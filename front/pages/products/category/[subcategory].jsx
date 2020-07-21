import { useRouter } from 'next/router'
import Layout from '../../../components/layout'
import  {FontAwesomeIcon}  from '@fortawesome/react-fontawesome'
import {faPen, faPlus} from '@fortawesome/free-solid-svg-icons'
import { faTrashAlt,faEdit } from '@fortawesome/free-regular-svg-icons'
import {subCategoryById,createSubCategoryQuery,allCategory,deleteSubCategoryQuery} from '../../../lib/graphql'
import {useQuery,useMutation} from '@apollo/react-hooks'
import {TableLoading} from '../../../components/skeleton'
// import Link from 'next/Link'
// import {} from '@apollo/react-hooks'
import {useForm} from 'react-hook-form'
import { useState } from 'react'
import { useEffect } from 'react'

const Model=({active,info=null,setActive,setInfo=undefined,isUpdate,categoryId})=>{
    // console.log(isUpdate)
    // console.log(categoryId)
    // if(isUpdate===false)
    // {
    //     setActive({})
    // }
    const { register, handleSubmit,setValue,getValues,errors } = useForm();
    const [updateSubCategory,{data:mdata,loading}] = useMutation(createSubCategoryQuery)
    useEffect(()=>{
        if(isUpdate=false){
            setInfo({})
        }
    },[])

    const onSubmit=(d)=>{
        // console.log(data)
        // console.log(isUpdate)
        updateSubCategory({
            variables:{id:info.id?info.id:"",name:d.name,hsn:d.hsn,gst:d.gst,category:categoryId!=null?categoryId:"",isUpdate:isUpdate==true?true:false},
            optimisticResponse:true,
            update:(cache,{data})=>{
                if(data!=true){
                    // console.log(data)
                    const subCategoryCache = cache.readQuery({query:subCategoryById,variables:{"id":categoryId}})
                    
                    console.log(subCategoryCache)
                    // console.log(info.id)
                    if(isUpdate==false){
                        subCategoryCache.subcategoy.edges.push({"node":data.updateSubcategory.subCategory,"__typename":"SubCategoryNodeEdge"})
                        cache.writeQuery({
                            query:subCategoryById,
                            variables:{"id":categoryId},
                            data:subCategoryCache
                        })
                    }
                    
                    else{
                        for(var i=0;i<subCategoryCache.subcategoy.edges.length;i++)
                        {
                            if(subCategoryCache.subcategoy.edges[i].node.id === info.id)
                            {
                                subCategoryCache.subcategoy.edges[i].node.name = data.updateSubcategory.subCategory.name
                                subCategoryCache.subcategoy.edges[i].node.product = data.updateSubcategory.subCategory.product
                                subCategoryCache.subcategoy.edges[i].node.hsn = data.updateSubcategory.subCategory.hsn
                                subCategoryCache.subcategoy.edges[i].node.GST = data.updateSubcategory.subCategory.GST
                            }
                        }
                        
                    }
                    
                    
                    // const categoryCache = cache.readQuery({query:allCategory})
                    // // categoryCache.categories.edges.filter
                    // for(var i=0;i<categoryCache.categories.edges.length;i++)
                    // {
                    //     if(categoryCache.categories.edges[i].node.id === categoryId)
                    //     {
                    //         categoryCache.categories.edges[i].node.subCategory+=1
                    //     }
                    // }

                    // console.log(existingCache)
                    // setInfo({})
                    setActive("")
                    
                    // setValue([{"name":""},{"hsn":""},{"gst":""}])
                }
            }
        })

    }
    return (<div className={`modal ${active}`} >
    <div className="modal-background" onClick={()=>setActive("")}></div>
        <div className="modal-content">
            <div className="box">
                <h1 className="model-title" style={{fontWeight:"bold"}}>{info.name?"Update subcategory":"Create subcategory"}</h1>
                <form 
                onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="columns">
                        <div className="column">
                            <label className="label">Name</label>
                            <input type="text" placeholder="Name" 
                            value={info!=null?info.name:""}
                            onChange={(e)=>setInfo({...info,name:e.target.value})}
                            // onChange={(e)=>setInfo(...{"name":e.target.value})}

                            // value={info.name} onChange={(e)=>setInfo({"name":e.target.value})} 
                            ref={register}
                            name="name"
                            className="input is-small" />
                        </div>
                        <div className="column">
                            <label className="label">HSN</label>
                            <input type="text" placeholder="HSN" 
                            value={info!=null?info.hsn:""}
                            onChange={(e)=>setInfo({...info,hsn:e.target.value})}
                            // value={info.hsn} onChange={(e)=>setInfo({"hsn":e.target.value})} 
                            ref={register}
                            name="hsn"
                            className="input is-small" />
                        </div>
                        <div className="column">
                            <label className="label">GST</label>
                            <input type="text" placeholder="GST" 
                            ref={register}
                            name="gst"
                            value={info!=null?info.gst:""}
                            onChange={(e)=>setInfo({...info,gst:e.target.value})}
                            // value={info.gst} onChange={(e)=>setInfo({"hsn":e.target.value})} 
                            className="input is-small" />
                        </div>
                        {/* <div className="column is-2">
                            <button type="submit" className={`button is-primary is-small ${loading==true?"is-loading":"not"}`}>Update</button>
                        </div> */}
                    </div>
                    <div className="columns">
                        <div className="column">
                            <button type="submit" className={`button is-primary is-small ${loading==true?"is-loading":""}`}>Update</button>
                        </div>
                    </div>
                </form>
            </div>
            {/* <!-- Any other Bulma elements you want --> */}
        </div>
    <button className="modal-close is-large" onClick={()=>setActive("")} aria-label="close"></button>
</div>)
}



