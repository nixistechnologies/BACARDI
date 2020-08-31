const userReducer = (state={"user":{},loading:true,error:null,created:true} ,action)=>{
    switch(action.type){
        case 'GET_CURRENT_USER' :
            return {...state,user:action.data,loading:false}
        case 'USER_LOADING':
            return {...state,loading:true}
        
        case 'USER_ERROR':{
            return {
                ...state,loading:false,error:action.error
            }
        }

        case 'USER_UPDATE_LOADING':
            return {
                ...state,created:false
            }
        case 'UPDATED_USER':
            return{
                ...state,user:action.data,created:true
            }
        case 'UPDATED_ADDRESS':
            return {
                ...state,"user":{...user,"profile":{...profile,"address":"",city:"",state:"",zipcode:""}}
            }
        case 'UPDATED_PERSONAL':
            return {
                ...state,"user":{...user,firstName:"",lastName:"",email:"","profile":{...profile,contactNumber:""}}
            }
        case 'UPDATED_FIRM':
            return {
                ...state,user:{...user,profile:{...profile,GSTNo:"",firmName:""}}
            }                
        default:
            return state
    
    }
}

export default userReducer; 