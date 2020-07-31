import  {FontAwesomeIcon,}  from '@fortawesome/react-fontawesome'
// import { faTrashAlt,faEdit, faHospital, faBuilding } from '@fortawesome/free-regular-svg-icons'
import {faAngleRight} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import Cookie from "js-cookie";
import $ from 'jquery'
const SideBar = ({sidebar,route}) =>{
    const Logout = () =>{
        console.log("logout")
        Cookie.remove("token")
        // const r = Router()
        // r.push("/login") 
        // Router.push("/login")
        route.push("/login")
    }
    const Toggle=(e)=>{
        // console.log(e.target.classList.value)
        if(e.target.classList.value=="label"){
            $(e.target.parentElement.nextElementSibling).toggle({duration:300})
        }
        else if(e.target.classList.value.startsWith("svg-inline-"))
        {
            console.log(e.target.parentElement.parentElement.nextElementSibling)
            $(e.target.parentElement.parentElement.nextElementSibling).toggle()
        }
        else{
            $(e.target.nextElementSibling).slideToggle({duration:300})
        }

        // console.log($(e).children)
        // e.target.nextSlibling.classList.toggle('hidden')
        // console.log(e.target.nextSibling)
        // $(e.target.nextSibling).toggle()
        // console.log($(e))
    }
    
    return(
        // <div style={{display:sidebar===true?'block':'none'}}>
        
        <div className="sidebar">
            <div className="_side">
                <div className="navbar-brand c_brand">
                    <Link href="/">
                        <a className="navbar-item">
                            <h1 className="is-4 custom-brand">BACARDI</h1>
                        </a>
                    </Link>

                </div>
                <aside className="menu" style={{padding:"10px"}}>
                <p className="menu-label">
                    General
                </p>
                <ul className="menu-list">
                    <li>
                        <div className="item">
                            <Link href="/">
                                <a className={route=="/"?"active":"not"}>
                                    Dashboard
                                </a>
                            </Link>
                        </div>
                        </li>
                    <li>
                        <Link href="/customers">
                            <a className={route.startsWith("/customers") ?"active":"not"}>Customers</a>
                        </Link>
                        <Link href="/vendors">
                            <a className={route.startsWith("/vendors") ?"active":"not"}>Vendors</a>
                        </Link>
                    </li>
                </ul>
                <p className="menu-label">
                    Team
                </p>
                <ul className="menu-list">
                    <li><a onClick={(e)=>Toggle(e)}>
                        Products
                        <span style={{float:"right"}}>
                            <FontAwesomeIcon icon={faAngleRight}/>
                        </span>
                        </a>
                        <ul className="child_" style={{display:route.startsWith("/products") || route.startsWith("/category")?"inherit":"none"}}>
                            <li>
                                <Link href="/products/category">
                                    <a className={route.startsWith("/products/category") ||route.startsWith("/category") ?"is-active":"not"}>Categories</a>
                                </Link>
                            </li>
                            {/* <li><a>SubCategory</a></li> */}
                            <li>
                                <Link href="/products">
                                    <a className={route==="/products"?"is-active":"not"}>
                                        Products
                                    </a>
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a style={{fontWeight:route.startsWith("/sales")?"bold":"normal"}} onClick={Toggle}>
                            Sales
                            <span style={{float:"right"}}>
                                <FontAwesomeIcon icon={faAngleRight}/>
                            </span>
                            </a>
                        
                        <ul className="child_" style={{display:route.startsWith("/sales")?"inherit":"none"}}>
                            <li className="is-active">
                            <Link href="/sales/add_new">
                                <a className={route.startsWith("/sales/add_new")?"is-active":"not"}>Add new</a>
                            </Link>
                                </li>
                            <li>
                                <Link href="/sales/history">
                                <a className={route.startsWith("/sales/history")?"is-active":"not"}>All Sales</a>
                                </Link>
                                </li>
                                
                        </ul>
                    </li>
                    <li><a onClick={(e)=>Toggle(e)}>
                        Purchase
                        <span style={{float:"right"}}>
                            <FontAwesomeIcon icon={faAngleRight}/>
                        </span>
                        </a>
                        <ul className="child_">
                            <li><a>Add new</a></li>
                            <li><a>All Sales</a></li>
                        </ul>
                    </li>
                </ul>

                </aside>
            </div>
        </div>
        // </div>


        
            // <div className="sidebar">
            //     <div className="_side">
            //         {/* {route} */}
            //         <div className="navbar-brand c_brand">
            //             <Link href="/">
            //                 <a className="navbar-item">
            //                     <h1 className="is-4 custom-brand">BACARDI</h1>
            //                 </a>
            //             </Link>

            //         </div>
            //         <aside className="menu" style={{padding:"10px"}}>
            //             <div className="menu-list">
            //                 <div className={route=="/" ||route.startsWith("/detail/")  ?"item active":"item"} >
            //                 <Link href="/" >
            //                     <a>
            //                             <div className="inner_block">
            //                                 <div className="icn-block">
            //                                     <FontAwesomeIcon icon={faHome} className="icon_" />
            //                                 </div>
            //                                 <h1 className="label">Product</h1>
            //                             </div>
            //                     </a>
            //                 </Link>
            //                 </div>

            //                 <div className={route.startsWith("/billing")?"item active":"item"}>
                                
            //                         <div>
            //                             <div className="inner_block"  onClick={(e)=>Toggle(e)}>
            //                                 <div className="icn-block">
            //                                     <FontAwesomeIcon icon={faList} className="icon_"/>
            //                                 </div>
            //                                 <h1 className="label">Billing</h1>
            //                             </div>
            //                             <div className="_child" style={{background:"white",padding:"0.5rem 0 0.5rem 1.5rem"}}>
            //                                 <div style={{borderLeft:"1px solid grey"}}>
            //                                     <div style={{padding:"3px 20px"}}>Add</div>
            //                                     <div style={{padding:"3px 20px"}}>old</div>
            //                                 </div>

            //                             </div>

            //                         </div>     
                                                    
            //                 </div>

            //                 <div className={route.startsWith("/report")?"item active":"item"}>
            //                     <Link href="/reports">
            //                         <div className="inner_block">
            //                             <div className="icn-block">
            //                                 <FontAwesomeIcon icon={faReceipt} className="icon_"/>
            //                             </div>
            //                             <h1 className="label">Report</h1>
            //                         </div>
            //                     </Link>
                                
            //                 </div>
            //                 <div className={route.startsWith("/history")?"item active":"item"}>
            //                     <Link href="/history">
            //                         <div className="inner_block">
            //                             <div>
            //                                 <FontAwesomeIcon icon={faHistory} className="icon_"/>
            //                             </div>
                                        
            //                             <h1 className="label">History</h1>
            //                         </div>
            //                     </Link>

                                
            //                 </div>
            //                 <div className={route.startsWith("/profile")?"item active":"item"}>
            //                     <Link href="/profile">
            //                         <div className="inner_block">
            //                         <div>
            //                             <FontAwesomeIcon icon={faUser} className="icon_"/>
            //                         </div>
                                        
            //                             <h1 className="label">Profile</h1>
            //                         </div>
            //                     </Link>
                                
            //                 </div>
            //                 <div style={{position:'fixed',bottom:10,width:'10%'}} className="_item_" onClick={Logout}>
            //                     <div  className="inner_block_" style={{
            //                         fontSize: "15px",
            //                         padding: "0.5rem 0.75rem",
            //                         lineHeight: "1.5",
            //                         cursor: "pointer",
            //                         display: "flex",
            // }}>
            //                         <FontAwesomeIcon icon={faSignOutAlt} className="icon_" color="rgba(255,0,0,0.8)" />
            //                         <h1 className="label" style={{marginLeft:'10px',color:"rgba(255,0,0,0.8)"}}>Logout</h1>

            //                     </div>
            //                 </div>
            //             </div>

            //         </aside>
            //     </div>
            // </div>
        
    )
}

export default SideBar