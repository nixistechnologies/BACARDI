import Layout from "../components/layout"
import { createProductQuery,productSuggetionQueryC,categorySuggestionQuery } from '../lib/graphql';
import { useState, useEffect } from 'react';
import {useForm} from 'react-hook-form'
import {useSelector,useDispatch} from 'react-redux'
import {getCategory} from '../redux_function/actions'
import {createUpdateCategory} from '../redux_function/actions/categoryActions'
import {FullPageLoading} from '../components/skeleton'
import Link from 'next/link'
// import  {useLazyQuery} from '@apollo/react-hooks'


const Category =()=>{
    const [category,setCategory] = useState([])
    const [temp,setTemp] = useState([])
    const [cat,setCat] = useState("")
    const [subcategory, setSubcategory] = useState([])
    const { register, handleSubmit, watch, errors,reset,setValue,getValues } = useForm();
    // const [getCategory, {loading,error,data}] = useLazyQuery(categorySuggestionQuery)
    const data = undefined;
    
    const dispatch = useDispatch()
    const categoryList = useSelector(state=>state.category)
    
    
    
    useEffect((e)=>{
        dispatch(getCategory())
    },[])

    useEffect(()=>{
        console.log("updated__")
        if(categoryList.update){
            alert("updat_ed")
        }
    },categoryList)
    // console.log(dd)

    const CategoryOption=(e)=>{
        // console.log(e)
        setCat(e.node.name)
        setSubcategory(e.node.subcategorySet.edges)
        setCategory([])
        setTemp(e.node.subcategorySet.edges)
        setValue([{"subcategory":""}])
    }
    const SubCategoryOption=(e)=>{
        setValue([{"subcategory":e.node.name},{"gst":e.node.GST},{"hsn":e.node.hsn}])
        setTemp([])
    }



    const selectCategory=(e)=>{
        const val = e.target.value
        if(val.length==0)
        {
            setTemp([])
            setValue([{"subcategory":""},{"gst":""},{"hsn":""}])
        }
        setCategory(categoryList.items.map(e=>e.node.name.toLocaleLowerCase().startsWith(val.toLocaleLowerCase())?e:undefined ))
        
        setCat(e.target.value)
        // console.log(temp)
    }

    const selectSubCategory = (e) =>{
        const val = e.target.value
        if(val.length==0){
            setValue([{"gst":""},{"hsn":""}])
        }
        setTemp(subcategory.map(e=>e.node.name.toLocaleLowerCase().startsWith(val.toLocaleLowerCase())?e:undefined))
        console.log(temp)
    }

    const  onSubmit = async(data) =>{
        dispatch(createUpdateCategory(data))
    }





    console.log(categoryList)
    return(
        <Layout>
            {
            categoryList.loading==true?
                <FullPageLoading />:
            (
            <div>
                <div className="topHeading">
                    <h2>Add/Update Category</h2>
                    <div>
                        <Link href="/category">
                        <a className="button is-rounded is-small is-bold is-primary" style={{fontWeight:"bold"}}>All categories</a>
                        </Link>
                    </div>
                    {/* <div style={{marginLeft:"10px"}}>
                        <Link href="/create">
                        <a className="button is-rounded is-small is-bold is-primary" style={{fontWeight:"bold"}}> product</a>
                        </Link>
                    </div> */}
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="columns">
                        <div className="column">
                            <label className="label">Category</label>
                            <input type="text" className="input is-small" value={cat}  onChange={(e)=>{selectCategory(e)}} placeholder="Category Name" name="category" ref={register}/>
                            {
                                category!=undefined?(
                                    <div style={{'padding':0,'maxWidth':'350px', position:'absolute',zIndex:'1',background:'white',display:category.length?"block":"none"}} role="combobox" className="_list">
                                        {
                                            category.map((e)=>{
                                                if(e!=undefined){
                                                    return (
                                                    <div className="_list-item" key={e.node.id} onClick={()=>CategoryOption(e)}>
                                                        <div key={e.node.id} >
                                                                <span className="left">{e.node.name}</span>
                                                                {/* <span className="right">&#x20b9; {e.price}</span> */}
                                                        </div>
                                                    </div>
                                                ) 
                                                }
                                                else{
                                                    return <div></div>
                                                }
                                                })
                                        }
                                    </div>
                                ):null
                            }
                            
                            
                        </div>
                        <div className="column">
                            <label className="label">Sub Category</label>
                            <input type="text" className="input is-small" name="subcategory" placeholder="Sub Category Name" ref={register} onChange={(e)=>selectSubCategory(e)}/>
                            <div style={{'padding':0,'maxWidth':'350px', position:'absolute',zIndex:'1',background:'white',display:temp.length?"block":"none"}} role="combobox" className="_list">
                                {
                                    temp.map((e)=>{
                                        if(e!=undefined){
                                            return (
                                            <div className="_list-item" key={e.node.id} onClick={()=>SubCategoryOption(e)}>
                                                <div key={e.node.id} >
                                                        <span className="left">{e.node.name}</span>
                                                        {/* <span className="right">&#x20b9; {e.price}</span> */}
                                                </div>
                                            </div>
                                        ) 
                                        }
                                        else{
                                            return <div></div>
                                        }
                                        })
                                }
                            </div>
                        </div>
                    </div>

                    <div className="columns">
                        <div className="column">
                            <label className="label">GST</label>
                            <input type="text" name="gst" placeholder="GST" className="input is-small" ref={register} />
                        </div>
                        <div className="column">
                            <label className="label">HSN Code</label>
                            <input type="text" name="hsn" placeholder="HSN Code" className="input is-small" ref={register} />
                        </div>
                        {/* <div className="column">
                            <label className="label">GST</label>
                            <input type="text" name="gst" className="input is-small" ref={register} />
                        </div> */}
                    </div>
                    <div className="columns">
                        <div className="column">
                            <button className="button is-small is-primary">Create</button>
                        </div>
                    </div>
                </form>
            </div>)
            }
        </Layout>
    )
}

export default Category;