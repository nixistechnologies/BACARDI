import Layout from '../../components/layout'
import {allVendorQuery, deleteVendor} from '../../lib/graphql'
import {TableLoading} from '../../components/skeleton'
import { useState} from 'react'
import  {FontAwesomeIcon}  from '@fortawesome/react-fontawesome'
import {faPen, faSearch, faAngleDown,faArrowDown, faArrowUp,faTimes, faEllipsisV,faEllipsisH, faTrash} from '@fortawesome/free-solid-svg-icons'
import {faTrashAlt} from '@fortawesome/free-regular-svg-icons'
import {useQuery, useLazyQuery,useMutation} from '@apollo/react-hooks'
import Modal from '../../components/vendorModel'
import { useEffect } from 'react'

const Records = ({items,getVendor,search,setSearch}) =>{
    const [active,setActive] = useState("")
    const [info,setInfo] = useState({})
    // const [info,setInfo] = useState({})
    const [delactive,setdelActive] = useState()
    const [id,setId] = useState("")
    const [deleteC,{data,loading}] = useMutation(deleteVendor)

    const deleteFromServer=(id)=>{
        console.log(id)
        deleteC(
            {
                variables:{"id":id},
                optimisticResponse:true,
                update:(cache,{data})=>{
                    const existingCache = cache.readQuery({query:allVendorQuery,variables:{"search":""}})
                    console.log(existingCache)
                    const nCache = existingCache.vendors.edges.filter((e)=>e.node.id!=id)
                    console.log(nCache)
                    setdelActive("")
                    const c ={"vendors":{"edges":nCache,"__typename":"VendorNodeEdge"}}
                    cache.writeQuery({
                        query:allVendorQuery,
                        variables:{"search":""},
                        data:c
                      })
                }
        })
    }
    return (
        <>
        <Modal active={active} setActive={setActive} isNew={false} info={info} />
        {/* <div style={{overflow:'auto'}}>
            <form onSubmit={(e)=>{e.preventDefault(), console.log(e.currentTarget[0].value),getVendor({variables:{search:e.currentTarget[0].value}})  }}>
                <div className="field">
                <p className="control has-icons-left has-icons-right" style={{width:'200px',float:'right'}}>
                    <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)} className="input is-small" name="usearch" placeholder="search.." />
                    <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faSearch} />
                    </span>
                </p>
                </div>
            </form>
        </div> */}


        <table className="table is-fullwidth is-hoverable is-bordered">
            <thead>
                <tr>
                    <th>SN.</th>
                    <th className="_w20" >
                        {/* <div> */}
                            <span>Name</span>
                            {/* <span style={{marginLeft:"10px"}}><FontAwesomeIcon icon={faArrowUp} /></span> */}
                        {/* </div> */}
                        
                    </th>
                    {/* <th className="_w20">Address</th> */}
                    <th className="_w20">Company</th>
                    <th className="_w10">Email</th>
                    {/* <th className="_w20">Zip</th> */}
                    <th className="_w10">City</th>
                    <th className="_w10">State</th>
                    
                    <th className="_w10">Mobile</th>
                    {/* <th className="_w10">GST</th> */}
                    
                    <th className="_w5" colSpan={2}></th>
                    {/* <th className="w5"></th> */}
                    {/* <th className="w5"></th> */}
                </tr>
            </thead>
            <tbody>
            {items.map((e,i)=>{
                return(
                    <tr key={e.node.id}>
                        <td>{i+1}</td>
                        <td className="_heading _w30">
                            {/* <a> */}
                                {e.node.name}
                                {/* <span className="sub">{e.node.email}</span> */}
                            {/* </a> */}
                        </td>
                        <td className="mw300">
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
                        <td
                            onClick={()=>{setInfo({"id":e.node.id,"name":e.node.name}),setdelActive("is-active")}}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} color={"red"} />
                        </td>
                        
                    </tr>
                        
                        )
                    })}
            </tbody>
        </table>
        <div className={`modal ${delactive}`} >
            <div className="modal-background" onClick={()=>setdelActive("")}></div>
                <div className="modal-content">
                    <div className="box" style={{width:"400px",margin:"auto"}}>
                        <h1 className="model-title title">Do you want to delete <b style={{textTransform:'uppercase'}}>{info.name}</b> ?</h1>
                        <div className="columns">
                            <div className="column" onClick={()=>deleteFromServer(info.id)}>
                                <button className={`button is-danger is-small ${loading==true?"is-loading":"not"}`} style={{width:"100%"}}>Delete</button>
                            </div>
                            <div className="column">
                                <button className="button is-primary is-small" style={{width:"100%"}} onClick={()=>setdelActive("")}>Cancel</button>
                            </div>
                            </div>
                        </div>
                    </div>                
                <button className="modal-close is-large" aria-label="close"></button>
            </div>
        </>
    )

}


const Vendor = () =>{
    const {data,loading} = useQuery(allVendorQuery,{variables:{search:""}})
    const [getVendor,{data:vdata,loading:vloading}] = useLazyQuery(allVendorQuery)
    const [active,setActive] = useState("")
    const [search,setSearch] = useState("")
    const [show,setShow] = useState(false)
    const [text,setText] = useState("")

    // const close=()=>{

    // }
    useEffect(()=>{
        getVendor({variables:{"search":text}})
    },[text])
    
    const Showing=()=>{
        setShow(true)
        console.log("show")
    }
    return(
        <Layout title={"Vendors | Bacardi"} text={text} setText={setText}>
            
            <div>
                <Modal active={active} setActive={setActive} isNew={true} />
                <div className="topHeading">
                    <div style={{width:"100%",display:'flex',alignItems:'center'}}>
                        <h2 style={{width:'auto'}} onClick={()=>Showing()}>Vendors</h2>
                        
                        
                        
                        
                        

                        {/* <div>
                            <input type="text" className="input is-small" placeholder="search"/>
                        </div>
                        

                        <div style={{marginRight:'10px'}}>
                            <FontAwesomeIcon icon={faSearch}  />
                        </div> */}
                    </div>

                    
                    <div>
                        <button type="button" onClick={()=>setActive("is-active")} className="button is-rounded is-small is-primary">Add vendor</button>
                    </div>
                </div>

                {
                loading===true || vloading ?
                <TableLoading />
                :<Records items={vdata===undefined?data.vendors.edges:vdata.vendors.edges} getVendor={getVendor} search={search} setSearch={setSearch} />
            }

            </div>

        </Layout>
    )
}
export default Vendor;