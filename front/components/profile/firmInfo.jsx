import {useForm} from 'react-hook-form'
import { getFirmQuery,updateFirmQuery } from '../../lib/graphql';
import { TableLoading } from '../skeleton';
import { useQuery , useMutation} from 'react-apollo';
import { useState } from 'react';

const FirmInfo = ()=>{
    const {data,loading} = useQuery(getFirmQuery)
    const [isEdit, setIsEdit] = useState(false)
    const { register, handleSubmit,setValue } = useForm({});
    const [updateFirm,{data:personalUpdateData,loading:pDataLoading}] = useMutation(updateFirmQuery)
    

    const submitFirm = data =>{
        if(isEdit){
            updateFirm({
                variables:{
                    "gst": data.gst,
                    "firm": data.firm,
                    // "name": data.name,
                    // "branch": data.branch,
                    // "account": data.account,
                },
                optimisticResponse:true,
                update:(cache,{data})=>{
                    if(data!=true){
                        
                        const existingCache = cache.readQuery({query:getFirmQuery})
                        existingCache.user.profile = data.updateFirm.user.profile
                        
                        // console.log(existingCache)

                        cache.writeQuery({
                            query:getFirmQuery,
                            data:existingCache
                        })

                        setIsEdit(false)
                        
                    }
                }
            })
            // setIsEdit(false)
        }
        else{
            setIsEdit(true)
        }
    }

    if(loading || data==undefined){
        return <TableLoading />
    }
    const user = data.user
    return <>

    <div>
        <form 
        onSubmit={handleSubmit(submitFirm)}
        >
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

            {/* <div className="out">
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
            </div> */}
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
    </div>
    </>
}

export default FirmInfo