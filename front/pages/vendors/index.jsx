import Layout from '../../components/layout'
import {allVendorQuery,createVendorQuery,stateQuery,cityByStateQuery} from '../../lib/graphql'
import {TableLoading} from '../../components/skeleton'
import { useState,useEffect } from 'react'
import  {FontAwesomeIcon}  from '@fortawesome/react-fontawesome'
import {faPen, faPlus,faAngleDown} from '@fortawesome/free-solid-svg-icons'
import {useQuery,useMutation,useLazyQuery} from '@apollo/react-hooks'
import {useForm} from 'react-hook-form'
// import {} from '..'
import Modal from '../../components/vendorModel'



// const Modal = ({active,setActive,isNew, info=null})=>{
//     const [createVendor,{data:cData,loading}] = useMutation(createVendorQuery)
//     const {register,setValue,handleSubmit,reset} = useForm()
//     const {data:stateList,loading:mloading} = useQuery(stateQuery)
//     const [stateDD,setstateDD] = useState("")
//     const [state,setState] = useState({name:"State",id:""})
//     const [city,setCity] = useState({name:"City",id:""})
//     const [cityDD,setcityDD] = useState("")
//     const [statefilter,setStateFilter] = useState("")
//     const [cityfilter,setCityFilter] = useState("")
//     const [getCity,{data:cityList,loading:cityLoading}] = useLazyQuery(cityByStateQuery)

//     console.log(info)

//     useEffect(()=>{
//         if(info)
//         {
//             reset({name:info.name,address:info.address,email:info.email,id:info.id,gst:info.gst,mobile:info.mobile,zipCode:info.zipCode,state:info.state,city:info.city})
//             // getState()
//             setState({name:info.state,id:info.stateId})
//             getCity({variables:{id:info.stateId}})
//             setCity({name:info.city,id:info.cityId})
            
//         }
        
//     },[info])

//     const sendToServer=(e)=>{
//         // e.preventDefault()
//         console.log(e)
//         createVendor({
//             variables:{
//                 "name": e.name,
//                 "email": e.email,
//                 "mobile": e.mobile,
//                 "company": e.company,
//                 "address": e.address,
//                 "city": city.id,
//                 "state": state.id,
//                 "zip": e.zipCode,
//                 "gst": e.gst,
//                 "id": e.id,
//                 "isNew": isNew

//             },
//             optimisticResponse:true,
//             update:(cache,{data})=>{
//                 if(data!=true)
//                 {
//                     const existingCache = cache.readQuery({query:allVendorQuery})
//                     if(isNew === true){
//                         console.log(data)
//                         existingCache.vendors.edges.push({"node":data.createVendor.vendor,"__typename":"VendorNodeEdge"})
//                     }
//                     else{
//                         console.log(existingCache)
//                         console.log(data)

//                         for(var i=0;i<existingCache.vendors.edges.length;i++)
//                         {
//                             if(existingCache.vendors.edges[i].node.id===e.id)
//                             {
//                                 existingCache.vendors.edges[i].node.name = data.createVendor.vendor.name
//                                 existingCache.vendors.edges[i].node.address = data.createVendor.vendor.address
//                                 existingCache.vendors.edges[i].node.mobile = data.createVendor.vendor.mobile
//                                 existingCache.vendors.edges[i].node.gst = data.createVendor.vendor.gst
//                                 existingCache.vendors.edges[i].node.email = data.createVendor.vendor.email
//                                 existingCache.vendors.edges[i].node.company = data.createVendor.vendor.company
//                                 existingCache.vendors.edges[i].node.zip = data.createVendor.vendor.zip
//                                 existingCache.vendors.edges[i].node.city.name = data.createVendor.vendor.city.name
//                                 existingCache.vendors.edges[i].node.state.name = data.createVendor.vendor.state.name
//                             }

//                         }
//                     }
//                     cache.writeQuery({
//                         query:allVendorQuery,
//                         data:existingCache
//                     })
//                     setActive("")
//                 }
//             }
//         })
        
 
//     }
    
//     return(
        
//         <div className={`modal ${active}`} >
//             <style jsx>{`
//             .column{
//                 padding:0;
//                 margin-bottom:10px;
//                 padding-right:5px;
//                 padding-left:5px;
//             }
//             .modal-content, .modal-card {
//                 margin: 0 auto;
//                 // width: 540px;
//             }
//             .my-d{
//                 display:none;
//                 position:absolute;
//                 width:100%;
//                 z-index:10;
//                 background:white;
//                 box-shadow:0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02);
//                 // height:135px;
//             }
//             .d-item{
//                 padding:5px;
//             }
//             .dd-active{
//                 display:block
//             }
//             .dn{
//                 display:none
//             }
//             .dd-list{
//                 position:absolute;
//                 width:100%;
//                 background:white;
//                 max-height:100px;
//                 overflow:scroll;
//                 z-index:100;
//                 box-shadow:0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02);
//             }

