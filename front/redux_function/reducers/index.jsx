import { combineReducers } from 'redux'
import productsReducer from './products';
import billReducer from './bill';
import loginReducer from './login';
import userReducer from './user';
export default combineReducers({
    products:productsReducer,
    bills:billReducer,
    user:userReducer,
    login:loginReducer,
})

// export default products;