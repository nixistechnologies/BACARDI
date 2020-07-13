import  {FontAwesomeIcon,}  from '@fortawesome/react-fontawesome'
import { faTrashAlt,faEdit, faHospital, faBuilding } from '@fortawesome/free-regular-svg-icons'
import {faHome, faList, faReceipt, faHistory, faUser, faSignOutAlt} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import Cookie from "js-cookie";
const SideBar = ({sidebar,route,}) =>{
    const Logout = () =>{
        console.log("logout")
        Cookie.remove("token")
        // const r = Router()
        // r.push("/login") 
        // Router.push("/login")
        router.push("/login")
    }
    
    return(
        // <div style={{display:sidebar===true?'block':'none'}}>
            <div className="sidebar">
                <div className="_side">
                    {/* {route} */}
                    <div className="navbar-brand c_brand">
                        <Link href="/">
                            <a className="navbar-item">
                                <h1 className="is-4 custom-brand">BACARDI</h1>
                            </a>
                        </Link>

                    </div>
                    <div className={route=="/" ||route.startsWith("/detail/")  ?"item active":"item"} >
                    <Link href="/" >
                        <div>
                                <div className="inner_block">
                                    <div className="icn-block">
                                        <FontAwesomeIcon icon={faHome} className="icon_" />
                                    </div>
                                    <h1 className="label">Product</h1>
                                </div>
                        </div>
                    </Link>
                    </div>

                    <div className={route.startsWith("/billing")?"item active":"item"}>
                        <Link href="/billing">
                            <div className="inner_block">
                                <div className="icn-block">
                                    <FontAwesomeIcon icon={faList} className="icon_"/>
                                </div>
                                <h1 className="label">Billing</h1>
                            </div>     
                        </Link>                           
                    </div>

                    <div className={route.startsWith("/report")?"item active":"item"}>
                        <Link href="/reports">
                            <div className="inner_block">
                                <div className="icn-block">
                                    <FontAwesomeIcon icon={faReceipt} className="icon_"/>
                                </div>
                                <h1 className="label">Report</h1>
                            </div>
                        </Link>
                        
                    </div>
                    <div className={route.startsWith("/history")?"item active":"item"}>
                        <Link href="/history">
                            <div className="inner_block">
                                <div>
                                    <FontAwesomeIcon icon={faHistory} className="icon_"/>
                                </div>
                                
                                <h1 className="label">History</h1>
                            </div>
                        </Link>

                        
                    </div>
                    <div className={route.startsWith("/profile")?"item active":"item"}>
                        <Link href="/profile">
                            <div className="inner_block">
                               <div>
                                   <FontAwesomeIcon icon={faUser} className="icon_"/>
                               </div>
                                
                                <h1 className="label">Profile</h1>
                            </div>
                        </Link>
                        
                    </div>
                    <div style={{position:'fixed',bottom:10,width:'10%'}} className="_item_" onClick={Logout}>
                        <div  className="inner_block_" style={{
                            fontSize: "15px",
                            padding: "0.5rem 0.75rem",
                            lineHeight: "1.5",
                            cursor: "pointer",
                            display: "flex",
    }}>
                            <FontAwesomeIcon icon={faSignOutAlt} className="icon_" color="rgba(255,0,0,0.8)" />
                            <h1 className="label" style={{marginLeft:'10px',color:"rgba(255,0,0,0.8)"}}>Logout</h1>

                        </div>
                    </div>
                </div>
            </div>
        // </div>
    )
}

export default SideBar