import Layout from '../../components/layout'
import {allVendorQuery} from '../../lib/graphql'
import {TableLoading} from '../../components/skeleton'
import { useState} from 'react'
import  {FontAwesomeIcon}  from '@fortawesome/react-fontawesome'
import {faPen, faSearch, faAngleDown,faArrowDown, faArrowUp,faTimes, faEllipsisV,faEllipsisH} from '@fortawesome/free-solid-svg-icons'
import {useQuery, useLazyQuery} from '@apollo/react-hooks'
import Modal from '../../components/vendorModel'
import { useEffect } from 'react'

const Records = ({items,getVendor,search,setSearch}) =>{
    const [active,setActive] = useState("")
    const [info,setInfo] = useState({})
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


        <table className="table is-fullwidth is-hoverable">
            <thead>
                <tr>
                    <th className="_w20" >
                        {/* <div> */}
                            <span>Name</span>
                            {/* <span style={{marginLeft:"10px"}}><FontAwesomeIcon icon={faArrowUp} /></span> */}
                        {/* </div> */}
                        
                    </th>
                    {/* <th className="_w20">Address</th> */}
                    <th className="_w20">Company</th>
                    {/* <th className="_w10">Email</th> */}
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
                            {/* <a> */}
                                {e.node.name}
                                <span className="sub">{e.node.email}</span>
                            {/* </a> */}
                        </td>
                        <td>
                            {e.node.company}
                        </td>
                        {/* <td>
                            {e.node.email}
                        </td> */}
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
                            {/* <div style={{zIndex:1001,position:'absolute'}}>
                            
                            <div className="s_menu" role="menu" style={{position:'absolute',background:'white',padding:'5px 0',boxShadow:"0 2px 10px 0 rgba(0,0,0,0.2)"}} tabIndex={-1}>
                                <div className="s_menuitem" role="menuitem">Edt</div>
                                <div className="s_menuitem" role="menuitem">Delete</div>
                            </div>
                            </div>                        */}
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