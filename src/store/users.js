import axios from "axios"

const USER_DETAILS_REQUEST = 'USER_DETAILS_REQUEST'
const USER_DETAILS_SUCCESS = 'USER_DETAILS_SUCCESS'
const USER_DETAILS_FAIL = 'USER_DETAILS_FAIL'
const USER_DETAILS_RESET = 'USER_DETAILS_RESET'

const USER_UPDATE_REQUEST = 'USER_UPDATE_REQUEST'
const USER_UPDATE_SUCCESS = 'USER_UPDATE_SUCCESS'
const USER_UPDATE_FAIL = 'USER_UPDATE_FAIL'

const USER_UPDATE_ADMIN_REQUEST = 'USER_UPDATE_ADMIN_REQUEST'
const USER_UPDATE_ADMIN_SUCCESS = 'USER_UPDATE_ADMIN_SUCCESS'
const USER_UPDATE_ADMIN_FAIL = 'USER_UPDATE_ADMIN_FAIL'


const USER_LIST_REQUEST = 'USER_LIST_REQUEST'
const USER_LIST_SUCCESS = 'USER_LIST_SUCCESS'
const USER_LIST_FAIL = 'USER_LIST_FAIL'
const USER_LIST_RESET = 'USER_LIST_RESET'

const USER_DELETE_REQUEST = 'USER_DELETE_REQUEST'
const USER_DELETE_SUCCESS = 'USER_DELETE_SUCCESS'
const USER_DELETE_FAIL = 'USER_DELETE_FAIL'

export const getUser = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_DETAILS_REQUEST })

        const {
            authentication: { auth },
        } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`,
            },
        }

        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${id}`, config)

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        })
    }
}

export const updateUser = (formData) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_UPDATE_REQUEST })

        const { authentication: { auth }} = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`,
            },
        }

        const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/api/users/profile`, formData, config)
        dispatch({
            type: USER_UPDATE_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: USER_UPDATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        })
    }
}

export const updateUserAdmin = (formData) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_UPDATE_ADMIN_REQUEST })

        const { authentication: { auth }} = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`,
            },
        }

        const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/users`, formData, config)
        dispatch({
            type: USER_UPDATE_ADMIN_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: USER_UPDATE_ADMIN_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        })
    }
}

export const listUsers = () => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_LIST_REQUEST })

        const {
            authentication: { auth },
        } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${auth.token}`,
            },
        }

        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, config)

        dispatch({
            type: USER_LIST_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: USER_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        })
    }
}

export const deleteUser = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_DELETE_REQUEST })

        const {
            authentication: { auth },
        } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${auth.token}`,
            },
        }

        await axios.delete(`${process.env.REACT_APP_API_URL}/api/users/${id}`, config)

        dispatch({
            type: USER_DELETE_SUCCESS
        })
    } catch (error) {
        dispatch({
            type: USER_DELETE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        })
    }
}



const reducer = (state = { user: {}, users: [] }, action) => {
    switch (action.type) {
        case USER_DETAILS_REQUEST:
            return { ...state, loading_user: true }
        case USER_DETAILS_SUCCESS:
            return { ...state, loading_user: false, user: action.payload }
        case USER_DETAILS_FAIL:
            return { ...state, loading_user: false, error_user: action.payload }
        case USER_DETAILS_RESET:
            return { ...state, user: {} }

        case USER_UPDATE_REQUEST:
            return {...state, loading_update: true }
        case USER_UPDATE_SUCCESS:
            return {...state, loading_update: false, success_update: true, user: action.payload }
        case USER_UPDATE_FAIL:
            return {...state, loading_update: false, error_update: action.payload }

        case USER_UPDATE_ADMIN_REQUEST:
            return {...state, loading_update_admin: true }
        case USER_UPDATE_ADMIN_SUCCESS:
            return {...state, loading_update_admin: false, success_update_admin: true, users: state.users.map(x => {
                if(x._id === action.payload._id) {
                    return {...action.payload}
                }
                return x
            })}
        case USER_UPDATE_ADMIN_FAIL:
            return {...state, loading_update_admin: false, error_update_admin: action.payload }

        case "UPDATE_PROFILE_PICTURE":
            return {...state, user: {...state.user, picture: action.payload}}

        case USER_LIST_REQUEST:
            return { ...state, loading_list: true }
        case USER_LIST_SUCCESS:
            return {...state, loading_list: false, users: action.payload }
        case USER_LIST_FAIL:
            return {...state, loading_list: false, error_list: action.payload }
        case USER_LIST_RESET:
            return {...state, users: [] }

        case USER_DELETE_REQUEST:
            return {...state, loading_delete: true, success: false }
        case USER_DELETE_SUCCESS:
            return {...state, loading_delete: false, success_delete: true }
        case USER_DELETE_FAIL:
            return {...state, loading_delete: false, error_delete: action.payload }

        default:
            return state
    }
}

export default reducer