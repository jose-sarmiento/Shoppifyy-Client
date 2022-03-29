import axios from "axios";

const ORDER_CREATE_REQUEST = "ORDER_CREATE_REQUEST";
const ORDER_CREATE_SUCCESS = "ORDER_CREATE_SUCCESS";
const ORDER_CREATE_FAIL = "ORDER_CREATE_FAIL";

const ORDER_DETAILS_REQUEST = "ORDER_DETAILS_REQUEST";
const ORDER_DETAILS_SUCCESS = "ORDER_DETAILS_SUCCESS";
const ORDER_DETAILS_FAIL = "ORDER_DETAILS_FAIL";
const ORDER_DETAILS_RESET = "ORDER_DETAILS_RESET";

const ORDER_PAY_REQUEST = "ORDER_PAY_REQUEST";
const ORDER_PAY_SUCCESS = "ORDER_PAY_SUCCESS";
const ORDER_PAY_FAIL = "ORDER_PAY_FAIL";
const ORDER_PAY_RESET = "ORDER_PAY_RESET";

const ORDER_LIST_MY_REQUEST = "ORDER_LIST_MY_REQUEST";
const ORDER_LIST_MY_SUCCESS = "ORDER_LIST_MY_SUCCESS";
const ORDER_LIST_MY_FAIL = "ORDER_LIST_MY_FAIL";
const ORDER_LIST_MY_RESET = "ORDER_LIST_MY_RESET";

const ORDER_LIST_REQUEST = "ORDER_LIST_REQUEST";
const ORDER_LIST_SUCCESS = "ORDER_LIST_SUCCESS";
const ORDER_LIST_FAIL = "ORDER_LIST_FAIL";

const ORDER_DELIVER_REQUEST = "ORDER_DELIVER_REQUEST";
const ORDER_DELIVER_SUCCESS = "ORDER_DELIVER_SUCCESS";
const ORDER_DELIVER_FAIL = "ORDER_DELIVER_FAIL";
const ORDER_DELIVER_RESET = "ORDER_DELIVER_RESET";

export const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_CREATE_REQUEST });

        const {
            authentication: { auth },
            users: { user }
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
            },
        };

        const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/orders`, order, config);
        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload: {...data, user: {
                _id: data.user,
                name: user.name,
                email: user.email
            }},
        });
    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const getOrderDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_DETAILS_REQUEST });

        const {
            authentication: { auth },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${auth.token}`,
            },
        };

        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/${id}`, config);

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const payOrder =
    (orderId, paymentResult) => async (dispatch, getState) => {
        try {
            dispatch({ type: ORDER_PAY_REQUEST });

            const {
                authentication: { auth },
            } = getState();

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.token}`,
                },
            };

            const { data } = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/orders/${orderId}/pay`,
                paymentResult,
                config
            );

            dispatch({
                type: ORDER_PAY_SUCCESS,
                payload: data,
            });
        } catch (error) {
            dispatch({
                type: ORDER_PAY_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            });
        }
    };

export const deliverOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_DELIVER_REQUEST });

        const {
            authentication: { auth },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${auth.token}`,
            },
        };

        const { data } = await axios.put(
            `${process.env.REACT_APP_API_URL}/api/orders/${order._id}/deliver`,
            {},
            config
        );

        dispatch({
            type: ORDER_DELIVER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ORDER_DELIVER_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const listMyOrders = () => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_LIST_MY_REQUEST });

        const {
            authentication: { auth },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${auth.token}`,
            },
        };

        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/myorders`, config);

        dispatch({
            type: ORDER_LIST_MY_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ORDER_LIST_MY_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const listOrders = () => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_LIST_REQUEST });

        const {
            authentication: { auth },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${auth.token}`,
            },
        };

        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders`, config);

        dispatch({
            type: ORDER_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ORDER_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

const reducer = (state = { orders: [], order: null}, action) => {
    switch (action.type) {
        case ORDER_CREATE_REQUEST:
            return { ...state, loading_create: true };
        case ORDER_CREATE_SUCCESS:
            return {
                ...state,
                loading_create: false,
                success_create: true,
                order: action.payload,
            };
        case ORDER_CREATE_FAIL:
            return {
                ...state,
                loading_create: false,
                error_create: action.payload,
            };

        case ORDER_DETAILS_REQUEST:
            return { ...state, loading_details: true };
        case ORDER_DETAILS_SUCCESS:
            return {
                ...state,
                loading_details: false,
                order: action.payload,
            };
        case ORDER_DETAILS_FAIL:
            return {
                ...state,
                loading_details: false,
                error_details: action.payload,
            };
        case ORDER_DETAILS_RESET:
            return { ...state, orderItems: [], order: null };

        case ORDER_PAY_REQUEST:
            return { ...state, loading_pay: true };
        case ORDER_PAY_SUCCESS:
            return { ...state, loading_pay: false, success_pay: true };
        case ORDER_PAY_FAIL:
            return { ...state, loading_pay: false, error_pay: action.payload };
        case ORDER_PAY_RESET:
            return { ...state, success_pay: false, order: null };

        case ORDER_LIST_MY_REQUEST:
            return { ...state, loading_list_my: true };
        case ORDER_LIST_MY_SUCCESS:
            return { ...state, loading_list_my: false, orders: action.payload };
        case ORDER_LIST_MY_FAIL:
            return {
                ...state,
                loading_list_my: false,
                error_list_my: action.payload,
            };
        case ORDER_LIST_MY_RESET:
            return { ...state, orders: [] };

        case ORDER_LIST_REQUEST:
            return { ...state, loading_list: true };
        case ORDER_LIST_SUCCESS:
            return { ...state, loading_list: false, orders: action.payload };
        case ORDER_LIST_FAIL:
            return {
                ...state,
                loading_list: false,
                error_list: action.payload,
            };

        case ORDER_DELIVER_REQUEST:
            return { ...state, loading_deliver: true };
        case ORDER_DELIVER_SUCCESS:
            return { ...state, loading_deliver: false, success_deliver: true };
        case ORDER_DELIVER_FAIL:
            return {
                ...state,
                loading_deliver: false,
                error_deliver: action.payload,
            };
        case ORDER_DELIVER_RESET:
            return { ...state, success_deliver: false, order: null };

        default:
            return state;
    }
};

export default reducer;
