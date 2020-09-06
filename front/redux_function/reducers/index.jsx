import { combineReducers } from 'redux'
import productsReducer from './products';
import billReducer from './bill';
import loginReducer from './login';
import userReducer from './user';
import {categoryReducer} from './category'
import widthReducer from './width'
import bankTabReducer from './bankTab'
export default combineReducers({
    products:productsReducer,
    bills:billReducer,
    user:userReducer,
    login:loginReducer,
    category:categoryReducer,
    width:widthReducer,
    bankTab:bankTabReducer,
})

// export default products;