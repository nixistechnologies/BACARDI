
// let initialproduct = {"products":[]}
// initialproduct.push
import Immutable from 'immutable';
import { List, Map} from 'immutable'
import {CREATE_PRODUCTS_SUCCESS,CREATE_PRODUCTS_BEGIN,CREATE_PRODUCTS_FAILURE} from '../actions'

// const product = Immutable.List()
// m = new List();
// m = Immutable.List()




const productsReducer = (state={'loading':true,'create_loading':false,"created":false,items:[]},action) =>{
    switch(action.type){
        case 'FETCH_PRODUCTS_BEGIN':
            // console.log(action.value.then)
            return {...state,loading:true,error:null}
        case 'FETCH_PRODUCTS_SUCCESS':
            // console.log(action)
            // return {
            //     ...state,
            //     items:action.payload.products.allProducts.edges,loading:false
            // }
            // let item = state.items.concat(...[action.payload.products.allProducts.edges])
            console.log(action.payload.products.allProducts.edges)
            return  {...state,loading:false,items:action.payload.products.allProducts.edges}
            




        case CREATE_PRODUCTS_BEGIN:
            return {...state,create_loading:true,error:null}

        case CREATE_PRODUCTS_SUCCESS:

            console.log(action.payload.createProduct)
            if(action.payload.createProduct.isNew==true){
                var item = state.items.concat(...[{"node":action.payload.createProduct.product}])
            }
            else{
                var item = state.items
            }
            
            let x = {...state,loading:false,items:item,create_loading:false,created:true}
            return x
            // return {
            //     ...state,loading:false,items:[action.payload.createProduct.product]
            
            // }
            // return [...state,action.value]
                // action.value
                // ...state,product:action.value
                
                // ...state,p:action.value
            
            // console.log(action.value)
            // state.push(1)
            // console.log(state)
            // action.value.map((e)=>{
            //     state.push(e)
            // })
            // return state;

            // return state.push({"name":action.value[0].name})
            // console.log(action.value)
            // return [...state,{}]
            // console.log(action.value)
            // return action.value.map((e)=>{
            //     return e.node
            //     // return {...state,}
            //     // state.push(e.node)
            // })
            // return state

        default:
            return state
            console.log(action)
            // return [
            //     ...state,
            // ]
    }
    console.log(state)

    return {...state}
}

export default productsReducer;