
const bankTabReducer=(state={'sale':true,"purchase":false,"contra":false},action)=>{
    switch(action.type){
        case 'TAB_CHANGED':
            // if(action.payload==false):
            console.log(action.tab)
            
            return action.tab == "sale"? {"sale":true,"purchase":false,"contra":false} 
            :action.tab == "purchase"? {"sale":false,"purchase":true,"contra":false} :{"sale":false,"purchase":false,"contra":true}
                
            // return {'sidebar':!action.payload}
            // return state

            // return {'sidebar':true}
        // case 'HIDE_SIDEBAR':
            // return {'sidebar':false}
        default:
            return state
    }
}
export default bankTabReducer