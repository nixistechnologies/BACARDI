import { useQuery,useMutation } from "react-apollo"
import { getPersonalQuery,updatePersonalQuery } from "../../lib/graphql"
import { TableLoading } from "../skeleton"
import { useState,useEffect } from "react"
import { useForm } from "react-hook-form"
import {server} from '../../lib/settings'



const Personal = () =>{
    const {data:C,loading,error} = useQuery(getPersonalQuery)
    const [isEdit, setIsEdit] = useState(false)
    const [tabs,setTabs]=useState({})
    const { register, handleSubmit,setValue } = useForm({});
    const [updatePersonal,{data:personalUpdateData,loading:pDataLoading}] = useMutation(updatePersonalQuery)

    
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
                            // existingCache.user = data.updatePersonal.user
                            // console.log(existingCache.user)
                            // console.log(data.updatePersonal.user)
                            existingCache.user.firstName = data.updatePersonal.user.firstName
                            existingCache.user.lastName = data.updatePersonal.user.lastName
                            existingCache.user.email = data.updatePersonal.user.email
                            existingCache.user.profile.contactNumber = data.updatePersonal.user.profile.contactNumber
                            cache.writeQuery({
                                query:getPersonalQuery,
                                data:existingCache
                            })
                            setIsEdit(false)
                        }
                    }
                })
                
            }
            else{
                setIsEdit(true)
            }
        }
    if(loading==true){
        return <TableLoading />
    }
    if(error){
    return <div>{error.message}</div>
    }
    return <>
        <form onSubmit={handleSubmit(submitPersonal)}>
            <div className="out">
                <img src={`${server}/media/${C.user.profile.image}`} alt={C.user.username} style={{height:'100px'}}/>
            </div>
            <div className="out">
                <div className="left-1">
                    Username
                </div>
                <div className="right-1">
                    {C.user.username}
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
                            <input type="text" name="firstName" defaultValue={C.user.firstName} ref={register} placeholder="First Name" className="input is-small" />
                        </div>
                    </div>
                    <div className="out">
                        <div className="left-1">
                            Last Name
                        </div>
                        <div className="right-1">
                            <input type="text" name="lastName" defaultValue={C.user.lastName} ref={register} placeholder="Last Name" className="input is-small" />
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
                    defaultValue={C.user.email} 
                    className="input is-small" />
                    :C.user.email
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
                    defaultValue={C.user.profile.contactNumber} 
                    className="input is-small" />
                    :C.user.profile.contactNumber
                }
                </div>
            </div>
            <div className="out">
                <button type="submit" className={pDataLoading!=true?"button is-primary is-small":"button is-primary is-small is-loading"} 
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

export default Personal