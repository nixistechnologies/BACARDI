import Layout from "../../components/layout"
import { BankByCustomerQuery,addSalePaymentQuery,customersForOutstandingQuery,addOutstandingCustomerQuery,addOutstandingVendorQuery,vendorsForOutstandingQuery } from "../../lib/graphql"


import {TableLoading} from '../../components/skeleton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileInvoice, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { server } from '../../lib/settings'
import { useState,useEffect } from 'react'
import {useMutation,useLazyQuery} from '@apollo/react-hooks'
import dynamic from 'next/dynamic'
import {useSelector,useDispatch} from 'react-redux'
import { change_bank_tab } from "../../redux_function/actions"
import {useForm} from 'react-hook-form'

const Sales = dynamic(()=>import('../../components/bank/sales'),{loading:()=><TableLoading />})
const Purchase = dynamic(()=>import('../../components/bank/purchase'),{loading:()=><TableLoading />})
const Contra = dynamic(()=>import('../../components/bank/expense'),{loading:()=><TableLoading />})
// const Personal = dynamic(()=>import('../../components/bank/personal'),{loading:()=><TableLoading />})


const Modal = ({active,setActive,tab})=>{
    console.log(tab)
    const { register, handleSubmit,setValue,getValues,errors,reset } = useForm();
    const [addPayment,{data,loading}] = useMutation(addSalePaymentQuery)
    const [getCustomer,{data:customers,loading:customerLoading}] = useLazyQuery(customersForOutstandingQuery,{fetchPolicy:'network-only'})
    
    const [getVendor,{data:vendors,loading:vendorLoading}] = useLazyQuery(vendorsForOutstandingQuery,{fetchPolicy:'network-only'})
    
    const [addCustomerOutstanding,{data:dd,loading:ll}] = useMutation(addOutstandingCustomerQuery)
    const [addVendorOutstanding,{data:vdd,loading:vll}] = useMutation(addOutstandingVendorQuery)
    
    const [customerDD,setCustomerDD] = useState("")
    const [customerFilter,setCustomerFilter] = useState("")
    const [customer,setCustomer] = useState({name:tab.sale==true})
    useEffect(()=>{
        reset({"outstanding":""})
        // setCustomer({name:`${tab.sale==true?"Select Customer":"Select Vendor"}`})
    },[tab.sale])

    const sendToServer=(e)=>{
        console.log(e)

        if(tab.sale==true)
        {
            addCustomerOutstanding({
                variables:{
                    id:e.id,
                    outstanding:e.outstanding
                },
                optimisticResponse:true,
                update:(cache,{data})=>{

                    // console.log(data)
                    try{
                    if(data!=true)
                        {
                            // console.log(data)
                            const newSale = data
                            console.log(newSale.addCustomerOutStanding.customer.csales)
                            const salesExisting = cache.readQuery({query:BankByCustomerQuery,variables:{"search":""}})
                            console.log(salesExisting)
                            // for(var i = 0;i<salesExisting.length;i++){
                            //     if(salesExisting[i].id == newSale.id){
                            //         salesExisting[i] = newSale.sales
                            //     }
                            // }

                            // cache.writeQuery({
                            //     query:BankByCustomerQuery,
                            //     variables:{"search":""},
                            //     data:paymentTable
                            // })
                            // reset({"outstanding":""})
                            // setCustomer({name:"Select Customer"})
                            // setActive("")
                        }
                    }
                    catch(e){
                        console.log(e)
                    }
                    // reset({"outstanding":""})
                    // setCustomer({name:"Select Customer"})
                    // setActive("")
                    closeAll()
                }
            })
        }
        else{
            addVendorOutstanding({
                variables:{
                    id:e.id,
                    outstanding:e.outstanding
                },
                optimisticResponse:true,
                update:(cache,{data})=>{
                    if(data!=true){
                        console.log(data)
                        // reset({"outstanding":""})
                        // setActive("")
                        closeAll()
                    }
                }
            })
        }
    }

    const selectCustomer=(e)=>{
        // customers
        // console.log(e.target.value)
        if(tab.sale==true){
            getCustomer({variables:{search:e.target.value}})
        }
        else{
            getVendor({variables:{search:e.target.value}})
        }
        
    }
    const customerClick=(e)=>{
        // id
        setCustomer({name:e.company})
        setCustomerDD("")
        setValue([
            {"id":e.id}
        ])
    }
    const closeAll=()=>{
        setActive("")
        setValue([{"id":""}]), 
        setCustomer("")
        setCustomerDD("")
        
    }
    return(
        <div className={`modal ${active}`} >
            <div className="modal-background" onClick={()=>{closeAll()}}></div>
                <div className="modal-content" style={{overflow:"unset"}}>
                    <div className="box" style={{height:"100%"}}>
                        <div style={{overflow:"auto"}}>
                            <div style={{float:'left'}}>
                                <h1 className="title model-title">Add Outstanding balance</h1>
                            </div>
                            <div style={{float:'right'}}>
                                <h1 style={{fontFamily:'nfontb'}}>&#8377; 232</h1>
                                
                            </div>                            
                                
                        </div>
                        
                        
                        <form onSubmit={handleSubmit(sendToServer)}>
                            {/* <div className="" */}
                            
                            <div className="columns">
                                {/* <div className="column">
                                    <label className="label">Date</label>
                                    <input type="date" ref={register} name="date" className="input is-small" />
                                </div> */}
                                
                                {/* <div className="column">
                                    <label className="label">Paid</label>
                                    <input type="text" name="paid" ref={register} className="input is-small" onChange={(e)=>{setValue([{"remain":parseFloat(223) - parseFloat(e.target.value)}])}} />
                                </div> */}
                                
                                <div className="column is-8">
                                    <label className="label">{tab.sale==true?"Customer Name":"Vendor Name"} </label>
                                    {/* <input type="text" name="customer" ref={register} onChange={(e)=>selectCustomer(e)} className="input is-small"/> */}

                                    <div>


                                    <div style={{position:'relative',padding:"0"}} >
                                        <div type="text" className="input is-small" 
                                        onClick={()=>{setCustomerDD(customerDD==="dd-active"?"":"dd-active")}}
                                        >
                                            {/* <input type="text" className="input is-small"/> */}
                                            <div style={{width:'100%',padding:"0",display:'flex'}}>
                                                <span style={{textOverflow:'ellipsis',overflow:'hidden',whiteSpace:'nowrap',paddingRight:'2px',width:'100%'}}>{customer.name}</span>
                                                <span style={{float:'right'}}>
                                                    <FontAwesomeIcon icon={faAngleDown} />
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{padding:"0"}}>
                                            <div className={`control my-d dropdown-content ${customerLoading===true || vendorLoading==true?"is-loading":""} ${customerDD}`} style={{padding:"0"}}>
                                                <input type="text" className={`input is-small `} value={customerFilter} onChange={(e)=>{ selectCustomer(e), setCustomerFilter(e.target.value)}} placeholder={`Search ${tab.sale==true?"Customer..":"Vendor.."}`} style={{border:0,outline:0,boxShadow:'none'}}/>
                                                <div className="dd-list" style={{padding:"0",maxHeight:"170px"}}>
                                                    {
                                                    tab.sale==true &&
                                                    customers!=null &&
                                                    customers.customers.edges.map(e=>{
                                                        return <div style={{padding:"0"}} className="d-item_" 
                                                                key={e.node.id} value={e.node.id}> 
                                                                
                                                                <a className="dropdown-item" onClick={()=>customerClick(e.node)}>
                                                                    <span>{e.node.company}</span>
                                                                    <span style={{fontSize:"0.8em",display:'block',color:"grey"}}>{e.node.name}</span>
                                                                    </a>
                                                                
                                                                </div>
                                                            }
                                                        )                                                    
                                                    }
                                                    {
                                                        tab.sale==false &&
                                                        vendors!=null &&
                                                        vendors.vendors.edges.map(e=>{
                                                            return <div style={{padding:"0"}} className="d-item_" 
                                                                    key={e.node.id} value={e.node.id}> 
                                                                    
                                                                    <a className="dropdown-item" onClick={()=>customerClick(e.node)}>
                                                                        <span>{e.node.company}</span>
                                                                        <span style={{fontSize:"0.8em",display:'block',color:"grey"}}>{e.node.name}</span>
                                                                        </a>
                                                                    
                                                                    </div>
                                                                }
                                                            )
                                                    }
                                                </div>
                                                
                                            </div>
                                        </div>
                                        <input type="hidden" name="id" ref={register} />
                                    </div>
                                </div>

                                </div>
                                <div className="column">
                                    <label className="label">Outstanding</label>

                                    <input type="text" name="outstanding" ref={register} placeholder="Outstanding" className="input is-small"/>
                                </div>
                            </div>
                            <div className="columns">
                                <div className="column">
                                    <button type="submit" className={`button is-primary is-small ${ll==true?"is-loading":"not"}`}>Update</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            <button className="modal-close is-large" aria-label="close" onClick={()=>setActive("")}></button>
        </div>
    )
}






