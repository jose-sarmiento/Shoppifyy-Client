import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import {
   Container,
   Table,
   Button,
   Figure,
} from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Message, Loader, Paginate, CreateProductModal } from "../components";
import { listProducts, deleteProduct } from "../store/products";
import { formatToPeso } from "../utils/formatToPeso";

const ProductListScreen = () => {
   const dispatch = useDispatch();
   const history = useHistory();
   const { pageNumber = 1 } = useParams();
   const [show, setShow] = useState(false)
   const [message, setMessage] = useState()


   const {
      loading_list,
      products,
      pages,
      page,
      loading_delete,
      error_delete,
      success_create,
      loading_create,
      error_create,
   } = useSelector((state) => state.products);

   const { auth } = useSelector((state) => state.authentication);

   useEffect(() => {
      if (!auth.isAdmin) return history.push("/");
      dispatch(listProducts("", pageNumber));
   }, [auth, history, dispatch, pageNumber]);

   useEffect(() => {
      if(success_create) {
         dispatch({type: "PRODUCT_CREATE_RESET"})
         setShow(false)
         setMessage("Product Created")
      }
   }, [dispatch, success_create, error_create])

   const deleteHandler = (id) => {
      if (window.confirm("Are you sure?")) {
         dispatch(deleteProduct(id));
      }
   };

   const handleClose = () => setShow(false)

   return (
      <Container>
         <div className="flex-between container">
            <h1>Products</h1>
            <Button className="my-3" onClick={() => setShow(true)}>
               <FaPlus /> Create Product
            </Button>
         </div>
         {loading_delete && <Loader />}
         {loading_create && <Loader />}
         {loading_list && <Loader />}
         {error_delete && <Message variant="danger">{error_delete}</Message>}
         {error_create && <Message variant="danger">{error_create}</Message>}
         {error_delete && <Message variant="danger">{error_delete}</Message>}

         <CreateProductModal 
            show={show} 
            close={handleClose} 
         /> 

         {message && <Message> {message} </Message>}

         {products && (
            <Container>

               <Table striped bordered hover responsive className="table-sm">
                  <thead>
                     <tr>
                        <th>IMAGE</th>
                        <th>NAME</th>
                        <th>PRICE</th>
                        <th>STOCK</th>
                        <th>CATEGORY</th>
                        <th>ACTIONS</th>
                     </tr>
                  </thead>
                  <tbody>
                     {products.map((product) => (
                        <tr key={product._id}>
                           <td>
                              <Figure>
                                 <Figure.Image
                                    width={120}
                                    height={150}
                                    alt={product.name}
                                    src={product.image}
                                 />
                              </Figure>
                           </td>
                           <td>{product.name}</td>
                           <td>{formatToPeso(product.price)}</td>
                           <td>{product.countInStock}</td>
                           <td>{product.category}</td>
                           <td colSpan={2}>
                              <LinkContainer
                                 to={`/admin/product/${product._id}/edit`}
                              >
                                 <Button variant="light" className="btn-sm">
                                    <FaEdit />
                                 </Button>
                              </LinkContainer>
                              <Button
                                 variant="danger"
                                 className="btn-sm"
                                 onClick={() => deleteHandler(product._id)}
                              >
                                 <FaTrash />
                              </Button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </Table>
               <Paginate pages={pages} page={page} isAdmin={true} />
            </Container>
         )}
      </Container>
   );
};

export default ProductListScreen;
