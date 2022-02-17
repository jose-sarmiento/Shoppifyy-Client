import React, { useState } from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import axios from "axios"
import {useDispatch} from "react-redux"
import {Loader} from "../components"
import {createProduct} from "../store/products"

const CreateProductModal = ({ show, close }) => {
   const dispatch = useDispatch()
   const [inputs, setInputs] = useState({
      name: "",
      category: "",
      description: "",
      price: 0,
      discount: 0,
      countInStock: 0,
   });
   const [image, setImage] = useState("");
   const [uploading, setUploading] = useState(false)

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
         console.log(data)
         setImage(data);
         setUploading(false);
      } catch (error) {
         console.log(error);
         setUploading(false);
      }
   };

   const submitHandler = (e) => {
      e.preventDefault();
      dispatch(createProduct({...inputs, image}))
   };

   const handleClose = () => {
      setInputs({
         name: "",
         category: "",
         description: "",
         price: 0,
         discount: 0,
         countInStock: 0,
      });
      setImage("");
      close();
   };

   return (
      <Modal
         show={show}
         aria-labelledby="contained-modal-title-vcenter"
         centered
         size="lg"
         onHide={handleClose}
      >
         <Modal.Header closeButton>
            <Modal.Title>Create Product</Modal.Title>
         </Modal.Header>

         <Modal.Body>
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

               <Form.Group className="mb-5" controlId="image">
                  <Form.Label>Image:</Form.Label>
                  <Form.File
                     placeholder="Product Image"
                     name="image"
                     required
                     onChange={handleFileChange}
                  />
                  {uploading && <Loader/>}
               </Form.Group>

               {image && <img src={image} alt="preview" />}

               <Button variant="primary" type="submit">
                  Submit
               </Button>
            </Form>
         </Modal.Body>
      </Modal>
   );
};

export default CreateProductModal;
