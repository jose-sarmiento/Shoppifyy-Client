import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../store/cart";
import { formatToPeso } from "../utils/formatToPeso";

const Product = React.forwardRef((props, ref) => {
  const { product } = props;
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  const handleAddToCart = () => {
    dispatch(addToCart(product._id, 1));
  };

  const inCart = (id) => {
    return cart.cartItems.find((x) => x.product === id);
  };

  return (
    <div className="col mb-5 p-3" ref={ref}>
      <div className="card h-100">
        {product.discount !== 0 && (
          <div
            className="badge bg-dark text-white position-absolute"
            style={{ top: "0.5rem", right: "0.5rem" }}
          >
            Sale
          </div>
        )}
        <Link to={`/product/${product._id}`} className="card-image">
          <img className="card-img-top" src={product.image} alt="..." />
        </Link>
        <div className="card-body p-2">
          <div className="text-center">
            <Link to={`/product/${product._id}`}>
              <h5 className="fw-bolder">{product.name}</h5>
            </Link>
            <div className="d-flex justify-content-center small text-warning mb-2">
              <div className="bi-star-fill"></div>
              <div className="bi-star-fill"></div>
              <div className="bi-star-fill"></div>
              <div className="bi-star-fill"></div>
              <div className="bi-star-fill"></div>
            </div>
            {product.discount !== 0 && (
              <span className="text-muted text-decoration-line-through">
                {formatToPeso(product.price)}
              </span>
            )}{" "}
            {formatToPeso(product.price - product.price * product.discount)}
          </div>
        </div>
        <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
          <div className="text-center">
            <button
              className="btn btn-outline-dark mt-auto"
              disabled={
                product.countInStock === 0 || inCart(product._id) ? true : false
              }
              onClick={handleAddToCart}
            >
              {product.countInStock === 0
                ? "Out of Stock"
                : inCart(product._id)
                ? "In Cart"
                : "Add to cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Product;

// <Card className='my-3 p-3 rounded'>
//       <Link to={`product/${product._id}`}>
//         <Card.Img src={product.image} variant='top' />
//       </Link>

//       <Card.Body>
//         <Link to={`product/${product._id}`}>
//           <Card.Title as='div'>
//             <strong>{product.name}</strong>
//           </Card.Title>
//         </Link>

//         <Card.Text as='div'>
//           <Rating
//             value={product.rating}
//             text={`${product.numReviews} reviews`}
//           />
//         </Card.Text>

//         <Card.Text as='h3'>${product.price}</Card.Text>
//       </Card.Body>
//     </Card>
