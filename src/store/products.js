import axios from "axios"

const PRODUCT_LIST_REQUEST = 'PRODUCT_LIST_REQUEST'
const PRODUCT_LIST_SUCCESS = 'PRODUCT_LIST_SUCCESS'
const PRODUCT_LIST_FAIL = 'PRODUCT_LIST_FAIL'

const PRODUCT_DETAILS_REQUEST = 'PRODUCT_DETAILS_REQUEST'
const PRODUCT_DETAILS_SUCCESS = 'PRODUCT_DETAILS_SUCCESS'
const PRODUCT_DETAILS_FAIL = 'PRODUCT_DETAILS_FAIL'

const PRODUCT_DELETE_REQUEST = 'PRODUCT_DELETE_REQUEST'
const PRODUCT_DELETE_SUCCESS = 'PRODUCT_DELETE_SUCCESS'
const PRODUCT_DELETE_FAIL = 'PRODUCT_DELETE_FAIL'

const PRODUCT_CREATE_REQUEST = 'PRODUCT_CREATE_REQUEST'
const PRODUCT_CREATE_SUCCESS = 'PRODUCT_CREATE_SUCCESS'
const PRODUCT_CREATE_FAIL = 'PRODUCT_CREATE_FAIL'
const PRODUCT_CREATE_RESET = 'PRODUCT_CREATE_RESET'

const PRODUCT_UPDATE_REQUEST = 'PRODUCT_UPDATE_REQUEST'
const PRODUCT_UPDATE_SUCCESS = 'PRODUCT_UPDATE_SUCCESS'
const PRODUCT_UPDATE_FAIL = 'PRODUCT_UPDATE_FAIL'
const PRODUCT_UPDATE_RESET = 'PRODUCT_UPDATE_RESET'

const PRODUCT_CREATE_REVIEW_REQUEST = 'PRODUCT_CREATE_REVIEW_REQUEST'
const PRODUCT_CREATE_REVIEW_SUCCESS = 'PRODUCT_CREATE_REVIEW_SUCCESS'
const PRODUCT_CREATE_REVIEW_FAIL = 'PRODUCT_CREATE_REVIEW_FAIL'
const PRODUCT_CREATE_REVIEW_RESET = 'PRODUCT_CREATE_REVIEW_RESET'

const PRODUCT_TOP_REQUEST = 'PRODUCT_TOP_REQUEST'
const PRODUCT_TOP_SUCCESS = 'PRODUCT_TOP_SUCCESS'
const PRODUCT_TOP_FAIL = 'PRODUCT_TOP_FAIL'


