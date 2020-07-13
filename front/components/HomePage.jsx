import Layout from '../components/layout'
import GetProduct from './productList'
import Login from '../pages/login';
// import dynamic from 'next/dynamic'

class Index extends React.Component{
  render(){
    return (
      <Layout>
        <GetProduct></GetProduct>
      </Layout>  
    )
  }
}



// console.log(localStorage.getItem("token"))
// var token = localStorage.getItem("token")



export default Index;