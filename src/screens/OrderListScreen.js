import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Container } from 'react-bootstrap'
import { FaTimes } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import {Message, Loader} from '../components'
import { listOrders } from '../store/orders'
import { formatToPeso} from "../utils/formatToPeso"


const OrderListScreen = () => {
   const dispatch = useDispatch()
   const history = useHistory()

   const {orders, loading_list, error_list} = useSelector((state) => state.orders)

   const {auth} = useSelector((state) => state.authentication)

   useEffect(() => {
      if (auth && auth.isAdmin) {
         dispatch(listOrders())
      } else {
         history.push('/')
      }
   }, [dispatch, history, auth])

   return (
      <Container>
         <h1>Orders</h1>
         {loading_list && <Loader />}
         {error_list && <Message variant='danger'>{error_list}</Message>}
         {orders && (
            <Table striped bordered hover responsive className='table-sm'>
               <thead>
                  <tr>
                     <th>ID</th>
                     <th>USER</th>
                     <th>DATE</th>
                     <th>TOTAL PRICE</th>
                     <th>PAID</th>
                     <th>DELIVERED</th>
                     <th></th>
                  </tr>
               </thead>
               <tbody>
                  {orders.map((order) => (
                     <tr key={order._id}>
                        <td>{order._id}</td>
                        <td className="capitalize">{order.user && order.user.name.firstname + " " + order.user.name.lastname}</td>
                        <td>{order.createdAt.substring(0, 10)}</td>
                        <td>{formatToPeso(order.totalPrice)}</td>
                        <td>
                           {order.isPaid ? (
                              order.paidAt.substring(0, 10)
                           ) : (
                              <FaTimes style={{ color: 'red' }} />
                           )}
                        </td>
                        <td>
                           {order.isDelivered ? (
                              order.deliveredAt.substring(0, 10)
                           ) : (
                              <FaTimes style={{ color: 'red' }} />
                           )}
                        </td>
                        <td>
                           <LinkContainer to={`/order/${order._id}`}>
                              <Button variant='light' className='btn-sm'>
                                 Details
                              </Button>
                           </LinkContainer>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </Table>
         )}
      </Container>
   )
}

export default OrderListScreen
