import Layout from "../../components/layout"
import {useForm} from 'react-hook-form'
import { useQuery,useLazyQuery, useMutation } from '@apollo/react-hooks'
import { getAllPatient,productSuggetionQuery, customerSuggestion, getAllCustomersQuery,generateBillQuery } from "../../lib/graphql";
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
// import SelectSearch from 'react-select-search';
// import { useSelect } from 'react-select-search';
import $ from 'jquery'

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

const Billingform =() =>{
    const [qlabel,setQlabel] = useState("")
    const [mlist,setMlist] = useState([])
    const [list,setList] = useState([])
    const [active,setActive] = useState("modal")
    const [cname,setCname] = useState("")
    const [pname,setPname] = useState("")
    const [cSuggestion,{data:customerTemp,loading:customerloading}] = useLazyQuery(customerSuggestion)
    const [pSuggestion,{data:productTemp,loading:productloading}] = useLazyQuery(productSuggetionQuery)
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
    
    if(loading)
        return <div><BillPageLoading/></div>
    const selectOption=(e)=>{
        // const f = data.customers.edges.filter(t=>(t.node.id===e.target.value))[0]
        // if(f!=undefined)
        //     setValue([{"mobile":f.node.mobile},{"address":f.node.address},{"customerId":f.node.id}])
        // if(e.target.value==="0")
        // {
        //     setValue([{"mobile":""},{"address":""},{"customerId":""}])   
        // }
        setDropdown1("")
        setCname(e.name)
        setValue([{"mobile":e.mobile},{"address":e.address},{"customerId":e.id},{"name":e.name}])

        
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
        if(e.target.value.length>0)
        {
            cSuggestion({variables:{suggestion:e.target.value}})
        }
    }

    const showProduct =(e)=>{
        if(e.target.value.length>0)
        {
            pSuggestion({variables:{suggestion:e.target.value}})
        }
    }

    const BillToServer=(customerId,date,payment,remarks,mlist)=>{
        // console.log(errors)
        console.log(customerId)
        console.log(date)
        console.log(payment)
        console.log(remarks)
        console.log(mlist)
        // console.log(mlist)
        genBill({variables:{
            "customerId":customerId,
            "remarks":remarks,
            "date":date,
            "payment":payment,
            "products":mlist,
            // "paid":getValues("paid") === ""?tamount:getValues("paid")
        }})

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
                "net":getValues("net"),
                // "discount":getValues("discount").length?getValues("discount"):0
            }]
        ))
        
        // setTamount( tamount+(getValues("price") * getValues("qty")??1) - ((getValues("price") * getValues("qty")??1)*getValues("discount")/100))
        
        setTamount(tamount+parseFloat(getValues("price")))

        setPname("")
        setProduct({name:"Select Product"})
        setProductFilter("")
        
        setValue([
            // {"medicine":""},
            {"qty":""},
            {"price":""},
            {"expiry":""},
            {"discount":""},
            {"pgst":""}
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
        dispatch(clearBill())
        setCname("")
        setPname("")
        setValue([
            {"mobile":""},
            {"address":""},
            {"remarks":""},
            {"gender":""},
            {"payment":""},
            {"gst":""},
            {"date":""},
            
        ])

    }
    // console.log(mlist)
    // console.log(billstore)

    

    return (
        <div 
        // onClick={()=>{dropdown1==="is-active"?setDropdown1(""):null}}
        >
            <div className="topHeading">
                <h2>Sales</h2>
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
            `} </style>
            {/* <form> */}
            {/* <div>   
                <h2 className="subtitle" style={{marginTop:"10px",fontWeight:'300'}}>User detail</h2>
            </div> */}
            <div style={{margin:"20px 2px 5px"}}>   
                <span className="" style={{fontSize:'22px', marginTop:"10px",fontWeight:'600'}}>User detail</span>
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
                                        customerTemp.customerSuggestion.map(e=>{
                                            // return ( e.node.name.toLocaleLowerCase().startsWith(statefilter)?
                                            return <div style={{padding:"0"}} className="d-item_" onClick={()=>{setCustomer({name:e.name}), selectOption(e), setCustomerDD(customerDD==="dd-active"?"":"dd-active") }} key={e.id} value={e.id}> <a className="dropdown-item">{e.name}</a></div>
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

            <div style={{margin:"20px 2px 5px"}}>   
                <span className="" style={{fontSize:'22px', marginTop:"10px",fontWeight:'600'}}>Billing detail</span>
            </div>


            <div>
            
                <div className="columns">
                    <div className="column">
                        <label className="label">Payment Mode <span className="error_text">{errors.payment?.message}</span></label>
                        <input className="input is-small" ref={register({required:"(this is required)"})}
                        //  onChange={()=>setQty(qty)} value={qty} 
                        type="text" name="payment"  placeholder="Payment Mode"/>
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
            <div style={{margin:"20px 2px 5px"}}>   
                <span className="" style={{fontSize:'22px', marginTop:"10px",fontWeight:'600'}}>Products detail</span>
            </div>

            <div>
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
                        type="text" name="grossm" placeholder="Gross(mtr)" required/>
                    </div>
                    <div className="column is-1">
                        <label className="label">Less(%)</label>
                        <input type="hidden" name="id" ref={register}/>
                        <input className="input is-small" ref={register}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        type="text" name="less" placeholder="Less" required/>
                    </div>
                    <div className="column">
                        <label className="label">Net(mtr)</label>
                        <input type="hidden" name="id" ref={register}/>
                        <input className="input is-small" ref={register}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        type="text" name="net" placeholder="Net(mtr)" required/>
                    </div>
                    <input type="hidden" name="pgst" ref={register} />
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
                            <th>Price</th>
                            <th>Gross (mtr)</th>
                            <th>Less(%)</th>
                            <th>Net(mtr)</th>
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
                            <td style={{fontWeight:'bold',fontFamily:'nfontB'}}>
                                {e.name}
                            
                            </td>
                            <td>{e.price}</td>
                            <td>{e.grossm}</td>
                            <td>{e.less}</td>
                            <td>{e.net}</td>
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
                    BillToServer( getValues("customerId"),getValues("date"),getValues("payment"),getValues("remarks"),mlist)
                }
                target={billstore.invoice==null?'_self':'_blank'}>


                <button type="button" className={`button is-primary is-small ${billLoading==true?"is-loading":""}`} data-target="bill" aria-haspopup="true">
                        {billstore.invoice==null?"Generate":"Download bill"}
                </button>
                </a>
                
                </>
                :
                    <>
                    <a href={`${server}/invoice/${billData.generateBill.bill.id}/`} target="_blank" className="button is-primary is-small" >Bill</a>
                    <a style={{marginLeft:'30px'}} className="button is-small" onClick={()=>reset()}>Reset</a>
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
        <Layout loading={billstore.loading} title="Generate Bill" >
            <div>
                <Billingform/>
            </div>
        </Layout>
    )
}

export default Bill