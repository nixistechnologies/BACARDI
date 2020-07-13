import Link from 'next/link'
import {useState} from 'react'
import {useQuery} from '@apollo/react-hooks'
import {currentUserQuery} from '../lib/graphql'
import { useDispatch, useSelector } from 'react-redux'
import  {currentUser} from '../redux_function/actions'


  const Navbar =()=>{
    // const {loading,data,error} = useQuery(currentUserQuery)
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
        <div className="main_content">            
        <div className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
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
      
          {/* <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <a className="">
                </a>
              </div>
            </div>
          </div> */}

          
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