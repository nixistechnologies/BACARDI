import client from '../../lib/apolloClient';
import {createUpdateCategorySubCategoryQuery} from '../../lib/graphql'

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

