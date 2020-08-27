
const widthReducer=(state={'sidebar':true},action)=>{
    switch(action.type){
        case 'TOGGLE_SIDEBAR':
            // if(action.payload==false):
            console.log(action.payload)
            return {'sidebar':!action.payload}

            // return {'sidebar':true}
        // case 'HIDE_SIDEBAR':
            // return {'sidebar':false}
        default:
            return state
    }
}
export default widthReducer