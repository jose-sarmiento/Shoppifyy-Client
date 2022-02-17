import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { savePaymentMethod } from '../store/cart'
import CheckoutSteps from '../components/CheckoutSteps'

const PaymentScreen = () => { 
  const history = useHistory()
  const dispatch = useDispatch()
  const { paymentMethod } = useSelector(state => state.cart)
  const {user} = useSelector(state => state.users)
  
  const [payment, setPayment] = useState(paymentMethod || 'PayPal')

  if(user && !user.address) {
    history.push('/shipping')
  }

  
  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(payment))
    history.push('/placeorder')
  }

  return <FormContainer>
    <CheckoutSteps step1 step2 step3 />
    <h1>Payment Method</h1>
    <Form onSubmit={submitHandler}>
      <Form.Group>
        <Form.Label as='legend'>Select Method</Form.Label>
        <Col>
          <Form.Check type='radio' 
          label='PayPal or Credit Card'
          id='Paypal'
          name='paymentMethod'
          value='PayPal'
          checked={payment === "PayPal"}
          onChange={(e)=>setPayment(e.target.value)} >
          </Form.Check>
          <Form.Check type='radio' 
          label='Cash on Delievery'
          id='cod'
          name='paymentMethod'
          value='cod'
          checked={payment === "cod"}
          onChange={(e)=>setPayment(e.target.value)} >
          </Form.Check>
        </Col>
        </Form.Group>
        <Button type='submit' variant='primary'>
          Continue
        </Button>
    </Form>
  </FormContainer>
}

export default PaymentScreen