export const listProducts = (keyword = '', pageNumber = '', pageSize = 8) => async (dispatch) => {
	try {
	  dispatch({ type: PRODUCT_LIST_REQUEST })
  
	  const { data } = await axios.get(`/api/products/admin?keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
  
	  dispatch({
		type: PRODUCT_LIST_SUCCESS,
		payload: data
	  })
	} catch(error) {
	  dispatch({
		type: PRODUCT_LIST_FAIL,
		payload: error.response && error.response.data.message
		  ? error.response.data.message : error.message
	  })
	}
  }
  
  export const getProduct = (id) => async (dispatch) => {
	try {
	  dispatch({ type: PRODUCT_DETAILS_REQUEST })
  
	  const { data } = await axios.get(`/api/products/${id}`)
  
	  dispatch({
		type: PRODUCT_DETAILS_SUCCESS,
		payload: data
	  })
	} catch(error) {
	  dispatch({
		type: PRODUCT_DETAILS_FAIL,
		payload: error.response && error.response.data.message
		  ? error.response.data.message : error.message
	  })
	}
  }
  
  export const createProduct = (formData) => async (dispatch, getState) => {
	try {
	  dispatch({ type: PRODUCT_CREATE_REQUEST })
  
	  const {
		authentication: { auth },
	  } = getState()
  
	  const config = {
		headers: {
		  Authorization: `Bearer ${auth.token}`,
		},
	  }
  
	  const { data } = await axios.post(`/api/products`, formData, config)
  
	  dispatch({
		type: PRODUCT_CREATE_SUCCESS,
		payload: data
	  })
	} catch (error) {
	  dispatch({
		type: PRODUCT_CREATE_FAIL,
		payload:
		  error.response && error.response.data.message
			? error.response.data.message
			: error.message,
	  })
	}
  }
  
  export const deleteProduct = (id) => async (dispatch, getState) => {
	try {
	  dispatch({ type: PRODUCT_DELETE_REQUEST })
  
	  const {
		authentication: { auth },
	  } = getState()
  
	  const config = {
		headers: {
		  Authorization: `Bearer ${auth.token}`,
		},
	  }
  
	  await axios.delete(`/api/products/${id}`, config)
  
	  dispatch({ type: PRODUCT_DELETE_SUCCESS, payload: id })
	} catch (error) {
	  dispatch({
		type: PRODUCT_DELETE_FAIL,
		payload:
		  error.response && error.response.data.message
			? error.response.data.message
			: error.message,
	  })
	}
  }
  
  export const updateProduct = (product) => async (dispatch, getState) => {
	try {
	  dispatch({ type: PRODUCT_UPDATE_REQUEST })
  
	  const {
		authentication: { auth },
	  } = getState()
  
	  const config = {
		headers: {
		  'Content-Type': 'application/json',
		  Authorization: `Bearer ${auth.token}`,
		},
	  }
  
	  const {data} = await axios.put(`/api/products/${product._id}`,product, config)
  
	  dispatch({
		type: PRODUCT_UPDATE_SUCCESS,
		payload: data
	  })
	} catch (error) {
	  dispatch({
		type: PRODUCT_UPDATE_FAIL,
		payload:
		  error.response && error.response.data.message
			? error.response.data.message
			: error.message,
	  })
	}
  }
  
  export const createProductReview = (id, review) => async (dispatch, getState) => {
	try {
	  dispatch({ type: PRODUCT_CREATE_REVIEW_REQUEST })
  
	  const {
		authentication: { auth },
	  } = getState()
  
	  const config = {
		headers: {
		  'Content-Type': 'application/json',
		  Authorization: `Bearer ${auth.token}`,
		},
	  }
  
	  await axios.post(`/api/products/${id}/reviews`, review, config)
  
	  dispatch({type: PRODUCT_CREATE_REVIEW_SUCCESS})
	} catch (error) {
	  dispatch({
		type: PRODUCT_CREATE_REVIEW_FAIL,
		payload:
		  error.response && error.response.data.message
			? error.response.data.message
			: error.message,
	  })
	}
  }
  
  export const getTopProducts = () => async (dispatch, getState) => {
	console.log("rerender")
	try {
	  dispatch({ type: PRODUCT_TOP_REQUEST })
  
	  const {data} = await axios.get(`/api/products/top`)
  
	  dispatch({
		type: PRODUCT_TOP_SUCCESS,
		payload: data,
	  })
	} catch (error) {
	  dispatch({
		type: PRODUCT_TOP_FAIL,
		payload:
		  error.response && error.response.data.message
			? error.response.data.message
			: error.message,
	  })
	}
  }




const reducer = (state = {products: [], product: {}}, action) => {
	switch (action.type) {
		case PRODUCT_LIST_REQUEST:
			return {...state, loading_list: true, products: [] }
		case PRODUCT_LIST_SUCCESS:
			return {...state,
				loading_list: false,
				products: action.payload.products,
				pages: action.payload.pages,
				page: action.payload.page,
			}
		case PRODUCT_LIST_FAIL:
			return {...state, loading_list: false, error_list: action.payload }

		case PRODUCT_DETAILS_REQUEST:
			return {...state, loading_details: true }
		case PRODUCT_DETAILS_SUCCESS:
			return {...state, loading_details: false, product: action.payload }
		case PRODUCT_DETAILS_FAIL:
			return {...state, loading_details: false, error_details: action.payload }

		case PRODUCT_DELETE_REQUEST:
			return {...state, loading_delete: true, product: {} }
		case PRODUCT_DELETE_SUCCESS:
			return {...state, loading_delete: false, success_delete: true, orders: state.orders.filter(x => x._id !== action.payload) }
		case PRODUCT_DELETE_FAIL:
			return {...state, loading_delete: false, error_delete: action.payload }
	
		case PRODUCT_CREATE_REQUEST:
			return {...state, loading_create: true }
		case PRODUCT_CREATE_SUCCESS:
			return {...state, loading_create: false, success_create: true, products: [...state.products, action.payload] }
		case PRODUCT_CREATE_FAIL:
			return {...state, loading_create: false, error_create: action.payload }
		case PRODUCT_CREATE_RESET:
			return {...state, product: null, success_create: false }

		case PRODUCT_UPDATE_REQUEST:
			return {...state, loading_update: true }
		case PRODUCT_UPDATE_SUCCESS: 
			return {...state, loading_update: false, success_update: true, products: state.products.map(x => {
				if(x._id === action.payload._id) {
					return {...action.payload}
				}
				return x
			}) }
		case PRODUCT_UPDATE_FAIL:
			return {...state, loading_update: false, error_update: action.payload }
		case PRODUCT_UPDATE_RESET:
			return {...state,product:{}}

		case PRODUCT_CREATE_REVIEW_REQUEST:
			return {...state, loading_create_review: true }
		case PRODUCT_CREATE_REVIEW_SUCCESS:
			return {...state, loading_create_review: false, success_create_review: true}
		case PRODUCT_CREATE_REVIEW_FAIL:
			return {...state, loading_create_review: false, error_create_review: action.payload }
		case PRODUCT_CREATE_REVIEW_RESET:
			return {...state, success_create_review: false }

		case PRODUCT_TOP_REQUEST:
			return {...state, ...state, loading_top: true }
		case PRODUCT_TOP_SUCCESS:
			return {...state, loading_top: false, products: action.payload}
		case PRODUCT_TOP_FAIL:
			return {...state, loading_top: false, error_top: action.payload }

		default:
			return state
	}
}

export default reducer