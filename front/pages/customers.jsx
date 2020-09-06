import Layout from '../components/layout'
import {FullPageLoading} from '../components/skeleton'
import {getAllCustomersQuery,createOrUpdateCustomerQuery, deleteCustomer} from '../lib/graphql'
import {useQuery,useMutation, useLazyQuery} from '@apollo/react-hooks'

import  {FontAwesomeIcon}  from '@fortawesome/react-fontawesome'
import {faPen, faPlus} from '@fortawesome/free-solid-svg-icons'
// import {} from '@fortawesome/fontawesome-free'
import { faTrashAlt,faEdit } from '@fortawesome/free-regular-svg-icons'
import { useState } from 'react'
import { useEffect } from 'react'
import CustomerForm from '../components/customerForm'
// import {useMutation} from '@apollo/react-hooks'



const CRecords = ({items}) =>{
    const [active,setActive] = useState()
    const [info,setInfo] = useState({})
    const [delactive,setdelActive] = useState()
    const [id,setId] = useState("")
    const [deleteC,{data,loading}] = useMutation(deleteCustomer)
    

    const deleteFromServer=(id)=>{
        console.log(id)
        deleteC(
            {
                variables:{"id":id},
                optimisticResponse:true,
                update:(cache,{data})=>{
                    const existingCache = cache.readQuery({query:getAllCustomersQuery,variables:{"search":""}})
                    console.log(existingCache)
                    const nCache = existingCache.customers.edges.filter((e)=>e.node.id!=id)
                    console.log(nCache)
                    setdelActive("")
                    const c ={"customers":{"edges":nCache,"__typename":"CustomerNodeEdge"}}
                    cache.writeQuery({
                        query:getAllCustomersQuery,
                        variables:{"search":""},
                        data:c
                      })
                }
        })
    }



    return(
        <>
        <CustomerForm active={active} setActive={setActive} isNew={false} info={info} />
        
        {
            items.length === 0?
            <h1 className="title" style={{textAlign:'center'}}>No Data Found</h1>
        :
        
        <table className="table is-fullwidth is-hoverable is-bordered">
                <thead>
                    <tr>
                        <th>SN.</th>
                        <th className="_w10">Company</th>
                        <th className="_w20" >Name</th>
                        <th className="_w20">Address</th>
                        
                        <th className="_w10">Mobile</th>
                        <th className="_w10">GST</th>
                        {/* <th className="_w10">Aadhar</th> */}
                        {/* <th className="_w10">State</th> */}
                        <th className="_w10">City</th>
                        
                        <th className="_w5" colSpan={2}></th>
                        {/* <th className="w5"></th> */}
                        {/* <th className="w5"></th> */}
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((e,i)=>{
                        return(<tr key={e.node.id}>
                            <td>{i+1}</td>
                            <td>
                                {e.node.company}
                            </td>
                            <td className="_heading _w30">
                                {/* <a> */}
                                    {e.node.name}
                                    {/* <span className="sub">
                                        {e.node.email}
                                    </span> */}
                                {/* </a> */}
                            </td>
                            <td>
                                {e.node.address}
                            </td>
                            

                            <td>
                                {e.node.mobile}
                            </td>
                            <td>
                                {e.node.gstNumber}
                            </td>
                            {/* <td>
                                {e.node.addharNo}
                            </td> */}
                            {/* <td>
                                {e.node.state}
                            </td> */}
                            <td>
                                {e.node.city}
                            </td>


                            
                            <td className="hover" 
                            
                            onClick={()=>{setActive("is-active"),setInfo({"city":e.node.city,"state":e.node.state,"addhar":e.node.addharNo,"name":e.node.name,"address":e.node.address,"email":e.node.email,"mobile":e.node.mobile,"gst":e.node.gstNumber,"id":e.node.id,"company":e.node.company,"zipcode":e.node.zipcode}) }}
                            

                            >
                                <FontAwesomeIcon icon={faPen} color="#00d1b2" />
                            </td>
                            <td
                                onClick={()=>{setdelActive("is-active"),setId(e.node.id)}}
                            >
                                <FontAwesomeIcon icon={faTrashAlt} color="red"/>
                            </td>

                            {/*                                                         
                                <td className="hover">
                                    <button className="button is-small is-rounded is-primary is-light"><FontAwesomeIcon icon={faPlus} /> <span style={{marginLeft:"3px"}}>Add</span></button>
                                </td> 
                            */}
                        </tr>
                        
                        )
                    })}
                    </tbody>
                    
            </table>
            }


            <div className={`modal ${delactive}`} >
            <div className="modal-background" onClick={()=>setdelActive("")}></div>
                <div className="modal-content">
                    <div className="box" style={{width:"400px",margin:"auto"}}>
                        <h1 className="model-title title">Do you want to delete <b style={{textTransform:'uppercase'}}>{info.name}</b> ?</h1>
                        <div className="columns">
                            <div className="column" onClick={()=>deleteFromServer(id)}>
                                <button className={`button is-danger is-small ${loading==true?"is-loading":"not"}`} style={{width:"100%"}}>Delete</button>
                            </div>
                            <div className="column">
                                <button className="button is-primary is-small" style={{width:"100%"}} onClick={()=>setdelActive("")}>Cancel</button>
                            </div>
                            </div>
                        </div>
                    </div>                
                <button className="modal-close is-large" aria-label="close"></button>
            </div>
            </>
    )
}


const Customers = () =>{
    const {data,loading} = useQuery(getAllCustomersQuery,{variables:{'search':''}})
    const [active,setActive] = useState("")
    const [text,setText] = useState("")
    const [searchData,{data:udata,loading:uloading}] = useLazyQuery(getAllCustomersQuery)
    
    useEffect(()=>{
            searchData({variables:{"search":text}})
    },[text])
    
    return(
        <Layout title={"Customers"} text={text} setText={setText}>
            <div>
                < CustomerForm active={active} setActive={setActive} isNew={true} />
                <div className="topHeading">
                    <h2>Customers</h2>
                <div>
                    <button type="button" onClick={()=>setActive("is-active")} className="button is-rounded is-small is-primary">Add customer</button>
                </div>
                </div>

            </div>

            {
            loading===true || uloading==true?
                <FullPageLoading />
                :<CRecords 
                
                items={
                    udata===undefined?    
                    data.customers.edges : udata.customers.edges
                } 
                
                />
            }



        </Layout>
    )
}

export default Customers;