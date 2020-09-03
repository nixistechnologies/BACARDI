import {useForm} from 'react-hook-form'
import { getAddressQuery,updateAddressQuery } from '../../lib/graphql';
import { TableLoading } from '../skeleton';
import { useQuery,useMutation } from 'react-apollo';
import { useState } from 'react';


const AddressInfo = ()=>{
    const {data,loading} = useQuery(getAddressQuery)
    const [isEdit, setIsEdit] = useState(false)
    const { register, handleSubmit,setValue } = useForm({});
    const [updateAddress,{data:personalUpdateData,loading:pDataLoading}] = useMutation(updateAddressQuery)


    const submitAddress = data =>{
        if(isEdit){
            updateAddress({
                variables:{
                    "city": data.city,
                    "state": data.state,
                    "zipcode": data.zipcode,
                    "address": data.address,
                    // "account": data.account,
                },
                optimisticResponse:true,
                update:(cache,{data})=>{
                    if(data!=true){
                        const existingCache = cache.readQuery({query:getAddressQuery})
                        existingCache.user.profile = data.updateAddress.user.profile                            
                        cache.writeQuery({
                            query:getAddressQuery,
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

    if(loading){
        return <TableLoading />
    }
    const user = data.user
    return <>
    <form 
        onSubmit={handleSubmit(submitAddress)}
        >
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
        <div className="left-1">
            State
        </div>
        <div className="right-1">
            
            {
            isEdit?
            <input type="text" name="state" ref={register} placeholder="State" 
            defaultValue={user.profile.state} 
            className="input is-small" />
            :user.profile.state
        }
        </div>
    </div>

    <div className="out">
        <div className="left-1">
            City
        </div>
        <div className="right-1">
            
            {
            isEdit?
            <input type="text" name="city" ref={register} placeholder="City" 
            defaultValue={user.profile.city} 
            className="input is-small" />
            :user.profile.city
        }
        </div>
    </div>
    <div className="out">
        <div className="left-1">
            Zip Code
        </div>
        <div className="right-1">
            
            {
            isEdit?
            <input type="text" name="zipcode" ref={register} placeholder="Zip Code" 
            defaultValue={user.profile.zipcode} 
            className="input is-small" />
            :user.profile.zipcode
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

export default AddressInfo