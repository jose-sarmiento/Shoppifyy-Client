import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useHistory } from "react-router-dom";
import { Form, Button, Row, Col, Container, Figure } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Loader, FormContainer } from "../components";
import { getProduct, updateProduct } from "../store/products";

const ProductEditScreen = () => {
   const [inputs, setInputs] = useState({
      name: "",
      category: "",
      description: "",
      price: 0,
      discount: 0,
      countInStock: 0,
   });
   const [image, setImage] = useState("");
   const [uploading, setUploading] = useState(false);

   const dispatch = useDispatch();
   const history = useHistory();
   const { id } = useParams();
   const {
      product,
      success_update,
   } = useSelector((state) => state.products);

   useEffect(() => {
      dispatch(getProduct(id));
   }, [id, dispatch]);

   useEffect(() => {
      if (!product) return null;

      setInputs({
         name: product.name,
         category: product.category,
         description: product.description,
         price: product.price,
         discount: product.discount,
         countInStock: product.countInStock,
      });
      setImage(product.image);
   }, [product]);

   useEffect(() => {
      if(!success_update) return null;
      history.push("/admin/productlist")
   }, [history, success_update])

   const handleInputChange = (e) =>
      setInputs({ ...inputs, [e.target.name]: e.target.value });

   const handleFileChange = async (e) => {
      const img = e.target.files[0];
      const form = new FormData();
      form.append("image", img);
      try {
         const config = {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         };
         const { data } = await axios.post("/api/upload", form, config);
         setImage(data);
         setUploading(false);
      } catch (error) {
         setUploading(false);
      }
   };

   const submitHandler = (e) => {
      e.preventDefault();
      dispatch(updateProduct({
         _id: product._id,
         ...inputs,
         image
      }))
   };

   return (
      <Container>
         <Link to="/admin/productlist" className="btn btn-light my-3">
            Go Back
         </Link>
         <FormContainer>
            <h1>Edit Product</h1>
            <Form onSubmit={submitHandler}>
               <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Name:</Form.Label>
                  <Form.Control
                     type="text"
                     placeholder="Enter product name"
                     name="name"
                     value={inputs.name}
                     required
                     onChange={handleInputChange}
                  />
               </Form.Group>

               <Row>
                  <Col md={6} sm={12}>
                     <Form.Group className="mb-3" controlId="category">
                        <Form.Label>Category:</Form.Label>
                        <Form.Control
                           type="text"
                           placeholder="Enter product name"
                           name="category"
                           value={inputs.category}
                           required
                           onChange={handleInputChange}
                        />
                     </Form.Group>
                  </Col>
                  <Col md={6} sm={12}>
                     <Form.Group className="mb-3" controlId="discount">
                        <Form.Label>%Discount (optional):</Form.Label>
                        <Form.Control
                           type="number"
                           placeholder="Discount"
                           name="discount"
                           value={inputs.discount}
                           onChange={handleInputChange}
                        />
                     </Form.Group>
                  </Col>
               </Row>

               <Form.Group className="mb-3" controlId="description">
                  <Form.Label>Description:</Form.Label>
                  <Form.Control
                     as="textarea"
                     rows={3}
                     placeholder="Product description"
                     name="description"
                     value={inputs.description}
                     required
                     onChange={handleInputChange}
                  />
               </Form.Group>

               <Row>
                  <Col md={6} sm={12}>
                     <Form.Group className="mb-3" controlId="price">
                        <Form.Label>Price:</Form.Label>
                        <Form.Control
                           type="number"
                           placeholder="Price"
                           name="price"
                           value={inputs.price}
                           required
                           onChange={handleInputChange}
                        />
                     </Form.Group>
                  </Col>
                  <Col md={6} sm={12}>
                     <Form.Group className="mb-3" controlId="countInStock">
                        <Form.Label>Count in Stock:</Form.Label>
                        <Form.Control
                           type="number"
                           placeholder="Number in stock"
                           name="countInStock"
                           value={inputs.countInStock}
                           required
                           onChange={handleInputChange}
                        />
                     </Form.Group>
                  </Col>
               </Row>

               <Form.Group controlId="image" className="mb-2">
                  <Form.Label>Image:</Form.Label>
                  <Form.File
                     placeholder="Product Image"
                     name="image"
                     required
                     onChange={handleFileChange}
                  />
                  {uploading && <Loader/>}
               </Form.Group>

               {image && (
                  <Container style={{display: "flex", justifyContent: "center"}}>
                     <Figure>
                     <Figure.Image
                        width={300}
                        height={300}
                        alt="171x180"
                        src={image}
                     />
                  </Figure>
                  </Container>
               )}

               <Button variant="primary" type="submit" className="my-3">
                  Submit
               </Button>
            </Form>
         </FormContainer>
      </Container>
   );
};

export default ProductEditScreen;
