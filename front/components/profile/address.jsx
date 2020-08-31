import {useForm} from 'react-hook-form'
import { getAddressQuery } from '../../lib/graphql';
import { TableLoading } from '../skeleton';
import { useQuery } from 'react-apollo';


const AddressInfo = ({isEdit,setIsEdit})=>{
    const {data,loading} = useQuery(getAddressQuery)
    const { register, handleSubmit,setValue } = useForm({});

    if(loading || data==undefined){
        return <TableLoading />
    }
    const user = data.user
    return <>
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
    </>
}

export default AddressInfo