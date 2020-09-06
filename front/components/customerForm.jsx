import {getAllCustomersQuery,createOrUpdateCustomerQuery, deleteCustomer} from '../lib/graphql'
import {useQuery,useMutation, useLazyQuery} from '@apollo/react-hooks'
import {useForm} from 'react-hook-form'
import {useState,useEffect} from 'react'



const CustomerForm = ({active,setActive,isNew, info=null})=>{
    const [createCustomer,{data,loading}] = useMutation(createOrUpdateCustomerQuery)
    const {register,setValue,handleSubmit,reset} = useForm()
    useEffect(()=>{
        if(info!=null)
        {
            reset({name:info.name,address:info.address,email:info.email,id:info.id,gst:info.gst,mobile:info.mobile,state:info.state,city:info.city,addhar:info.addhar})
        }
        
    },[info])


    const sendToServer=(e)=>{
        createCustomer({
            variables:{
                name: e.name,
                id: e.id,
                mobile: e.mobile,
                gst: e.gst,
                email: e.email,
                address: e.address,
                isNew: isNew,
                addhar:e.addhar,
                state:e.state,
                city:e.city,
                zipcode:e.zipcode,
                company:e.company

            },
            optimisticResponse:true,
            update:(cache,{data})=>{
                if(data!=true)
                {
                    
                    try{
                        const existingCache = cache.readQuery({query:getAllCustomersQuery,variables:{"search":""}})
                    
                    if(isNew === true){
                        console.log(data)
                        existingCache.customers.edges.push({"node":data.createCustomer.customer,"__typename":"CustomerNodeEdge"})
                    }
                    else{
                        console.log(existingCache.customers)
                        for(var i=0;i<existingCache.customers.edges.length;i++)
                        {
                            if(existingCache.customers.edges[i].node.id===e.id)
                            {
                                existingCache.customers.edges[i].node.name = data.createCustomer.customer.name
                                existingCache.customers.edges[i].node.address = data.createCustomer.customer.address
                                existingCache.customers.edges[i].node.mobile = data.createCustomer.customer.mobile
                                existingCache.customers.edges[i].node.gstNumber = data.createCustomer.customer.gstNumber
                                existingCache.customers.edges[i].node.email = data.createCustomer.customer.email
                                existingCache.customers.edges[i].node.state = data.createCustomer.customer.state
                                existingCache.customers.edges[i].node.city = data.createCustomer.customer.city
                                existingCache.customers.edges[i].node.addharNo = data.createCustomer.customer.addharNo
                                existingCache.customers.edges[i].node.company = data.createCustomer.customer.company
                                existingCache.customers.edges[i].node.zipcode = data.createCustomer.customer.zipcode
                            }

                        }
                    }
                    cache.writeQuery({
                        query:getAllCustomersQuery,
                        variables:{"search":""},
                        data:existingCache
                    })
                    
                }
                catch(e){
                    console.log("no need")
                }
                if(isNew===true)
                    {
                        reset({"company":"","zipcode":"", "name":"","gst":"","mobile":"","address":"","email":"","addhar":"","city":"","state":""})
                    } 
                    setActive("")
                    
                                       
                    
                }
            }
        })
    }
    
    return(
        <div className={`modal ${active}`} >
            <style jsx>{`
            .column{
                padding:0;
                margin-bottom:10px;
                padding-right:5px;
                padding-left:5px;
            }
            .modal-content, .modal-card {
                margin: 0 auto;
                // width: 540px;
            }
        `}

            </style>
            <div className="modal-background" onClick={()=>setActive("")}></div>
                <div className="modal-content">
                    <div className="box">
                        <h1 className="model-title title">{isNew==true?"Create new customer":"Update customer"}</h1>
                        <form onSubmit={handleSubmit(sendToServer)}>
                            <div className="columns">
                                <div className="column">
                                    <label className="label">Company</label>
                                    <input type="text"  
                                    placeholder="Enter Company"
                                    defaultValue={!isNew?info.company:""}
                                    name="company"
                                    ref={register}
                                    className="input is-small" />
                                </div>
                            </div>
                            <input type="hidden" defaultValue={!isNew?info.id:""} name="id" ref={register} />
                            <div className="columns">
                                <div className="column">
                                    <label className="label">Name</label>
                                    <input type="text"  
                                    placeholder="Enter Name"
                                    defaultValue={!isNew?info.name:""}
                                    name="name"
                                    ref={register}
                                    className="input is-small" />
                                </div>
                                <div className="column">
                                <label className="label">Email</label>
                                    <input type="text" className="input is-small" 
                                    name="email"
                                    defaultValue={!isNew?info.email:""}
                                    ref={register}
                                    placeholder="Email" />
                                </div>
                            </div>
                            <div className="columns">
                                <div className="column">
                                <label className="label">Address</label>
                                    <input type="text" className="input is-small" 
                                    defaultValue={!isNew?info.address:""}
                                    name="address"
                                    ref={register}
                                    placeholder="Address" />
                                </div>
                                <div className="column is-2">
                                <label className="label">zipCode</label>
                                    <input type="text" className="input is-small" 
                                    defaultValue={!isNew?info.zipcode:""}
                                    name="zipcode"
                                    ref={register}
                                    placeholder="Zip Code" />
                                </div>
                            </div>
                            <div className="columns">
                                <div className="column">
                                <label className="label">State</label>
                                    <input type="text" className="input is-small"
                                    name="state"
                                    defaultValue={!isNew?info.state:""}
                                    ref={register}
                                    placeholder="State" />
                                </div>
                                <div className="column">
                                <label className="label">City</label>
                                    <input type="text" className="input is-small"
                                    name="city"
                                    defaultValue={!isNew?info.city:""}
                                    ref={register}
                                    placeholder="City" />
                                </div>
                            </div>
                            <div className="columns">
                                <div className="column">
                                <label className="label">GST</label>
                                    <input type="text" className="input is-small"
                                    defaultValue={!isNew?info.gst:""}
                                    name="gst"
                                    ref={register}
                                    placeholder="GST" />
                                </div>
                                <div className="column">
                                <label className="label">Mobile Number</label>
                                    <input type="text" className="input is-small"
                                    name="mobile"
                                    defaultValue={!isNew?info.mobile:""}
                                    ref={register}
                                    placeholder="Mobile Number" />
                                </div>
                            </div>
                            {/* <div className="columns">
                                
                            </div> */}
                            <div className="columns">
                                <div className="column">
                                <label className="label">Aadhar Number</label>
                                    <input type="text" className="input is-small"
                                    name="addhar"
                                    defaultValue={!isNew?info.addhar:""}
                                    ref={register}
                                    placeholder="Aadhar Number" />
                                </div>
                            </div>

                            <div className="columns">
                                <div className="column">
                                    <button type="submit" className="button is-primary is-small" >
                                    {isNew===true?"Create Customer":"Update Customer"}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    {/* <!-- Any other Bulma elements you want --> */}
                </div>
            <button className="modal-close is-large" aria-label="close" onClick={()=>setActive("")}></button>
        </div>
    )
}
export default CustomerForm