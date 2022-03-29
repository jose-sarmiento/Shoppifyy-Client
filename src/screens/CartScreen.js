import React, { useEffect } from "react";
import { useParams, useLocation, Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Row,
    Col,
    ListGroup,
    Image,
    Form,
    Button,
    Card,
    Container,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import Message from "../components/Message";
import { addToCart, removeItemFromCart } from "../store/cart";
import { formatToPeso } from "../utils/formatToPeso";

const CartScreen = () => {
    const { id } = useParams();
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();

    const qty = location.search ? Number(location.search.split("=")[1]) : 1;

    const { cartItems } = useSelector((state) => state.cart);

    useEffect(() => {
        if (id) {
            dispatch(addToCart(id, qty));
        }
    }, [dispatch, id, qty]);

    const removeFromCartHandler = (id) => {
        dispatch(removeItemFromCart(id));
    };

    const checkOutHandler = () => {
        history.push("/signin?redirect=shipping");
    };

    return (
        <Container>
            <Row>
                <Col md={9}>
                    <h2>Shopping Cart</h2>
                    {cartItems.length === 0 ? (
                        <Message>
                            Your cart is empty <Link to="/">Go Back</Link>
                        </Message>
                    ) : (
                        <ListGroup variant="flush">
                            {cartItems.map((item) => (
                                <ListGroup.Item key={item.product}>
                                    <Row>
                                        <Col md={2}>
                                            <Image
                                                src={item.image}
                                                fluid
                                                rounded
                                            />
                                        </Col>
                                        <Col md={4}>
                                            <Link
                                                to={`/product/${item.product}`}
                                            >
                                                {item.name}
                                            </Link>
                                        </Col>
                                        <Col md={2}>
                                            {formatToPeso(item.price)}
                                        </Col>
                                        <Col md={2}>
                                            <Form.Control
                                                as="select"
                                                value={item.qty}
                                                onChange={(e) =>
                                                    dispatch(
                                                        addToCart(
                                                            item.product,
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    )
                                                }
                                            >
                                                {[
                                                    ...Array(
                                                        item.countInStock
                                                    ).keys(),
                                                ].map((i) => {
                                                    return (
                                                        <option
                                                            key={i + 1}
                                                            value={i + 1}
                                                        >
                                                            {i + 1}
                                                        </option>
                                                    );
                                                })}
                                            </Form.Control>
                                        </Col>

                                        <Col md={2}>
                                            <Button
                                                type="button"
                                                variant="light"
                                                onClick={() =>
                                                    removeFromCartHandler(
                                                        item.product
                                                    )
                                                }
                                            >
                                                <FaTrash />
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Col>
                <Col md={3}>
                    <Card style={{ textAlign: "center" }}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h3>
                                    Subtotal (
                                    {cartItems.reduce(
                                        (total, item) => total + item.qty,
                                        0
                                    )}
                                    ) items
                                </h3>
                                {formatToPeso(
                                    cartItems.reduce(
                                        (total, item) =>
                                            total + item.qty * item.price,
                                        0
                                    )
                                )}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Button
                                    type="button"
                                    className="bg-dark"
                                    disabled={cartItems.length === 0}
                                    onClick={checkOutHandler}
                                >
                                    Proceed to checkout
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CartScreen;
