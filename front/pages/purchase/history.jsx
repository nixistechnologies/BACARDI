import Layout from '../../components/layout'
import {useState} from 'react'
import { useQuery,useLazyQuery,useMutation } from '@apollo/react-hooks'
import {historyBySlugQuery,purchaseHistoryQuery,purchaseHistoryDateQuery,createCategoryQuery} from '../../lib/graphql'
import {privateRoute} from '../../lib/private_route'
import { server } from '../../lib/settings'
import {TableLoading} from '../../components/skeleton'
import  {FontAwesomeIcon}  from '@fortawesome/react-fontawesome'
import {faPen, faPlus} from '@fortawesome/free-solid-svg-icons'
import {useForm} from 'react-hook-form'



const Modal = ({active,setActive,paid,outstanding})=>{
    
    // const [name,setName] = useState("")
    const { register, handleSubmit,setValue,getValues,errors } = useForm();
    const [createCategory,{data,loading}] = useMutation(createCategoryQuery)

    const sendToServer=(e)=>{
        console.log(e)
        // e.preventDefault()
        // createCategory({
        //     variables:{name:name},
        //     optimisticResponse:true,
        //     update:(cache,{data})=>{
        //         if(data!=true){
        //             console.log(data)
        //             const existingCache = cache.readQuery({query:allCategory})
        //             existingCache.categories.edges.push({"node":data.createCategory.category,"__typename":"CategoryNodeEdge"})
        //             console.log(existingCache)
                    
        //             cache.writeQuery({
        //                 query:allCategory,
        //                 data:existingCache
        //             })

        //             setActive("")

                    
        //         }
        //     }
        // })   
    }
    
    return(
        <div className={`modal ${active}`} >
            <div className="modal-background" onClick={()=>setActive("")}></div>
                <div className="modal-content">
                    <div className="box">
                        <h1 className="title model-title">Update Outstanding balance</h1>
                        <form onSubmit={handleSubmit(sendToServer)}>
                            <div className="columns">
                                <div className="column">
                                    <label className="label">Paid</label>
                                    <input type="text" defaultValue={paid} ref={register} className="input is-small" />
                                </div>
                                
                                <div className="column">
                                    <label className="label">Outstanding</label>
                                    <input type="text" defaultValue={outstanding} ref={register} className="input is-small" />
                                </div>
                            </div>
                            <div className="columns">
                                <div className="column">
                                    <button type="submit" className={`button is-primary is-small ${loading==true?"is-loading":"not"}`}>Update</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    {/* <!-- Any other Bulma elements you want --> */}
                </div>
            <button className="modal-close is-large" aria-label="close" onClick={()=>setActive("")}></button>
        </div>
    )
}



const Result = ({loading,data})=>{
    // console.log(data)
    const [active,setActive] = useState("")
    const [paid,setPaid] = useState("")
    const [outstanding,setOutstanding] = useState("")
    return(
        <div className="data">
            <style jsx>{`
             td,th{
                 font-size:15px;
             }
             .data{
                 margin-top:50px;
             }
            `} </style>
            {loading===true
            ?(<div style={{textAlign:'center',fontWeight:'bold',fontSize:'20px'}}><TableLoading /></div>):
            data!=undefined?
            data.length?
            <table className="table is-fullwidth is-hoverable">
                <thead>
                    <tr>
                        {/* <th>SN.</th> */}
                        <th>Date</th>
                        <th>Vendor</th>
                        <th>Company</th>
                        <th>Invoice No.</th>
                        <th>Invoice Date</th>
                        <th>Products</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item,i)=>{
                        return (<tr key={item.node.id}>
                            {/* <td>{i+1}</td> */}
                            {/* <td>
                                <a href={`${server}/media/${item.node.invoice}`} target="_blank">
                                    {item.node.invoiceNumber}
                                </a>
                            </td> */}
                            <td>{item.node.date}</td>
                            <td>{item.node.vendor.name}</td>
                            <td>{item.node.vendor.company}</td>

                            <td>{item.node.invoiceNumber}</td>
                            <td>{item.node.invoiceDate}</td>
                            
                            <td>{item.node.products}</td>

                            {/* <td>{item.node.outstanding}</td> */}
                            <td onClick={()=>{setActive("is-active"),setPaid(item.node.paidAmount),setOutstanding(item.node.outstanding)}}>
                                <FontAwesomeIcon icon={faPen} color="#00c4a7" /> 
                            </td>
                        </tr>)
                    })}
                </tbody>
            </table>:
            <div style={{textAlign:'center',fontWeight:'bold',fontSize:'20px'}}>No Data Found</div>           
            :<div></div>
            }

            <Modal active={active} setActive={setActive} paid={paid} outstanding={outstanding} />

            </div>
    )
}



