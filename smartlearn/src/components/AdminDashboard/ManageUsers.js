import React, { useEffect, useState } from 'react';
import "./ManageUsers.css"
import LittleAlertBox from '../LittleAlertBox';
import { AddCircleOutlineOutlined, SettingsOutlined, DeleteForeverOutlined, PauseCircleSharp } from '@mui/icons-material';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import DeleteConfirmationDialog from '../dialoguePopUp';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { Link } from 'react-router-dom';
import r from "./r.png"
function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [modifiedUserData, setModifiedUserData] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [newUserData, setNewUserData] = useState({});

  const [errorAlert,setErrorAlert]=useState("");
  const [successAlert,setSuccessAlert]=useState("");
  useEffect(() => {fetchUsersList();}, []);


  const fetchUsersList= () => {
    fetch('http://localhost:3001/api/users')
    .then((response) => response.json())
    .then((data) => setUsers(data))
    .catch((error) => console.error(error));
}

  const handleEditUser = (userId) => {
    const user = users.find((user) => user.id === userId);
    setEditedUser(user);
    setModifiedUserData(user);
  };

  const handleSaveUser = () => {
    // Perform the save operation here using the modifiedUserData
    console.log('Save user:', modifiedUserData);
    setUsers(prevUsers => {
      return prevUsers.map(user => {
        if (user.id === editedUser.id) {
          return { ...user, ...modifiedUserData };
        }
        return user;
      });
    });

    fetch(`http://localhost:3001/api/users/${editedUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(modifiedUserData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('User data updated in the database:', data);
      })
      .catch(error => {
        console.error('Error updating user data:', error);
      });

    setEditedUser(null);
    setModifiedUserData({});
  };

  const handleCancelEdit = () => {
    setEditedUser(null);
    setModifiedUserData({});
  };

  const handleDeleteUser = (userId) => {
    console.log('Delete user:', userId);

    fetch(`http://localhost:3001/api/users/${userId}`, {
      method: 'DELETE'
    })
      .then((response) => {
        if (response.ok) {
          console.log('User deleted successfully');
          // Update the users state by removing the deleted user
          setUsers((prevState) => prevState.filter(user => user.id !== userId));
        } else {
          console.error('Error deleting user:', response.status);
        }
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
      setIsDeleteDialogOpen(false)
  };

  const handleConsultPurchases = (userId) => {
    setSelectedUserId(userId);
    setIsLoading(true);

    fetch(`http://localhost:3001/api/purchases/${userId}`, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((data) => {
        setPurchasedItems(data);
        console.log(data)
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching purchased items:', error);
        setIsLoading(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModifiedUserData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleNewUserInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // useEffect(() => {
  //   setAlert("");
  // }, [alert]);
  const handleAddUser = (e) => {
    e.preventDefault();
    console.log('Add user:', newUserData);
    const emailExists = users.some(user => user.email === newUserData.email);
    if (emailExists) {
      console.log('Email already exists');
      setErrorAlert('Email already exists')
      setTimeout(() => {
        setErrorAlert('');
      }, 1000); // Delay of 1 second (1000 milliseconds)

      return;
    }

   else{
  if(newUserData.password!="")
    fetch('http://localhost:3001/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUserData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('User added to the database:', data);
        setUsers(prevUsers => [...prevUsers, data]);
        setNewUserData({});
        setShowPopup(false);
        setSuccessAlert('user is added to the database successfully')
        setTimeout(() => {
          setSuccessAlert('');
        }, 1000);
        fetchUsersList()
      })
      .catch(error => {
        console.error('Error adding user:', error);
      });
      else
      {
        setErrorAlert('password field is empty')
        setTimeout(() => {
          setErrorAlert('');
        }, 1000);
      }
    }
  };
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userIdToDelte,setUserIdToDelete] = useState(0);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return new Intl.DateTimeFormat(undefined, options).format(date);
  };

  return (
    <div className='manage-users'>
      <h1>Users</h1>
      <button onClick={() => setShowPopup(true)} className='addButton'>Add a user</button>
      <table className="table table-striped table-hover table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Last Name</th>
            <th>Country</th>
            <th>Address</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>

          {users.slice(1).map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {editedUser && editedUser.id === user.id ? (
                  <input
                    type="text"
                    name="name"
                    value={modifiedUserData.name || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editedUser && editedUser.id === user.id ? (
                  <input
                    type="text"
                    name="last_name"
                    value={modifiedUserData.last_name || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  user.last_name
                )}
              </td>
              <td>
                {editedUser && editedUser.id === user.id ? (
                  <input
                    type="text"
                    name="country"
                    value={modifiedUserData.country || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  user.country
                )}
              </td>
              <td>
                {editedUser && editedUser.id === user.id ? (
                  <input
                    type="text"
                    name="address"
                    value={modifiedUserData.address || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  user.address
                )}
              </td>
              <td>
                {editedUser && editedUser.id === user.id ? (
                  <input
                    type="text"
                    name="phone_number"
                    value={modifiedUserData.phone_number || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  user.phone_number
                )}
              </td>
              <td>
                {editedUser && editedUser.id === user.id ? (
                  <input
                    type="text"
                    name="email"
                    value={modifiedUserData.email || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editedUser && editedUser.id === user.id ? (
                  <div className='actions'>
                    <div onClick={handleSaveUser}><CheckIcon/></div>
                    <div onClick={handleCancelEdit}><ClearIcon/></div>
                  </div>
                ) : (
                  <div className='actions'>
                    <div onClick={() => handleEditUser(user.id)}><SettingsOutlined/></div>
                    <div onClick={() => {setIsDeleteDialogOpen(true);setUserIdToDelete(user.id)}} ><DeleteForeverOutlined/></div>
                    <div onClick={() => handleConsultPurchases(user.id)}><ShoppingBasketIcon/></div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>


     {setIsDeleteDialogOpen&&(   <DeleteConfirmationDialog
  open={isDeleteDialogOpen}
  onClose={() => setIsDeleteDialogOpen(false)}
  onConfirm={() => handleDeleteUser(userIdToDelte)}
/>
)
}
      {showPopup && (

        <div className='popup-container-add-user'>
      <div className='popup-overlay'></div>
      <div className='popup-content'>
      <form>
            <h2>Add a user</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newUserData.name || ''}
              onChange={handleNewUserInputChange} required
            />


            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={newUserData.last_name || ''}
              onChange={handleNewUserInputChange} required
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={newUserData.country || ''}
              onChange={handleNewUserInputChange} required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={newUserData.address || ''}
              onChange={handleNewUserInputChange} required
            />
            <input
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              value={newUserData.phone_number || ''}
              onChange={handleNewUserInputChange} required
            />
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={newUserData.email || ''}
              onChange={handleNewUserInputChange} required
            />
            <input
            type="password"
            name="password" // Add the name attribute
            placeholder="Password"
            value={newUserData.password || ''}
            onChange={handleNewUserInputChange}
            required
          />
    <div className='popup-footer'>
            <button onClick={(e)=>handleAddUser(e)} className='btn btn-danger'>Save</button>
            <button onClick={() => setShowPopup(false)} className='btn btn-success close-button'> Cancel</button>
            </div>
            </form>
          </div>
        </div>

      )}
         {errorAlert && (
          <LittleAlertBox message={errorAlert} isSuccess={false} />
        )}
            {successAlert && (
          <LittleAlertBox message={successAlert} isSuccess={true} />
        )}
      {selectedUserId && (
        <div className="popup">
          <div className="popup-content">
          <h2>Purchased courses By {users.find(user => user.id === selectedUserId)?.name}</h2>

            {isLoading ? (
              <p>Loading...</p>
            ) : (
         <>
                {purchasedItems.length === 0 ? (




                  <div>No purchased courses found.</div>
                ) : (

                  <div className='PactolusWrap'>
                  {purchasedItems.map((item) => (
                     <div
                     className={`Pactolus-1 `}
                     key={item.pactolusId}
             >
                           <img src={r} alt="Pactolus" />
                           <div className='PactolusName-1'>{item.pactolusName}</div>



                           <div className='PactolusInformations-1'>Purchased the :<br/>{formatDate(item.date_of_purchase)}</div>

                 </div>
                  ))}
                </div>
                )}
            </>
            )}
            <div onClick={() => setSelectedUserId(null)}  className='cancel-btn btn btn-danger close-button'>Close</div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ManageUsers;

