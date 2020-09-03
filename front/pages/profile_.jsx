import Layout from "../components/layout"
// import {} from 'react'
import {currentUserQuery, updateCurrentUserQuery,getPersonalQuery,updatePersonalQuery,updateFirmQuery, getFirmQuery, getAddressQuery} from '../lib/graphql'
import {useQuery, useMutation, useLazyQuery} from '@apollo/react-hooks'
import {useForm} from 'react-hook-form'
import {AuthProps,privateRoute} from '../lib/private_route'
import {useState, useEffect} from 'react'
import {useSelector,useDispatch} from 'react-redux'
import {getCurrentUser,updateUser,updatedFirm, updateFirm} from '../redux_function/actions'
import {FullPageLoading,TableLoading} from '../components/skeleton'
// import FirmInfor from '../components/profile/firmInfo'
// import FirmInfo from "../components/profile/firmInfo"
// import AddressInfo from "../components/profile/address"
// import BankInfo from "../components/profile/bank"
import { server } from "../lib/settings"

// import dynamic from 'next/dynamic'
// const DynamicBank = dynamic(()=>import('../components/profile/bank'),{loading:()=><TableLoading />})


const Profile =() =>{
    const {data,loading} = useQuery(getPersonalQuery)
    const [isEdit, setIsEdit] = useState(false)
    const [tabs,setTabs]=useState({})
    const { register, handleSubmit,setValue } = useForm({
    });
    
    const [updatePersonal,{data:personalUpdateData,loading:pDataLoading}] = useMutation(updatePersonalQuery)
    useEffect(()=>{        
        // dispatch(getCurrentUser())
        setTabs({"personal":true,"firm":false,"bank":false,"address":false})

    },[])

    
    const submitPersonal = data =>{
        if(isEdit){
            updatePersonal({
                variables:{
                    "firstname": data.firstName,
                    "lastname": data.lastName,
                    "phone": data.phone,
                    "email": data.email,
                },
                optimisticResponse:true,
                update:(cache,{data})=>{
                    if(data!=true){
                        const existingCache = cache.readQuery({query:getPersonalQuery})
                        existingCache.user = data.updatePersonal.user
                        console.log(existingCache.user)
                        console.log(data.updatePersonal.user)
                        existingCache.user.firstName = data.updatePersonal.user.firstName
                        existingCache.user.lastName = data.updatePersonal.user.lastName
                        existingCache.user.email = data.updatePersonal.user.email
                        existingCache.user.profile.contactNumber = data.updatePersonal.user.profile.contactNumber
                        cache.writeQuery({
                            query:getPersonalQuery,
                            data:existingCache
                        })
                    }
                }
            })
            setIsEdit(false)
        }
        else{
            setIsEdit(true)
        }
    }


    // const submitFirm = data =>{
    //     if(isEdit){
    //         updateFirm({
    //             variables:{
    //                 "firm": data.firm,
    //                 "gst": data.gst,
    //                 // "phone": data.phone,
    //                 // "email": data.email,
    //             },
    //             optimisticResponse:true,
    //             update:(cache,{data})=>{
    //                 if(data!=true){
    //                     const existingCache = cache.readQuery({query:getFirmQuery})
                        
    //                     // existingCache.user = data.updatePersonal.user

    //                     // console.log(existingCache.user)
    //                     // console.log(data.updatePersonal.user)
    //                     // existingCache.user.firstName = data.updatePersonal.user.firstName
    //                     // existingCache.user.lastName = data.updatePersonal.user.lastName
    //                     // existingCache.user.email = data.updatePersonal.user.email
    //                     // existingCache.user.profile.contactNumber = data.updatePersonal.user.profile.contactNumber
    //                     // cache.writeQuery({
    //                     //     query:getPersonalQuery,
    //                     //     data:existingCache
    //                     // })
    //                 }
    //             }
    //         })
    //         setIsEdit(false)
    //     }
    //     else{
    //         setIsEdit(true)
    //     }
    // }

    // const submitFirm = data =>{
    //     if(isEdit){
    //         dispatch(updateFirm(data))

    //         setIsEdit(false)
    //     }
    //     else{
    //         setIsEdit(true)
    //     }
    // }

    // const submitAddress = data =>{
    //     if(isEdit){
    //         dispatch(updateAddress(data))

    //         setIsEdit(false)
    //     }
    //     else{
    //         setIsEdit(true)
    //     }
    // }

    // console.log(data.user)
    // console.log(userStore)
    console.log(data)
    // if(loading)
    // {
    //     return <div><FullPageLoading/></div>    
    // }
    
    
    // const user = userStore.user
    // const user = data.user
    // console.log(firmData)
    // if(userfirm!=undefined)
    // {
    //     const userfirm = firmData.user
    // }
    // if(userAddress!=undefined)
    // {
    //     const userAddress = addressData.user
    // }
    

    // console.log(data)
    
    return (
    
        <div>
            {
                loading==true
                ?<TableLoading />:
            <>
            <style jsx>{`
            body{
                background:white !important
            }
            .t-head{
                border-bottom:1px solid rgba(0,0,0,.15);
                display:flex;
                margin-bottom:25px;
            }
            .t-head span{
                font-weight:600;
                line-height:1.2;
                font-size:22px;
                border-bottom:1px solid rgba(0,0,0,.54);
                padding-bottom:20px;
                margin-bottom:-1px
            }
        `}
        </style>
            <div className="topHeading">
                <h2>Welcome {data.user.firstName} {data.user.lastName}</h2>
            </div>
        <div style={{background:'white',padding:'20px'}} className="card">
            {/* <div>
                <h1 className="title">Welcome {data.user.firstName} {data.user.lastName}</h1>
            </div> */}
            <div>
                {/* <div className="t-head">
                    <span>
                        Account Information
                    </span>
                </div> */}

                <div className="tabs">
                    <ul>
                        <li className={`${tabs.personal==true && "is-active"}`}><a onClick={()=>setTabs({personal:true,firm:false,bank:false,address:false})} >Personal Info</a></li>
                        <li className={`${tabs.firm==true && "is-active"}`}><a onClick={()=>{setTabs({personal:false,firm:true,bank:false,address:false})} } >Firm</a></li>
                        <li className={`${tabs.address==true && "is-active"}`}><a onClick={()=>setTabs({personal:false,firm:false,bank:false,address:true})} >Address</a></li>
                        <li className={`${tabs.bank==true && "is-active"}`}><a onClick={()=>setTabs({personal:false,firm:false,bank:true,address:false})} >Bank</a></li>
                    </ul>
                </div>

                
                
                <div style={{width:'70%'}}>
                
                { tabs.personal ==true &&
                <>
                <form onSubmit={handleSubmit(submitPersonal)}>
                    <div className="out">
                        <img src={`${server}/media/${data.user.profile.image}`} alt={data.user.username} style={{height:'100px !important'}}/>
                    </div>
                    <div className="out">
                        <div className="left-1">
                            Username
                        </div>
                        <div className="right-1">
                            {data.user.username}
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
                                    <input type="text" name="firstName" defaultValue={data.user.firstName} ref={register} placeholder="First Name" className="input is-small" />
                                </div>
                            </div>
                            <div className="out">
                                <div className="left-1">
                                    Last Name
                                </div>
                                <div className="right-1">
                                    <input type="text" name="lastName" defaultValue={data.user.lastName} ref={register} placeholder="Last Name" className="input is-small" />
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
                            defaultValue={data.user.email} 
                            className="input is-small" />
                            :data.user.email
                        }

                            
                        </div>
                    </div>

                    <div className="out">
                        <div className="left-1">
                            Phone
                        </div>
                        <div className="right-1">
                            {
                            isEdit?
                            <input type="text" name="phone" ref={register} placeholder="Phone" 
                            defaultValue={data.user.profile.contactNumber} 
                            className="input is-small" />
                            :data.user.profile.contactNumber
                        }
                        </div>
                    </div>
                    <div className="out">
                        <button type="submit" className={true?"button is-primary is-small":"button is-primary is-small is-loading"} 
                        >
                        {isEdit?"Update":"Edit"}
                        </button>
                        {isEdit && 
                            <div style={{marginLeft:"20px"}}>
                                <button type="reset" onClick={()=>setIsEdit(false)} className={"button is-secondary is-small is-light"}>Cancel</button>
                            </div>                
                        }
                        
                    </div>
                </form>

                </>
                }



                {/* {tabs.firm==true ?
                <>
                    <FirmInfo isEdit={isEdit} setIsEdit={setIsEdit}/>
                </>:<div></div>
                }
                { tabs.address ==true &&
                <AddressInfo setIsEdit={setIsEdit} isEdit={isEdit} />
                }
                {
                    tabs.bank==true &&
                <DynamicBank />
                } */}



                </div>
                
                
                
            </div>
        </div>
        </>}
        </div>
    
    )
}

const PX = () =>{
    // const {data,loading} = useQuery(getPersonalQuery)
    return(
    <Layout title="Profile" body_color="white">
        
            {/* loading==true 
            ?<TableLoading />
            :<div>Done</div> */}
            <Profile />
        
    </Layout>
    )
}


export default PX;
// export default privateRoute(PX);