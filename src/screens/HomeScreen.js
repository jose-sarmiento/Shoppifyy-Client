import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { BsFilterLeft } from "react-icons/bs";
import { FaLayerGroup } from "react-icons/fa";
import { Row, Col } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import usePaginateFetch from "../hooks/usePaginateFetch";
import banner from "../banner.jpg"

const HomeScreen = () => {
  const { keyword } = useParams();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [sort, setSort] = useState("createdAt");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("all");

  const { loading, results, error, hasNext } = usePaginateFetch(
    keyword,
    page,
    pageSize
  );

  useEffect(() => {
    if(!keyword) {
      setPage(1)
      setSort("createdAt")
      setCategory("all")
    }
  }, [keyword])

  // extract categories from the list
  useEffect(() => {
    const uniqueCategories = [...new Set(results.map((x) => x.category))];
    setCategories(["all", ...uniqueCategories]);
  }, [results]);

  // handle sorting 
  useEffect(() => {
    let sortedResults = results;
    if (category !== "all") {
      sortedResults = sortedResults.filter((x) => x.category === category);
    }

    if (sort === "createdAt") {
      sortedResults = sortedResults.sort((a, b) => a.createdAt - b.createdAt);
    }
    if (sort === "name") {
      sortedResults = sortedResults.sort((a, b) => {
        return a.name < b.name ? -1 : 1;
      });
    }
    if (sort === "price") {
      sortedResults = sortedResults.sort((a, b) => a.price - b.price);
    }
    if (sort === "itemInStock") {
      sortedResults = sortedResults.sort(
        (a, b) => a.countInStock - b.countInStock
      );
    }
    if (sort === "sale") {
      sortedResults = sortedResults.sort((a, b) => b.discount - a.discount);
    }
    setProducts([...sortedResults]);
  }, [results, category, sort]);

  // infinite scrolling
  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNext) {
            setPage((prevPage) => prevPage + 1);
          }
        },
        {
          threshold: 0.5,
        }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasNext]
  );

  const handleChange = (e) => {
    setSort(e.target.value);
  };

  const handleCategorySelect = (e) => {
    setCategory(e.target.textContent.toLowerCase());
  };

  return ( 
    <>
      {error && <Message variant="danger">{error}</Message>}

      <section className="banner">
        <img src={banner} alt="banner image" />
      </section>

      {/*<div className="nav-category"></div>*/}

      <section className="container py-0">
        <Row>
          <Col md={2} className="nav-category">
            <div className="side-category">
              <h4 className="lead">
                <BsFilterLeft className="mx-2" />
                Sort By:
              </h4>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sort"
                      value="createdAt"
                      id="createdAt"
                      onChange={handleChange}
                      checked={sort === "createdAt"}
                    />
                    <label className="form-check-label" htmlFor="createdAt">
                      Date
                    </label>
                  </div>
                </li>

                <li className="list-group-item">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sort"
                      value="name"
                      id="name"
                      onChange={handleChange}
                      checked={sort === "name"}
                    />
                    <label className="form-check-label" htmlFor="name">
                      Name
                    </label>
                  </div>
                </li>
                <li className="list-group-item">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sort"
                      value="price"
                      id="price"
                      onChange={handleChange}
                      checked={sort === "price"}
                    />
                    <label className="form-check-label" htmlFor="price">
                      Price
                    </label>
                  </div>
                </li>
                <li className="list-group-item">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sort"
                      value="itemInStock"
                      id="itemInStock"
                      onChange={handleChange}
                      checked={sort === "itemInStock"}
                    />
                    <label className="form-check-label" htmlFor="itemInStock">
                      Item in Stock
                    </label>
                  </div>
                </li>

                <li className="list-group-item">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sort"
                      value="sale"
                      id="sale"
                      onChange={handleChange}
                      checked={sort === "sale"}
                    />
                    <label className="form-check-label" htmlFor="sale">
                      Sale
                    </label>
                  </div>
                </li>
              </ul>

              <h4 className="lead mt-4">
                <FaLayerGroup className="mx-2" />
                Category
              </h4>
              <ul className="list-group list-group-flush">
                {categories.map((cat, idx) => (
                  <li
                    className={
                      cat === category
                        ? "list-group-item active"
                        : "list-group-item"
                    }
                    key={idx}
                    onClick={handleCategorySelect}
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
          </Col>
          <Col md={10}>
            <div className="container px-4 px-lg-5 mt-5">
              <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-3 justify-content-center">
                {products.map((product, idx, self) => {
                  if (idx === self.length - 1) {
                    return (
                      <Product
                        product={product}
                        key={uuidv4()}
                        ref={lastElementRef}
                      />
                    );
                  }
                  return <Product product={product} key={product._id} />;
                })}
                {loading && <Loader />}
              </div>
            </div>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default HomeScreen;
// <Paginate pages={pages} page={page} keyword={keyword && keyword} />

/*<Row>
            {products.map((product) => (
              <Col sm={12} md={3} key={product._id}>
                <Product product={product} />
              </Col>
            ))}
          </Row>*/
