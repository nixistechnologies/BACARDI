import client from '../../lib/apolloClient';
import {createUpdateCategorySubCategoryQuery,renameCategory} from '../../lib/graphql'


export const updateCategory=(id,name,is_update)=>{
    return dispatch=>{
        dispatch(updateLoading())
        return client.mutate({
            mutation:renameCategory,
            variables:{
                "id":id,
                "name":name,
                "isUpdate":is_update
            }
        }).then(e=>{
            dispatch(updateCategorySuccess(e.data))
        }).catch(e=>{
            console.log(e)
        })
    }
}
const updateCategorySuccess=(data)=>({
    type:"CATEGORY_UPDATE_SUCCESS"
})

export const createUpdateCategory=(data)=>{
    return dispatch=>{
        dispatch(categoryAddLoading())
        return client.mutate({
            mutation:createUpdateCategorySubCategoryQuery,
            variables:{
                "category":data.category,
                "subcategory":data.subcategory,
                "gst":data.gst,
                "hsn":data.hsn
            }
        }).then(e=>{
            dispatch(categorySubCategoryUpdated(e.data.updateCategory))
        }).catch(e=>{
            console.log(e)
        })
    }
}

const categoryAddLoading=()=>({
    type:"CATEGORY_ADD_LOADING",
})

const categorySubCategoryUpdated = (data) =>({
    type:"CATEGORY_SUBCATEGORY_UPDATED",
    payload:data
})

