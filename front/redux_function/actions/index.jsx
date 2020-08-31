import client from '../../lib/apolloClient';
import { gql } from 'apollo-boost';
import Router from  'next/router'
import {createUserQuery,getAllProductQuery,createProductQuery,generateBillQuery, currentUserQuery, updateCurrentUserQuery,getTokenQuery,getCateogryQuery, updateFirmQuery, updateAddressQuery,updatePersonalQuery} from '../../lib/graphql'



export const createNewUser = (data) =>{
    return dispatch=>{
        dispatch(userLoading())
        return client.mutate({
            mutation:createUserQuery,
            variables:{
                "username": data.username,
                "password": data.password,
                "firstName": data.first_name,
                "lastName": data.last_name,
                "email": data.email,
                "phone": data.phone,
                "gst": data.gst,
                "tin": data.tin,
                "firm": data.firm_name,
                "address": data.address
            }
        }).then((e)=>{
            dispatch(userCreated())
            Router.push("/login")
        }).catch((e)=>{
            dispatch(userError())
        })
    }
}


export const getCategory = () =>{
    return dispatch=>{
        dispatch(categoryLoading)
        return client.query({
            query:getCateogryQuery
        }).then(e=>{
            console.log(e.data)
            dispatch(categoryLoaded(e.data.categories.edges))
        }).catch(e=>{
            console.log("errro")
        })
    }
}

// export const toggle_side_bar=(state)=>{
//     type:
// }

export const getCurrentUser=()=>{
    return dispatch=>{
        dispatch(userLoading)
        return client.query({
            query:currentUserQuery
        }).then((e)=>{
            dispatch(currentUser(e.data.user))
        }).catch((e)=>{
            dispatch(userError(e))
        })
    }
}

// export const clearBill=()=>{
//     return dispatch=>{
        
//     }
// }

export const updatePersonal = (data) =>{
    return dispatch=>{
        dispatch(userUpdateLoading());
        return client.mutate({
            mutation:updatePersonalQuery,
            variables:{
                "firstname": data.firstName,
                "lastname": data.lastName,
                "phone": data.phone,
                "email": data.email,
            }
        }).then((e)=>{
            dispatch(updatedPersonal(e.data.updatePersonal.user))
        }).then((e)=>{
            dispatch(userError(e))
        })
    }
}

export const updateFirm = (data) =>{
    return dispatch=>{
        dispatch(userUpdateLoading());
        return client.mutate({
            mutation:updateFirmQuery,
            variables:{
                "firm": data.firm,
                "gst": data.lastName,
                // "phone": data.phone,
                // "email": data.email,
            }
        }).then((e)=>{
            dispatch(updateFirm(e.data.updateFirm.user))
        }).then((e)=>{
            dispatch(userError(e))
        })
    }
}

export const updateAddress = (data) =>{
    return dispatch=>{
        dispatch(userUpdateLoading());
        return client.mutate({
            mutation:updateAddressQuery,
            variables:{
                "address": data.address,
                "state":data.state,
                "city":data.city,
                "zipcode":data.zipcode
            }
        }).then((e)=>{
            dispatch(updatedAddress(e.data.updateAddress.user))
        }).then((e)=>{
            dispatch(userError(e))
        })
    }
}


export const updateUser = (data) =>{
    return dispatch=>{
        dispatch(userUpdateLoading());
        return client.mutate({
            mutation:updateCurrentUserQuery,
            variables:{
                "gst": data.gst,
                // "tin": data.tin,
                "firstName": data.firstName,
                "lastName": data.lastName,
                "phone": data.phone,
                "email": data.email,
                "firm": data.firm,
                "address": data.address,
                "state":data.state,
                "city":data.city,
                "zipcode":data.zipcode
            }
        }).then((e)=>{
            dispatch(updatedUser(e.data.updateUser.user))
        }).then((e)=>{
            dispatch(userError(e))
        })
    }
}

export const getUserToken = (data) =>{
    // console.log(data)
    return dispatch=>{
        dispatch(loginLoading());
        // console.log(data)
        return client.mutate({
            mutation:getTokenQuery,
            variables:{
                "username": data.username,
                "password": data.password,            
            }
        }).then((e)=>{
            dispatch(loginToken(e.data.tokenAuth.token))
        }).catch((e)=>{
            dispatch(loginError("username or password wrong"))
        })
    }
}


// export const getUserToken = (data) =>{
//     // console.log(data)
//     return dispatch =>{
//         dispatch(loginLoading());
//         console.log("sdflkjsl")
//         return client.mutate({
//             mutation:getTokenQuery,
//             variables:{
//                 "username": data.username,
//                 "password": data.password,
//             }
//         }).then((e)=>{
//             console.log("ersdf")
//             dispatch(loginToken(e.data.tokenAuth.token))
//         }).catch((e)=>{
//             console.log("error")
//             dispatch(loginError("username or password wrong"))
//         })
//     }
// }



