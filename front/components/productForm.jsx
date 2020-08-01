import Layout from './layout'
import { useMutation, useQuery, useLazyQuery } from '@apollo/react-hooks';
import { createProductQuery,allCategory,subCategoryById,getAllProductQuery,getProductByIdQuery,vendorSuggestionQuery } from '../lib/graphql';
import { useState, useEffect } from 'react';
import {useForm} from 'react-hook-form'
import { TableLoading } from './skeleton';
import { useSnackbar } from 'react-simple-snackbar'
// import VendorModel from '../components/vendorModel'


function X({productId=null,name=null,purchase=null,setActive=null }){
    const [openSnackbar, closeSnackbar] = useSnackbar({position:"top-center",style:{zIndex:"999", marginTop:"50px"}})
    const {data:single,loading:sLoading} = useQuery(getProductByIdQuery,{variables:{id:productId}})
    const {data,loading:mainLoading} = useQuery(allCategory)
    const [getSub,{data:subData,loading:subLoading}] = useLazyQuery(subCategoryById)
    const [createNewProduct,{data:newData,loading:createLoading}] = useMutation(createProductQuery)
    const [notify,setNotify] = useState(false)
    const { register, handleSubmit, watch, errors,reset,setValue,getValues } = useForm();
    

    // const [active,setActive] = useState("")
    
    
    const clearData=() =>{
        setValue([
            {"gst":""},{"mrp":""},{"medicine":""},{"qty":""},{"purchase":""},{"typeofpack":""},{"exp_date":"dd/mm/yyyy"},
            {"mfg":"","discount":"","hsn":"","batch":""},{"category":""},{"subCategory":""},{"product":""},{"cost":""},{"listprice":""},
            {"exp_time":""},{"discount":""},{"hsn":""},{"batch":""}
        ])
        return false
    }
    
    
    const  onSubmit = async(data) =>{
        createNewProduct(
            {
                variables:{
                "isNew":productId===null?true:false,
                "id":productId===null?"":productId,
                "categoryId":data.category,
                "subCategoryId":data.subCategory,
                "name": data.product,
                "qty": data.qty,
                "typeofpack": data.typeofpack,

                "mrp": data.mrp,
                "list":data.listprice,
                "cost":data.cost,

                "mfg":data.mfg,
                "exp":data.exp_date,
                "exp_time":data.exp_time,

                "discount":data.discount,
                "hsn":data.hsn,
                "batch":data.batch,                 
            },
            optimisticResponse:true,
            update:(cache,{data})=>{
                if(data!=true){
                    console.log(data)
                    try{
                        const existCache = cache.readQuery({query:getAllProductQuery})
                        console.log(existCache)
                        
                        if(productId===null){
                            existCache.allProducts.edges.push({"node":data.createProduct.product,"__typename":"ProductNodeEdge"})
                        }
                        else{
                            for(var i=0;i<existCache.allProducts.edges.length;i++)
                            {
                                if(existCache.allProducts.edges[i].node.id == productId)
                                {
                                    console.log("matches")
                                    existCache.allProducts.edges[i].node.name = data.createProduct.product.name
                                    existCache.allProducts.edges[i].node.mfg = data.createProduct.product.mfg
                                    existCache.allProducts.edges[i].node.price = data.createProduct.product.price
                                    existCache.allProducts.edges[i].node.qty = data.createProduct.product.qty
                                    existCache.allProducts.edges[i].node.typeOfPacking = data.createProduct.product.typeOfPacking
                                }
                            }
                        }
                        cache.writeQuery({
                            query:getAllProductQuery,
                            data:existCache
                        })
                        
                    }catch(e){
                        console.log("no need to update")
                    }

                    if(productId===null)
                    {
                        openSnackbar("Product has been created successfully")
                    }
                    else{
                        openSnackbar("Product has been updated successfully")
                    }
                         
                    if(productId===null){
                        clearData()
                    }
                    setActive("")
                    
                }
            }
        
        })
    }

    const select_Sub_Category = (e) =>{
        // console.log(e)
        getSub({variables:{"id":e.target.value}})

    }
    useEffect(()=>{
        if(single!=undefined)
        {
            // console.log("getsubcategory")
            // const p = single.productById
            // setValue([
            //     {"gst":p.GST},{"mrp":p.mrp},{"product":p.name},{"qty":p.qty},{"typeofpack":p.typeOfPacking},{"exp_date":p.expiryDate},
            //     {"mfg":p.mfg},{"cost":p.cost},{"listprice":p.price},
            //     {"exp_time":p.expiryTime},{"discount":p.discount},
            // ])
            getSub({variables:{"id":single.productById.subcategory.category.id}})
            
            
            
        }
    },[single,productId])
    // single.productById.subcategory.category.id

    // console.log(subData)
    // console.log(name)
    // console.log(single)
    // console.log(purchase)

    // console.log(setActive)
    return(
        <>
            
            
            <style jsx>{`
                .is-small{
                    font-size:0.85rem;
                }
                .dd-list
            `}
            </style>
            {/* <VendorModel isNew={true} active={active} setActive={setActive} /> */}
            <div style={{display:notify?'block':'none'}}  onClick={()=>setNotify(false)}>
                <div className="notification is-primary">
                <button className="delete"  onClick={()=>setNotify(false)}></button>
                 product has been uploaded
                </div>
            </div>
        <div style={{maxWidth:"1000px",}} className="createform">
            
            {purchase===null?
            <div className="topHeading">
                <h2>{
                name==null?"Create New":
                    name
                
                }</h2>
                {/* {
                    purchase!=null?
                    <button type="buttom" className="button is-primary is-small is-rounded" onClick={()=>setActive("is-active")}> Add Vendor</button>
                    :""
                } */}
                <div>
                    
                </div>
            </div>:""}


            {mainLoading==true || sLoading==true?
                <TableLoading />:
            <>
            <form 
                onSubmit={handleSubmit(onSubmit)}
            >
            <div>
            
            {/* <h2 style={{fontSize:"20px",marginBottom:"15px",fontWeight:'300'}}> Product Detail</h2> */}
            
            <div className="i_row" style={{display:"flex"}}>

                <div>
                    <label className="label">Category Name</label>
                    
                    {/* <input type="text" className="input is-small" placeholder="Category Name" name="category"
                    onChange={getCategoryName} autoComplete="off" ref={register}/> */}
                    <article className="select is-small" style={{width:"100%"}}>
                        <select className="_input is-small" style={{width:"100%"}} ref={register} name="category" onChange={(e)=>select_Sub_Category(e)}>
                            <option>-----</option>
                            {   
                                data.categories.edges.map(e=>{
                                return productId!=null?
                                <option selected={e.node.id==single.productById.subcategory.category.id?true:false} key={e.node.id} disabled={e.node.subCategory>0?false:true} value={e.node.id}>{e.node.name}  {e.node.subCategory}</option>
                                :<option key={e.node.id} disabled={e.node.subCategory>0?false:true} value={e.node.id}>{e.node.name}  {e.node.subCategory}</option>
                            })
                            
                            }


                        </select>
                    </article>                    
                    <input type="hidden" name="categoryId" ref={register}/>

                </div>
                <div>
                    <label className="label">Sub Category</label>
                    <article className={`select is-small ${subLoading===true?"is-loading":""}`} style={{width:"100%"}}>
                        <select className="_input is-small" style={{width:"100%"}} ref={register} name="subCategory">
                        <option>-----</option>
                            {
                                subData!=undefined?
                                (
                                    subData.subcategoy.edges.map(e=>
                                        {   return productId!=null?
                                            <option key={e.node.id} selected={e.node.id==single.productById.subcategory.id?true:false} value={e.node.id}>{e.node.name}</option>
                                            :<option key={e.node.id} value={e.node.id}>{e.node.name}</option>
                                        }
                                    )
                                ):null
                            
                            }
                        </select>
                    </article>
                    {/* <input type="text" className="input is-small" placeholder="Sub Category Name" name="subCategory" ref={register}
                    onChange={selectSubCategory}
                    /> */}
                    
                </div>
                

            </div>
            <div className="i_row" style={{display:"flex"}}>
                <div>
                    <label className="label">Product Name</label>
                    <input className="input is-small" ref={register}
                    // onChange={()=>setMedicine(medicine)}  value={medicine} 
                    autoComplete="off"
                    defaultValue={productId!=null?single.productById.name:""}
                    // onChange={selectMedicineOption}
                     name="product" type="text"placeholder="Product Name" required/>

                        {/* <div style={{'padding':0,'maxWidth':'350px', position:'absolute',zIndex:'1',background:'white',display:list.length?"block":"none"}} role="combobox" className="_list">
                            { list.map((e)=>{
                            return <div className="_list-item" key={e.id} onClick={()=>fillProductInfo(e)}>
                                <div key={e.id} >
                                        <span className="left">{e.name}</span>
                                        <span className="right">&#x20b9; {e.price}</span>
                                </div>
                            </div>
                            })}   
                        </div> */}
                </div>
                
                <div>
                    <label className="label">Quantity</label>
                    <input className="input is-small" ref={register}
                    //  onChange={()=>setQty(qty)} value={qty} 
                    defaultValue={productId!=null?single.productById.qty:""}
                     type="text" name="qty"  placeholder="Quantity" required/>
                </div>
                <div>
                    <label className="label">Type of packing</label>
                    <input className="input is-small" ref={register}
                    defaultValue={productId!=null?single.productById.typeOfPacking:""}
                    //  onChange={()=>setTypeofpack(typeofpack)} value={typeofpack} 
                    type="text" name="typeofpack" placeholder="Type of Packing" required/>
                </div>
                
            </div>
            
            <div className="i_row" style={{display:'flex'}}>
                <div>
                    <label className="label">MRP</label>
                    <input className="input is-small" ref={register}
                    // onChange={()=>setMrp(mrp)} value={mrp} 
                    defaultValue={productId!=null?single.productById.mrp:""}
                    type="text" name="mrp" placeholder="MRP" required/>
                </div>
                <div>
                    <label className="label">Cost Price</label>
                    <input className="input is-small" ref={register}
                    //  onChange={()=>setQty(qty)} value={qty} 
                    defaultValue={productId!=null?single.productById.cost:""}
                     type="text" name="cost"  placeholder="Cost Price" required/>
                </div>
                <div>
                    <label className="label">List Price</label>
                    <input className="input is-small" ref={register}
                    //  onChange={()=>setQty(qty)} value={qty} 
                    defaultValue={productId!=null?single.productById.price:""}
                     type="text" name="listprice"  placeholder="List Price" required/>
                </div>

            </div>


            <div className="i_row" style={{display:'flex'}}>
                <div>
                    <label className="label">Brand/Manufeacture</label>
                    <input className="input is-small"  ref={register}
                    // onChange={()=>setExt(exp)}  value={exp} 
                    defaultValue={productId!=null?single.productById.mfg:""}
                    type="text" name="mfg"  placeholder="Manfacturing" required/>
                </div>
                
                <div>
                    <label className="label">Expiry Date</label>
                    <input className="input is-small"  ref={register}
                    // onChange={()=>setExt(exp)}  value={exp} 
                    defaultValue={productId!=null?single.productById.expiryDate:""}
                    type="date" name="exp_date"  placeholder="Expiry Date" required/>
                </div>
                <div>
                    <label className="label">Expiry Time (in months)</label>
                    <input className="input is-small"  ref={register}
                    // onChange={()=>setExt(exp)}  value={exp} 
                    defaultValue={productId!=null?single.productById.expiryTime:""}
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
                    defaultValue={productId!=null?single.productById.discount:""}
                    type="text" name="discount" placeholder="Discount" required/>
                </div>
                <div>
                    <label className="label">HSN</label>
                    <input className="input is-small" ref={register}
                    //  onChange={()=>setQty(qty)} value={qty} 
                    // defaultValue={productId!=null?single.productById.expiryDate:""}
                     type="text" name="hsn"  placeholder="HSN"/>
                </div>
                <div>
                    <label className="label">Batch</label>
                    <input className="input is-small" ref={register}
                    // onChange={()=>setMrp(mrp)} value={mrp} 
                    type="text" name="batch" placeholder="batch"/>
                </div>
            </div>


            {/* <div className="i_row" style={{display:'flex'}}>

            </div> */}



            <div className="i_row">
                <div>
                    <button type="submit" 
                        className={`button is-primary is-small ${createLoading==true?"is-loading":""}`}
                        // className= {createLoading==true?"button is-primary is-small is-loading":"button is-primary is-small"} 
                        >
                            {productId==null?"Create":"Update"}
                            {/* Create */}
                        {/* {isNew?"CREATE":"UPDATE"} */}
                    </button>
                </div>
            </div>
            </div>
            
            </form>
            </>
            }
        </div> 
    </>
    )
}

const CreateProduct = ({name=null,productId=null,purchase=null, setActive=null})=>{
    return(
        // <SnackbarProvider>
            // <Layout title={productId===null?"Create new Product":`Update ${name}`}>
                <X name={name} productId={productId} purchase={purchase} setActive={setActive}/>
            // </Layout>
        // </SnackbarProvider>
    )
}



export default CreateProduct;