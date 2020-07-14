import Layout from '../components/layout'

import { useMutation } from '@apollo/react-hooks';
import { createProductQuery,productSuggetionQueryC,categorySuggestionQuery } from '../lib/graphql';
import { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import {createProduct} from '../redux_function/actions'
import {useForm} from 'react-hook-form'
import client from '../lib/apolloClient';
import { gql } from 'apollo-boost';
import { useStore,useDispatch, useSelector } from 'react-redux'





function CreateProduct(){
    // const [medicine,setMedicine] = useState("")
    // const [qty,setQty] = useState(0)
    // const [mrp,setMrp] = useState(0)
    // const [exp,setExt] = useState("")
    // const [purchase,setPurchase] = useState("")
    // const [typeofpack,setTypeofpack] = useState("")
    // const [gst,setGst] = useState("")
    const [isNew,setIsNew] = useState(true)
    const [list,setList] = useState([])
    const [category,setCategory] = useState([])
    const [temp,setTemp] = useState([])
    const [subcategory, setSubcategory] = useState([])
    const [notify,setNotify] = useState(false)
    const { register, handleSubmit, watch, errors,reset,setValue,getValues } = useForm();
    const product = useSelector(state=>state)
    const dispatch = useDispatch()
    const  onSubmit = async(data) =>{
        dispatch(createProduct(data))
    }
    const clearData=() =>{
        // console.log(onSubmit)
        setValue([
            {"gst":""},{"mrp":""},{"medicine":""},{"qty":""},{"purchase":""},{"typeofpack":""},{"exp_date":"dd/mm/yyyy"},
            {"mfg":"","discount":"","hsn":"","batch":""}
        ])
        return false
    }

    useEffect(()=>{
        setNotify(product.products.created)
        console.log(product.products)
        clearData()
    },[product.products.items.length])
    

    const fillProductInfo = (e)=>{
        // console.log("tap")
        // setQlabel(` (${qty})`)
        setValue([
            {"id":e.id},
            {"product":e.product},
            {"qty":e.qty},
            {"typeofpack":e.typeOfPacking},
            
            {"mrp":e.mrp},
            {"cost":e.cost},
            {"listprice":e.price},
            
            {"mfg":e.mfg},
            {"exp_date":e.expiryDate},
            {"exp_time":e.expiryTime},

            
            {"discount":e.discount},
            {"hsn":e.hsn},
            {"batch":e.batch}

        ])
        setIsNew(false)
        setList([])
    }

    const subCategoryOption = (e) =>{
        // console.log(e.name)
        setValue([
            {"category":e.name},
            {"categoryId":e.id}
        ])
        setSubcategory(e.subcategorySet.edges)
        setCategory([])
        
    }


    const selectSubCategory = async (d) =>{
        var val = d.target.value
        // console.log(su)
        if(val.length)
            setTemp(subcategory.map(e=>e.node.name.toLocaleLowerCase().startsWith(val.toLocaleLowerCase())?e:undefined ))
        // else if(val.toLocaleLowerCase() === d)
        else
            setTemp([])
    }

    const getCategoryName = async (d)=>{
        var val = d.target.value
        var result = await client.query({
            query:categorySuggestionQuery,
            variables:{
                "suggestion":d.target.value
            }
        })
        if(result.loading == false)
        {
            if(val.length==0)
            {
                setCategory([])
                // setIsNew(false)
            }else{
                setCategory(result.data.categorySuggestion)
            }
            console.log(category)
        }
        
    }

    const selectMedicineOption = async (d)=>{
        // const {loading,data} = useQuery(productSuggetionQuery,{variables:{"suggestion":d.target.value}})
        var vl = d.target.value
        var result = await client.query({
            query:productSuggetionQueryC,
            variables:{
                "suggestion":d.target.value
            }
        })
        if(result.loading == false)
        if(vl.length==0)
        {
            setList([])
            setIsNew(false)
        }else{
            setList(result.data.productSuggestion)
        }

    }





    return(
        <Layout>
            <style jsx>{`
                .is-small{
                    font-size:0.85rem;
                }
            `}
            </style>
            <div style={{display:notify?'block':'none'}}  onClick={()=>setNotify(false)}>
                <div className="notification is-primary">
                <button className="delete"  onClick={()=>setNotify(false)}></button>
                 product has been uploaded
                </div>
            </div>
        <div style={{maxWidth:"1000px",}} className="createform">
            <div className="topHeading">
                <h2>Create New</h2>
            </div>
            
            <form 
                onSubmit={handleSubmit(onSubmit)}
            >

            <div className="i_row" style={{display:"flex"}}>
                <div>
                    <label className="label">Category Name</label>
                    <input type="text" className="input is-small" placeholder="Category Name" name="category"
                    onChange={getCategoryName} autoComplete="off" ref={register}/>
                    <input type="hidden" name="categoryId" ref={register}/>
                    
                    <div style={{'padding':0,'maxWidth':'350px', position:'absolute',zIndex:'1',background:'white',display:category.length?"block":"none"}} role="combobox" className="_list">
                        { category.map((e)=>{
                        return <div className="_list-item" key={e.id} onClick={()=>subCategoryOption(e)}>
                            <div key={e.id} >
                                    <span className="left">{e.name}</span>
                                    {/* <span className="right">&#x20b9; {e.price}</span> */}
                            </div>
                        </div>
                        })}   
                    </div>

                </div>
                <div>
                    <label className="label">Sub Category</label>
                    <input type="text" className="input is-small" placeholder="Sub Category Name" name="subCategory" ref={register}
                    onChange={selectSubCategory}
                    />
                    <input type="hidden" name="subCategoryId" ref={register}/>
                    
                    <div style={{'padding':0,'maxWidth':'350px', position:'absolute',zIndex:'1',background:'white',display:temp.length?"block":"none"}} role="combobox" className="_list">
                        { temp.map((e)=>{
                        // console.log(e.node.name.startsWith(getValues("subCategory")))
                        // console.log(getValues("subCategory").length)
                        // if(e.node.name.startsWith(getValues("subCategory"))==true && getValues("subCategory").length>0)
                        // {
                            // console.log(e)
                            if(e!=undefined)
                            {return (
                                <div className="_list-item" key={e.node.id} onClick={()=>{setValue([{"subCategory":e.node.name},{"subCategoryId":e.node.id}]) , setTemp([])}}>
                                <div key={e.node.id} >
                                        <span className="left">{e.node.name}</span>
                                        {/* <span className="right">&#x20b9; {e.price}</span> */}
                                </div>
                            </div>
                            )}
                        
                        
                        })}   
                    </div>
                </div>
                

            </div>
            <div className="i_row" style={{display:"flex"}}>
                <div>
                    <label className="label">Product Name</label>
                    <input className="input is-small" ref={register}
                    // onChange={()=>setMedicine(medicine)}  value={medicine} 
                    autoComplete="off"
                    onChange={selectMedicineOption}
                     name="product" type="text"placeholder="Product Name" required/>

                        <div style={{'padding':0,'maxWidth':'350px', position:'absolute',zIndex:'1',background:'white',display:list.length?"block":"none"}} role="combobox" className="_list">
                            { list.map((e)=>{
                            return <div className="_list-item" key={e.id} onClick={()=>fillProductInfo(e)}>
                                <div key={e.id} >
                                        <span className="left">{e.name}</span>
                                        <span className="right">&#x20b9; {e.price}</span>
                                </div>
                            </div>
                            })}   
                        </div>
                </div>
                
                <div>
                    <label className="label">Quantity</label>
                    <input className="input is-small" ref={register}
                    //  onChange={()=>setQty(qty)} value={qty} 
                     type="text" name="qty"  placeholder="Quantity" required/>
                </div>
                <div>
                    <label className="label">Type of packing</label>
                    <input className="input is-small" ref={register}
                    //  onChange={()=>setTypeofpack(typeofpack)} value={typeofpack} 
                    type="text" name="typeofpack" placeholder="Type of Packing" required/>
                </div>
                
            </div>
            
            <div className="i_row" style={{display:'flex'}}>
                <div>
                    <label className="label">MRP</label>
                    <input className="input is-small" ref={register}
                    // onChange={()=>setMrp(mrp)} value={mrp} 
                    type="text" name="mrp" placeholder="MRP" required/>
                </div>
                <div>
                    <label className="label">Cost Price</label>
                    <input className="input is-small" ref={register}
                    //  onChange={()=>setQty(qty)} value={qty} 
                     type="text" name="cost"  placeholder="Cost Price" required/>
                </div>
                <div>
                    <label className="label">List Price</label>
                    <input className="input is-small" ref={register}
                    //  onChange={()=>setQty(qty)} value={qty} 
                     type="text" name="listprice"  placeholder="List Price" required/>
                </div>

            </div>


            <div className="i_row" style={{display:'flex'}}>
                <div>
                    <label className="label">Brand/Manufeacture</label>
                    <input className="input is-small"  ref={register}
                    // onChange={()=>setExt(exp)}  value={exp} 
                    type="text" name="mfg"  placeholder="Manfacturing" required/>
                </div>
                
                <div>
                    <label className="label">Expiry Date</label>
                    <input className="input is-small"  ref={register}
                    // onChange={()=>setExt(exp)}  value={exp} 
                    type="date" name="exp_date"  placeholder="Expiry Date" required/>
                </div>
                <div>
                    <label className="label">Expiry Time (in months)</label>
                    <input className="input is-small"  ref={register}
                    // onChange={()=>setExt(exp)}  value={exp} 
                    type="text" name="exp_time"  placeholder="Expiry Time" required/>
                </div>
                
            </div> 


            {/* <div className="i_row" style={{display:'flex'}}>
                <div>
                    <label className="label">Purchase From</label>
                    <input className="input is-small" ref={register}
                    type="text" name="purchase" placeholder="Purchase from" required/>
                </div>
                <div>
                    <label className="label">Type of packing</label>
                    <input className="input is-small" ref={register}
                    type="text" name="typeofpack" placeholder="Type of Packing" required/>
                </div>
            </div> */}

            <div className="i_row" style={{display:'flex'}}>
                <div>
                    <label className="label">Discount(%)</label>
                    <input className="input is-small" ref={register}
                    // onChange={()=>setMrp(mrp)} value={mrp} 
                    type="text" name="discount" placeholder="Discount" required/>
                </div>
                <div>
                    <label className="label">HSN</label>
                    <input className="input is-small" ref={register}
                    //  onChange={()=>setQty(qty)} value={qty} 
                     type="text" name="hsn"  placeholder="HSN" required/>
                </div>
                <div>
                    <label className="label">Batch</label>
                    <input className="input is-small" ref={register}
                    // onChange={()=>setMrp(mrp)} value={mrp} 
                    type="text" name="batch" placeholder="batch" required/>
                </div>
            </div>


            {/* <div className="i_row" style={{display:'flex'}}>

            </div> */}



            <div className="i_row">
                <div>
                    <button type="submit" 
                        className= {product.products.create_loading==true?"button is-primary is-small is-loading":"button is-primary is-small"} 
                        >
                        {isNew?"CREATE":"UPDATE"}
                    </button>
                </div>
            </div>

            </form>
        </div>
    </Layout>
    )
}

export default connect()(CreateProduct);