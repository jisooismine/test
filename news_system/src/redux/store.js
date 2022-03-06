import { createStore,combineReducers } from "redux";
import {CollApsedReducer} from './reducers/CollapsedReducer'
const reducer = combineReducers({
    CollApsedReducer
})

const store = createStore(reducer);

export default store
