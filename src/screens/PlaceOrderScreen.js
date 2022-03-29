import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from '../store/orders'
import {formatToPeso} from "../utils/formatToPeso"

const PlaceOrderScreen = () => {
	const dispatch = useDispatch()
	const history = useHistory()

	const cart = useSelector(state => state.cart)
	const { cartItems } = cart

	const {user} = useSelector(state => state.users)
	const {success_create, error_order, order} = useSelector(state => state.orders)

	cart.itemsPrice = cartItems.reduce((acc, item) => {
		return acc + (item.price * item.qty)
	}, 0)
	cart.shippingPrice = cart.itemsPrice < 100 ? 0 : 100
	cart.taxPrice = Number((0.15 * cart.itemsPrice))
	cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice

	useEffect(() => {
		if(success_create)history.push(`/order/${order._id}`)
		// eslint-disable-next-line
	},[history, success_create])

	const placeOrderHandler = () => {
		dispatch(createOrder({
			orderItems: cart.cartItems,
			shippingAddress: user.address,
			paymentMethod:cart.paymentMethod,
			itemsPrice:cart.itemsPrice,
			shippingPrice:cart.shippingPrice,
			taxPrice:cart.taxPrice,
			totalPrice:cart.totalPrice,
		}))
	}
	return (
		<Container>
			<CheckoutSteps step1 step2 step3 step4 />
			<Row>
				<Col md={8} >
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong>Address: </strong>
								{user?.address.houseNumber}, {' '}
								{user?.address.street}, {' '}
								{user?.address.barangay}, {' '}
								{user?.address.city}, {' '}
								{user?.address.province}, {' '}
								{user?.address.region}.
							</p>
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Payment Method</h2>
							<strong>Method: </strong>
							{cart.paymentMethod}
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Order Items</h2>
							{cart.cartItems.length === 0 ? (
								<Message>Your cart is empty</Message>
								) : (
									<ListGroup variant='flush'>
										{cart.cartItems.map((item, index) => (
											<ListGroup.Item key={index} >
												<Row>
													<Col md={1}>
														<Image 
														src={item.image}
														alt={item.name}
														fluid
														rounded />
													</Col>
													<Col>
														<Link to={`/product/${item.product}`}>
															{item.name}
														</Link>
													</Col>
													<Col md={4}>
														{item.qty} x {formatToPeso(item.price)} = {formatToPeso((item.qty * item.price))}
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
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h2>Order Summary</h2>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Items</Col>
									<Col>{formatToPeso(cart.itemsPrice)}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Shipping</Col>
									<Col>{formatToPeso(cart.shippingPrice)}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Tax</Col>
									<Col>{formatToPeso(cart.taxPrice)}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Total</Col>
									<Col>{formatToPeso(cart.totalPrice)}</Col>
								</Row>
							</ListGroup.Item>
							{error_order && <Message variant='danger'>{error_order}</Message>}
							<ListGroup.Item>
								<Button
								type='button'
								className='btn-block'
								disabled={cart.cartItems.length === 0}
								onClick={placeOrderHandler} >
									Place Order
								</Button>
							</ListGroup.Item>
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</Container>
	)
}

export default PlaceOrderScreen