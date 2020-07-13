import Layout from "../components/layout"
// import {} from 'react'
import {currentUserQuery, updateCurrentUserQuery} from '../lib/graphql'
import {useQuery, useMutation} from '@apollo/react-hooks'
import {useForm} from 'react-hook-form'
import {AuthProps,privateRoute} from '../lib/private_route'
import {useState, useEffect} from 'react'
import {useSelector,useDispatch} from 'react-redux'
import {getCurrentUser,updateUser} from '../redux_function/actions'
import {FullPageLoading} from '../components/skeleton'


const Profile =(props) =>{

    const [isEdit, setIsEdit] = useState(false)
    // const {loading,data,error}  = useQuery(currentUserQuery)
    // const [updateUser,{response}] = useMutation(updateCurrentUserQuery)
    const { register, handleSubmit,setValue } = useForm({
    });

    const userStore = useSelector(state => state.user);
    const dispatch = useDispatch()

    useEffect(()=>{        
        dispatch(getCurrentUser())    

    },[])


    
    const onSubmit = data =>{
        
        // console.log(isEdit)
        if(isEdit){
            dispatch(updateUser(data))
            setIsEdit(false)
        }
        else{
            setIsEdit(true)
        }

    }

    // console.log(data.user)
    console.log(userStore)
    if(userStore.loading)
    return <div><FullPageLoading/></div>
    
    const user = userStore.user


    return (
    
        <div>
            <div className="topHeading">
                <h2>Welcome {user.firstName} {user.lastName}</h2>
            </div>
        <div>
            {/* <div>
                <h1 className="title">Welcome {user.firstName} {user.lastName}</h1>
            </div> */}
            <div>
                {/* <div>info</div> */}
                <form onSubmit={handleSubmit(onSubmit)}>
                <div className="out">
                    <div className="left-1">
                        Username
                    </div>
                    <div className="right-1">
                        {user.username}
                        {/* <input type="text" name="username" className="input is-small" /> */}

                    </div>
                </div>
                {isEdit?
                    (
                        <>
                        <div className="out">
                            <div className="left-1">
                                First Name
                            </div>
                            <div className="right-1">
                                <input type="text" name="firstName" defaultValue={user.firstName} ref={register} placeholder="First Name" className="input is-small" />
                            </div>
                        </div>
                        <div className="out">
                            <div className="left-1">
                                Last Name
                            </div>
                            <div className="right-1">
                                <input type="text" name="lastName" defaultValue={user.lastName} ref={register} placeholder="Last Name" className="input is-small" />
                            </div>
                        </div>
                        </>
                    ):""

                }

                <div className="out">
                    <div className="left-1">
                        Email
                    </div>
                    <div className="right-1">
                    {
                        isEdit?
                        <input type="text" name="email" ref={register}  placeholder="email" 
                        defaultValue={user.email} 
                        className="input is-small" />
                        :user.email
                    }

                        
                    </div>
                </div>

                <div className="out">
                    <div className="left-1">
                        Phone
                    </div>
                    <div className="right-1">
                    {/* <input type="text" name="username" ref={register} placeholder="email" className="input is-small" /> */}
                        {/* {user.profile.contactNumber} */}
                        {
                        isEdit?
                        <input type="text" name="phone" ref={register} placeholder="Phone" 
                        defaultValue={user.profile.contactNumber} 
                        className="input is-small" />
                        :user.profile.contactNumber
                    }
                    </div>
                </div>

                <div className="out">
                    <div className="left-1">
                        GST
                    </div>
                    <div className="right-1">
                        
                        {
                        isEdit?
                        <input type="text" name="gst" ref={register} placeholder="GST Number" 
                        defaultValue={user.profile.GSTNo} 
                        className="input is-small" />
                        :user.profile.GSTNo
                    }
                    </div>
                </div>

                <div className="out">
                    <div className="left-1">
                        TIN
                    </div>
                    <div className="right-1">
                        {
                        isEdit?
                        <input type="text" name="tin" ref={register} placeholder="TIN" 
                        defaultValue={user.profile.TINNo} 
                        className="input is-small" />
                        :user.profile.TINNo
                    }
                    </div>
                </div>
                <div className="out">
                    <div className="left-1">
                        Firm Name
                    </div>
                    <div className="right-1">
                        {
                        isEdit?
                        <input type="text" name="firm" ref={register} placeholder="Firm Name" 
                        defaultValue={user.profile.firmName} 
                        className="input is-small" />
                        :user.profile.firmName
                    }
                    </div>
                </div>
                <div className="out">
                    <div className="left-1">
                        Address
                    </div>
                    <div className="right-1">
                        
                        {
                        isEdit?
                        <input type="text" name="address" ref={register} placeholder="Address" 
                        defaultValue={user.profile.address} 
                        className="input is-small" />
                        :user.profile.address
                    }
                    </div>
                </div>
                <div className="out">
                    
                
                <button type="submit" className={userStore.created?"button is-primary is-small":"button is-primary is-small is-loading"} 
                >
                {isEdit?"Update":"Edit"}
                </button>
                {/* <button>
                    Logout
                </button> */}


                    {/* {isEdit?
                    <input type="submit" className="button is-primary is-small" value="Update" 
                    // onClick={()=>setIsEdit(false)}
                />  :
                    <input type="button" className="button is-primary is-small" value="Edit" 
                    onClick={()=>setIsEdit(true)}
                />
                    } */}
                    
                </div>

                </form>
            </div>
        </div>
        </div>
    
    )
}

const P = () =>{
    return(
    <Layout title="Profile">
        <Profile />
    </Layout>
    )
}


export default privateRoute(P);