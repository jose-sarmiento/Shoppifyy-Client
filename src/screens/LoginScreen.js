import React, { useState, useEffect } from 'react'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { Button, Row, Col, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import {Message, Loader, LoginWithGoogle} from '../components'
import FormContainer from '../components/FormContainer'
import { login } from '../store/auth'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const location = useLocation()
  const history = useHistory()
  const dispatch = useDispatch()

  const { auth, loading_login, error_login } = useSelector(state => state.authentication)


  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (auth) {
      history.push(redirect)
    }
  }, [history, auth, redirect])

  const handleSubmit = e => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error_login && <Message variant='danger'>{error_login}</Message>}
      {loading_login && <Loader />}
      <form onSubmit={handleSubmit}>
        <Form.Group controlId='email' className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={e => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='password' className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary'>
          Sign In
        </Button>
      </form>


      <Row className='py-3'>
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Register
          </Link>
        </Col>
      </Row>

      {/*<hr/>*/}

      <LoginWithGoogle />
    </FormContainer>
  )
}

export default LoginScreen
