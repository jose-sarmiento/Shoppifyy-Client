import React, { useState, useEffect } from "react";
import axios from "axios"
import { useHistory } from "react-router-dom";
import {
  Form,
  Button,
  Row,
  Col,
  Table,
  Container,
  Image,
} from "react-bootstrap";
import { FaEdit } from "react-icons/fa"
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { FaPhone, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import { Message, Loader, EditProfileModal } from "../components";
import { FaTimes } from "react-icons/fa";
import { updateUser } from "../store/users";
import { listMyOrders } from "../store/orders";
import { formatToPeso } from "../utils/formatToPeso";
import defaultProfile from "../default.png";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [editMode] = useState(false);
  const [uploading, setUploading] = useState(false)

  const history = useHistory();
  const dispatch = useDispatch();

  const { auth } = useSelector((state) => state.authentication);

  const {
    user,
    loading_details,
    success_update,
    error_update,
  } = useSelector((state) => state.users);

  const { orders, loading_orders, error_orders } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    if (!auth) {
      history.push(`/signin`);
    } else {
      dispatch(listMyOrders());
      setName(user?.name.firstname + " " + user?.name.lastname);
      setEmail(user?.email);
    }
  }, [dispatch, history, auth, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);
    if (password !== confirmPassword) {
      setMessage("Password do not match");
    } else {
      dispatch(updateUser({ id: user._id, name, email, password }));
    }
  };

  const handleFileChange = async (e) => {
      const img = e.target.files[0];
      console.log(img)
      const form = new FormData();
      form.append("image", img);
      try {
         const config = {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         };
         const { data } = await axios.post("/api/upload", form, config);
         dispatch(updateUser({picture: data}))
         setUploading(false);
      } catch (error) {
         console.log(error);
         setUploading(false);
      }
   };

  if (!user) return null;

  return (
    <Container>
      <Row>
        <Col md={3}>
          {message && <Message variant="danger">{message}</Message>}
          {success_update && (
            <Message variant="success">User profile updated</Message>
          )}
          {error_update && <Message variant="danger">{error_update}</Message>}
          {loading_details && <Loader />}

          <Container className="profile-container">
            <figure className="profile">
              <Image src={user.picture || defaultProfile} className="profile-image" />
              <div className="profile-edit-container">
                <label htmlFor="profile"><FaEdit className="profile-edit"/></label>
                <input type="file" id="profile" className="profile-input" accept="image/*"
                onChange={handleFileChange} />
              </div>
            </figure>
            <h4 className="capitalize">{user.name.firstname + " " + user.name.lastname}</h4>
            {user.isAdmin && <h6>Admin</h6>}

            <div className="profile-row">
              <h6>Contacts</h6>
              <p>
                <FaPhone style={{ fontSize: ".8rem", marginRight: ".5rem" }} />{" "}
                {user.phone || "not set"}
              </p>
              <p>
                <FaEnvelope
                  style={{ fontSize: ".8rem", marginRight: ".5rem" }}
                />{" "}
                {user.email}
              </p>
            </div>

            <div className="profile-row">
              <h6>Shipping Address</h6>
              <p>
                <FaMapMarkerAlt
                  style={{ fontSize: ".8rem", marginRight: ".5rem" }}
                />
                {user.address ? `${user.address?.houseNumber} ${user.address?.street}, ${user.address?.barangay} ${user.address?.city}, ${user.address?.province}` : "not set"}
              </p>
            </div>
          </Container>

          {editMode && (
            <form onSubmit={handleSubmit}>
              <Form.Group controlId="name" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="password" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="confirmPassword" className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Button type="submit" variant="primary" className="mb-3">
                Update
              </Button>
            </form>
          )}
        </Col>

        <Col md={9}>
          <h4 className="mt-4">My Orders</h4>
          {loading_orders ? (
            <Loader />
          ) : error_orders ? (
            <Message variant="danger">{error_orders}</Message>
          ) : (
            <Table striped hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  return (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>{formatToPeso(order.totalPrice)}</td>
                      <td>
                        {order.isPaid ? (
                          order.paidAt.substring(0, 10)
                        ) : (
                          <FaTimes style={{ color: "red" }} />
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          order.deliveredAt.substring(0, 10)
                        ) : (
                          <FaTimes style={{ color: "red" }} />
                        )}
                      </td>
                      <td>
                        <LinkContainer to={`/order/${order._id}`}>
                          <Button className="btn-sm" variant="light">
                            Details
                          </Button>
                        </LinkContainer>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileScreen;
