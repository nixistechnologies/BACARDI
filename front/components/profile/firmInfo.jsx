import {useForm} from 'react-hook-form'
import { getFirmQuery } from '../../lib/graphql';
import { TableLoading } from '../skeleton';
import { useQuery } from 'react-apollo';


const FirmInfo = ({isEdit,setIsEdit})=>{
    const {data,loading} = useQuery(getFirmQuery)
    const { register, handleSubmit,setValue } = useForm({});

    if(loading || data==undefined){
        return <TableLoading />
    }
    const user = data.user
    return <>

    <div>
        <form 
        //onSubmit={handleSubmit(submitFirm)}
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
    </div>
    </>
}

export default FirmInfo