//         `}

//             </style>
//             <div className="modal-background" onClick={()=>setActive("")}></div>
//                 <div className="modal-content">
//                     <div className="box">
//                     {mloading===true?<TableLoading />:
//                         <>
//                         <h1 className="model-title title">{isNew==true?"Create new vendor":"Update vendor"}</h1>
//                         <form onSubmit={handleSubmit(sendToServer)}>
//                             <div className="columns">
//                                 <div className="column">
//                                 <label className="label">Company Name</label>
//                                 <input type="text"  
//                                     placeholder="Enter Company Name"
//                                     defaultValue={!isNew?info.company:""}
//                                     name="company"
//                                     ref={register}
//                                     className="input is-small" />
//                                 </div>
//                             </div>
//                             <div className="columns">
//                                 <div className="column">
//                                     <label className="label">Name</label>
//                                     <input type="text"  
//                                     placeholder="Enter Name"
//                                     defaultValue={!isNew?info.name:""}
//                                     name="name"
//                                     ref={register}
//                                     className="input is-small" />
//                                 </div>
//                                 <div className="column">
//                                 <label className="label">Email</label>
//                                     <input type="text" className="input is-small" 
//                                     name="email"
//                                     defaultValue={!isNew?info.email:""}
//                                     ref={register}
//                                     placeholder="Email" />
//                                 </div>
//                             </div>
//                             <input type="hidden" value={!isNew?info.id:""} name="id" ref={register} />
//                             <div className="columns">
//                                 <div className="column">
//                                 <label className="label">Address</label>
//                                     <input type="text" className="input is-small" 
//                                     defaultValue={!isNew?info.address:""}
//                                     name="address"
//                                     ref={register}
//                                     placeholder="Address" />
//                                 </div>
//                                 <div className="column is-2">
//                                 <label className="label">zipCode</label>
//                                     <input type="text" className="input is-small" 
//                                     name="zipCode"
//                                     ref={register}
//                                     placeholder="Zip Code" />
//                                 </div>
//                             </div>
//                             <div className="columns">
//                                 <div className="column">
//                                 <label className="label">State</label>
                                    
                                    
//                                     <div style={{position:'relative'}}>
//                                         <div type="text" className="input is-small" name="address" ref={register} onClick={()=>{setstateDD(stateDD==="dd-active"?"":"dd-active")}}>
//                                             <div style={{width:'100%'}}>
//                                                 <span>{state.name}</span>
//                                                 <div style={{float:'right'}}>
//                                                     <FontAwesomeIcon icon={faAngleDown} />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div>
//                                             <div className={`my-d dropdown-content ${stateDD}`}>
//                                                 <input type="text" className="input is-small" value={statefilter} onChange={(e)=>setStateFilter(e.target.value)} placeholder="Search state.." style={{border:0,outline:0,boxShadow:'none'}}/>
//                                                 <div className="dd-list">
//                                                     {stateList.states.edges.map(e=>{
//                                                         return ( e.node.name.toLocaleLowerCase().startsWith(statefilter)?
//                                                         <div className="d-item_" onClick={()=>{setState({name:e.node.name,id:e.node.id}),setCity({name:"City",id:""}),setCityFilter(""),setStateFilter(""), setstateDD(stateDD==="dd-active"?"":"dd-active"),getCity({variables:{id:e.node.id}}) }} key={e.node.id} value={e.node.id}> <a className="dropdown-item">{e.node.name}</a></div>
//                                                         :null
//                                                         )
//                                                     })}
//                                                 </div>
                                                
//                                             </div>
//                                         </div>
//                                     </div>


//                                 </div>
                                
//                                 <div className="column">
//                                 <label className="label">City</label>
//                                     <div style={{position:'relative'}}>
//                                         <div type="text" className="input is-small" name="city" onClick={()=>{setcityDD(cityDD==="dd-active"?"":"dd-active")}}>
//                                             <div style={{width:'100%'}}>
//                                                 <span>{city.name}</span>
//                                                 <div style={{float:'right'}}>
//                                                     <FontAwesomeIcon icon={faAngleDown} />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div>
//                                             <div className={`my-d dropdown-content ${cityDD}`}>
//                                                 <input type="text" className="input is-small" value={cityfilter} onChange={(e)=>setCityFilter(e.target.value)} placeholder="Search city.." style={{border:0,outline:0,boxShadow:'none'}}/>
//                                                 <div className="dd-list">
                                                    
