import { useQuery,useMutation } from "react-apollo"
import { getBankQuery,updateBankQuery } from "../../lib/graphql"
import { TableLoading } from "../skeleton"
import { useState,useEffect } from "react"
import { useForm } from "react-hook-form"
import {server} from '../../lib/settings'



const Personal = () =>{
    const {data:C,loading,error} = useQuery(getBankQuery)
    const [isEdit, setIsEdit] = useState(false)
    const { register, handleSubmit,setValue } = useForm({});
    const [updatePersonal,{data:personalUpdateData,loading:pDataLoading}] = useMutation(updateBankQuery)

    
    const submitPersonal = data =>{
            if(isEdit){
                updatePersonal({
                    variables:{
                        "ifsc": data.ifsc,
                        "bank": data.bank,
                        "name": data.name,
                        "branch": data.branch,
                        "account": data.account,
                    },
                    optimisticResponse:true,
                    update:(cache,{data})=>{
                        if(data!=true){
                            const existingCache = cache.readQuery({query:getBankQuery})
                            existingCache.user.bank = data.updateBank.user.bank                            
                            cache.writeQuery({
                                query:getBankQuery,
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
                <div className="left-1">
                    Account No
                </div>
                <div className="right-1">
                {
                    isEdit?
                    <input type="text" name="account" ref={register}  placeholder="Account No" 
                    defaultValue={C.user.bank.accountNo} 
                    className="input is-small" />
                    :C.user.bank.accountNo
                }

                    
                </div>
            </div>

            <div className="out">
                <div className="left-1">
                    Account Holder Name
                </div>
                <div className="right-1">
                    {
                    isEdit?
                    <input type="text" name="name" ref={register} placeholder="Account Holder Name" 
                    defaultValue={C.user.bank.name} 
                    className="input is-small" />
                    :C.user.bank.name
                }
                </div>
            </div>
            <div className="out">
                <div className="left-1">
                    Bank Name
                </div>
                <div className="right-1">
                    {
                    isEdit?
                    <input type="text" name="bank" ref={register} placeholder="Bank Name" 
                    defaultValue={C.user.bank.bankName} 
                    className="input is-small" />
                    :C.user.bank.bankName
                }
                </div>
            </div>
            <div className="out">
                <div className="left-1">
                    IFSC code
                </div>
                <div className="right-1">
                    {
                    isEdit?
                    <input type="text" name="ifsc" ref={register} placeholder="IFSC code" 
                    defaultValue={C.user.bank.ifscCode} 
                    className="input is-small" />
                    :C.user.bank.ifscCode
                }
                </div>
            </div>
            <div className="out">
                <div className="left-1">
                    Branch
                </div>
                <div className="right-1">
                    {
                    isEdit?
                    <input type="text" name="branch" ref={register} placeholder="Branch" 
                    defaultValue={C.user.bank.branch} 
                    className="input is-small" />
                    :C.user.bank.branch
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