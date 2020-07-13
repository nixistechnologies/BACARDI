import Layout from '../components/layout'
import {useForm} from 'react-hook-form'
import {PostLogin} from '../lib/authentication'
import {useDispatch,useSelector} from 'react-redux'
import Link from 'next/link'
import {getUserToken,getCurrentUser} from '../redux_function/actions'

const Login =() =>{
    // console.log(localStorage.getItem("token"))
    const { register, handleSubmit, watch, errors } = useForm();
    const login = useSelector(state=>state.login)
    const dispatch = useDispatch()
    console.log(login)

    const Submit=(data)=>{
        // console.log(data)
        dispatch(getUserToken(data))
    }


    return(

        <Layout sidebar={false} navbar={false} title="Login to BACARDI">
            
            <div style={{marginTop:'50px'}}>

            {/* <style jsx>{`
             .error_msg{
                text-align:center;
                font-size:12px;
                margin-top:10px;
             }
            `}>
            </style> */}

            <style jsx>{`
             td,th{
                 font-size:13px;
             }
             .error_msg{
                 text-align:center;
                 font-size:12px;
                 margin-top:10px;
             }
             .columns .column{
                padding:0.2rem
             }
            `} 

            </style>



                <div style={{maxWidth:'400px',margin:'auto',padding:'30px', border:'1px solid rgba(0,0,0,.2)',borderRadius:'5px'}}>
                   <div style={{marginTop:'0'}}>
                   
                    <div style={{textAlign:"center"}}>
                        <div className="subtitle" style={{fontWeight:'300',fontSize:'25px'}}>Welcome to <b>BACARDI</b></div>
                    </div>
                    <div className="error_msg" style={login.error?{visibility:"initial"}:{visibility:"hidden"}} >Wrong username and password</div>
                    {/* <div className="subtitle">Login</div> */}
                    <form onSubmit={handleSubmit(Submit)}>
                    <div style={{marginTop:"30px"}}>
                        <div className="columns">
                            <div className="column">
                                <label className="label">Username</label>
                                <input type="text" className="input is-small" name="username" ref={register} placeholder="Username"/>
                            </div>
                        </div>
                        <div className="columns">
                            <div className="column">
                                <label className="label">Password</label>
                                <input type="password" className="input is-small" name="password" ref={register} placeholder="Password" />
                            </div>
                        </div>
                        <div className="columns" style={{marginTop:'15px'}}>
                            <div className="column is-3">
                                <button type="submit" className={login.loading==true?"button is-primary is-small is-loading":"button is-primary is-small"}>Login</button>
                            </div>
                            <div className="column" style={{fontSize:'14px'}}>
                                <Link href="/signup">
                                    <a>Sign Up</a>
                                </Link>
                            </div>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
            </div>
        
        </Layout>
    )
}

export default Login;