import Link from 'next/link'
import Head from 'next/head'
import { withApollo } from "next-apollo";
import gql from 'graphql-tag';
import { useQuery, useMutation,useLazyQuery } from '@apollo/react-hooks'
import {getAllProductQuery,deleteProductQuery} from '../lib/graphql'
import { useStore,useDispatch, useSelector } from 'react-redux'
import { useEffect,useState } from 'react';
import {addProduct} from '../redux_function/actions'
import {FullPageLoading} from './skeleton'
import  {FontAwesomeIcon}  from '@fortawesome/react-fontawesome'
import {faPen, faPlus} from '@fortawesome/free-solid-svg-icons'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
// import flus from 'font'
// import  from '@fortawesome/fontawesome-free'
import { connect } from "react-redux";

const GET_PRODUCT = gql`
query x{
  allProducts{
    edges{
      node{
        id
        name
        listPrice
        mrp
      }
    }
  }
}
`;


const TableView=({data,mloading})=>{
  // {products.loading}
  // console.log(products.items)
  const [delactive, setdelActive] = useState("")
  const [info,setInfo] = useState({}) 
  const [deleteProduct,{data:mdata,loading}] = useMutation(deleteProductQuery)


  if(mloading)
  return (
    <div>
      <FullPageLoading />
    </div>
  )

  const sendToServer=(id)=>{
    deleteProduct({variables:{id:id},
    optimisticResponse:true,
    update:(cache,{data})=>{
      const existCache = cache.readQuery({query:getAllProductQuery,variables:{"search":""}})
      // existCache.allProducts.edges.push({"node":data.createProduct.product,"__typename":"ProductNodeEdge"})
      // existingCache.categories.edges.push({"node":data.createCategory.category,"__typename":"CategoryNodeEdge"})
      console.log(existCache)
      const nCache = existCache.allProducts.edges.filter((e)=>e.node.id!=id)
      // console.log(nCache)
      const c ={"allProducts":{"edges":nCache,"__typename":"ProductNodeEdge"}}
      console.log(c)
      cache.writeQuery({
        query:getAllProductQuery,
        variables:{"search":""},
        data:c
      })
      setdelActive("")
    }
  })
}


    
  
  if(data.allProducts.edges.length==0)
  return (<div style={{marginTop:"200px",textAlign:"center",fontSize:"20px",fontWeight:"bold"}}>
            <div>No Product Avaiable please add </div>
          </div>
        )
    return (
    <div>
      <style jsx>{`

      // ._heading{
      //   font-weight:500;
      //   color:black;
      //   text-transform: uppercase;
      // }
      .cont{
        color:grey;
      }
      `}

      </style>
    <div className="topHeading" style={{display:"flex",alignItems:"center"}}>
      <div style={{width:"100%"}}>
        <h2>Products</h2>
      </div>
      
      {/* <h3>Add</h3> */}
      {/* <FontAwesomeIcon icon={faPlusCircle} size="2x"/> */}
      {/* <div>
        <Link href="/category">
          <a className="button is-rounded is-small is-bold is-primary" style={{fontWeight:"bold"}}>Add category</a>
        </Link>
      </div> */}
      <div style={{marginLeft:"10px"}}>
        <Link href="products/create">
          <a className="button is-rounded is-small is-bold is-primary" style={{fontWeight:"bold"}}>Add product</a>
        </Link>
      </div>
      
    </div>
    <div style={{overflow:"auto"}}>
     <table className="table is-fullwidth is-hoverable is-bordered">
       <thead>
       <tr>
         <th>SN.</th>
         <th className="w30">Name</th>
         <th className="w10">Taga</th>
         <th className="w10">List</th>
         <th className="w10">Cost</th>
         <th className="w10">Gross(mtr)</th>
         <th className="w10">Less</th>
         <th className="w10">Net(mtr)</th>         
         <th className="w5"></th>
         <th className="w5"></th>
         </tr>
       </thead>
        <tbody>
          {data.allProducts.edges.map((prd,i)=>{
            return (
            // <tr>
            //   <td>{prd.node.name}</td>
            //   <td>{prd.node.name}</td>
            //   <td>{prd.node.name}</td>
              
              
            //   </tr>
          // <Link href="/detail/[product]" as={`/detail/${prd.node.id}`} key={prd.node.id}> 


            <tr key={prd.node.id} className="data-item" style={{cursor:'pointer'}}>
                  <td>{i+1}</td>
                  <td>
                    <div className="_heading">
                      {prd.node.name}
                      {/* <span className="sub">
                      {prd.node.mfg}
                      </span> */}
                    </div>
                    
                  </td>
                  <td className="_cont">
                    {prd.node.taga}
                  </td>
                  {/* <td className="_cont">
                    {prd.node.price}
                  </td> */}
                  {/* <td className="_cont">
                    {prd.node.cost}
                  </td> */}
                  <td className="_cont">
                    &#8377; {prd.node.price}<br/>
                    {/* <span style={{fontSize:"0.8em",color:'grey' }}>&#8377; {prd.node.mrp}</span> */}
                  </td>
                  <td className="_cont">
                    &#8377; {prd.node.cost}
                  </td>
                  <td className="_cont">
                    {prd.node.grossm}
                  </td>
                  <td className="_cont">
                    {prd.node.less}
                  </td>
                  <td className="_cont">
                    {prd.node.netm}
                  </td>


                  <td className="_cont">
                    <Link href={`products/[product]?name=${prd.node.name}`} as={`products/${prd.node.id}?name=${prd.node.name}`}>
                      <a>
                        <FontAwesomeIcon icon={faPen} color="#00d1b2" />
                      </a>
                    </Link>
                  </td>
                  <td onClick={()=>(setInfo({"name":prd.node.name,"id":prd.node.id}),setdelActive("is-active"))}>
                    <FontAwesomeIcon icon={faTrashAlt} color="red"/>
                  </td>
                  {/* <p className="title is-4">{e.node.name}</p>
                  <p className="subtitle is-4">{e.node.id}</p> */}
                
                {/* </Link>   */}
            </tr>
            // </Link>
            )
          })}
          </tbody>
        </table>

        <div className={`modal ${delactive}`} >
          <div className="modal-background" onClick={()=>setdelActive("")}></div>
              <div className="modal-content">
                  <div className="box" style={{width:"400px",margin:"auto"}}>
                      <h1 className="model-title title">Do you want to delete <b style={{textTransform:'uppercase'}}>{info.name}</b> ?</h1>
                      <div className="columns">
                          <div className="column" onClick={()=>sendToServer(info.id)}>
                              <button className={`button is-danger is-small ${loading==true?"is-loading":"not"}`} style={{width:"100%"}}>Delete</button>
                          </div>
                          <div className="column">
                              <button className="button is-primary is-small" style={{width:"100%"}} onClick={()=>setdelActive("")}>Cancel</button>
                          </div>
                        </div>
                    </div>
                </div>                
            <button className="modal-close is-large" aria-label="close"></button>
        </div>


        </div>
      </div>
      )
}

function GetProduct({text}){
  const {data,loading} = useQuery(getAllProductQuery,{variables:{"search":""}})
  const [getData,{data:udata,loading:uloading}] = useLazyQuery(getAllProductQuery)
  
  // const product = useSelector(state => state);
  // const dispatch = useDispatch();
  

  useEffect(()=>{
    // dispatch(addProduct("X"))
      getData({variables:{"search":text}})
  },[text])
  
  // const action=()=>{
  //   dispatch(addProduct("X"))
  // }

  return (
    <div>
    <TableView 
    data={
      udata!=undefined?udata:
      data
    } 
    
    
      mloading={
        uloading ||
        loading
        
        } />
    </div>
    )  
  ;

}


export default GetProduct;