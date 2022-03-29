import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center pt-3'>Copyright &copy; Shoppifyy</Col>
          <small className='text-center'>sample products is provided by <b>fakestoreapi.com</b></small>
          <small className='text-center'><a href="https://www.freepik.com/vectors/banner">Banner vector created by freepik - www.freepik.com</a></small>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