const Records=({rdata,id})=>{
    const [active,setActive] = useState("")
    const [info,setInfo] = useState({})
    const [delactive,setdelActive] = useState("")
    // const { register, handleSubmit,setValue,getValues,errors } = useForm();
    
    const [deleteCategory,{data,loading}] = useMutation(deleteSubCategoryQuery)
    // const loading=true;

    const sendToServer=()=>{

        console.log("deleted")
        // setdelActive("")
        deleteCategory(
            {variables:{id:info.id},
            optimisticResponse:true,
            update:(cache,{data})=>{
                if(data!=loading)
                {
                    const subCategoryCache = cache.readQuery({query:subCategoryById,variables:{"id":id}})
                    console.log(subCategoryCache)
                    const nCache = subCategoryCache.subcategoy.edges.filter((e)=>e.node.id!=info.id)
                    // console.log(nCache)
                    const c ={"subcategoy":{"edges":nCache,"__typename":"SubCategoryNodeConnection"}}
                    console.log(c)
                    cache.writeQuery({
                        query:subCategoryById,
                        variables:{"id":id},
                        data:c
                    })
                    setdelActive("")
                }
            }
        
        })

    }



    return(<div>
        <table className="table is-fullwidth is-hoverable">
            <thead>
                <tr>
                    <th className="w30" > Name</th>
                    <th className="w10">Product</th>
                    <th className="w10">HSN Code</th>
                    <th className="w10">GST</th>
                    <th className="w5"></th>
                    <th className="w5"></th>
                    {/* <th className="w5"></th> */}
                </tr>
                </thead>
                <tbody>
                {rdata.map((e)=>{
                    return(<tr key={e.node.id}>
                        <td className="_heading w30">
                            {/* <Link href="category/[subcategory]" as={`category/${e.node.id}`}> */}
                                {/* <a> */}
                                    {e.node.name}
                                {/* </a> */}
                            {/* </Link> */}
                        </td>
                        <td>
                            {e.node.product}
                        </td>                        
                        <td>
                            {e.node.hsn}
                        </td>
                        <td>
                            {e.node.GST}
                        </td>
                        
                        <td className="hover" 
                        onClick={()=>{
                            setActive("is-active"),
                            setInfo({"name":e.node.name,"hsn":e.node.hsn,"gst":e.node.GST,"id":e.node.id})}
                            // setValue([{"name":e.node.name},{"hsn":e.node.hsn},{"gst":e.node.GST}])
                        // }
                        }
                        >
                            <FontAwesomeIcon icon={faPen} color="#00d1b2" />
                        </td>
                        <td 
                        onClick={()=>{
                            setInfo({"name":e.node.name,"hsn":e.node.hsn,"gst":e.node.GST,"id":e.node.id})
                            setdelActive("is-active")
                        }}
                        // onClick={()=>{setdelActive("is-active"),setName(e.node.name),setId(e.node.id)}}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} color="red"/>
                        </td>
                        {/* <td className="hover">
                            <button className="button is-small is-rounded is-primary is-light"><FontAwesomeIcon icon={faPlus} /> <span style={{marginLeft:"3px"}}>Add</span></button>
                        </td> */}

                    </tr>)
                })}
                </tbody>
        </table>
        <Model active={active} info={info} setActive={setActive} setInfo={setInfo} isUpdate={true} categoryId={id}/>
        <div className={`modal ${delactive}`} >
            <div className="modal-background" onClick={()=>setdelActive("")}></div>
                <div className="modal-content">
                    <div className="box" style={{width:"400px",margin:"auto"}}>
                        <h1 className="model-title">Do you want to delete <b style={{textTransform:'uppercase'}}>{info.name}</b> ?</h1>
                        <div className="columns">
                            <div className="column" onClick={()=>sendToServer()}>
                                <button className={`button is-danger is-small ${loading==true?"is-loading":"not"}`} style={{width:"100%"}}>Delete</button>
                            </div>
                            <div className="column">
                                <button className="button is-primary is-small" style={{width:"100%"}} onClick={()=>setdelActive("")}>Cancel</button>
                            </div>

                        </div>
                        {/* <form onSubmit={(e)=>sendToServer(e,false)}>
                            <div className="columns">
                                <div className="column">
                                    <input type="text" value={name} onChange={(e)=>setName(e.target.value)} className="input is-primary is-small" />
                                </div>
                                <div className="column is-2">
                                    <button type="submit" className={`button is-primary is-small ${loading==true?"is-loading":"not"}`}>Update</button>
                                </div>
                            </div>
                        </form> */}
                    </div>
                    {/* <!-- Any other Bulma elements you want --> */}
                </div>
            
            <button className="modal-close is-large" onClick={()=>setdelActive("")} aria-label="close"></button>
        </div>
    </div>)
}







const SubCategory=()=>{
    const router = useRouter()
    const {query} = router
    const subCategoryId = query.subcategory
    const {data,loading} = useQuery(subCategoryById,{variables:{"id":subCategoryId}})
    const [info,setInfo] = useState({})
    // console.log(query.subcategory)
    const [active,setActive] = useState("")

    // console.log(router)
    // console.log(data)
    return(
        <Layout title="Sub Category">
            <>
            <div className="topHeading">
                <div style={{width:"100%"}}>
                    <h2>{query.name}</h2>
                </div>
                <div>
                    <input type="button" className="button is-rounded is-small is-bold is-primary" value="Add new" onClick={()=>setActive("is-active")}/>
                    
                    {/* <Link href="/category"> */}
                        {/* <a className="button is-rounded is-small is-bold is-primary" style={{fontWeight:"bold"}}>Add subcategory</a> */}
                    {/* </Link> */}
                </div>
                <Model active={active} setActive={setActive} info={info} setInfo={setInfo} isUpdate={false} categoryId={subCategoryId}/>
            </div>
            {
                loading==true
                ?<TableLoading/>
                :<Records rdata={data.subcategoy.edges} id={subCategoryId}/>
            }
            </>
        </Layout>
    )

}

export default SubCategory;