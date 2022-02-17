import React, { useState, useEffect } from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
import { Form, Button, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { getUser, updateUser } from '../store/users'

const UserEditScreen = () => {
   const [name, setName] = useState('')
   const [email, setEmail] = useState('')
   const [isAdmin, setIsAdmin] = useState(false)

   const dispatch = useDispatch()
   const history = useHistory()
   const { id } = useParams()

   const {user, loading_update, error_update, success_update} = useSelector((state) => state.users)

   useEffect(() => {
      if (success_update) {
         dispatch({ type: "USER_UPDATE_RESET" })
         history.push('/admin/userlist')
      } else {
         if (!user.name || user._id !== id) {
            dispatch(getUser(id))
         } else {
            setName(user.name)
            setEmail(user.email)
            setIsAdmin(user.isAdmin)
         }
      }
   }, [dispatch, history, id, user, success_update])

   const handleSubmit = (e) => {
      e.preventDefault()
      dispatch(updateUser({ _id: id, name, email, isAdmin }))
   }

   return (
      <Container>
      <Link to='/admin/userlist' className='btn btn-light my-3'>
         Go Back
      </Link>
      <FormContainer>
         <h1>Edit User</h1>
         {loading_update && <Loader/>}
         {error_update && <Message variant='danger'>{error_update}</Message>}
         {loading_update ? <Loader /> : error_update ? (
            <Message variant='danger'>{error_update}</Message>) : (
            <Form onSubmit={handleSubmit}>
               <Form.Group controlId='name'>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                     type='text'
                     placeholder='Enter name'
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                  ></Form.Control>
               </Form.Group>

               <Form.Group controlId='email'>
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                     type='email'
                     placeholder='Enter email'
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                  ></Form.Control>
               </Form.Group>

               <Form.Group controlId='isAdmin'>
                  <Form.Check
                     type='checkbox'
                     label='Is Admin'
                     checked={isAdmin}
                     onChange={(e) => setIsAdmin(e.target.checked)}
                  ></Form.Check>
               </Form.Group>
               <Button type='submit' variant='primary'>
                  Update
               </Button>
            </Form>
            )}
      </FormContainer>
      </Container>
   )
}

export default UserEditScreen
