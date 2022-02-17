import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Table, Button, Container } from "react-bootstrap";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listUsers, deleteUser, updateUserAdmin } from "../store/users";

const UserListScreen = () => {
   const dispatch = useDispatch();
   const history = useHistory();

   const { users, loading_list, error_list, success_delete } = useSelector(
      (state) => state.users
   );

   const { auth } = useSelector((state) => state.authentication);

   useEffect(() => {
      if (auth && auth.isAdmin) {
         dispatch(listUsers());
      } else {
         history.push("/");
      }
   }, [dispatch, history, success_delete, auth]);

   const deleteHandler = (id) => {
      if (window.confirm("Are you sure?")) {
         dispatch(deleteUser(id));
      }
   };

   const setAdminHandler = (id) => {
      dispatch(updateUserAdmin({
         userId: id, 
         isAdmin: true
      }))
   }

   const demoteAdminHandler = (id) => {
      dispatch(updateUserAdmin({
         userId: id, 
         isAdmin: false
      }))
   }

   return (
      <Container>
         <h1>Users</h1>
         {loading_list && <Loader />}
         {error_list && <Message variant="danger">No users</Message>}
         {users && (
            <Table striped hover responsive className="table-sm">
               <thead>
                  <tr>
                     <th>ID</th>
                     <th>NAME</th>
                     <th>EMAIL</th>
                     <th>ADMIN</th>
                     <th>ACTIONS</th>
                  </tr>
               </thead>
               <tbody>
                  {users.map((user) => (
                     <tr key={user._id}>
                        <td>{user._id}</td>
                        <td>
                           {user.name.firstname + " " + user.name.lastname}
                        </td>
                        <td>
                           <a href={`mailto:${user.email}`}>{user.email}</a>
                        </td>
                        <td>
                           {user.isAdmin ? (
                              <FaCheck style={{ color: "green" }} />
                           ) : (
                              <FaTimes style={{ color: "red" }} />
                           )}
                        </td>
                        <td>
                           {user.isAdmin && user._id === auth._id ? (
                              <Button
                                 variant="success"
                                 className="btn-sm w-100"
                                 disabled={true}
                              >
                                 You
                              </Button>
                           ) : user.isAdmin ? (
                              <div className="btn-between">
                                 <Button variant="danger" className="btn-sm mx-1" onClick={() => demoteAdminHandler(user._id)}>
                                    demote
                                 </Button>
                                 <Button
                                    variant="danger"
                                    className="btn-sm"
                                    onClick={() => deleteHandler(user._id)}
                                 >
                                    <FaTrash />
                                 </Button>
                              </div>
                           ) : (
                              <div className="btn-between">
                                 <Button variant="success" className="btn-sm mx-1" onClick={() => setAdminHandler(user._id)}>
                                    set admin
                                 </Button>
                                 <Button
                                    variant="danger"
                                    className="btn-sm"
                                    onClick={() => deleteHandler(user._id)}
                                 >
                                    <FaTrash />
                                 </Button>
                              </div>
                           )}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </Table>
         )}
      </Container>
   );
};

export default UserListScreen;
