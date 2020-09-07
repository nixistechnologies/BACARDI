// import Layout from '../../../components/layoutout'
import Layout from '../../../components/layout'
import { useRouter } from 'next/router'
import { useQuery ,useMutation} from 'react-apollo'
import { TableLoading } from '../../../components/skeleton'
import {bankPurchaseDetailQuery,addPurchasePaymentQuery,BankByVendorQuery,getAllPaymentLedgerQuery} from '../../../lib/graphql'
import {useForm} from 'react-hook-form'
import { useState } from 'react'
import { useEffect } from 'react'

const Modal = ({active,setActive,paid,outstanding,id})=>{
    const { register, handleSubmit,setValue,getValues,errors,reset } = useForm();
    const [addPayment,{data,loading}] = useMutation(addPurchasePaymentQuery)
    useEffect(()=>{
        reset({"paid":0})
    },[outstanding])

    const sendToServer=(e)=>{
        console.log(e)
        addPayment({
            variables:{
                "id":id,
                "paid":e.paid,
                "outstanding":e.remain,
                "date":e.date
            },
            optimisticResponse:true,
            update:(cache,{data})=>{
                // console.log(data)
                if(data!=true)
                {
                    if(data.addPurchasePayment.success == true){
                        try{
                        const paymentTable = cache.readQuery({query:bankPurchaseDetailQuery,variables:{"id":id}})
                        console.log(paymentTable.vendor.paritalpaymentSet.edges)
                        let dt = data.addPurchasePayment.partial
                        dt["__typename"]="PartialPaymentNode"
                        paymentTable.vendor.paritalpaymentSet.edges.push({"node":dt,"__typename":"PartialPaymentNodeEdge"})

                        console.log(paymentTable)
                        cache.writeQuery({
                            query:bankPurchaseDetailQuery,
                            variables:{"id":id},
                            data:paymentTable
                        })
                        console.log(e.paid)
                        const existingCache = cache.readQuery({query:BankByVendorQuery})
                        for(var i=0;i<existingCache.vendors.edges.length;i++){
                            if(existingCache.vendors.edges[i].node.id===id)
                            {
                                console.log(existingCache.vendors.edges[i].node.paid)
                                existingCache.vendors.edges[i].node.paid = existingCache.vendors.edges[i].node.paid +parseFloat(e.paid)
                            }
                        }
                        cache.writeQuery({
                            query:BankByVendorQuery,
                            data:existingCache
                        })

                        const ledger = cache.readQuery({query:getAllPaymentLedgerQuery,variables:{"search":""}})
                        delete dt.outstanding
                        dt["customer"] = null

                        ledger.allPayment.edges.push(dt)
                        
                        cache.writeQuery({
                            query:getAllPaymentLedgerQuery,
                            variables:{"search":""},
                            data:ledger
                        })

                        }
                        catch(e){
                            console.log(e)
                        }
                    }
                    setActive("")
                }
            }
        })
    }
    
    return(
        <div className={`modal ${active}`} >
            <div className="modal-background" onClick={()=>setActive("")}></div>
                <div className="modal-content">
                    <div className="box">
                        <div style={{overflow:"auto"}}>
                            <div style={{float:'left'}}>
                                <h1 className="title model-title">Update Outstanding balance</h1>
                            </div>
                            <div style={{float:'right'}}>
                                <h1 style={{fontFamily:'nfontb'}}>&#8377; {outstanding}</h1>
                                
                            </div>                            
                                
                        </div>
                        
                        
                        <form onSubmit={handleSubmit(sendToServer)}>
                            <div className="columns">
                                <div className="column">
                                    <label className="label">Date</label>
                                    <input type="date" ref={register} name="date" className="input is-small" />
                                </div>
                                <div className="column">
                                    <label className="label">Paid</label>
                                    <input type="text" name="paid" ref={register} className="input is-small" onChange={(e)=>{setValue([{"remain":parseFloat(outstanding) - parseFloat(e.target.value)}])}} />
                                </div>
                                
                                <div className="column">
                                    <label className="label">Reamin</label>
                                    <input type="text" name="remain" defaultValue={outstanding} ref={register} className="input is-small" disabled/>
                                </div>
                            </div>
                            <div className="columns">
                                <div className="column">
                                    <button type="submit" className={`button is-primary is-small ${loading==true?"is-loading":"not"}`}>Update</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            <button className="modal-close is-large" aria-label="close" onClick={()=>setActive("")}></button>
        </div>
    )
}

