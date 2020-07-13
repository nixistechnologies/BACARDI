import Layout from "../components/layout"
import {useForm} from 'react-hook-form'
import { useQuery } from '@apollo/react-hooks'
import { getAllPatient,productSuggetionQuery, generateBillQuery } from "../lib/graphql";
import { useDispatch, useSelector } from 'react-redux'
import {useState, useEffect} from 'react'
import React from 'react'
import client from "../lib/apolloClient";
import  {FontAwesomeIcon}  from '@fortawesome/react-fontawesome'
import { faTrashAlt,faEdit } from '@fortawesome/free-regular-svg-icons'
import { generateBill,clearBill } from "../redux_function/actions";
import { server } from "../lib/settings";
import {BillPageLoading} from '../components/skeleton'
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
    const [text,setText] = useState("")
    const { register, handleSubmit,setValue,getValues,errors } = useForm();
    const {loading,error,data} = useQuery(getAllPatient)
    const product = useSelector(state => state.products);
    const billstore = useSelector(state => state.bills);
    const dispatch = useDispatch()
    if(loading)
        return <div><BillPageLoading/></div>
    const selectOption=(d)=>{
        data.allPatient.map((e)=>{
            if(e.name+" ("+e.age+")" === d.target.value)
                setValue([{"age":e.age},{"gender":e.sex},{"patientId":e.id}])
        })
    }

    const BillToServer=(name,age,gender,date,gst,payment,mlist)=>{
        // console.log(errors)
        dispatch(generateBill(name,age,gender,date,gst,payment,mlist))
    }

    const fillMedicineInfo = (id,medicine,qty,price,expiry,discount)=>{
        // console.log("tap")
        setQlabel(` (${qty})`)
        setValue([
            {"id":id},
            {"medicine":medicine},
            // {"qty":qty},
            {"price":price},
            {"expiry":expiry},
            {"discount":discount}
        ])
        setList([])
    }

    const AddRows=()=>{
        setMlist(mlist.concat(
            [{
                "medicineId":getValues("id"),
                "name":getValues("medicine"),
                "qty":getValues("qty").length? getValues("qty"):1,
                "price":getValues("price"),
                "expiry":getValues("expiry"),
                "discount":getValues("discount").length?getValues("discount"):0
            }]
        ))
        setValue([
            {"medicine":""},
            {"qty":""},
            {"price":""},
            {"expiry":""},
            {"discount":""},
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
        console.log(id)
        console.log(mlist)
        
        // mlist.slice(0, id-1).concat(mlist.slice(id, mlist.length))
        // console.log(x)
        setMlist(mlist.slice(0, id).concat(mlist.slice(id+1, mlist.length)))

    }
    const reset =()=>{
        setMlist([])
        dispatch(clearBill())
        setValue([
            {"patient":""},
            {"age":""},
            {"gender":""},
            {"payment":""},
            {"gst":""},
            {"date":""},
            
        ])

    }
    // console.log(mlist)
    console.log(billstore)

    return (
        <div>
            <div className="topHeading">
                <h2>Billing</h2>
            </div>
            <style jsx>{`
                .error_text{
                    color:red;
                    font-weight:400
                }
                .is-small{
                    font-size:0.85rem;
                }
            `} </style>
            {/* <form> */}
            <div>   
                <h2 className="subtitle" style={{marginTop:"10px",fontWeight:'300'}}>User detail</h2>
            </div>
            
            <div>
                <div className="columns is-mobile" style={{display:'flex'}}>
                    <div className="column">
                        <label className="label">Patient Name <span className="error_text">{errors.patient?.message}</span></label>
                        

                        <input list="patient_name" className="input is-small" ref={register({required:"(Name is required)"})}
                        //  onChange={()=>setQty(qty)} value={qty} 
                        type="text" name="patient"  placeholder="Patient Name" onChange={selectOption}/>
                        
                        <datalist id="patient_name">
                            {data.allPatient.map((e)=>{
                                return <option key={e.id} value={e.name +" ("+ e.age+")"} onClick={selectOption}/>
                            })}
                        </datalist>

                    </div>
                    <div className="column">
                        <label className="label">Age <span className="error_text">{errors.age?.message}</span></label>
                        <input className="input is-small" ref={register({required:"(Age is required)"})}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        type="text" name="age" placeholder="Age"/>
                    </div>
                    <input type="hidden" ref={register} name="patientId"/>
                    <div className="column">
                        <label className="label">Gender <span className="error_text">{errors.gender?.message}</span></label>
                        <input className="input is-small" ref={register({required:"(Gender is required)"})}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        type="text" name="gender" placeholder="Gender"/>
                    </div>
                </div>
            </div>
            <div>   
                <h2 className="subtitle" style={{marginTop:"10px",fontWeight:'300'}}>Billing detail</h2>
            </div>
            <div>
            
                <div className="columns">
                    <div className="column">
                        <label className="label">Payment Mode <span className="error_text">{errors.payment?.message}</span></label>
                        <input className="input is-small" ref={register({required:"(this is required)"})}
                        //  onChange={()=>setQty(qty)} value={qty} 
                        type="text" name="payment"  placeholder="Payment Mode"/>
                    </div>
                    <div className="column">
                        <label className="label">GST</label>
                        <input className="input is-small" ref={register}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        type="text" name="gst" placeholder="GST"/>
                    </div>
                    <div className="column">
                        <label className="label">Date <span className="error_text">{errors.date?.message}</span></label>
                        <input className="input is-small" ref={register({required:"(Fill date first)"})}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        type="date" name="date" placeholder="date" required/>
                    </div>
                </div>
            </div>


            <div>   
                <h2 className="subtitle" style={{marginTop:"10px",fontWeight:'300'}}>Add Medicines</h2>
            </div>

            <div>
                <form onSubmit={handleSubmit(AddRows)}>
                <div className="columns">
                    <div className="column">
                        <label className="label">Medicine<span className="error_text">{errors.medicine?.message}</span></label>
                        {/* {errors.medicine?.message} */}
                        <input className="input is-small" list="medicine_name" ref={register({required:"(required)"})} autoComplete="off"
                        //  onChange={()=>setQty(qty)} value={qty} 
                        type="text" name="medicine"  placeholder="Medicine" onChange={selectMedicineOption} />
                        

                        <div style={{position:'absolute',zIndex:'1',background:'white',display:list.length?"block":"none"}} className="_list">
                            { list.map((e)=>{
                            return <div className="_list-item" key={e.id} onClick={()=>fillMedicineInfo(e.id,e.name,e.qty,e.price,e.expiryDate,e.discount)}>
                                <div key={e.id} >
                                        <span className="left">{e.name}</span>
                                        <span className="right">&#x20b9; {e.price}</span>
                                </div>
                            </div>
                            })}   
                        </div>

                    </div>
                    <div className="column">
                        <label className="label">Quantity<span style={{fontSize:12,fontWeight:'normal'}}>{qlabel}</span></label>
                        <input type="hidden" name="id" ref={register}/>
                        <input className="input is-small" ref={register}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        type="text" name="qty" placeholder="Quantity"/>
                    </div>
                    <div className="column">
                        <label className="label">Price</label>
                        <input className="input is-small" ref={register}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        type="text" name="price" placeholder="Price"/>
                    </div>
                    <div className="column">
                        <label className="label">Expiry Date</label>
                        <input className="input is-small" ref={register}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        type="date" name="expiry" placeholder="Expiry Date"/>
                    </div>
                    <div className="column">
                        <label className="label">Discount</label>
                        <input className="input is-small" ref={register}
                        // onChange={()=>setMrp(mrp)} value={mrp} 
                        type="text" name="discount" placeholder="Discount"/>
                    </div>
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
                            <th>Quantity</th>
                            <th>Discount</th>
                            <th></th>
                        </tr>
                    </thead>
                
                <tbody>
                {mlist.map((e,i)=>{
                    return(
                        <tr key={e.medicineId} style={{fontSize: "13px",
                            letterSpacing: "1px",
                            marginBottom: "5px",
                            textTransform: "uppercase"
                            }}>
                            <td style={{fontWeight:'bold'}}>{e.name}</td>
                            <td>{e.price}</td>
                            <td>{e.qty??1}</td>
                            <td>{e.discount??1}</td>
                            <td onClick={deletefromtemp.bind(null,i)} style={{cursor:'pointer'}}>
                                <FontAwesomeIcon icon={faTrashAlt} color="red" />
                            </td>
                        </tr>
                    )
                })}
                </tbody>
                </table>

                {billstore.invoice==null?
                <>
                

                <a onClick={()=>
                        BillToServer( getValues("patient"),getValues("age"),getValues("gender"), getValues("date"),getValues("gst"),getValues("payment"),mlist)
                    }
                target={billstore.invoice==null?'_self':'_blank'}>


                <button type="button" className="button is-primary is-small" data-target="bill" aria-haspopup="true">
                        {billstore.invoice==null?"Generate":"Download bill"}
                </button>
                </a>
                {/* <div style={{marginLeft:'10px'}}> */}
                    {/* <a style={{marginLeft:'30px'}} className="button is-small" onClick={()=>reset()}>Reset</a> */}
                {/* </div> */}
                
                </>
                :
                    <>
                    <a href={`${server}/media/${billstore.link}`} target="_blank" className="button is-primary is-small" >Bill</a>
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