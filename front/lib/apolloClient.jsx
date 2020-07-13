import ApolloClient  from 'apollo-client'
import { createHttpLink,HttpLink } from 'apollo-link-http';
// import {} from 'a'
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
// import ApolloClient, {createNetworkInterface} from 'apollo-client'
import {server} from './settings'
// const server = "http://shoppingjunction.pythonanywhere.com/graphql/"

const _server = `${server}/graphql/`

// const _server ="http://localhost:8000/graphql/";


// import ServerCookie from "next-cookies";
import Cookie from 'js-cookie'


// const networkinterface = createNetworkInterface({
//   //uri:'http://localhost:8000/graphql/',
//   uri:server,
// })


// networkinterface.use([
//   {
//     applyMiddleware(req, next) {
//       if (!req.options.headers) {
//         req.options.headers = {}
//       }

//       const token = localStorage.getItem('token')
//         ? localStorage.getItem('token')
//         : null
//       req.options.headers['authorization'] = `JWT ${token}` 
//       next()
//     },
//   },
// ])


// const client = new ApolloClient({
//   //link:networkinterface
//   networkInterface:networkinterface,
  
//   cache : new InMemoryCache(),
// })


// export default client



const httplink = createHttpLink({
    uri:_server,
    credentials: 'same-origin'
    // credentials: 'include'
  });
// const l = new HttpLink({
//   uri:server,
//   // credentials:'include'
// })

  // const token = ServerCookie(ctx)["token"];

  

  // const token = "token";
  const authLink = setContext((_, { headers }) => {
    const token = Cookie.get("token") 
    // const token = localStorage.getItem("token")

    // console.log("this.is token fro cookie")
    // console.log(token)
    if(token=="undefined"){
      token = ""
    }


    return {
      headers:{
        ...headers,
        // 'Authorization':'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNTkzNTMwMzcwLCJvcmlnSWF0IjoxNTkzNTMwMDcwfQ.1s5p9ZT5W604Ka0i_iMoy2b-FuczbB3bxelB0w1UEx8'
        // if(token.length>0){

        // }
        // 'Authorization':'JWT '+token
        'Authorization':`JWT ${token==undefined?"":token}`
      }
    }
  });


const client = new ApolloClient({
    link: authLink.concat(httplink),
    // uri:server,
    // link:httplink,
    cache : new InMemoryCache(),
})


export default client


// import { ApolloClient } from 'apollo-client';
// import { InMemoryCache } from 'apollo-cache-inmemory';
// import { HttpLink } from 'apollo-link-http';
// import fetch from 'isomorphic-unfetch';

// export default function createApolloClient(initialState, ctx) {
//     // The `ctx` (NextPageContext) will only be present on the server.
//     // use it to extract auth headers (ctx.req) or similar.
//     return new ApolloClient({
//         ssrMode: Boolean(ctx),
//         link: new HttpLink({
//             uri: 'http://shoppingjunction.pythonanywhere.com/graphql/', // Server URL (must be absolute)
//             credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
//             fetch,
//         }),
//         cache: new InMemoryCache().restore(initialState),
//     });
// }



// import { ApolloLink } from "apollo-link";
// import { createHttpLink, HttpLink } from "apollo-link-http";

// const httpLink = createHttpLink({ uri: "http://shoppingjunction.pythonanywhere.com/graphql/" });
// const middlewareLink = new ApolloLink((operation, forward) => {
//   operation.setContext({
//     headers: {
//       authorization: localStorage.getItem("token") || null
//     }
//   });
//   return forward(operation);
// });

// // use with apollo-client
// const link = middlewareLink.concat(httpLink);
// client = ApolloClient({
//   link:httpLink,
//   cache:new InMemoryCache()

// })
// export default client;