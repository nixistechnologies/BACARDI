import { useRouter } from 'next/router'
import Layout from '../layout'
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks'
import {getProductByIdQuery} from '../../lib/graphql'

const getProductById = gql`
query x($productId:ID){
	productById(id:$productId){
    id
    name
  }
}
`

const GET_PRODUCT = gql`
query x($first:Int!){
  allProducts(first:$first){
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

// const Product =(id) =>{
//   console.log("tu9s9")
//   console.log(id)
//   // const {loading,error,data} = useQuery(getProductById,{variables:{id:"UHJvZHVjdE5vZGU6ODA="}})
//   const {loading,error,data} = useQuery(getProductByIdQuery,{variables:{id:id.id}})
//   if(loading){
//     return <h1>Loading..</h1>
//   }
//   if(error){
//     console.log(error)
//     return <h1>Error..</h1>
//   }
//   if(data){
//     console.log(data)
//     return <div>
//       <h1>{data.productById.name}</h1>
//       <h1>{data.productById.id}</h1>
//     </div>
//   }


// }


const P = () => {
  const router = useRouter()
  // console.log(router.query)
  const { product } = router.query
  return <Layout>

          <div>{product}</div>
            {/* <p>Product: {product}</p> */}
            {/* <Product id={product}/> */}
        </Layout>
  // return <p>Product: {product}</p>
}


// class Product extends React.Component{
//   render(){
//     return(
      
//           <Layout>
//           <P/>
//           {/* const router = useRouter()
//           const { product } = router.query */}
//           <div>
//               <h1>{product}</h1>

//               <Link href="/">go to home</Link>
//           </div>
//           </Layout>

//       )
//   }
// }


export default P
