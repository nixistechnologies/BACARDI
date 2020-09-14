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

        <Layout login={true} navbar={false} title="Login to BACARDI">
            
            <div>

            <style jsx>{`
            
            input{
                background: transparent;
                border: none;
                    border-bottom-color: currentcolor;
                    border-bottom-style: none;
                    border-bottom-width: medium;
                outline: none !important;
                box-shadow: none !important;
                border-bottom: 2px solid #00c4a7 !important;
            }
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
             .container{
                 width:100% !important;
             }
             .login_form, .login_context{
                display:flex;
                align-items:center;
                padding:20px;
             }
             .login_form{
                 width:50%;
                    // background: antiquewhite;
             }
             .login_context{
                 width:50%;
             }
             .w70{
                 width:60%;
                 margin 0 auto;
                 margin-bottom:20%;
             }
            `} 

            </style>
            <div style={{padding:'10px 0px 0px 20px',fontSize:'1em',fontFamily:'nfontB',letterSpacing:'2px'}}>
                <h1>BACARDI</h1>
            </div>
            <div style={{display:'flex',height:"100vh"}}>
                
                <div className="login_context">
                    <div>
                        <img src="/company.webp" />
                        {/* <h1 className="title">Welcome to Bacardi</h1> */}
                    </div>
                </div>

                <div className="login_form" >
                <div className="w70"
                // style={{maxWidth:'400px',margin:'auto',padding:'30px', border:'1px solid rgba(0,0,0,.2)',borderRadius:'5px'}}
                >
                   
                   <div  style={{marginTop:'0'}}>
                   
                    <div style={{textAlign:"center"}}>
                        <div className="subtitle" style={{fontWeight:'300',fontSize:'25px',fontFamily:'nfontb'}}>Welcome Back :)</div>
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
                        <div className="columns" style={{marginTop:'15px',paddingTop:'10px'}}>
                            <div className="column is-3">
                                <button type="submit" className={login.loading==true?"button is-primary is-small is-rounded is-loading":"button is-rounded is-primary is-small"}>Login</button>
                            </div>
                            {/* <div className="column" style={{fontSize:'14px'}}>
                                <Link href="/signup">
                                    <a>Sign Up</a>
                                </Link>
                            </div> */}
                        </div>
                    </div>
                    </form>
                </div>
            </div>
            </div>
            
            </div>
            </div>
        
        </Layout>
    )
}

export default Login;