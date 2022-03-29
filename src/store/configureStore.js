import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import authReducer from "./auth"
import usersReducer from "./users"
import productsReducer from "./products"
import ordersReducer from "./orders"
import cartReducer from "./cart"

const appReducer = combineReducers({
    authentication: authReducer,
    users: usersReducer,
    products: productsReducer,
    orders: ordersReducer,
    cart: cartReducer,
})

const rootReducer = (state, action) => {
    if (action.type === 'USER_LOGOUT') {
        return appReducer(undefined, action)
    }
    return appReducer(state, action)
}

export const user_info_key = 'shoppiffyy/user_info'
export const cart_items_key = 'shoppiffyy/cart_items'
export const payment_method_key = 'shoppiffyy/payment_method'
export const shipping_address_key = 'shoppiffyy/shipping_address'

const userFromLocalStorage = localStorage.getItem(user_info_key)
    ? JSON.parse(localStorage.getItem(user_info_key))
    : null
const cartFromLocalStorage = localStorage.getItem(cart_items_key)
    ? JSON.parse(localStorage.getItem(cart_items_key))
    : []
const paymentFromLocalStorage = localStorage.getItem(payment_method_key)
    ? JSON.parse(localStorage.getItem(payment_method_key))
    : null

const initialState = {
    authentication: {
        auth: userFromLocalStorage
    },
    users: {
        user: null
    },
    cart: {
        cartItems: cartFromLocalStorage,
        paymentMethod: paymentFromLocalStorage
    }
}

const middleware = [thunk]

const configureStore = () => {
    return createStore(
        rootReducer,
        initialState,
        composeWithDevTools(applyMiddleware(...middleware))
    )
}

export default configureStore 