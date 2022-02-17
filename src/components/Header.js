import React from "react";
import { useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SearchBox from "./SearchBox"
import { logout } from "../store/auth";
import defaultImage from "../default.png";

const Header = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const { auth } = useSelector((state) => state.authentication);

    const { cartItems } = useSelector((state) => state.cart);

    const handleUserLogout = (e) => {
        e.preventDefault();
        dispatch(logout());
        history.push("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container px-4 px-lg-5">
                <Link className="navbar-brand" to="/">
                    Shoppifyy
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className="collapse navbar-collapse bg-light"
                    id="navbarSupportedContent"
                >
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                        {/*<li className="nav-item">
                            <Link
                                className="nav-link active"
                                aria-current="page"
                                to="/"
                            >
                                Home
                            </Link>
                        </li>*/}
                        
                            <SearchBox/>

                            

                        
                    </ul>


                    <div className="d-flex justify-content-center align-items-center navbar-nav">
                        {auth && (
                            <div className="header-profile">
                                <img
                                    className="header-profile-img"
                                    alt={auth?.name.firstname}
                                    src={
                                        auth && auth.picture
                                            ? auth.picture
                                            : defaultImage
                                    }
                                />
                            </div>
                        )}

                        {auth ? (
                            <li className="nav-item dropdown">
                                <button
                                    className="nav-link dropdown-toggle dropdown-toggle-name btn btn-white"
                                    id="navbarDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {auth.name.firstname +
                                        " " +
                                        auth.name.lastname}
                                </button>
                                <ul
                                    className="dropdown-menu"
                                    aria-labelledby="navbarDropdown"
                                >
                                    <li>
                                        <Link
                                            className="dropdown-item"
                                            to="/profile"
                                        >
                                            Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="dropdown-item"
                                            to="/logout"
                                            onClick={handleUserLogout}
                                        >
                                            Logout
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <li className="nav-item mx-2">
                                <Link className="nav-link" to="/signin">
                                    Signin
                                </Link>
                            </li>
                        )}

                        {auth && auth.isAdmin && (
                            <li className="nav-item dropdown show mx-2">
                                <Link
                                    className="nav-link dropdown-toggle"
                                    id="navbarDropdown"
                                    to="/dashboard"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Dashboard
                                </Link>
                                <ul
                                    className="dropdown-menu"
                                    aria-labelledby="navbarDropdown"
                                >
                                    <li>
                                        <Link
                                            className="dropdown-item"
                                            to="/admin/userlist"
                                        >
                                            Users
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="dropdown-item"
                                            to="/admin/productlist"
                                        >
                                            Products
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            className="dropdown-item"
                                            to="/admin/orderlist"
                                        >
                                            Orders
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        )}

                        <Link to="/cart" className="btn btn-outline-dark">
                            <i className="bi-cart-fill me-1"></i>
                            Cart
                            <span className="badge bg-dark text-white ms-1 rounded-pill">
                                {cartItems.length}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
