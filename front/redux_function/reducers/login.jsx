
import {AuthToken} from '../../lib/auth_token'
// import { Router } from 'next/router'
// var token = localStorage.getItem("token")

const loginReducer = (state={'token':null,'loading':false,'error':false},action) =>{
    // console.log(action)
    switch(action.type){
        case 'USER_CREATED':
            return {
                ...state,loading:false,error:false
            }

        case 'LOGIN_TOKEN':
            AuthToken.storeToken(action.token)
            return{
                ...state,loading:false,token:action.token
            }
        case 'LOGIN_LOADING':
                console.log("loading....")
            return{
                    ...state,token:action.token,loading:true
                }
        case 'LOGIN_ERROR':
            return{
                ...state,loading:false,error:true
            }
        default:
            return state
    }
}

export default loginReducer;