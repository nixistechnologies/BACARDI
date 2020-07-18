import HomePage from '../../components/HomePage'
import {AuthProps,privateRoute} from '../../lib/private_route'
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