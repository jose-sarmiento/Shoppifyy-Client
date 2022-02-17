import React, { useState, useEffect } from 'react'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Form } from 'react-bootstrap'
import { Message, Loader } from '../components'
import {FormContainer, LoginWithGoogle} from '../components'
import { register } from '../store/auth'

const RegisterScreen = () => {
  const [name, setName] = useState({firstname: "", lastname: ""})
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState(null)

  const location = useLocation()
  const history = useHistory()
  const dispatch = useDispatch()

  const { auth, loading_register, error_register } = useSelector(state => state.authentication)

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (auth) {
      history.push(redirect)
    }
  }, [history, auth, redirect])

  const handleSubmit = e => {
    e.preventDefault()
    setMessage(null)
    if (password !== confirmPassword) {
      setMessage('Password do not match')
    } else {
      dispatch(register({
        name: {
          firstname: name.firstname,
          lastname: name.lastname,
        },
        password,
        email,
        phone,
      }))
    }
  }

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      {message && <Message variant='danger'>{message}</Message>}
      {error_register && <Message variant='danger'>{error_register}</Message>}
      {loading_register && <Loader />}
      <form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group controlId='firstname' className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter firstname'
                value={name.firstname}
                name="firstname"
                onChange={e => setName({...name, [e.target.name]: e.target.value})}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId='lastname' className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter lastname'
                value={name.lastname}
                name="lastname"
                onChange={e => setName({...name, [e.target.name]: e.target.value})}
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>


        <Form.Group controlId='email' className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={e => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='phone' className="mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter phone number'
            value={phone}
            onChange={e => setPhone(e.target.value)}
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

        <Form.Group controlId='confirmPassword' className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Sign Up
        </Button>
      </form>

      <Row className='py-3'>
        <Col>
          Have an account?{' '}
          <Link to={redirect ? `/signin?redirect=${redirect}` : '/signin'}>
            Login
          </Link>
        </Col>
      </Row>

      <LoginWithGoogle/>
    </FormContainer>
  )
}

export default RegisterScreen
