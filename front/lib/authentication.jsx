import client from './apolloClient';
import Cookie from 'js-cookie'
// import { gql } from 'apollo-boost';

import Router from "next/router";
import { getTokenQuery} from './graphql'
import {AuthToken} from './auth_token'

// export class AuthToken{
//     static async storeToken(token){
//         Cookie.set("token",token)
//         await Router.push("/")
//     }
// }








export const PostLogin = async (data) =>{
    var result = await client.mutate({
        mutation:getTokenQuery,
        variables:{
            "username": data.username,
            "password": data.password,
        }
    })
    var token = result.data.tokenAuth.token
    await AuthToken.storeToken(token)
    // console.log(result.data)
}


export const getCurrentUser = async () =>{
    // var res = await client.query({
    //     query:currentUserQuery
    // })
    
    
    // if(res.data){
    //     return res.data.currentUser
    // }
}


// export PostLogin;