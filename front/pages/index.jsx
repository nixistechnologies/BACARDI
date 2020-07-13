import Layout from '../components/layout'
import dynamic from 'next/dynamic'
import HomePage from '../components/HomePage'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import {getToken} from '../redux_function/actions/index'
import Login from './login'
import { withAuthSync } from '../lib/auth'
import {AuthProps,privateRoute} from '../lib/private_route'
import {AuthToken} from '../lib/auth_token'


// import {Cookies} from 'react-cookie'


// class Index extends React.Component{
//   render(){
//     return (
//       <Layout>
//         <GetProduct></GetProduct>
//       </Layout>  
//     )
//   }
// }

// if(!isNode){
//   localStorage.setItem("token","xxx")
//   var token = localStorage.getItem("token")
//   console.log("work!")
// }

// const LoginWithNoSSR = dynamic(
//   ()=>import("./login"),{ssr:false}
// )
// const HomePage = dynamic(
//   ()=>import("../components/HomePage"),{ssr:false}
// )



// const cookies = new Cookies();


const HomePageX =(props)=>{
  // const Token = useDispatch()
  // const token = useSelector(state => state.login);  
  // console.log(token)
  // if(token)
  console.log(props)
  
  return <HomePage />
  
  // return token.token==null?<HomePage/>:<Login/>
}


// HomePageX.getInitialProps = async ({auth}) =>{

// }



export default privateRoute(HomePageX);

// export default withAuthSync(HomePageX);
// export default withApollo(Index);