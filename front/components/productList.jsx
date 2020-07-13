import Link from 'next/link'
import Head from 'next/head'
import { withApollo } from "next-apollo";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks'
import {getAllProductQuery} from '../lib/graphql'
import { useStore,useDispatch, useSelector } from 'react-redux'
import { useEffect,useState } from 'react';
import {addProduct} from '../redux_function/actions'
import {FullPageLoading} from './skeleton'
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


const TableView=({products})=>{
  // {products.loading}
  // console.log(products.items)
  if(products.loading)
  return (
    <div>
      <FullPageLoading />
    </div>
  )
    
  
  if(products.items.length==0)
  return (<div style={{marginTop:"200px",textAlign:"center",fontSize:"20px",fontWeight:"bold"}}>
          <div>No Product Avaiable please add </div>
        </div>)
    return (
    <div>
      <style jsx>{`

      ._heading{
        font-weight:500;
        color:black;
        text-transform: uppercase;
      }

      .w30{
        width:30%
      }
      .w10{
        width:10%
      }
      .th{

      }
      .w5{
        width:5%;
      }
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
      <div>
        <Link href="/create">
          <a className="button is-rounded is-small is-bold is-primary" style={{fontWeight:"bold"}}>Add new</a>
        </Link>
      </div>
      
    </div>
    <div style={{overflow:"auto"}}>
     <table className="table is-fullwidth is-hoverable ">
       <thead>
       <tr>
         <th className="w30">Name</th>
         <th className="w10">Qty</th>
         <th className="w10">Price</th>
         <th className="w10">Purchase from</th>
         <th className="w5"></th>
         </tr>
       </thead>
        <tbody>
          {products.items.map((prd)=>{
            return (
            // <tr>
            //   <td>{prd.node.name}</td>
            //   <td>{prd.node.name}</td>
            //   <td>{prd.node.name}</td>
              
              
            //   </tr>
          // <Link href="/detail/[product]" as={`/detail/${prd.node.id}`} key={prd.node.id}> 


            <tr key={prd.node.id} className="data-item" style={{cursor:'pointer'}}>
                  <td>
                    <div className="_heading">
                      {prd.node.name}
                    </div>
                    
                  </td>
                  <td className="cont">
                    {prd.node.qty}
                  </td>
                  <td className="cont">
                    {prd.node.price}
                  </td>
                  <td className="cont">
                    {prd.node.purchaseFrom}
                  </td>
                  <td className="cont">
                  <button className="button is-rounded is-small is-success is-light">Update</button>
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
        </div>
      </div>
      )
}

function GetProduct(){
  const [allProducts, setAllProducts] = useState(null);
  const product = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(addProduct("X"))
  },[])
  
  const action=()=>{
    dispatch(addProduct("X"))
    
  }
  return (
    <div>
    <TableView products={product.products} />
    </div>
    )  
  ;

}


export default GetProduct;