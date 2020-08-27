import Layout from '../components/layout'
import {FullPageLoading} from '../components/skeleton'
import {getAllCustomersQuery,createOrUpdateCustomerQuery} from '../lib/graphql'
import {useQuery,useMutation, useLazyQuery} from '@apollo/react-hooks'

import  {FontAwesomeIcon}  from '@fortawesome/react-fontawesome'
import {faPen, faPlus} from '@fortawesome/free-solid-svg-icons'
// import {} from '@fortawesome/fontawesome-free'
import {useForm} from 'react-hook-form'
import { faTrashAlt,faEdit } from '@fortawesome/free-regular-svg-icons'
import { useState } from 'react'
import { useEffect } from 'react'
// import {useMutation} from '@apollo/react-hooks'

const Modal = ({active,setActive,isNew, info=null})=>{
    const [createCustomer,{data,loading}] = useMutation(createOrUpdateCustomerQuery)
    const {register,setValue,handleSubmit,reset} = useForm()
    console.log(info)
    
    useEffect(()=>{
        if(info!=null)
        {
            reset({name:info.name,address:info.address,email:info.email,id:info.id,gst:info.gst,mobile:info.mobile})
        }
        
    },[info])


    const sendToServer=(e)=>{
        // e.preventDefault()
        console.log(e)
        createCustomer({
            variables:{
                name: e.name,
                id: e.id,
                mobile: e.mobile,
                gst: e.gst,
                email: e.email,
                address: e.address,
                isNew: isNew

            },
            optimisticResponse:true,
            update:(cache,{data})=>{
                if(data!=true)
                {
                    const existingCache = cache.readQuery({query:getAllCustomersQuery})
                    if(isNew === true){
                        console.log(data)
                        existingCache.customers.edges.push({"node":data.createCustomer.customer,"__typename":"CustomerNodeEdge"})
                        // console.log(existingCache)
                    }
                    else{
                        for(var i=0;i<existingCache.customers.edges.length;i++)
                        {
                            if(existingCache.customers.edges[i].node.id===e.id)
                            {
                                existingCache.customers.edges[i].node.name = data.createCustomer.customer.name
                                existingCache.customers.edges[i].node.address = data.createCustomer.customer.address
                                existingCache.customers.edges[i].node.mobile = data.createCustomer.customer.mobile
                                existingCache.customers.edges[i].node.gstNumber = data.createCustomer.customer.gstNumber
                                existingCache.customers.edges[i].node.email = data.createCustomer.customer.email
                            }

                        }
                    }
                    cache.writeQuery({
                        query:getAllCustomersQuery,
                        data:existingCache
                    })
                    if(isNew===true)
                    {
                        reset({"name":"","gst":"","mobile":"","address":"","email":""})
                    }
                    // reset({"name":"","gst":"","mobile":"","address":"","email":""})
                    
                    
                    setActive("")
                }
            }
        })

        // createCategory({
        //     variables:{name:name},
        //     optimisticResponse:true,
        //     update:(cache,{data})=>{
        //         if(data!=true){
        //             console.log(data)
        //             const existingCache = cache.readQuery({query:allCategory})
        //             existingCache.categories.edges.push({"node":data.createCategory.category,"__typename":"CategoryNodeEdge"})
        //             console.log(existingCache)
                    
        //             cache.writeQuery({
        //                 query:allCategory,
        //                 data:existingCache
        //             })

        //             setActive("")

                    
        //         }
        //     }
        // })   
    }
    
    return(
        <div className={`modal ${active}`} >
            <style jsx>{`
            .column{
                padding:0;
                margin-bottom:10px;
            }
            .modal-content, .modal-card {
                margin: 0 auto;
                width: 540px;
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
                                    <label className="label">Name</label>
                                    <input type="text"  
                                    placeholder="Enter Name"
                                    defaultValue={!isNew?info.name:""}
                                    // value={info.name}
                                    // onChange={(e)=>setName(e.target.value)} 
                                    name="name"
                                    ref={register}
                                    className="input is-small" />
                                </div>
                                {/* <div className="column is-2">
                                    <button type="submit" className={`button is-small ${loading==true?"is-loading":"not"}`}>Create</button>
                                </div> */}
                            </div>
                            <input type="hidden" defaultValue={!isNew?info.id:""} name="id" ref={register} />
                            <div className="columns">
                                <div className="column">
                                <label className="label">Address</label>
                                    <input type="text" className="input is-small" 
                                    defaultValue={!isNew?info.address:""}
                                    name="address"
                                    ref={register}
                                    placeholder="Address" />
                                </div>
                            </div>
                            <div className="columns">
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
                                <label className="label">GST</label>
                                    <input type="text" className="input is-small"
                                    defaultValue={!isNew?info.gst:""}
                                    name="gst"
                                    ref={register}
                                    placeholder="GST" />
                                </div>
                            </div>
                            <div className="columns">
                                <div className="column">
                                <label className="label">Mobile Number</label>
                                    <input type="text" className="input is-small"
                                    name="mobile"
                                    defaultValue={!isNew?info.mobile:""}
                                    ref={register}
                                    placeholder="Mobile Number" />
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



const CRecords = ({items}) =>{
    const [active,setActive] = useState()
    const [info,setInfo] = useState({})
    
    return(
        <>
        <Modal active={active} setActive={setActive} isNew={false} info={info} />
        
        {
            items.length === 0?
            <h1 className="title" style={{textAlign:'center'}}>No Data Found</h1>
        :
        
        <table className="table is-fullwidth is-hoverable is-bordered">
                <thead>
                    <tr>
                        <th className="_w20" >Name</th>
                        <th className="_w20">Address</th>
                        <th className="_w10">Email</th>
                        <th className="_w10">Mobile</th>
                        <th className="_w10">GST</th>
                        
                        <th className="_w5"></th>
                        {/* <th className="w5"></th> */}
                        {/* <th className="w5"></th> */}
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((e)=>{
                        return(<tr key={e.node.id}>
                            <td className="_heading _w30">
                                {/* <a> */}
                                    {e.node.name}
                                    {/* <span className="sub">
                                        {e.node.email}
                                    </span> */}
                                {/* </a> */}
                            </td>
                            <td>
                                {e.node.address}
                            </td>
                            
                            <td>
                                {e.node.email}
                            </td>
                            <td>
                                {e.node.mobile}
                            </td>
                            <td>
                                {e.node.gstNumber}
                            </td>


                            
                            <td className="hover" 
                            
                            onClick={()=>{setActive("is-active"),setInfo({"name":e.node.name,"address":e.node.address,"email":e.node.email,"mobile":e.node.mobile,"gst":e.node.gstNumber,"id":e.node.id}) }}
                            

                            >
                                <FontAwesomeIcon icon={faPen} color="#00d1b2" />
                            </td>
                            {/* <td 
                            // onClick={()=>{setdelActive("is-active"),setName(e.node.name),setId(e.node.id)}}
                            >
                                <FontAwesomeIcon icon={faTrashAlt} color="red"/>
                            </td> */}

                            {/*                                                         
                                <td className="hover">
                                    <button className="button is-small is-rounded is-primary is-light"><FontAwesomeIcon icon={faPlus} /> <span style={{marginLeft:"3px"}}>Add</span></button>
                                </td> 
                            */}
                        </tr>
                        
                        )
                    })}
                    </tbody>
                    
            </table>
            }
            </>
    )
}


const Customers = () =>{
    const {data,loading} = useQuery(getAllCustomersQuery,{variables:{'search':''}})
    const [active,setActive] = useState("")
    const [text,setText] = useState("")
    const [searchData,{data:udata,loading:uloading}] = useLazyQuery(getAllCustomersQuery)
    
    useEffect(()=>{
        // console.log(text)
        // if(text.length>1){
            searchData({variables:{"search":text}})
            // data = udata
            // loading = uloading

        // }
    },[text])
    
    return(
        <Layout title={"Customers"} text={text} setText={setText}>
            <div>
                < Modal active={active} setActive={setActive} isNew={true} />
                <div className="topHeading">
                    <h2>Customers</h2>
                <div>
                    <button type="button" onClick={()=>setActive("is-active")} className="button is-rounded is-small is-primary">Add customer</button>
                </div>
                </div>

            </div>

            {
            loading===true || uloading==true?
                <FullPageLoading />
                :<CRecords 
                
                items={
                    udata===undefined?    
                    data.customers.edges : udata.customers.edges
                } 
                
                />
            }



        </Layout>
    )
}

export default Customers;