export const generateBill=(name,age,gender,date,gst,paymentMode,mlist)=>{
    return dispatch=>{
        dispatch(billGenerateLoading());
        return client.mutate({
            mutation:generateBillQuery,
            variables:{
                "medicines": mlist,
                "name": name,
                "age":age,
                "gender":gender,
                "date": date,
                "gst": gst,
                "payment": paymentMode
            }
        }).then((e)=>{
            dispatch(billGenerated(e.data.generateBill.bill.invoiceNumber,e.data.generateBill.bill.invoice))

        }).catch((error)=>{
            dispatch(billFailure(error))
        })
    }
}

export const createProduct =(data) =>{
    return dispatch=>{
        dispatch(createProductsBegin());
        return client.mutate({
            mutation:createProductQuery,
            variables:{
                "name": data.product,
                "qty": data.qty,
                "typeofpack": data.typeofpack,

                "mrp": data.mrp,
                "list":data.listprice,
                "cost":data.cost,

                "mfg":data.mfg,
                "exp":data.exp_date,
                "exp_time":data.exp_time,

                "discount":data.discount,
                "hsn":data.hsn,
                "batch":data.batch,
                
            }
        }).then(res=>{
            dispatch(createProductSucess(res.data))
            return res.data
        }).catch(err=>{
            dispatch(createProductsFailure(err))
        })
    }
}


export const addProduct = (product) =>{
    return dispatch =>{
        dispatch(fetchProductsBegin());
        return client.query({query:getAllProductQuery})
        .then(res=>{
            if(!res.loading){
                dispatch(fetchProductsSuccess(res.data))
                return res.data
            }
        })
        .catch(err=>dispatch(fetchProductFail(error)))
    }
}


export const CREATE_PRODUCTS_SUCCESS = 'CREATE_PRODUCTS_SUCCESS';
export const CREATE_PRODUCTS_BEGIN = 'CREATE_PRODUCTS_BEGIN';
export const CREATE_PRODUCTS_FAILURE = 'CREATE_PRODUCTS_FAILURE';


export const FETCH_PRODUCTS_BEGIN   = 'FETCH_PRODUCTS_BEGIN';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';

export const toggle_side_bar = (s) =>({
    type:'TOGGLE_SIDEBAR',
    payload:s
})

export const createProductSucess = (product) =>({
    type:CREATE_PRODUCTS_SUCCESS,
    payload:product
})

const categoryLoading=()=>({
    type:"CATEGORY_LOADING"
})

const categoryLoaded=(category)=>({
    type:'CATEGORY_LOADED',
    payload:category
})

export const loginLoading = () =>({
    type:'LOGIN_LOADING'
})

export const userCreated = () =>({
    type:"USER_CREATED"
})

export const loginToken = (token) =>({
    type:"LOGIN_TOKEN",
    token: token
})
export const loginError = (error) => ({
    type:'LOGIN_ERROR',
    error:error
})

export const clearBill = () =>({
    type:'CLEAR_BILL'
})

export const userLoading = () =>({
    type:'USER_LOADING',
})
export const userError = (error) =>({
    type:'USER_ERROR',
    error:error
})
export const currentUser = (user) => ({
    type:'GET_CURRENT_USER',
    data:user
})

export const userUpdateLoading = () =>({
    type:'USER_UPDATE_LOADING'
})

export const updatedUser = (user) =>({
    type:'UPDATED_USER',
    data:user

})

export const updatedFirm = (user) =>({
    type:'UPDATED_FIRM',
    data:user

})
export const updatedPersonal = (user) =>({
    type:'UPDATED_PERSONAL',
    data:user

})
export const updatedAddress = (user) =>({
    type:'UPDATED_ADDRESS',
    data:user

})





export const billGenerateLoading = () => ({
    type : 'BILL_LOADING'
})
export const billGenerated = (invoiceNumber,invoice) => ({
    type:'BILL_GENERATED',
    invoice:invoiceNumber,
    link:invoice
})

export const billFailure = (error) =>({
    type:'BILL_FAILURE',
    error :error
})

export const createProductsBegin = () => ({
    type: CREATE_PRODUCTS_BEGIN
});

export const createProductsFailure = products => ({
    type: CREATE_PRODUCTS_FAILURE,
    payload: { error }
  });


  
export const fetchProductsBegin = () => ({
  type: FETCH_PRODUCTS_BEGIN
});

export const fetchProductsSuccess = products => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: { products }
});

export const fetchProductsFailure = error => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: { error }
});

export const setToken = () =>({
    type:'SET_TOKEN',
    token:localStorage.getItem("token")
})

export const getToken = () =>({
    type :'GET_TOKEN'
})