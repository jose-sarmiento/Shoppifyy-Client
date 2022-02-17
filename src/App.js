import React, {useEffect} from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import {useSelector, useDispatch} from "react-redux" 
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import CartScreen from './screens/CartScreen'
import ShippingScreen from './screens/ShippingScreen'
import PaymentScreen from './screens/PaymentScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreen from './screens/OrderScreen'
import ProductScreen from './screens/ProductScreen'
import ProfileScreen from './screens/ProfileScreen'
import UserListScreen from './screens/UserListScreen'
import UserEditScreen from './screens/UserEditScreen'
import ProductListScreen from './screens/ProductListScreen'
import ProductEditScreen from './screens/ProductEditScreen'
import OrderListScreen from './screens/OrderListScreen'

import {
   Header,
   Footer
} from "./components"

import {getUser} from "./store/users"

const App = () => {
   const dispatch = useDispatch()

   const {auth} = useSelector(state => state.authentication)
   
   useEffect(() => {
      if(auth) dispatch(getUser(auth._id));
   }, [auth, dispatch])

   return (
      <Router>
         <Header />
         <main>
               <Switch>
                <Route path='/product/:id'>
                     <ProductScreen />
                  </Route> 
                  <Route path='/cart/:id?'>
                     <CartScreen />
                  </Route>
                  <Route path='/signin'>
                     <LoginScreen />
                  </Route>
                  <Route path='/register'>
                     <RegisterScreen />
                  </Route>
                   <Route path='/profile'>
                     <ProfileScreen />
                  </Route> 
                  <Route path='/shipping'>
                     <ShippingScreen />
                  </Route>
                   <Route path='/payment'>
                     <PaymentScreen />
                  </Route> 
                   <Route path='/placeorder'>
                     <PlaceOrderScreen />
                  </Route> 
                   <Route path='/order/:id'>
                     <OrderScreen />
                  </Route> 
                   <Route path='/admin/userlist'>
                     <UserListScreen />
                  </Route> 
                   <Route path='/admin/user/:id/edit'>
                     <UserEditScreen />
                  </Route> 
                   <Route path='/admin/productlist' exact>
                     <ProductListScreen />
                  </Route> 
                   <Route path='/admin/productlist/:pageNumber'>
                     <ProductListScreen />
                  </Route> 
                   <Route path='/admin/product/:id/edit'>
                     <ProductEditScreen />
                  </Route> 
                   <Route path='/admin/orderlist'>
                     <OrderListScreen />
                  </Route> 
                  <Route path='/search/:keyword' exact>
                     <HomeScreen />
                  </Route>
                  <Route path='/page/:pageNumber' exact>
                     <HomeScreen />
                  </Route>
                  <Route
                     path='/search/:keyword/page/:pageNumber'
                     exact>
                     <HomeScreen />
                  </Route>
                  <Route path='/' exact>
                     <HomeScreen />
                  </Route>
               </Switch>
         </main>
         <Footer />
      </Router>
   )
}

export default App