//                                                     { cityList !=undefined && cityLoading!=true? cityList.city.edges.map(e=>{
//                                                             return ( e.node.name.toLocaleLowerCase().startsWith(cityfilter)?
//                                                             <div className="d-item_" onClick={()=>{setCity({name:e.node.name,id:e.node.id}),setcityDD(cityDD==="dd-active"?"":"dd-active") }} key={e.node.id} value={e.node.id}> <a className="dropdown-item">{e.node.name}</a></div>
//                                                             :null
//                                                             )
//                                                         }):null
//                                                     }

//                                                 </div>
                                                
//                                             </div>
//                                         </div>
//                                     </div>





//                                 </div>
                                                                
//                             </div>
//                             <div className="columns">
                                
//                             </div>
//                             <div className="columns">
//                                 <div className="column">
//                                 <label className="label">GST</label>
//                                     <input type="text" className="input is-small"
//                                     defaultValue={!isNew?info.gst:""}
//                                     name="gst"
//                                     ref={register}
//                                     placeholder="GST" />
//                                 </div>
//                                 <div className="column">
//                                 <label className="label">Mobile Number</label>
//                                     <input type="text" className="input is-small"
//                                     name="mobile"
//                                     defaultValue={!isNew?info.mobile:""}
//                                     ref={register}
//                                     placeholder="Mobile Number" />
//                                 </div>
//                             </div>

//                             <div className="columns">
//                                 <div className="column">
//                                     <button type="submit" className={`button is-primary is-small ${loading?"is-loading":""}`} >
//                                     {isNew===true?"Create Vendor":"Update Vendor"}</button>
//                                 </div>
//                             </div>
//                         </form>
//                         </>}
//                     </div>
//                 </div>
//             <button className="modal-close is-large" aria-label="close" onClick={()=>setActive("")}></button>
//         </div>
//     )
// }




const Records = ({items}) =>{
    const [active,setActive] = useState("")
    const [info,setInfo] = useState({})
    return (
        <>
        <Modal active={active} setActive={setActive} isNew={false} info={info} />
        <table className="table is-fullwidth is-hoverable">
            <thead>
                <tr>
                    <th className="_w20" >Name</th>
                    {/* <th className="_w20">Address</th> */}
                    <th className="_w20">Company</th>
                    <th className="_w10">Email</th>
                    {/* <th className="_w20">Zip</th> */}
                    <th className="_w10">City</th>
                    <th className="_w10">State</th>
                    
                    <th className="_w10">Mobile</th>
                    {/* <th className="_w10">GST</th> */}
                    
                    <th className="_w5"></th>
                    {/* <th className="w5"></th> */}
                    {/* <th className="w5"></th> */}
                </tr>
            </thead>
            <tbody>
            {items.map((e)=>{
                return(
                    <tr key={e.node.id}>
                        <td className="_heading _w30">
                            <a>
                                {e.node.name}
                            </a>
                        </td>
                        <td>
                            {e.node.company}
                        </td>
                        <td>
                            {e.node.email}
                        </td>
                        {/* <td>
                            {e.node.address}
                        </td> */}
                        {/* <td>
                            {e.node.zipCode}
                        </td> */}
                        <td>
                            {e.node.city.name}
                        </td>
                        <td>
                            {e.node.state.name}
                        </td>                                                                        
                        
                        <td>
                            {e.node.mobile}
                        </td>
                        {/* <td>
                            {e.node.gst}
                        </td> */}
                        
                        <td className="hover" 
                            onClick={()=>{setActive("is-active"),setInfo({"id":e.node.id,"name":e.node.name,"address":e.node.address,"city":e.node.city.name,"cityId":e.node.city.id,"stateId":e.node.state.id, "state":e.node.state.name,"zipCode":e.node.zipCode,"gst":e.node.gst,"email":e.node.email,"mobile":e.node.mobile,"company":e.node.company}) }}
                        >
                            <FontAwesomeIcon icon={faPen} color="#00d1b2" />
                        </td>
                    </tr>
                        
                        )
                    })}
            </tbody>
        </table>
        </>
    )

}


const Vendor = () =>{
    const {data,loading} = useQuery(allVendorQuery)
    const [active,setActive] = useState("")
    return(
        <Layout title={"Vendors | Bacardi"}>
            <div>
                <Modal active={active} setActive={setActive} isNew={true} />
                <div className="topHeading">
                    <h2>Vendors</h2>
                    <div>
                        <button type="button" onClick={()=>setActive("is-active")} className="button is-rounded is-small is-primary">Add vendor</button>
                    </div>
                </div>

                {
                loading===true?
                <TableLoading />
                :<Records items={data.vendors.edges} />
            }

            </div>

        </Layout>
    )
}
export default Vendor;