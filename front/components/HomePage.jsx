import Layout from '../components/layout'
import GetProduct from './productList'
import Login from '../pages/login';
import {useState} from 'react'
// import dynamic from 'next/dynamic'

// class Index extends React.Component{
//   render(){
//     return (
//       <Layout title={"All products | BACARDI"}>
//         <GetProduct></GetProduct>
//       </Layout>  
//     )
//   }
// }

const Index =() =>{
  const [text,setText] = useState("")
  return <>
    <Layout title={"All products | BACARDI"} text={text} setText={setText}>
        <GetProduct text={text}></GetProduct>
    </Layout>
  </>
}


// console.log(localStorage.getItem("token"))
// var token = localStorage.getItem("token")



export default Index;