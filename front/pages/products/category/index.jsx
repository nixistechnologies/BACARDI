import Layout from '../../../components/layout'
import {useQuery, useMutation} from '@apollo/react-hooks'
import {FullPageLoading} from '../../../components/skeleton'
import {allCategory} from '../../../lib/graphql'
import  {FontAwesomeIcon}  from '@fortawesome/react-fontawesome'
import {faPen, faPlus} from '@fortawesome/free-solid-svg-icons'
// import {} from '@fortawesome/fontawesome-free'
import { faTrashAlt,faEdit } from '@fortawesome/free-regular-svg-icons'
import Link from 'next/link'
import {useState} from 'react'
import { useDispatch,useSelector}from 'react-redux'
// import { useEffect } from 'react'
import SnackbarProvider,{ useSnackbar } from 'react-simple-snackbar'
import {renameCategory} from '../../../lib/graphql'


const Records = ({rdata}) => {
    // console.log(data)
    // const active = ""
    const [active, setActive] = useState(null);
    const [delactive, setdelActive] = useState(null);
    const [name,setName]=useState("")
    const [id,setId] = useState("")
    const [openSnackbar, closeSnackbar] = useSnackbar({position:"top-center",style:{zIndex:"999", marginTop:"50px",color: 'black',backgroundColor:"white"}})
    const [updateCategory,{data:mdata,loading}] = useMutation(renameCategory)
    // const []
    // useEffect(()=>{
    //     console.log("record.....")
    //     const [active,setActive] = useState("")
    // },[])

    // console.log(data)

    const sendToServer=(isUpdate,e=null)=>{
        if(e!=null){
            e.preventDefault();
        }
        

        console.log(name)
        console.log(id)
        updateCategory({
            variables:{id:id,name:name,isUpdate:isUpdate},
            optimisticResponse:true,
            update:(cache,{data})=>{
                if(data!=true){
                    const existingCache = cache.readQuery({query:allCategory})
                    console.log(existingCache)
                    // console.log(data)
                    // console.log(data.renameCategory.category)
                    if(isUpdate==true){
                        // const cc = {"node":data.renameCategory.category}
                        // const newCache = existingCache.categories.edges.map(e=>(e.node.id==id?cc:e))
                        setActive("")
                    }
                    else{
                        // console.log(data)
                        
                        // console.log(existingCache)
                        const newCache = existingCache.categories.edges.filter(t=>(t.node.id!=id))
                        const c ={"categories":{"edges":newCache,"__typename":"CategoryNodeConnection"}}
                        console.log(c)
                        cache.writeQuery({
                            query:allCategory,
                            data:c
                        })
                        setdelActive("")
                    }

                    
                }
                // const newCache = existingCache.categories.edges.filter(t=>(t.node.id!=id)) ///for remove
            }
            
        })
        // setActive("")
    }
    
    return(
        <div>
            <style jsx>{`
                .title{
                    margin-bottom:5px;
                    font-size:1rem;
                }
            `}  
            </style>


            <table className="table is-fullwidth is-hoverable">
                <thead>
                    <tr>
                        <th className="w30" > Name</th>
                        <th className="w10">Sub Category</th>
                        <th className="w10">Products</th>
                        <th className="w5"></th>
                        <th className="w5"></th>
                        <th className="w5"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {rdata.map((e)=>{
                        return(<tr key={e.node.id}>
                            <td className="_heading w30">
                                <Link href={`category/[subcategory]?name=${e.node.name}`} as={`category/${e.node.id}?name=${e.node.name}`}>
                                    <a>
                                        {e.node.name}
                                    </a>
                                </Link>
                            </td>
                            <td>
                                {e.node.subCategory}
                            </td>
                            <td>
                                {e.node.product}
                            </td>
                            
                            <td className="hover" onClick={()=>{setActive("is-active"),setName(e.node.name),setId(e.node.id)}}>
                                <FontAwesomeIcon icon={faPen} color="#00d1b2" />
                            </td>
                            <td onClick={()=>{setdelActive("is-active"),setName(e.node.name),setId(e.node.id)}}>
                                <FontAwesomeIcon icon={faTrashAlt} color="red"/>
                            </td>
                            <td className="hover">
                                
                                
                                <button className="button is-small is-rounded is-primary is-light"><FontAwesomeIcon icon={faPlus} /> <span style={{marginLeft:"3px"}}>Add</span></button>
                            
                            </td>

                        </tr>)
                    })}
                    </tbody>
            </table>

            <div className={`modal ${delactive}`} >
                <div className="modal-background" onClick={()=>setdelActive("")}></div>
                    <div className="modal-content">
                        <div className="box" style={{width:"400px",margin:"auto"}}>
                            <h1 className="title">Do you want to delete <b style={{textTransform:'uppercase'}}>{name}</b> ?</h1>
                            <div className="columns">
                                <div className="column" onClick={()=>sendToServer(false)}>
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
                
                <button className="modal-close is-large" aria-label="close"></button>
            </div>



            <div className={`modal ${active}`} >
                <div className="modal-background" onClick={()=>setActive("")}></div>
                    <div className="modal-content">
                        <div className="box">
                            <h1 className="title">Update Category Name</h1>
                            <form onSubmit={(e)=>sendToServer(true,e)}>
                                <div className="columns">
                                    <div className="column">
                                        <input type="text" value={name} onChange={(e)=>setName(e.target.value)} className="input is-primary is-small" />
                                    </div>
                                    <div className="column is-2">
                                        <button type="submit" className={`button is-primary is-small ${loading==true?"is-loading":"not"}`}>Update</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        {/* <!-- Any other Bulma elements you want --> */}
                    </div>
                
                <button className="modal-close is-large" aria-label="close"></button>
            </div>
        </div>
    )
}




const Category=()=>{
    const {data,loading,error} = useQuery(allCategory)
    // const dispatch = useDispatch();
    // useEffect(()=>{
    //     dispatch(addProduct("X"))
    // },[])
    // useSelector(state=state.category)
    return(
        <SnackbarProvider>
        <Layout title="Category">
            <>
            <div className="topHeading">
                <div style={{width:"100%"}}>
                    <h2>Categories</h2>
                </div>
                <div>
                    <Link href="/category">
                        <a className="button is-rounded is-small is-bold is-primary" style={{fontWeight:"bold"}}>Add category</a>
                    </Link>
                </div>            
            </div>
            {
                loading==true
                ?<FullPageLoading/>
                :<Records rdata={data.categories.edges} />
            }
            </>

    </Layout>
    </SnackbarProvider>
    )

}

export default Category;
// const newCache = existingCache.categories.edges
