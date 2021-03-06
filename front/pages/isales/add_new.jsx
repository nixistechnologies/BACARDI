import Layout from "../../components/layout"
import {useForm} from 'react-hook-form'
import { useQuery,useLazyQuery, useMutation } from '@apollo/react-hooks'
import { getAllPatient,productSuggetionQuery,lastBillNumber, customerSuggestion, getAllCustomersQuery,generateBillQuery,getLedgersQuery } from "../../lib/graphql";
import { useDispatch, useSelector } from 'react-redux'
import {useState, useEffect} from 'react'
import React from 'react'
import client from "../../lib/apolloClient";
import  {FontAwesomeIcon}  from '@fortawesome/react-fontawesome'
import { faTrashAlt,faEdit } from '@fortawesome/free-regular-svg-icons'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { generateBill,clearBill } from "../../redux_function/actions";
import { server } from "../../lib/settings";
import {BillPageLoading} from '../../components/skeleton'
import SnackbarProvider,{useSnackbar} from 'react-simple-snackbar'
// import VendorModel from '../../components/vendorModel'
import ProductForm from '../../components/productForm'
import CustomerForm from '../../components/customerForm'
// import SelectSearch from 'react-select-search';
// import { useSelect } from 'react-select-search';
import $ from 'jquery'
import Router from "next/router"

const ref = React.createRef();


// function useGenerateBill(patientId,date,gst,paymentMode,medicies){
//     const [loading,setLoading] = React.useState(true)
//     const [error,setError] = React.useState(false)
//     const [invoiceNumber,setInvoiceNumber] = React.useState()
    
//     useEffect(()=>{
//         setLoading(true)
//         client.mutate({
//             mutation:generateBillQuery,
//             variables:{
//                 "medicines": medicies,
//                     "userId": patientId,
//                   "date": date,
//                   "gst": gst,
//                   "payment": paymentMode
              
//             }
//         }).then((d)=>{
//             setInvoiceNumber(d.data.generateBill.invoiceNumber)
//             setLoading(false)
//             setError(true)
//         }).catch((e)=>{
//             setLoading(false)
//             setError(true)
//         })
//     },[])

//     return {loading,invoiceNumber,error}
    
// }




const Modal =({active,setActive}) =>{
    return <>

<div className={`modal ${active}`} >
    <style jsx>{`
    .column{
        padding:0;
        margin-bottom:10px;
        padding-right:5px;
        padding-left:5px;
    }
    .modal-content, .modal-card {
        margin: 0 auto;
        width:60%;
            // width: 540px;
        }

    `}

    </style>

    <div className="modal-background"  onClick={()=>setActive("")}></div>
    <div className="modal-content">
        <div className="box">
            <h1 className="model-title title">Create new product</h1>
            <ProductForm purchase={true} setActive={setActive} />
        </div>
    </div>

</div>

    </>
}

