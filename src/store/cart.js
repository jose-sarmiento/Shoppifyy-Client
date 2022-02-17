import axios from "axios"
import { cart_items_key, payment_method_key } from "./configureStore"

const CART_ADD_ITEM = 'CART_ADD_ITEM'
const CART_REMOVE_ITEM = 'CART_REMOVE_ITEM' 
const CART_SAVE_SHIPPING_ADDRESS = 'CART_SAVE_SHIPPING_ADDRESS'
const CART_SAVE_PAYMENT_METHOD = 'CART_SAVE_PAYMENT_METHOD'


export const addToCart = (id, qty) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/products/${id}`)
  
    dispatch({
      type: CART_ADD_ITEM,
      payload: {
        product: data._id,
        name: data.name,
        image: data.image,
        price: data.price,
        countInStock: data.countInStock,
        qty,
      },
    })
  
    localStorage.setItem(cart_items_key, JSON.stringify(getState().cart.cartItems))
  }
  
  export const removeItemFromCart = id => async (dispatch, getState) => {
    dispatch({
      type: CART_REMOVE_ITEM,
      payload: id,
    })
  
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
  }
  
  export const saveShippingAddress = data => async (dispatch, getState) => {
    dispatch({
      type: CART_SAVE_SHIPPING_ADDRESS,
      payload: data,
    })
    
    // localStorage.setItem('shippingAddress', JSON.stringify(data))
  }
  
  export const savePaymentMethod = paymentMethod => async (dispatch, getState) => {
    dispatch({
      type: CART_SAVE_PAYMENT_METHOD,
      payload: paymentMethod,
    })
    
    localStorage.setItem(payment_method_key, JSON.stringify(paymentMethod))
  }
  



const reducer = (state = { cartItems: [], shippingAddress: {} }, action) => {
    switch (action.type) {
      case CART_ADD_ITEM:
        const item = action.payload
        const existItem = state.cartItems.find(x => x.product === item.product)
  
        if (existItem) {
          return {
            ...state,
            cartItems: state.cartItems.map(x =>
              x.product === existItem.product ? item : x
            ),
          }
        } else {
          return {
            ...state,
            cartItems: [...state.cartItems, item],
          }
        }
      case CART_REMOVE_ITEM:
        return {
          ...state,
          cartItems: state.cartItems.filter(
            item => item.product !== action.payload
          ),
        }
      case CART_SAVE_SHIPPING_ADDRESS:
        return {
          ...state,
          shippingAddress: action.payload
        }
      case CART_SAVE_PAYMENT_METHOD:
        return {
          ...state,
          paymentMethod: action.payload
        }
      default:
        return state
    }
  }
  
  export default reducer