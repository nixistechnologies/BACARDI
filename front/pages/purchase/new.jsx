import Layout from '../../components/layout'
import {vendorSuggestionQuery,productStartsWithQuery,addPurchaseQuery} from '../../lib/graphql'
import {useLazyQuery,useMutation} from '@apollo/react-hooks'
import CreateProduct from '../../components/productForm'
import {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrashAlt} from '@fortawesome/free-regular-svg-icons'
import { faUpload,faAngleDown, } from '@fortawesome/free-solid-svg-icons';
import {useForm} from 'react-hook-form'
import ProductForm from '../../components/productForm'
import SnackbarProvider,{useSnackbar} from 'react-simple-snackbar'
import VendorModel from '../../components/vendorModel'

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


const NewPurchase = () =>{
    const [getVendor,{data:vendorData,loading:VendorLoading}] = useLazyQuery(vendorSuggestionQuery)
    const [getProduct,{data:productData,loading:productLoading}] = useLazyQuery(productStartsWithQuery)
    const { register, handleSubmit, watch, errors,reset,setValue,getValues } = useForm();
    const [vendorFilter,setVendorFilter] = useState("")
    const [vendorDD,setVendorDD] = useState("")
    const [vendor,setVendor] = useState({name:"Select Vendor",id:"",email:"",gst:""})

    const [productFilter,setProductFilter] = useState("")
    const [productDD,setProductDD] = useState("")
    const [product,setProduct] = useState({name:"Select Product"})
    
    const [active,setActive] = useState("2")
    const [Vactive,setVActive] = useState("")
    const [mlist,setMlist] = useState([])
    const [addPurchase,{data:purchaseData,loading:purchaseLoading}] = useMutation(addPurchaseQuery)
    const [openSnackbar, closeSnackbar] = useSnackbar({position:"top-center",style:{zIndex:"999", marginTop:"50px"}})


    const AddRow = (data) =>{
        console.log(data)
        setMlist(mlist.concat(
            [{
                "name":product.name,
                "productId":data.productId,
                "qty":data.qty,
                "discount":data.discount?data.discount:0,
                "mrp":data.mrp,
                "price":data.list,
                "cost":data.cost,
                // "gst":getValues("pgst"),
                // "discount":getValues("discount").length?getValues("discount"):0
            }]
        ))
        setProduct({name:"Select Product"})
        reset({
            "name":"","productId":"","qty":"","discount":"","mrp":"","list":"","cost":""
        })
    }

    const deletefromtemp=(id)=>{
        setMlist(mlist.slice(0, id).concat(mlist.slice(id+1, mlist.length)))

    }

    const sendToserver = () =>{
        addPurchase({
            variables:{
                "date":getValues("invoice_date"),
                "invoiceNumber":getValues("invoice_number"),
                "vendorId":vendor.id,
                "products":mlist
            },
            optimisticResponse:true,
            update:(cache,{data})=>{
                setMlist([])
                setVendor({name:""})
                reset({
                    "name":"","productId":"","qty":"","discount":"","mrp":"","list":"","cost":"","vendor_email":"","vendor_GST":"","invoice_date":"","invoice_number":""
                })

                openSnackbar("Purchase has been added successfully")
            }
        })
    }
    
    return <>
    <SnackbarProvider>
        <Layout>
            {/* <CreateProduct purchase={true}/> */}
            <Modal active={active} setActive={setActive} />
            <VendorModel active={Vactive} setActive={setVActive} isNew={true} />
            <div >
            <div className="topHeading">
                <h2>Purchase</h2>
            </div>
            <div style={{marginBottom:"30px"}}>
                {/* <h2 style={{fontSize:"20px",marginBottom:"15px",fontWeight:'300'}}> Vendor Detail</h2> */}
                {/* <hr /> */}

                <div style={{marginBottom:"15px",display:'flex',alignItems:'center'}}>
                    <h2 style={{fontSize:"20px",fontWeight:'300'}}> Vendor Detail</h2>
                    <a className="tag is-link is-light" style={{marginLeft:"20px"}} onClick={()=>setVActive("is-active")}>Add vendor</a>
                </div>

                <div className="i_row" style={{display:"flex"}}>
                    
                    
                    
                    <div>
                        <label className="label">Vendor Name</label>
                        {/* <input className="input is-small" ref={register}
                        type="text" name="vendor_name" placeholder="Vendor NAme" required/> */}


                        <div style={{position:'relative',padding:"0"}} >
                            <div type="text" className="input is-small" 
                            onClick={()=>{setVendorDD(vendorDD==="dd-active"?"":"dd-active")}}
                            >
                                {/* <input type="text" className="input is-small"/> */}
                                <div style={{width:'100%',padding:"0"}}>
                                    <span>{vendor.name}</span>
                                    <span style={{float:'right'}}>
                                        <FontAwesomeIcon icon={faAngleDown} />
                                    </span>
                                </div>
                            </div>
                            <div style={{padding:"0"}}>
                                <div className={`control my-d dropdown-content ${VendorLoading===true?"is-loading":""} ${vendorDD}`} style={{padding:"0"}}>
                                    <input type="text" className={`input is-small `} value={vendorFilter} onChange={(e)=>{ setVendorFilter(e.target.value), getVendor({variables:{"name":e.target.value}})}} placeholder="Search Vendor.." style={{border:0,outline:0,boxShadow:'none'}}/>
                                    <div className="dd-list" style={{padding:"0",maxHeight:"170px"}}>
                                        {
                                        vendorData!=null?
                                        vendorData.vendors.edges.map(e=>{
                                            // return ( e.node.name.toLocaleLowerCase().startsWith(statefilter)?
                                            return <div style={{padding:"0"}} className="d-item_" onClick={()=>{setVendor({name:e.node.name,id:e.node.id,email:e.node.email,gst:e.node.gst}), setValue([{"vendor_email":e.node.email},{"vendor_GST":e.node.gst}]), setVendorDD(vendorDD==="dd-active"?"":"dd-active") }} key={e.node.id} value={e.node.id}> <a className="dropdown-item">{e.node.name}</a></div>
                                            // :null
                                                }
                                            ):null
                                        }
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="label">Vendor Email</label>
                        <input className="input is-small is-disabled" ref={register}
                        type="text" name="vendor_email"  placeholder="Vendor Email" required disabled/>
                    </div>
                    <div>
                        <label className="label">GST</label>
                        <input className="input is-small" ref={register}
                        type="text" name="vendor_GST"  placeholder="Vendor GST" required disabled/>
                    </div>
                </div>
            </div>

            <div style={{marginBottom:"30px"}}>
                <h2 style={{fontSize:"20px",marginBottom:"15px",fontWeight:'300'}}> Invoice Detail</h2>
                {/* <hr /> */}
                <div className="i_row" style={{display:"flex"}}>
                    <div>
                        <label className="label">Invoice Date</label>
                        <input className="input is-small" ref={register}
                        type="date" name="invoice_date" placeholder="Invoice date" required/>
                    </div>
                    <div>
                        <label className="label">Invoice Number</label>
                        <input className="input is-small" ref={register}
                        type="text" name="invoice_number"  placeholder="Invoice Number" required/>
                    </div>
                    <div>
                        <label className="label">Upload</label>

                        <div className="file is-small">
                            <label className="file-label">
                                <input className="file-input is-small" type="file" name="resume" />
                                <span className="file-cta">
                                <span className="file-icon">
                                <FontAwesomeIcon icon={faUpload} />
                                </span>
                                <span className="file-label">
                                    Choose a file…
                                </span>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>


            <form style={{marginBottom:"30px"}} onSubmit={handleSubmit(AddRow)} >
                <div style={{marginBottom:"15px",display:'flex',alignItems:'center'}}>
                    <h2 style={{fontSize:"20px",fontWeight:'300'}}> Product Detail</h2>
                    <a className="tag is-link is-light" style={{marginLeft:"20px"}} onClick={()=>setActive("is-active")}>Add Product</a>
                </div>
                {/* <hr /> */}
                <div className="columns">
                    <div className="column is-3">
                        <label className="label">Product Name</label>

                        <div style={{position:'relative',padding:"0"}} >
                            <div type="text" className="input is-small" 
                            onClick={()=>{setProductDD(productDD==="dd-active"?"":"dd-active")}}
                            >
                                {/* <input type="text" className="input is-small"/> */}
                                <div style={{width:'100%',padding:"0"}}>
                                    <span>{product.name}</span>
                                    <span style={{float:'right'}}>
                                        <FontAwesomeIcon icon={faAngleDown} />
                                    </span>
                                </div>
                            </div>
                            <div style={{padding:"0"}}>
                                <div className={`control my-d dropdown-content ${productLoading===true?"is-loading":""} ${productDD}`} style={{padding:"0"}}>
                                    <input type="text" className={`input is-small `} value={productFilter} onChange={(e)=>{ setProductFilter(e.target.value), getProduct({variables:{"name":e.target.value}})}} placeholder="Search product.." style={{border:0,outline:0,boxShadow:'none'}}/>
                                    <div className="dd-list" style={{padding:"0",maxHeight:"170px"}}>
                                        {
                                        productData!=null?
                                        productData.allProducts.edges.map(e=>{
                                            // return ( e.node.name.toLocaleLowerCase().startsWith(statefilter)?
                                            return <div style={{padding:"0"}} className="d-item_" onClick={()=>{setProduct({name:e.node.name}), setValue([{"qty":e.node.qty},{"mrp":e.node.mrp}, {"productId":e.node.id},{"cost":e.node.cost},{"list":e.node.price}]), setProductDD(productDD==="dd-active"?"":"dd-active") }} key={e.node.id} value={e.node.id}> <a className="dropdown-item">{e.node.name}</a></div>
                                            // :null
                                                }
                                            ):null
                                        }
                                    </div>
                                    
                                </div>
                            </div>
                        </div>                    
                    
                    
                    </div>
                    <div className="column">
                        <label className="label">Quantity</label>
                        <input type="hidden" name="productId" ref={register}/>
                        <input className="input is-small" ref={register}
                        type="text" name="qty"  placeholder="Quantity" required/>
                    </div>
                    <div className="column">
                        <label className="label">Discount</label>
                        <input type="text" placeholder="Discount" ref={register} name="discount" className="input is-small" />
                    </div>
                    <div className="column">
                        <label className="label">MRP</label>
                        <input type="text" placeholder="MRP" ref={register} name="mrp" className="input is-small" />
                    </div>
                    <div className="column">
                        <label className="label">List Price</label>
                        <input type="text" placeholder="List Price" ref={register} name="list" className="input is-small" />
                    </div>
                    <div className="column">
                        <label className="label">Cost</label>
                        <input type="text" placeholder="Cost Price" ref={register} name="cost" className="input is-small" />
                    </div>
                    <div className="column is-1">
                        <label className="label" style={{visibility:"hidden"}}>c</label>
                        <button type="submit" className="button is-link is-small tag">Add</button>
                        {/* <input type="text" placeholder="Cost Price" ref={register} name="cost" className="input is-small" /> */}
                    </div>
                </div>
            </form>






            <div className="datatable" style={{display:mlist.length?'block':'none',marginTop:'70px'}}>
                <table className="table is-fullwidth ctable is-hoverable">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>MRP</th>
                            <th>List Price</th>
                            <th>Cost Price</th>
                            <th>Discount</th>
                            {/* <th>Total Amount</th> */}
                            <th></th>
                        </tr>
                    </thead>
                
                <tbody>
                {mlist.map((e,i)=>{
                    return(
                        <tr key={e.productId} style={{fontSize: "13px",
                            letterSpacing: "1px",
                            marginBottom: "5px",
                            textTransform: "uppercase"
                            }}>
                            <td style={{fontWeight:'bold'}}>{e.name}</td>
                            <td>{e.qty}</td>
                            <td>{e.mrp}</td>
                            <td>{e.price}</td>
                            <td>{e.cost}</td>
                            <td>{e.discount??1}</td>
                            {/* <td>{(e.price * e.qty??1) - ((e.price * e.qty??1)*e.discount/100)  }</td> */}
                            <td onClick={deletefromtemp.bind(null,i)} style={{cursor:'pointer'}}>
                                <FontAwesomeIcon icon={faTrashAlt} color="red" />
                            </td>
                        </tr>
                    )
                })}
                </tbody>
                </table>
                <button className={`button is-small is-primary ${purchaseLoading===true?"is-loading":""} `} onClick={()=>sendToserver()} >Proceed</button>

                {/* {billData==undefined?
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
                    <a href={`${server}/media/${billData.generateBill.bill.invoice}`} target="_blank" className="button is-primary is-small" >Bill</a>
                    <a style={{marginLeft:'30px'}} className="button is-small" onClick={()=>reset()}>Reset</a>
                    </>
                } */}
            </div>







            </div>


            
        </Layout>
        </SnackbarProvider>
    </>
}

export default  ()=> <SnackbarProvider> <NewPurchase /></SnackbarProvider>;