const Billingform =() =>{
    const [qlabel,setQlabel] = useState("")
    const [mlist,setMlist] = useState([])
    const [Pactive,setPactive] = useState("")
    const [Cactive,setCactive] = useState("")
    const [list,setList] = useState([])
    const [active,setActive] = useState("modal")
    const [cname,setCname] = useState("")
    const [pname,setPname] = useState("")
    const [cSuggestion,{data:customerTemp,loading:customerloading}] = useLazyQuery(customerSuggestion,{fetchPolicy:'network-only'})
    const [pSuggestion,{data:productTemp,loading:productloading}] = useLazyQuery(productSuggetionQuery,{fetchPolicy:'network-only'})
    const [genBill,{data:billData,loading:billLoading}]  = useMutation(generateBillQuery)
    
    const [dropdown1,setDropdown1] = useState("")
    const [dropdown2,setDropdown2] = useState("")
    const [fullPayment,setFullpayment] = useState(true)


    const [productFilter,setProductFilter] = useState("")
    const [productDD,setProductDD] = useState("")
    const [product,setProduct] = useState({name:"Select Product"})  
    
    const [customerFilter,setCustomerFilter] = useState("")
    const [customerDD,setCustomerDD] = useState("")
    const [customer,setCustomer] = useState({name:"Select Customer"})      


    const { register, handleSubmit,setValue,getValues,errors } = useForm();
    const {loading,error,data} = useQuery(getAllCustomersQuery)
    // const {data:lastNumber,loading:numberLoading} = useQuery(lastBillNumber,{variables:{"id":""}, fetchPolicy:"network-only"})
    const [CheckExisted,{data:isExisted,loading:isExistedLoading}] = useLazyQuery(lastBillNumber,{fetchPolicy:"network-only"})
    // const product = useSelector(state => state.products);
    const billstore = useSelector(state => state.bills);
    const [tamount,setTamount] = useState(0)
    const dispatch = useDispatch()

    
    useEffect(()=>{
        // console.log("ds")
        
        // if($("#customer_dropdown").click()){
        //     console.log("clickedd")
        // }

        $("#customer_dropdown").click(()=>{
            console.log("XX")
        })
        // $(document).on("click",(e)=>{
        //     // if($("customer_dropdown").click(()=>{
        //         console.log(e)
        //     // })


        //     // console.log("clickeddd")
            
        // })
        
    })
    useEffect(()=>{
        cSuggestion({variables:{suggestion:""}})
        pSuggestion({variables:{suggestion:""}})
    },[])
    
    if(loading)
        return <div><BillPageLoading/></div>
    // console.log(lastNumber.lastNumber.lastNumber)
    const selectOption=(e)=>{
        // const f = data.customers.edges.filter(t=>(t.node.id===e.target.value))[0]
        // if(f!=undefined)
        //     setValue([{"mobile":f.node.mobile},{"address":f.node.address},{"customerId":f.node.id}])
        // if(e.target.value==="0")
        // {
        //     setValue([{"mobile":""},{"address":""},{"customerId":""}])   
        // }
        setDropdown1("")
        setCname(e.node.name)
        setValue([{"mobile":e.node.mobile},{"address":e.node.address},{"customerId":e.node.id},{"name":e.node.name}])

        
    }
    const selectProduct=(e)=>{
        setPname(e.name)
        setQlabel(` (${e.netm})`)
        // setValue([
        //     {"id":id},
        //     {"medicine":medicine},
        //     {"price":price},
        //     {"expiry":expiry},
        //     {"discount":discount}
        // ])
        setDropdown2("")
        setValue([{"price":e.price},{"expiry":e.expiryDate},{"discount":e.discount},{"id":e.id},{"pgst":e.GST}])
    }

    const showCustomer=(e)=>{
        // if(e.target.value.length>0)
        // {
            cSuggestion({variables:{suggestion:e.target.value}})
        // }
    }

    const showProduct =(e)=>{
        // if(e.target.value.length>0)
        // {
            pSuggestion({variables:{suggestion:e.target.value}})
        // }
    }

    const BillToServer=(customerId,date,payment,remarks,mlist,invoice_number,taga)=>{
        // console.log(errors)
        console.log(customerId)
        console.log(date)
        console.log(payment)
        console.log(remarks)
        // console.log(mlist)
        // console.log(mlist)
        genBill({variables:{
            "customerId":customerId,
            "remarks":remarks,
            "date":date,
            "payment":"Cash",
            // "taga":taga,
            "isInstant":true,
            "invoice_number":1,
            "products":mlist,
            // "paid":getValues("paid") === ""?tamount:getValues("paid")
        },optimisticResponse:true,
        update:(cache,{data})=>{
            if(data!=true){
                console.log(data)
                // data.generateBill.ledger
                try{
                    const existingCache = cache.readQuery({query:getLedgersQuery,variables:{"search":""}})
                    // const billNumberCache = cache.readQuery({query:lastBillNumber})
                    console.log(existingCache)
                    existingCache.ledgers.edges = [{"node":data.generateBill.ledger,"__typename":"LedgerNodeEdge"}].concat(existingCache.ledgers.edges)
                    console.log(existingCache)
                    cache.writeQuery({
                        query:getLedgersQuery,
                        variables:{"search":""},
                        data:existingCache
                    })
                    // billNumberCache.lastNumber.lastBillNumber ++
                    
                    // cache.writeData
                }
                catch(e){
                    console.log(e)
                }
                
                
                
                // console.log(existingCache)
                // existingCache.ledgers.edges.push({"__typename":"LedgerNodeEdge","node":{"id":"rendom","sale":data.bill}})
                // cache.writeQuery({
                //     query:getLedgersQuery,
                //     variables:{"search":""},
                //     data:existingCache
                // })
            }

        }
    
    })

        // dispatch(generateBill(name,age,gender,date,gst,payment,mlist))
    }

    const fillMedicineInfo = (id,medicine,qty,price,expiry,discount)=>{
        // console.log("tap")
        setQlabel(` (${qty})`)
        setValue([
            {"id":id},
            {"medicine":medicine},
            {"price":price},
            {"expiry":expiry},
            {"discount":discount}
        ])
        setList([])
    }

    const AddRows=()=>{
        setMlist(mlist.concat(
            [{
                "productId":getValues("id"),
                "name":pname,
                "grossm":getValues("grossm").length? getValues("grossm"):1,
                "price":getValues("price"),
                "less":getValues("less"),
                "taga":getValues("taga"),
                "net":getValues("net"),
                // "discount":getValues("discount").length?getValues("discount"):0
            }]
        ))
        
        // setTamount( tamount+(getValues("price") * getValues("qty")??1) - ((getValues("price") * getValues("qty")??1)*getValues("discount")/100))
        
        setTamount(tamount+(parseFloat(getValues("price"))*parseFloat(getValues("net"))))

        setPname("")
        setProduct({name:"Select Product"})
        setProductFilter("")
        
        setValue([
            // {"medicine":""},
            {"less":""},
            {"grossm":""},
            {"net":""},
            {"price":""},
            {"taga":""}
            // {"pgst":""}
        ])
    }



    const selectMedicineOption = async (d)=>{
        var vl = d.target.value
        var result = await client.query({
            query:productSuggetionQuery,
            variables:{
                "suggestion":d.target.value
            },
            fetchPolicy:'network-only'
        })
        if(result.loading == false)
        // console.log(result.data.productSuggestion)
        // console.log(vl)
        if(vl.length==0)
        {
            // console.log("empty")
            setList([])
        }else{
            setList(result.data.productSuggestion)
        }

    }
    const deletefromtemp=(id)=>{
        // console.log(id)
        // console.log(mlist)
        // console.log(mlist[id])
        
        // console.log(tamount)
        const x = (mlist[id].price * mlist[id].qty) - ((mlist[id].price * mlist[id].qty)*mlist[id].discount/100)

        // console.log(tamount)
        // console.log(x)
        setTamount(tamount-x)

        // tamount - (mlist[id].price * mlist[id].qty) - ((mlist[id].price * mlist[id].qty)*mlist[id].discount/100)
        
        // mlist.slice(0, id-1).concat(mlist.slice(id, mlist.length))
        // console.log(x)
        setMlist(mlist.slice(0, id).concat(mlist.slice(id+1, mlist.length)))

    }
    const reset =()=>{
        setMlist([])
        // dispatch(clearBill())
        // setCname("")
        setCustomer({name:""})
        setPname("")
        // billData = undefined
        setValue([
            {"mobile":""},
            {"address":""},
            {"remarks":""},
            {"gender":""},
            {"payment":""},
            {"gst":""},
            {"date":""},
            {"invoice_number":""}
            
        ])

    }
    const SetNetM=(e)=>{
        console.log(e.target.value)
        console.log(getValues("grossm"))
        const net = (parseFloat(e.target.value)/100)*parseFloat(getValues("grossm"))
        console.log(net)
        setValue([{"net":parseFloat(getValues("grossm"))-net}])
    }
    const SetNetMForGrossM=(e)=>{
        const less = getValues("less")
        if(less){
            const net = (parseFloat(less)/100) * parseFloat(e.target.value)
            
            setValue([{"net":parseFloat(e.target.value)-net}])
        }
    }
    

    return (
        
        // <VendorModel active={Vactive} setActive={setVActive} isNew={true} />
        <div 
        // onClick={()=>{dropdown1==="is-active"?setDropdown1(""):null}}
        >
            <Modal active={Pactive} setActive={setPactive} />
            <CustomerForm active={Cactive} setActive={setCactive} isNew={true} />
            <div className="topHeading">
                <h2>Instant Sales</h2>
            </div>
            <style jsx>{`
                .error_text{
                    color:red;
                    font-weight:400
                }
                .is-small{
                    font-size:0.85rem;
                }
                .search_dropdown{
                    outline: 0;
                    border: 0;
                    box-shadow: none;
                }
                .dropdown-menu{
                    min-width:18rem;
                }
                .t-head{
                    border-bottom:1px solid rgba(0,0,0,.15);
                    display:flex;
                    margin-bottom:25px;
                }
                .t-head span{
                    font-weight:600;
                    line-height:1.2;
                    font-size:22px;
                    border-bottom:1px solid rgba(0,0,0,.54);
                    padding-bottom:20px;
                    margin-bottom:-1px
                }
                .sep-word{
                    margin-top:10px;
                    // font-weight:600;
                    font-family:nfontL
                }
            `} </style>
            {/* <form> */}
            {/* <div>   
                <h2 className="subtitle" style={{marginTop:"10px",fontWeight:'300'}}>User detail</h2>
            </div> */}
        <div className="card_">
            {/* <div style={{margin:"20px 2px 5px"}}>   
                <span className="sep-word">User detail</span>
            </div> */}
            <div style={{marginBottom:"15px",display:'flex',alignItems:'center'}}>
                <h2 style={{fontFamily:'nfontL',fontWeight:'300'}}> User detail</h2>
                <a className="tag is-link is-light" style={{marginLeft:"20px"}} 
                onClick={()=>setCactive("is-active")}
                >Add Customer</a>
            </div>
            
            <div>
                <div className="columns is-mobile" style={{display:'flex'}}>
                    <div className="column">
                        <label className="label">Customer Name <span className="error_text">{errors.customer?.message}</span></label>
                        

                        {/* <input className="input is-small" ref={register({required:"(Name is required)"})} type="text" name="customer"  placeholder="Customer Name"/> */}
                        {/* <article className="select is-small" style={{width:'100%'}}>
                            <select className="" style={{width:'100%'}}
                            onChange={(e)=>selectOption(e)}
                            >
                                <option value="0">------</option>
                                {data.customers.edges.map(e=>{
                                    return <option key={e.node.id} value={e.node.id}>{e.node.name}</option>
                                })}

                            </select>                            
                        </article> */}

                        
                        <div style={{position:'relative',padding:"0"}} >
                            <div type="text" className="input is-small" 
                            onClick={()=>{setCustomerDD(customerDD==="dd-active"?"":"dd-active")}}
                            >
                                {/* <input type="text" className="input is-small"/> */}
                                <div style={{width:'100%',padding:"0"}}>
                                    <span>{customer.name}</span>
                                    <span style={{float:'right'}}>
                                        <FontAwesomeIcon icon={faAngleDown} />
                                    </span>
                                </div>
                            </div>
                            <div style={{padding:"0"}}>
                                <div className={`control my-d dropdown-content ${customerloading===true?"is-loading":""} ${customerDD}`} style={{padding:"0"}}>
                                    <input type="text" className={`input is-small `} value={customerFilter} onChange={(e)=>{ setCustomerFilter(e.target.value), showCustomer(e) }} placeholder="Search product.." style={{border:0,outline:0,boxShadow:'none'}}/>
                                    <div className="dd-list" style={{padding:"0",maxHeight:"170px"}}>
                                        {
                                        customerTemp!=null?
                                        customerTemp.customerSuggestion.edges.map(e=>{
                                            // return ( e.node.name.toLocaleLowerCase().startsWith(statefilter)?
                                            return <div style={{padding:"0"}} className="d-item_" onClick={()=>{setCustomer({name:e.node.company}), selectOption(e), setCustomerDD(customerDD==="dd-active"?"":"dd-active") }} key={e.node.id} value={e.node.id}> <a className="dropdown-item">{e.node.company}</a></div>
                                            // :null
                                                }
                                            ):null
                                        }
                                    </div>
                                    
                                </div>
                            </div>
                        </div>  



                        {/* <div className={`dropdown ${dropdown1}`} id="customer_dropdown" style={{width:"100%"}} >
                        <div style={{width:"100%"}} className="dropdown-trigger" onClick={()=>{dropdown1==="is-active"?setDropdown1(""):setDropdown1("is-active")}}>
                            <button style={{width:"100%"}} className="button is-small" aria-haspopup="true" aria-controls="dropdown-menu3">
                                <span ref={register} name="name">{cname.length===0?"Select Customer Name":cname}</span>


                            <span className="icon is-small">
                                <i className="fas fa-angle-down" aria-hidden="true"></i>
                            </span>
                            </button>
                        </div>
                        <div className="dropdown-menu" id="dropdown-menu3" role="menu">
                            <div className="dropdown-content">
                            <a className="dropdown-item" style={{padding:"0"}}>
                                <div className={`control ${customerloading===true?"is-loading":""}`}>
                                    <input type="text" className="input is-small search_dropdown is-loading" onChange={(e)=>showCustomer(e)} placeholder="Customer name.." />
                                </div>
                                
                            </a>
                            <hr className="dropdown-divider" />
                            {
                                customerTemp!=undefined?
                                customerTemp.customerSuggestion.map(e=>{
                                return <a className="dropdown-item" onClick={()=>selectOption(e)} key={e.id}> {e.name}</a>
                                }):""
                            }
                            </div>
                        </div>
                        </div> */}

                        {/* <div className="dropdown is-hoverable">
                        <div className="dropdown-trigger">
                            <button className="button" aria-haspopup="true" aria-controls="dropdown-menu4">
                            <span>Hover me</span>
                            <span className="icon is-small">
                                <i className="fas fa-angle-down" aria-hidden="true"></i>
                            </span>
                            </button>
                        </div>
                        <div className="dropdown-menu" id="dropdown-menu4" role="menu">
                            <div className="dropdown-content">
                            <div className="dropdown-item">
                                <p>You can insert <strong>any type of content</strong> within the dropdown menu.</p>
                            </div>
                            </div>
                        </div>
                        </div> */}




                        {/* <datalist id="customer_name">
                            {data.customers.edges.map((e)=>{
                                return <option key={e.id} value={e.name} onClick={selectOption}/>
                            })}
                        </datalist> */}

                    </div>
                    <div className="column">
                        <label className="label">Mobile <span className="error_text">{errors.mobile?.message}</span></label>
                        <input className="input is-small" ref={register({required:"(Mobile is required)"})}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        type="text" name="mobile" placeholder="Mobile" disabled/>
                    </div>
                    <input type="hidden" ref={register} name="customerId"/>

                    <div className="column">
                        <label className="label">Address <span className="error_text">{errors.address?.message}</span></label>
                        <input className="input is-small" ref={register({required:"(Address is required)"})}
                        // onChange={()=>setMrp(mrp)} value={mrp} 

                        type="text" name="address" placeholder="Address" disabled/>
                    </div>
                </div>
            </div>
            
            {/* <div className="t-head">
                <span>
                Billing detail
                </span>
            </div> */}

            {/* <div style={{margin:"20px 2px 5px"}}>   
                <span className="sep-word">Billing detail</span>
            </div> */}


            <div>
            
                <div className="columns">
                    <div className="column">
                        <label className="label">Invoice Number<span className="error_text">{errors.payment?.message}</span></label>
                        <div className={`control ${isExistedLoading==true && "is-loading"}`} >
                            <input className={`input is-small ${isExisted !=undefined && isExisted.lastNumber.exist==true && "is-danger"}`} ref={register()}
                            //  onChange={()=>setQty(qty)} value={qty} 
                            // onChange={(e)=>CheckExisted({variables:{"id":e.target.value}})}
                            // defaultValue={lastNumber.lastNumber.lastNumber}
                            type="text" name="invoice_number"  placeholder="Invoice Number" disabled/>
                        </div>

                        {
                            isExisted !=undefined &&
                            <div style={{fontSize:'0.6em',color:'red',display:`${isExisted.lastNumber.exist==true ? "block":"none"}`}}>
                                <span>Invoice number already existed</span>
                            </div>
                        }
                        
                        
                    </div>
                    
                    {/* <div className="column">
                        <label className="label">GST</label>
                        <input className="input is-small" ref={register}
                        type="text" name="gst" placeholder="GST"/>
                    </div> */}

                    <div className="column">
                        <label className="label">Date <span className="error_text">{errors.date?.message}</span></label>
                        <input className="input is-small" ref={register({required:"(Fill date first)"})}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        type="date" name="date" placeholder="date" required/>
                    </div>

                    <div className="column">
                        <label className="label">Remarks</label>
                        <input className="input is-small" ref={register}
                        type="text" name="remarks" placeholder="Remarks"/>
                    </div>
                </div>
            </div>


            {/* <div>   
                <h2 className="subtitle" style={{marginTop:"10px",fontWeight:'300'}}>Products</h2>
            </div> */}
            <div>
                <hr className="divider" style={{height:'1px',backgroundColor:'#d9d9d9',margin:'1rem 0'}} />
            </div>
            

            <div style={{marginBottom:"15px",display:'flex',alignItems:'center'}}>
                <h2 style={{fontFamily:'nfontL',fontWeight:'300'}}> Product detail</h2>
                <a className="tag is-link is-light" style={{marginLeft:"20px"}} 
                onClick={()=>setPactive("is-active")}
                >Add Product</a>
            </div>
            <div>
        </div>
                <form onSubmit={handleSubmit(AddRows)}>
                <div className="columns">
                    <div className="column is-4">
                        <label className="label">Product<span className="error_text">{errors.medicine?.message}</span></label>
                        {/* {errors.medicine?.message} */}
                        {/* <input className="input is-small" list="medicine_name" ref={register({required:"(required)"})} autoComplete="off"
                        type="text" name="medicine"  placeholder="Medicine" onChange={selectMedicineOption} /> */}


                        <div style={{position:'relative',padding:"0"}} >
                            <div type="text" className="input is-small" 
                            onClick={()=>{setProductDD(productDD==="dd-active"?"":"dd-active")}}
                            >
                                {/* <input type="text" className="input is-small"/> */}
                                <div style={{width:'100%',padding:"0",display:'flex'}}>
                                    <span style={{textOverflow:'ellipsis',overflow:'hidden',whiteSpace:'nowrap',paddingRight:'2px',width:'100%'}}>{product.name}</span>
                                    <span style={{float:'right'}}>
                                        <FontAwesomeIcon icon={faAngleDown} />
                                    </span>
                                </div>
                            </div>
                            <div style={{padding:"0"}}>
                                <div className={`control my-d dropdown-content ${productloading===true?"is-loading":""} ${productDD}`} style={{padding:"0"}}>
                                    <input type="text" className={`input is-small `} value={productFilter} onChange={(e)=>{ setProductFilter(e.target.value), showProduct(e) }} placeholder="Search product.." style={{border:0,outline:0,boxShadow:'none'}}/>
                                    <div className="dd-list" style={{padding:"0",maxHeight:"170px"}}>
                                        {
                                        productTemp!=null?
                                        productTemp.productSuggestion.map(e=>{
                                            // return ( e.node.name.toLocaleLowerCase().startsWith(statefilter)?
                                            return <div style={{padding:"0"}} className="d-item_" onClick={()=>{setProduct({name:e.name}), selectProduct(e), setProductDD(productDD==="dd-active"?"":"dd-active") }} key={e.id} value={e.id}> <a className="dropdown-item">{e.name}</a></div>
                                            // :null
                                                }
                                            ):null
                                        }
                                    </div>
                                    
                                </div>
                            </div>
                        </div>  


                        {/* <div className={`dropdown ${dropdown2}`} id="customer_dropdown" style={{width:"100%"}} >
                        <div style={{width:"100%"}} className="dropdown-trigger" onClick={()=>{dropdown2==="is-active"?setDropdown2(""):setDropdown2("is-active")}}>
                            <button type="button" style={{width:"100%"}} className="button is-small" aria-haspopup="true" aria-controls="dropdown-menu3">
                                <span ref={register} name="name">{pname.length===0?"Product name":pname}</span>


                            <span className="icon is-small">
                                <i className="fas fa-angle-down" aria-hidden="true"></i>
                            </span>
                            </button>
                        </div>
                        <div className="dropdown-menu" id="dropdown-menu3" role="menu">
                            <div className="dropdown-content">
                            <a className="dropdown-item" style={{padding:"0"}}>
                                <div className={`control ${productloading===true?"is-loading":""}`}>
                                    <input type="text" className="input is-small search_dropdown is-loading" onChange={(e)=>showProduct(e)} placeholder="Product name.." />
                                </div>
                                
                            </a>
                            <hr className="dropdown-divider" />
                            {
                                productTemp!=undefined?
                                productTemp.productSuggestion.map(e=>{
                                return <a className="dropdown-item" onClick={()=>selectProduct(e)} key={e.id}> {e.name}</a>
                                }):""
                            }
                            </div>
                        </div>
                        </div> */}


                        

                        {/* <div style={{position:'absolute',zIndex:'1',background:'white',display:list.length?"block":"none"}} className="_list">
                            { list.map((e)=>{
                            return <div className="_list-item" key={e.id} onClick={()=>fillMedicineInfo(e.id,e.name,e.qty,e.price,e.expiryDate,e.discount,e.GST)}>
                                <div key={e.id} >
                                        <span className="left">{e.name}</span>
                                        <span className="right">&#x20b9; {e.price}</span>
                                </div>
                            </div>
                            })}   
                        </div> */}

                    </div>
                    <div className="column">
                        <label className="label">Gross(mtr)<span style={{fontSize:12,fontWeight:'normal'}}>{qlabel}</span></label>
                        <input type="hidden" name="id" ref={register}/>
                        <input className="input is-small" ref={register}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        onChange={(e)=>SetNetMForGrossM(e)}
                        type="text" name="grossm" placeholder="Gross(mtr)" required/>
                    </div>
                    <div className="column is-1">
                        <label className="label">Less(%)</label>
                        <input type="hidden" name="id" ref={register}/>
                        <input className="input is-small" ref={register}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        defaultValue={0}
                        type="text" name="less" placeholder="Less" onChange={(e)=>SetNetM(e)} required/>
                    </div>
                    <div className="column">
                        <label className="label">Net(mtr)</label>
                        <input type="hidden" name="id" ref={register}/>
                        <input className="input is-small" ref={register}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        type="text" name="net" placeholder="Net(mtr)" required disabled/>
                    </div>
                    <input type="hidden" name="pgst" ref={register} />
                    <div className="column is-1">
                        <label className="label">Taga</label>
                        <input className="input is-small" ref={register}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        defaultValue={0}
                        type="text" name="taga" placeholder="Taga" required/>
                    </div>

                    <div className="column">
                        <label className="label">Price</label>
                        <input className="input is-small" ref={register}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        type="text" name="price" placeholder="Price" required/>
                    </div>
                    {/* <div className="column">
                        <label className="label">Expiry Date</label>
                        <input className="input is-small" ref={register}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        type="date" name="expiry" placeholder="Expiry Date" required/>
                    </div> */}
                    {/* <div className="column">
                        <label className="label">Discount</label>
                        <input className="input is-small" ref={register}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        type="text" name="discount" placeholder="Discount" required />
                    </div> */}
                    <div className="column is-1">
                    {/* <label className="label">Add</label> */}
                        <div style={{display:'table',height:'100%',width:'100%',textAlign:'center'}}>
                            <div className="_icon" style={{display:'table-cell',verticalAlign:'bottom'}}>
                            <button type="submit"  className="button is-small is-link" style={{fontWeight:'bold'}} >+</button>
                            </div>
                        </div>

                    </div>
                </div>
                </form>
            </div>


              
            {/* </form> */}

            <div className="datatable" style={{display:mlist.length?'block':'none',marginTop:'70px'}}>
                <table className="table is-fullwidth ctable">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Gross (mtr)</th>
                            <th>Less(%)</th>
                            <th>Net(mtr)</th>
                            <th>Taga</th>
                            <th>Price</th>
                            {/* <th>Total Amount</th> */}
                            <th></th>
                        </tr>
                    </thead>
                
                <tbody>
                {mlist.map((e,i)=>{
                    
                    return(
                        <tr style={{fontFamily:'nfont'}} key={e.medicineId} 
                        // style={{fontSize: "13px",
                        //     letterSpacing: "1px",
                        //     marginBottom: "5px",
                        //     textTransform: "uppercase"
                        //     }}
                            >
                            <td style={{fontWeight:'bold', fontFamily:'nfontB',width:"250px"}}>
                                {e.name}
                            
                            </td>
                            <td>{e.grossm}</td>

                            <td>{e.less}</td>
                            <td>{e.net}</td>
                            <td>{e.taga}</td>
                            <td>{e.price}</td>
                            {/* <td>{e.discount??1}</td> */}
                            {/* <td>{(e.price * e.qty??1) - ((e.price * e.qty??1)*e.discount/100)  }</td> */}
                            <td onClick={deletefromtemp.bind(null,i)} style={{cursor:'pointer'}}>
                                <FontAwesomeIcon icon={faTrashAlt} color="red" />
                            </td>
                        </tr>
                    )
                })}
                <tr>
                   <td colspan={4} style={{fontWeight:'bold',fontSize:'1.2rem',padding:'0.5em 0.55em'}}>
                        Total
                    </td> 
                    <td style={{fontWeight:'bold',fontSize:'1.2rem',padding:'0.5em 0.55em'}}>
                        &#8377;
                        
                        <span style={{paddingLeft:"2px"}}>{tamount}</span>
                    </td>
                </tr>
                </tbody>
                </table>

                {/* <div style={{display:'flex',height:'30px',marginBottom:"20px",fontSize:'1em',fontWeight:'bold',alignItems:'center'}}> 
                    <div>
                        <h2 className="subtitle">Do you want full payment? </h2>
                    </div>
                    
                    <div style={{marginLeft:"20px",display:'flex'}} class="control">
                        <label class="radio"style={{marginRight:"15px",display:'flex',alignItems:'center'}}>
                            <input type="radio" style={{marginRight:'10px'}} name="answer" onClick={()=>setFullpayment(true)} defaultChecked />
                            Yes
                        </label>
                        <label class="radio" style={{display:'flex',alignItems:'center'}}>
                            <input type="radio" style={{marginRight:'10px'}} name="answer" onClick={()=>setFullpayment(false)}/>
                            No
                        </label>
                    </div>
                    <div style={{marginLeft:"15px",display:fullPayment===true?"none":"block"}}>
                        <input type="text" className="input is-small" ref={register} name="paid" placeholder="Payment" />
                    </div>
                    
                </div> */}

                {billData==undefined?
                <>
                

                <a onClick={()=> 
                    BillToServer( getValues("customerId"),getValues("date"),getValues("payment"),getValues("remarks"),mlist,getValues("invoice_number"),getValues("taga"))
                }
                target={billstore.invoice==null?'_self':'_blank'}>


                <button type="button" className={`button is-primary is-small ${billLoading==true?"is-loading":""}`} data-target="bill" aria-haspopup="true">
                        {billstore.invoice==null?"Generate":"Download bill"}
                </button>
                </a>
                
                </>
                :
                    <>
                    <a href={`${server}/invoice/${billData.generateBill.bill.id}/${billData.generateBill.bill.user.id}`} target="_blank" className="button is-primary is-small" >View or Print</a>
                    <a style={{marginLeft:'30px'}} className="button is-small" onClick={()=>Router.reload()}>Reset</a>
                    </>
                }
            </div>
        </div>
    )

}





const Bill = () =>{
    
    
    const billstore = useSelector(state => state.bills);
    // console.log(billstore)
    return(
        <SnackbarProvider>
        <Layout loading={billstore.loading} title="Generate Bill" >
            <div>
                <Billingform/>
            </div>
        </Layout>
        </SnackbarProvider>
    )
}

export default Bill