import Link from 'next/link'
import {useState} from 'react'
import {useQuery} from '@apollo/react-hooks'
import {currentUserQuery} from '../lib/graphql'
import { useDispatch, useSelector } from 'react-redux'
import  {currentUser, toggle_side_bar} from '../redux_function/actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faSortDown,faCaretDown, faUser, faSearch, faBars} from '@fortawesome/free-solid-svg-icons'
import {useRouter} from 'next/router'
import Cookie from "js-cookie";

  const Navbar =({text,setText=undefined})=>{
    const {loading,data:profile,error} = useQuery(currentUserQuery)
    const router = useRouter()

    const data = true;
    if(data)
    {
      const dispatch = useDispatch()
      // dispatch(currentUser(data))
      const store = useSelector(state => state.width)
      // console.log(store)
      

      // cons

      const tgl = () =>{
        // console.log("clicked")
        const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
        // if ($navbarBurgers.length > 0) {

          $navbarBurgers.forEach( el => {

            // el.addEventListener('click', () => {
              const target = el.dataset.target;
              const $target = document.getElementById(target);
              el.classList.toggle('is-active');
              $target.classList.toggle('is-active');
            // })
          })
        // }
        // console.log("clicked")
      }
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

    // console.log(store)


      // console.log(data.currentUser.username)
      return(
        loading===true || profile==undefined?"":
        <div className="main_content">  
        <style jsx>{`
          .dropdown-content{
          position:absolute;
          // border-radius: 6px;
          border-top: none;
          box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02);
          display: none;
          // opacity: 0;
          // pointer-events: none;
          top: calc(100% + (-4px));
          transform: translateY(-5px);
          transition-duration: 86ms;
          transition-property: opacity,transform;
          }
          .dropdown {
            position: relative;
            // display: inline-block;
          }

          .dropdown-content a {
            color: black;
            padding: 0.375rem 1rem;
            text-decoration: none;
            display: block;
            font-size:0.875rem;
          }

          .dropdown-content a:hover {background-color: #fafafa;}

          .dropdown:hover .dropdown-content {display:block}
          
        `}</style>          
        <div className="navbar" style={{boxShadow:"0px 0px 1px rgba(0,0,0,0.1)",position:'fixed',width:`${store.sidebar==true?"82%":"95%"}`,}} role="navigation" aria-label="main navigation">
        <div className="navbar-brand" style={{display:'none'}}>
            <Link href="/">
            <a className="navbar-item" >
              {/* <img src="/logo.png" /> */}
                {/* <h1 className="is-4 custom-brand">Bacardi</h1> */}
                {/* <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28"/> */}
            </a>
            </Link>

          <div role="button" onClick={()=>tgl()} className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </div>
        </div> 

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <div className="navbar-item" style={{cursor:'pointer'}} onClick={()=>dispatch(toggle_side_bar(store.sidebar))}>
              <FontAwesomeIcon icon={faBars} color="grey"/>
            </div>
            <div className="navbar-item">
              <p className="control has-icons-left has-icons-right">
                <input type="input" className="input is-small" 
                value={text}
                onChange={(e)=>
                  setText===undefined ?{}:
                  // setText(e.target.value)
                  setText(e.target.value)
                }
                placeholder="Search anything..." style={{outline:'none',border:'none',boxShadow:'none'}}  />  
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
              </p>
              
            </div>
            
           {/* <Link href="/create">
            <a className="navbar-item" style={{fontSize:"13px",fontWeight:"bold"}}>
                Add New
                </a>
            </Link> */}
            {/* <a className="navbar-item">
              Home
            </a>
      
            <a className="navbar-item">
              Documentation
            </a> */}
      

            {/* <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">
                More
              </a>
      
              <div className="navbar-dropdown">
                <a className="navbar-item">
                  About
                </a>
                <a className="navbar-item">
                  Jobs
                </a>
                <a className="navbar-item">
                  Contact
                </a>
                <hr className="navbar-divider"/>
                <a className="navbar-item">
                  Report an issue
                </a>
              </div>
            </div> */}
          </div>
      
          <div className="navbar-end">
            <div className="navbar-item has-dropdown_ dropdown">
              {/* <div> */}
              <div className="buttons_" style={{fontSize:"14px",fontFamily:'nfontb',cursor:'pointer'}}>
                <span style={{marginRight:"10px",color:'grey'}}>
                  <FontAwesomeIcon icon={faUser} color="grey" style={{fontSize:"17px"}}/>
                </span>
                <span  style={{marginRight:"10px"}}>
                  {profile.user.firstName} {profile.user.lastName}
                </span>
                <span>
                  
                  <FontAwesomeIcon icon={faCaretDown} style={{fontSize:"17px"}}/>
                </span>

                {/* <a className="">
                Rahul
                </a> */}
                <div className="navbar-dropdown">
                  <a className="navbar-item">
                    About
                  </a>
                  <a className="navbar-item">
                    Jobs
                  </a>
                  <a className="navbar-item">
                    Contact
                  </a>
                </div>
                
              </div>
              <div className="dropdown-content" style={{width:'85%'}}>
                  <Link href="/profile">
                    <a>Profile</a>
                  </Link>
                  
                  <a onClick={()=>Logout()}>Logout</a>
                  {/* <a href="#">Link 3</a> */}
                </div>

              {/* </div> */}
              

            </div>
          </div>

          
        </div>
        </div>
        </div>
    )
    }
    if(loading){
      return <h1></h1>
    }
}

export default Navbar;