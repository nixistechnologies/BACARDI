import Layout from '../../components/layout'
import {allVendorQuery} from '../../lib/graphql'
import {TableLoading} from '../../components/skeleton'
import { useState} from 'react'
import  {FontAwesomeIcon}  from '@fortawesome/react-fontawesome'
import {faPen} from '@fortawesome/free-solid-svg-icons'
import {useQuery} from '@apollo/react-hooks'
import Modal from '../../components/vendorModel'

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