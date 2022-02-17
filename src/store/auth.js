import axios from "axios"

const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST'
const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS'
const USER_LOGIN_FAIL = 'USER_LOGIN_FAIL'

const USER_REGISTER_REQUEST = 'USER_REGISTER_REQUEST'
const USER_REGISTER_SUCCESS = 'USER_REGISTER_SUCCESS'
const USER_REGISTER_FAIL = 'USER_REGISTER_FAIL'

const USER_LOGOUT = 'USER_LOGOUT'

export const user_info_key = 'shoppiffyy/user_info'
export const cart_items_key = 'shoppiffyy/cart_items'
export const payment_method_key = 'shoppiffyy/payment_method'
export const shipping_address_key = 'shoppiffyy/shipping_address'

const config = {
    headers: {
        'Content-Type': 'application/json',
    },
}

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST })

        const { data } = await axios.post(
            '/api/auth/login',
            { email, password },
            config
        )

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        })

        localStorage.setItem(user_info_key, JSON.stringify(data))
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        })
    }
}

export const logout = () => (dispatch) => {
    localStorage.removeItem(user_info_key)
    localStorage.removeItem(cart_items_key)
    localStorage.removeItem(payment_method_key)
    localStorage.removeItem(shipping_address_key)
    dispatch({ type: USER_LOGOUT })
}

export const register = (formData) => async (dispatch) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST })

        const { data } = await axios.post(
            '/api/auth/register',
            formData,
            config
        )

        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data,
        })

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        })

        localStorage.setItem(user_info_key, JSON.stringify(data))
    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        })
    }
}

export const signinGoogle = (profileObj) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST })

        const { data } = await axios.post(
            '/api/auth/google-signin',
            {
                googleId: profileObj.googleId,
                userInfo: {
                    name: {
                        firstname: profileObj.givenName,
                        lastname: profileObj.familyName,
                    },
                    email: profileObj.email,
                    picture: profileObj.imageUrl
                },
            },
            config
        )

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        })

        localStorage.setItem(user_info_key, JSON.stringify(data))
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        })
    }
}

const reducer = (state = { auth: null }, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return { loading_login: true }
        case USER_LOGIN_SUCCESS:
            return { loading_login: false, auth: action.payload }
        case USER_LOGIN_FAIL:
            return { loading_login: false, error_login: action.payload }


        case USER_REGISTER_REQUEST:
            return { loading_register: true }
        case USER_REGISTER_SUCCESS:
            return { loading_register: false, auth: action.payload }
        case USER_REGISTER_FAIL:
            return { loading_register: false, error_register: action.payload }

        case USER_LOGOUT:
            return {}

        default:
            return state
    }
}

export default reducer