const History = () =>{
    const [slug,setSlug] = useState("")
    const [byname,setByname] = useState(true)
    const [bydate,setDate] = useState(false)
    const [today,setToday] = useState(false)

    const [min,setMin] = useState("")
    const [max,setMax] = useState("")
    const [getReport, {loading:nloading,nerror,data:ndata}] = useLazyQuery(purchaseHistoryDateQuery,{variables:{"dateGte":min,"dateLte":max}})
    const {data:pageData,loading:pageLoading} = useQuery(purchaseHistoryQuery,{variables:{"slug":""}})
    const [getHistory, {loading,error,data}] = useLazyQuery(purchaseHistoryQuery)    
    // console.log(ndata)
    return (
        <Layout title="History">
            <div>
                {/* <div className="columns">
                    <input type="text" className="input is-small" placeholder="Search Invoice/Name"/>
                </div> */}
            <div>
                <div className="topHeading">
                    <h2>All Purchase</h2>
                    <div>
                        <a className={`button input is-small is-primary is-rounded ${byname!=true?'is-light':''}`} onClick={()=>{setByname(true),setDate(false),setToday(false)}}>By name</a>
                    </div>
                    <div style={{marginLeft:"10px"}}>
                        <a className={`button input is-small is-primary is-rounded ${bydate!=true?'is-light':''}`} onClick={()=>{setByname(false),setDate(true),setToday(false)}}>Between days</a>
                    </div>
                    {/* <div style={{marginLeft:"10px"}}>
                        <a className={`button input is-small is-primary is-rounded ${today!=true?'is-light':''}`} onClick={()=>{setByname(false),setDate(false),setToday(true)}}>Today</a>
                    </div> */}
                    {/* <div>
                        <a className="button input is-small is-primary is-rounded is-light">Last 10 days</a>
                    </div> */}

                </div>
                
                <div>

                    {byname===true?
                    <div>
                    <form onSubmit={(e)=> {e.preventDefault(), getHistory({variables:{"slug":slug}})}}>
                    <div>
                        <div className="columns">
                            <div className="column">
                                <label className="label">Invoice/Name</label>
                                <input type="text" className="input is-small" placeholder="Search Invoice,name"
                                onChange={e=>setSlug(e.target.value)}
                                />
                            </div>
                            <div className="column is-3">
                                <label className="label" style={{visibility:'hidden'}}>Invoice/Name</label>
                                <input type="submit" className="is-small button is-primary" value="Search"
                                
                                // onClick={()=>getHistory({variables:{"slug":slug}})}
                                
                                />
                            </div>
                        </div>
                    </div>
                    </form>
                    {/* <Result loading={loading} data={data!=undefined?data.history.edges:undefined}/> */}
                    <Result loading={pageLoading} data={data!=undefined?data.purchases.edges:pageData!=undefined?pageData.purchases.edges:undefined}/>
                    </div>

                :

                <div>
                    <form onSubmit={(e)=>{e.preventDefault(),getReport()}}>
                        <div className="columns">
                            <div className="column">
                                <label className="label">From</label>
                                <input type="date" className="input is-small" value={min} onChange={e=>setMin(e.target.value)}/>
                            </div>
                            <div className="column">
                                <label className="label">To</label>
                                <input type="date" className="input is-small" min={min}  value={max} onChange={e=>setMax(e.target.value)}/> 
                            </div>

                            <div className="column is-2">
                                <label className="label" style={{visibility:'hidden'}}>To</label>
                                <button type="submit" className="button is-primary is-small">
                                    Report
                                </button>

                            </div>
                        </div>
                        </form>
                        <Result loading={nloading} data={ndata!=undefined?ndata.purchases.edges:undefined}/>
                    </div>
                }
                </div>
            </div>
            </div>
        </Layout>
    )
}

export default privateRoute(History);