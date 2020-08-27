import  {FontAwesomeIcon,}  from '@fortawesome/react-fontawesome'
// import { faTrashAlt,faEdit, faHospital, faBuilding } from '@fortawesome/free-regular-svg-icons'
import {faAngleRight, faChartBar,faMale, faUserTie,faThList, faHome, faUser, faUsers, faShippingFast, faPlus, faHistory, faSmile, faCog} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import Cookie from "js-cookie";
import $ from 'jquery'
import {useSelector} from 'react-redux'
import {useRouter} from 'next/router'
const SideBar = ({sidebar,route}) =>{
    const store = useSelector(state => state.width)
    const Logout = () =>{
        console.log("logout")
        Cookie.remove("token")
        // const r = Router()
        // console.log(r)
        // console.log(router)
        // r.push("/login")
        router.push("/login") 
        // Router.push("/login")
        // console.log(route)
        // route.push("/login")
    }
    const Toggle=(e)=>{
        // console.log(e.target)
        // console.log($(e))
        // if(e.target.classList.value=="s-bar-text"){
        //     $(e.target.parentNode.parentNode.parentNode.nextElementSibling).toggle({duration:300})
        // }
        if(e.target.localName=="path"){
            $(e.target.parentNode.parentNode.parentNode.parentNode.parentNode.nextElementSibling).toggle({duration:300})
        }
        else if(e.target.localName=="span"){
            $(e.target.parentNode.parentNode.parentNode.nextElementSibling).toggle({duration:300})
        }
        else if(e.target.localName=="a"){
            $(e.target.parentNode.nextElementSibling).toggle({duration:300})
        }
        
        else{
            $(e.target.parentNode.parentNode.parentNode.parentNode.nextElementSibling).toggle({duration:300})
        }


        // if(e.target.classList.value=="label"){
        //     $(e.target.parentElement.nextElementSibling).toggle({duration:300})
        // }
        // else if(e.target.classList.value.startsWith("svg-inline-"))
        // {
        //     console.log(e.target.parentElement.parentElement.nextElementSibling)
        //     $(e.target.parentElement.parentElement.nextElementSibling).toggle()
        // }
        // else{
        //     $(e.target.nextElementSibling).slideToggle({duration:300})
        // }

        // console.log($(e).children)
        // e.target.nextSlibling.classList.toggle('hidden')
        // console.log(e.target.nextSibling)
        // $(e.target.nextSibling).toggle()
        // console.log($(e))
    }
    // const r = new Router()
    // console.log(r)
    // console.log(route)
    const router = useRouter()
    return(
        // <div style={{display:sidebar===true?'block':'none'}}>
        <>
        <style jsx>{`
            .s-bar-text, .rr-icon{
                display:${store.sidebar==true?"initial":"none"}
            }
            .menu-label{
                font-size:${store.sidebar==true?'0.75em':'0.6em'}
            }
        
                    
        
        `}</style>


        <div className="sidebar" style={{width:`${store.sidebar==true?"18%":"5%"}`}}>
            <div className="_side" style={{width:`${store.sidebar==true?"18%":"5%"}`}}>
                <div className="navbar-brand c_brand">
                    <Link href="/">
                        <a className="navbar-item">
                            {
                                store.sidebar==true
                                ?<h1 className="is-4 custom-brand">BACARDI</h1>
                                :<img src="/logo.png" style={{maxHeight:'initial'}} />
                            }
                            
                            {/* <h1 className="is-4 custom-brand">BACARDI</h1> */}
                        </a>
                    </Link>

                </div>
                <aside className="menu" style={{padding:"10px"}}>
                <p className="menu-label">
                    General
                </p>
                <ul className="menu-list">
                    <li>
                        <Link href="/">
                        <div className="item">
                            <>
                            
                            <a className={route=="/"?"active":"not"}>
                                <div>
                                    <span className="s-bar-icon">
                                        <FontAwesomeIcon icon={faHome} />
                                    </span>
                                    <span className="s-bar-text">
                                        Dashboard
                                    </span>
                                    
                                </div>

                            </a>
                            </>
                            </div>
                        </Link>
                        </li>
                    <li>
                        <Link href="/customers">
                            <div className="item">
                            <a className={route.startsWith("/customers") ?"active":"not"}>
                                    <div>
                                        <span className="s-bar-icon">
                                            <FontAwesomeIcon icon={faUsers} />
                                        </span>
                                        <span className="s-bar-text">
                                            Customers
                                        </span>
                                        
                                    </div>
                                </a>
                                </div>    
                            </Link>
                        </li>
                        <li>
                        <Link href="/vendors">
                            <div className="item">
                                <a className={route.startsWith("/vendors") ?"active":"not"}>
                                    <div>
                                        <span className="s-bar-icon">
                                            <FontAwesomeIcon icon={faUserTie} />
                                        </span>
                                        <span className="s-bar-text">
                                            Vendors
                                        </span>
                                        
                                    </div>
                                </a>
                            </div>
                        </Link>
                    </li>
                </ul>
                <p className="menu-label">
                    Process
                </p>
                <ul className="menu-list">
                    <li>
                        <div className="item" onClick={(e)=>Toggle(e)}>
                                <a>
                                    <div>
                                        <span className="s-bar-icon">
                                            <FontAwesomeIcon icon={faUserTie} />
                                        </span>
                                        <span className="s-bar-text" style={{width:'100%'}}>
                                            Products
                                        </span>
                                        <span className="rr-icon" style={{float:"right"}}>
                                            <FontAwesomeIcon icon={faAngleRight}/>
                                        </span>
                                        
                                    </div>
                                </a>
                            </div>

                        <ul className="child_" style={{display:route.startsWith("/products") || route.startsWith("/category")?"inherit":"none"}}>
                            <li>
                                <Link href="/products/category">
                                    <a className={route.startsWith("/products/category") ||route.startsWith("/category") ?"active":"not"}>Categories</a>
                                </Link>
                            </li>
                            {/* <li><a>SubCategory</a></li> */}
                            <li>
                                <Link href="/products">
                                    <a className={route==="/products"?"active":"not"}>
                                        Products
                                    </a>
                                </Link>
                            </li>
                        </ul>
                    </li>
                    <li>
                            <div className="item" onClick={(e)=>Toggle(e)}>
                                <a>
                                    <div >
                                        <span className="s-bar-icon">
                                            <FontAwesomeIcon icon={faShippingFast} />
                                        </span>
                                        <span className="s-bar-text" style={{width:'100%'}}>
                                            Sales
                                        </span>
                                        <span className="rr-icon" style={{float:"right"}}>
                                            <FontAwesomeIcon icon={faAngleRight}/>
                                        </span>
                                        
                                    </div>
                                </a>
                            </div>
                        
                        <ul className="child_" style={{display:route.startsWith("/sales")?"inherit":"none"}}>
                            <li className="is-active">
                            <Link href="/sales/add_new">
                                <div className="item">
                                    <a className={route.startsWith("/sales/add_new")?"active":"not"}>
                                        <div>
                                            <span className="s-bar-icon">
                                                <FontAwesomeIcon icon={faPlus} />
                                            </span>
                                            <span className="s-bar-text">
                                                Add
                                            </span>
                                            
                                        </div>
                                    </a>
                                </div>
                            </Link>
                                </li>
                            <li>
                                <Link href="/sales/history">
                                    <div className="item">
                                        <a className={route.startsWith("/sales/history")?"active":"not"}>
                                            <div>
                                                <span className="s-bar-icon">
                                                    <FontAwesomeIcon icon={faHistory} />
                                                </span>
                                                <span className="s-bar-text">
                                                    All Sales
                                                </span> 
                                            </div>
                                        </a>
                                    </div>
                                </Link>
                                </li>
                                
                        </ul>
                    </li>
                    <li>
                        <div className="item" onClick={(e)=>Toggle(e)}>
                            <a>
                                <div >
                                    <span className="s-bar-icon">
                                        <FontAwesomeIcon icon={faShippingFast} />
                                    </span>
                                    <span className="s-bar-text" style={{width:'100%'}}>
                                        Purchase
                                    </span>
                                    <span className="rr-icon" style={{float:"right"}}>
                                        <FontAwesomeIcon icon={faAngleRight}/>
                                    </span>
                                    
                                </div>
                            </a>
                        </div>                        
                        <ul className="child_" style={{display:route.startsWith("/purchase")?"inherit":"none"}}>
                            <li>
                                <Link href="/purchase/new">
                                    {/* <a className={route.startsWith("/purchase/new")?"active":"not"}>Add new</a> */}
                                    <div className="item">
                                        <a className={route.startsWith("/purchase/new")?"active":"not"}>
                                            <div>
                                                <span className="s-bar-icon">
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </span>
                                                <span className="s-bar-text">
                                                    Add
                                                </span>
                                                
                                            </div>
                                        </a>
                                    </div>                                
                                </Link>
                            </li>
                            <li>
                                <Link href="/purchase/history">
                                    {/* <a className={route.startsWith("/purchase/history")?"active":"not"}>All purchase</a> */}
                                    <div className="item">
                                        <a className={route.startsWith("/purchase/history")?"active":"not"}>
                                            <div>
                                                <span className="s-bar-icon">
                                                    <FontAwesomeIcon icon={faHistory} />
                                                </span>
                                                <span className="s-bar-text">
                                                    All Purchase
                                                </span> 
                                            </div>
                                        </a>
                                    </div>
                                
                                </Link>
                                
                            </li>
                        </ul>
                    </li>
                    <li style={{position:'fixed',bottom:'5%',width:"18.4%"}}>
                        <a style={{color:"red"}} onClick={()=>Logout()}>Logout</a>
                    </li>
                </ul>
                <p className="menu-label">
                    Settings
                </p>
                <ul className="menu-list">
                    <li>
                        <Link href="/profile">
                            {/* <a className={route.startsWith("/profile")?"active":"not"}>Profile</a> */}
                            <div className="item">
                                <a className={route.startsWith("/profile") ?"active":"not"}>
                                    <div>
                                        <span className="s-bar-icon">
                                            <FontAwesomeIcon icon={faSmile} />
                                        </span>
                                        <span className="s-bar-text">
                                            Profile
                                        </span>
                                        
                                    </div>
                                </a>
                            </div>
                        </Link>
                        
                    </li>
                    <li>
                        {/* <a>Settings</a> */}
                        <div className="item">
                                <a 
                                // className={route.startsWith("/profile") ?"active":"not"}
                                >
                                    <div>
                                        <span className="s-bar-icon">
                                            <FontAwesomeIcon icon={faCog} />
                                        </span>
                                        <span className="s-bar-text">
                                            Settings
                                        </span>
                                        
                                    </div>
                                </a>
                            </div>
                    </li>
                </ul>

                </aside>
            </div>
        </div>
        </>
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