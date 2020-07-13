import Layout from "../components/layout"
import {useForm} from 'react-hook-form'
import Link from 'next/link'
import {useDispatch,useSelector} from 'react-redux'
import { createNewUser } from "../redux_function/actions"
// import {useDispatch} from 'react-redux'



const SignUp = () =>{
    const { register, handleSubmit, watch, errors } = useForm();
    
    const dispatch = useDispatch()
    const signup = useSelector(state=>state.login)

    const Submit = (data) =>{
        dispatch(createNewUser(data))
    }
    console.log(signup)


    return (
        // <Layout>
        <Layout sidebar={false} navbar={false} title="SignUp to BACARDI">
            <div style={{marginTop:'50px'}}>
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
                        <div className="subtitle" style={{fontWeight:'300',fontSize:'25px'}}>Welcome to BACARDI</div>
                        <div className="error_msg" style={signup.error?{visibility:"initial"}:{visibility:"hidden"}}>Problem in signup contact to adminstation</div>
                    </div>
                    {/* <div className="error_msg" style={login.error?{visibility:"initial"}:{visibility:"hidden"}} >Wrong username and password</div> */}
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
                                <label className="label">First Name</label>
                                <input type="text" className="input is-small" name="first_name" ref={register} placeholder="First Name" />
                            </div>
                            <div className="column">
                                <label className="label">Last Name</label>
                                <input type="text" className="input is-small" name="last_name" ref={register} placeholder="Last Name" />
                            </div>
                        </div>

                        <div className="columns">
                            <div className="column">
                                <label className="label">Phone Number</label>
                                <input type="text" className="input is-small" name="phone" ref={register} placeholder="Phone Number" />
                            </div>
                            <div className="column">
                                <label className="label">Email</label>
                                <input type="text" className="input is-small" name="email" ref={register} placeholder="Email" />
                            </div>
                        </div>
                        <div className="columns">
                            <div className="column">
                                <label className="label">GST</label>
                                <input type="text" className="input is-small" name="gst" ref={register} placeholder="GST Number" />
                            </div>
                        </div>
                        <div className="columns">
                            <div className="column">
                                <label className="label">TIN</label>
                                <input type="text" className="input is-small" name="tin" ref={register} placeholder="TIN Number" />
                            </div>
                        </div>

                        <div className="columns">
                            <div className="column">
                            <label className="label">Firm Name</label>
                                <input type="text" className="input is-small" name="firm_name" ref={register} placeholder="Firm Name" />
                            </div>
                        </div>

                        <div className="columns">
                            <div className="column">
                            <label className="label">Address</label>
                                <input type="text" className="input is-small" name="address" ref={register} placeholder="Address" />
                            </div>
                        </div>

                        <div className="columns">
                            <div className="column">
                                <label className="label">Password</label>
                                <input type="password" className="input is-small" name="password" ref={register} placeholder="First Name" />
                            </div>
                            <div className="column">
                                <label className="label">Password Again</label>
                                <input type="password" className="input is-small" name="password1" ref={register} placeholder="Last Name" />
                            </div>
                        </div>

                        <div className="columns">
                            {/* <div className="column">
                                <button type="submit" className={login.loading==true?"button is-primary is-small is-loading":"button is-primary is-small"}>Login</button>
                            </div> */}
                            <div className="column is-3">
                                <button className={signup.loading==true?"button is-primary is-small is-loading":"button is-primary is-small"} >Sign Up</button>
                            </div>
                            <div className="column is-9" style={{textAlign:'right',fontSize:'14px'}}>
                                <Link href="/login">
                                    <a className="is-small" >Already have account? Login</a>
                                </Link>
                            </div>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
            </div>
        
        </Layout>
        // </Layout>
    )
}

export default SignUp