import { combineReducers } from 'redux'
import productsReducer from './products';
import billReducer from './bill';
import loginReducer from './login';
import userReducer from './user';
import {categoryReducer} from './category'
export default combineReducers({
    products:productsReducer,
    bills:billReducer,
    user:userReducer,
    login:loginReducer,
    category:categoryReducer
})

// export default products;