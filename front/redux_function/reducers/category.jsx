var inital = {'loading':true,items:[],"internal_loading":false,"update":false}

export const categoryReducer = (state=inital,action)=>{
    
    switch(action.type){
        case 'CATEGORY_ADD_LOADING':
            console.log("loading")
            return {...state,internal_loading:true}
        
        case 'CATEGORY_SUBCATEGORY_UPDATED':
            console.log("updated")
            if(action.payload.isNew==true){
                var item = state.items.concat(...[{"node":action.payload.category}])
            }
            else{
                var item = state.items
            }
            return {...state,internal_loading:false,items:item,update:true}

                // if(action.payload.isNew)
                // return action.payload.isNew==true? 
                //     {...state,loading:false,...items }
                // :""

            

        case 'CATEGORY_LOADING':
            return {...state,loading:true,error:null}
        case 'CATEGORY_LOADED':
            return  {...state,loading:false,items:action.payload}
        default:
            return state
    }
}