const Records = ({items}) =>{
    return <>
    <table className="table is-fullwidth is-hoverable is-bordered">
        <thead>
            <tr>
                <th>SN.</th>
                <th className="_w20">Date</th>
                <th className="_w10">Paid</th>
                <th className="_w10">OutStanding</th>
                {/* <th className="_w5" colSpan={1}></th> */}

                {/* <th className="_w10">File</th> */}
                {/* <th className="_w5" colSpan={2}></th> */}
            </tr>
            </thead>
            <tbody>
            {items.map((e,i)=>{
                return(
                
                <tr key={e.node.id}>
                    <td>{i+1}</td>
                    <td className="_heading _w30">
                        {e.node.date}
                            {/* {e.node.sale !=null ?e.node.sale.customer.name:e.node.purchase.vendor.name} */}
                    </td>
                    <td>
                        {e.node.paid}
                    </td>
                    <td>
                        {e.node.outstanding}
                    </td>
                    {/* <td>
                        0
                    </td> */}
                    
                    {/* <td>
                        <Link href={`bank/[detail]?name=${e.node.company}`} as={`bank/${e.node.id}?name=${e.node.company}`}>
                            <FontAwesomeIcon icon={faList} />
                        </Link>
                        
                    </td> */}
                </tr>
                
                )
            })}
            </tbody>
            
    </table>
    </>
}
export const NoPayment = () =>{
    return <>
    <div>
        <h1 style={{fontFamily:'nfont',fontSize:'1.5em',textAlign:'center',marginTop:'15%'}}>
            No Payment Found
        </h1>
    </div>
    </>
}

const PurchaseDetail=()=>{
    const router = useRouter()
    
    const {query} = router
    const id = query.purchase
    const {data,loading} = useQuery(bankPurchaseDetailQuery,{variables:{"id":id}})
    const [active,setActive] = useState("")
    // console.log(query)
    return <>
        <Layout>
            <div>
                <nav className="breadcrumb" aria-label="breadcrumbs">
                    <ul>
                        <li><a onClick={()=>router.back()}>Bank</a></li>
                        <li className="is-active"><a>Purchase</a></li>
                        <li className="is-active">
                            <a href="#" aria-current="page">{query.name}</a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div>

                {
                    loading ?
                    <TableLoading />:
                    <>
                        <Modal active={active} setActive={setActive} outstanding={data.vendor.purchase - data.vendor.paid} paid={0} id={id}/>
                        
                        <div className="topHeading">
                            <h2>{query.name}</h2>
                            <div>
                                <button type="button" className="button is-rounded is-small is-primary" onClick={()=>setActive("is-active")}>Add Payment</button>
                            </div>
                        </div>
                        <div>
                            <div style={{fontSize:"1.2em",fontFamily:"nfontL",marginBottom:"5px",float:"left"}}>Total Amount<span style={{marginLeft:"5px",fontFamily:"nfontb"}}> &#8377;{data.vendor.purchase}</span></div>
                            <div style={{fontSize:"1.2em",fontFamily:"nfontL",marginBottom:"5px",float:'right'}}>Total Outstanding<span style={{marginLeft:"5px",fontFamily:"nfontb"}}> &#8377;{data.vendor.purchase - data.vendor.paid}</span></div>
                        </div>

                        {
                            data.vendor.paritalpaymentSet.edges.length==0?
                            <NoPayment />:
                            <Records items ={
                                data.vendor.paritalpaymentSet.edges
                            } />
                        }
                        
                    </>
                }
            </div>
            
        </Layout>
    
    </>
}
export default PurchaseDetail;