const Bank = () =>{
    const [text,setText] = useState("")
    const [tabs,setTabs] = useState("")
    const [active,setActive] = useState("")
    const bankTab = useSelector(state=>state.bankTab)
    const dispatch = useDispatch()
    // useEffect(()=>{
    //     setTabs({"sales":true,"purchase":false,"expense":false})
    // },[])
    console.log(bankTab)
    return <>
        <Layout title="Bank" text={text} setText={setText}>
            <Modal active={active} setActive={setActive} tab={bankTab} />
            <div>
                <div className="topHeading">
                    <h2>Bank</h2>
                    
                    {bankTab.contra == false &&
                        <div style={{marginRight:"10px",cursor:"pointer"}} onClick={()=>setActive("is-active")}>
                        <span className="tag is-small is-rounded is-primary">Add Outstanding</span>
                    </div>}
                    <div>
                        <a target="_blank" href={`${server}/export/${bankTab.sale==true?"sales":"purchase"}/${text==""?"all":text}`} className="tag is-small is-rounded is-primary">Export To Excel</a>
                    </div>
                </div>

            </div>
            <div style={{background:'_white_',padding:'0px'}} className="card_">
                <div>
                    <div className="tabs">
                        <ul>
                            <li className={`${bankTab.sale==true && "is-active"}`}><a onClick={()=>dispatch(change_bank_tab("sale"))} >Sales</a></li>
                            <li className={`${bankTab.purchase==true && "is-active"}`}><a onClick={()=>dispatch(change_bank_tab("purchase")) } >Purchase</a></li>
                            <li className={`${bankTab.contra==true && "is-active"}`}><a onClick={()=>dispatch(change_bank_tab("contra"))} >Contra</a></li>
                            {/* <li className={`${tabs.bank==true && "is-active"}`}><a onClick={()=>setTabs({sales:true,purchase:false,expense:false})} >Bank</a></li> */}
                        </ul>
                    </div>
                    {
                        bankTab.sale &&
                        <Sales text={text} setText={setText}/>
                    }
                    {
                        bankTab.purchase &&
                        <Purchase />
                    }
                    {
                        bankTab.contra &&
                        <Contra />
                    }
                </div>
            </div>

            
        </Layout>
    </>

}

export default Bank;