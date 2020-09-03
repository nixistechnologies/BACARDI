import Layout from "../components/layout"
import { useQuery } from "react-apollo"
import { getPersonalQuery } from "../lib/graphql"
import { TableLoading } from "../components/skeleton"
import { useState,useEffect } from "react"
import { useForm } from "react-hook-form"
import { server } from "../lib/settings"
import dynamic from 'next/dynamic'

// const Container=()=>{
//     return 
// }

const Bank = dynamic(()=>import('../components/profile/bank'),{loading:()=><TableLoading />})
const Address = dynamic(()=>import('../components/profile/address'),{loading:()=><TableLoading />})
const Firm = dynamic(()=>import('../components/profile/firmInfo'),{loading:()=><TableLoading />})
const Personal = dynamic(()=>import('../components/profile/personal'),{loading:()=><TableLoading />})


const Profile=()=>{
    // const {data:C,loading} = useQuery(getPersonalQuery)
    const [isEdit, setIsEdit] = useState(false)
    const [tabs,setTabs]=useState({})
    const { register, handleSubmit,setValue } = useForm({});
    
    useEffect(()=>{        
        setTabs({"personal":true,"firm":false,"bank":false,"address":false})
    },[])


    return <>
    <Layout title="profile">
        {/* {loading==true?
        <TableLoading />
        : */}
        <>
            <div className="topHeading">
                <h2>Welcome to Profile</h2>
            </div>
            <div style={{background:'white',padding:'20px'}} className="card">
                <div>
                    <div className="tabs">
                        <ul>
                            <li className={`${tabs.personal==true && "is-active"}`}><a onClick={()=>setTabs({personal:true,firm:false,bank:false,address:false})} >Personal Info</a></li>
                            <li className={`${tabs.firm==true && "is-active"}`}><a onClick={()=>{setTabs({personal:false,firm:true,bank:false,address:false})} } >Firm</a></li>
                            <li className={`${tabs.address==true && "is-active"}`}><a onClick={()=>setTabs({personal:false,firm:false,bank:false,address:true})} >Address</a></li>
                            <li className={`${tabs.bank==true && "is-active"}`}><a onClick={()=>setTabs({personal:false,firm:false,bank:true,address:false})} >Bank</a></li>
                        </ul>
                    </div>
                    <div style={{width:'70%'}}>
                        { tabs.personal ==true &&
                            <Personal />
                            
                        }
                        {
                         tabs.firm == true &&
                            <Firm />
                        }
                        {
                         tabs.address == true &&
                            <Address />
                        }
                        {
                         tabs.bank == true &&
                            <Bank />
                        }
                    </div>
                </div>
            </div>


        </>
        {/* } */}
    </Layout>
    </>
}
export default Profile