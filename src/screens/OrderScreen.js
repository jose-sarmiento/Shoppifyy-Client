import React, { useState, useEffect } from "react";
import axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";
import { Link, useParams } from "react-router-dom";
import {
	Row,
	Col,
	ListGroup,
	Image,
	Card,
	Button,
	Container,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Message, Loader } from "../components/";
import { getOrderDetails, payOrder, deliverOrder } from "../store/orders";
import {formatToPeso} from "../utils/formatToPeso"

const OrderScreen = () => {
	const dispatch = useDispatch();
	const { id } = useParams();

	const [sdkReady, setSdkReady] = useState(false);

	const {
		order,
		loading_details,

		loading_pay,
		success_pay,
		error_pay,

		loading_deliver,
		success_deliver,
		error_deliver
	} = useSelector((state) => state.orders);

	const { user } = useSelector((state) => state.users);

	if (!loading_details && order) {
		const addDecimals = (num) => {
			return Number((Math.round(num * 100) / 100).toFixed(2));
		};

		order.itemsPrice = addDecimals(
			order?.orderItems.reduce((acc, item) => {
				return acc + item.price * item.qty;
			}, 0)
		);
	}

	useEffect(() => {
		const addPaypalScript = async () => {
			const { data: clientId } = await axios.get(`${process.env.REACT_APP_API_URL}/api/config/paypal`);
			const script = document.createElement("script");
			script.type = "text/javascript";
			script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
			script.async = true;
			script.onload = () => setSdkReady(true);
			document.body.appendChild(script);
		};

		if (!order || success_pay || success_deliver) {
			dispatch({type: "ORDER_PAY_RESET"})
			dispatch({type: "ORDER_DELIVER_RESET"})
			dispatch(getOrderDetails(id));
		} else if (!order.isPaid) {
			if (!window.paypal) {
				addPaypalScript();
			} else {
				setSdkReady(true);
			}
		}
	}, [dispatch, id, order, success_pay, success_deliver]);

	const convertToDollar = (price) => {
		return Number(((Math.round(price * 100) / 100) / 51.56).toFixed(2))
	}

	const successPaymentHandler = (paymentResult) => {
		dispatch(payOrder(id, paymentResult));
	};

	const deliverHandler = () => {
		dispatch(deliverOrder(order));
	};

	if(loading_details || !user || !order) {
		return <Loader />
	}

	return (
		<>
			{(error_pay || error_deliver) && <Message variant="danger">{error_pay || error_deliver}</Message>}
			<Container>
				<h2>Order {order?._id}</h2>
				<Row>
					<Col md={8}>
						<ListGroup variant="flush">
							<ListGroup.Item>
								<h2>Shipping</h2>
								<p>
									<strong>Name: </strong> {order.user.name?.firstname + " " + order.user.name?.lastname}
								</p>
								<p>
									<strong>Email: </strong>{" "}
									<a className="lowercase" href={`mailto:${order.user.email}`}>
										{order.user.email}
									</a>
								</p>
								<p>
									<strong>Address: </strong>
									{order.shippingAddress.houseNumber}, {' '}
									{order.shippingAddress.street},{" "}
									{order.shippingAddress.barangay}{" "}
									{order.shippingAddress.city},{" "}
									{order.shippingAddress.province}.{" "}
									{order.shippingAddress.region}.{" "}
								</p>
								{order.isDelivered ? (
									<Message variant="success">
										Delievered on {order.deliveredAt}
									</Message>
								) : (
									<Message variant="danger">
										Not delievered
									</Message>
								)}
							</ListGroup.Item>
							<ListGroup.Item>
								<h2>Payment Method</h2>
								<p>
									<strong>Method: </strong>
									{order.paymentMethod}
								</p>
								{order.isPaid ? (
									<Message variant="success">
										Paid on {order.paidAt}
									</Message>
								) : (
									<Message variant="danger">Not paid</Message>
								)}
							</ListGroup.Item>
							<ListGroup.Item>
								<h2>Order Items</h2>
								{order.orderItems.length === 0 ? (
									<Message>Order is empty</Message>
								) : (
									<ListGroup variant="flush">
										{order.orderItems.map((item, index) => (
											<ListGroup.Item key={index}>
												<Row>
													<Col md={1}>
														<Image
															src={item.image}
															alt={item.name}
															fluid
															rounded
														/>
													</Col>
													<Col>
														<Link
															to={`/product/${item.product}`}
														>
															{item.name}
														</Link>
													</Col>
													<Col md={4}>
														{item.qty} x{" "}
														{formatToPeso(item.price)} {" = "} {formatToPeso(item.qty *
															item.price)}
													</Col>
												</Row>
											</ListGroup.Item>
										))}
									</ListGroup>
								)}
							</ListGroup.Item>
						</ListGroup>
					</Col>
					<Col md={4}>
						<Card>
							<ListGroup variant="flush">
								<ListGroup.Item>
									<h2>Order Summary</h2>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col>Items</Col>
										<Col>{formatToPeso(order.itemsPrice)}</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col>Shipping</Col>
										<Col>{formatToPeso(order.shippingPrice)}</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col>Tax</Col>
										<Col>{formatToPeso(order.taxPrice)}</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col>Total</Col>
										<Col>{formatToPeso(order.totalPrice)}</Col>
									</Row>
								</ListGroup.Item>
								{!order.isPaid && (
									<ListGroup.Item>
										{loading_pay && <Loader />}
										{!sdkReady ? (
											<Loader />
										) : (
											<PayPalButton
												amount={convertToDollar(order.totalPrice)}
												onSuccess={
													successPaymentHandler
												}
											/>
										)}
									</ListGroup.Item>
								)}
								{loading_deliver && <Loader />}
								{user.isAdmin &&
									order.isPaid &&
									!order.isDelivered && (
										<ListGroup.Item>
											<Button
												type="button"
												className="btn btn-block"
												onClick={deliverHandler}
											>
												Mark as Delivered
											</Button>
										</ListGroup.Item>
									)}
							</ListGroup>
						</Card>
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default OrderScreen;
