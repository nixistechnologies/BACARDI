import Link from 'next/link'
import {useState} from 'react'
import {useQuery} from '@apollo/react-hooks'
import {currentUserQuery} from '../lib/graphql'
import { useDispatch, useSelector } from 'react-redux'
import  {currentUser} from '../redux_function/actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faSortDown,faCaretDown, faUser, faSearch} from '@fortawesome/free-solid-svg-icons'

  const Navbar =()=>{
    const {loading,data:profile,error} = useQuery(currentUserQuery)
    const data = true;
    if(data)
    {
      // const dispatch = useDispatch()
      // dispatch(currentUser(data))
      // const store = useSelector(state => state.user)
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



      // console.log(data.currentUser.username)
      return(
        loading===true || profile==undefined?"":
        <div className="main_content">            
        <div className="navbar" style={{boxShadow:"0px 0px 1px rgba(0,0,0,0.1)",position:'fixed',width:"85%", }} role="navigation" aria-label="main navigation">
        <div className="navbar-brand" style={{display:'none'}}>
            <Link href="/">
            <a className="navbar-item" >
                <h1 className="is-4 custom-brand">Bacardi</h1>
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
            <div className="navbar-item">
              <p className="control has-icons-left has-icons-right">
                <input type="input" className="input is-small" placeholder="Search anything..." style={{outline:'none',border:'none',boxShadow:'none'}}  />  
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
            <div className="navbar-item has-dropdown_">
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