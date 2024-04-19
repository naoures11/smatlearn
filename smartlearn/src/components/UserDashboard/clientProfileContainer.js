import React, { useState, useEffect, useRef } from 'react';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import face from './face.png';
import './clientProfileContainer.css';

import jwt_decode from 'jwt-decode';




function ProfileContainer() {
  const token = localStorage.getItem('token');
  const authenticated = token !== null; // Check if token exists
  console.log(token)
  console.log(authenticated)

  let id = '';

  if (authenticated) {
    const decodedToken = jwt_decode(token);
    id = decodedToken.user_id; // Get the user's name from the decoded token
console.log(id)
  }


  const [userData, setUserData] = useState({});
  const nameRef = useRef('');
  const lastNameRef = useRef('');
  const countryRef = useRef('');
  const addressRef = useRef('');
  const phoneNumberRef = useRef('');
  const emailRef = useRef('');
  const [editMode, setEditMode] = useState(false);
  const [passwordPopupOpen, setPasswordPopupOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    // Fetch user data when the component mounts
    fetchUserData();
  }, []);

  // const fetchUserData = async () => {
  //   try {
  //     const response = await fetch(`http://localhost:3001/api/users/${id}`);
  //     const data = await response.json();
  //     setUserData(data[0]); // Assuming the response is an array with a single object
  //     console.log(userData)
  //     console.log("i made here")
  //   } catch (error) {
  //     console.error('Error fetching user data: ', error);
  //   }
  // };


  const fetchUserData = () => {
    fetch(`http://localhost:3001/api/users/${id}`)
      .then(response => response.json())
      .then(data => {
        setUserData(data[0]);
      })
      .catch(error => console.error(error));
  };

  const handleUpdate = async () => {
    const updatedUserData = {
      name: nameRef.current.value || userData.name,
      last_name: lastNameRef.current.value || userData.last_name,
      country: countryRef.current.value || userData.country,
      address: addressRef.current.value || userData.address,
      phone_number: phoneNumberRef.current.value || userData.phone_number,
      email: emailRef.current.value || userData.email,
    };

    try {
      await  fetch(`http://localhost:3001/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });

      fetchUserData();
      setEditMode(false);
      // Clear the form fields

      // Optional: You can display a success message here if needed
    } catch (error) {
      console.error('Error updating user data: ', error);
      // Optional: You can display an error message here if needed
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleChangePasswordClick = () => {
    setPasswordPopupOpen(true);
  };

  const handleCancelPasswordChange = () => {
    setPasswordPopupOpen(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handlePasswordUpdate = async () => {
    // Validate password and confirm password
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    // Check if the old password matches the stored password in the database
    try {
      const response = await fetch('http://localhost:3001/api/user/check-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userData.email, password: oldPassword , role:"user"}),
      });
      const data = await response.json();
      const isPasswordCorrect = data.isPasswordCorrect;

      if (!isPasswordCorrect) {
        alert("Old password is incorrect");
        return;
      }

      // Password validation passed, proceed with updating the password
      const updatedUserData = {
        password: newPassword,
        email:userData.email,
        role:"user"
      };

      const updateResponse = await fetch('http://localhost:3001/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });

      if (updateResponse.ok) {
        // Password update successful
        alert("Password updated successfully");
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordPopupOpen(false);
      } else {
        // Password update failed
        alert("Failed to update password");
      }
    } catch (error) {
      console.error('Error updating password: ', error);
      alert("An error occurred while updating password");
    }
  };

  return (
    <div className='pc client-profile'>
      <div className='line-1'>
        <div className='prof-pic'>
          <img src="https://www.svgrepo.com/show/28109/user.svg" alt='Profile' />
        </div>
        <div className='editButton' onClick={handleEditClick}>
          <SettingsOutlinedIcon />
        </div>
      </div>

      <h2>Client Profile</h2>
      <table className='profile-table'>
        <tbody>
          <tr>
            <td>Name:</td>
            <td>
              {editMode ? (
                <input type='text' ref={nameRef} defaultValue={userData.name} />
              ) : (
                userData.name
              )}
            </td>
          </tr>
          <tr>
            <td>Last Name:</td>
            <td>
              {editMode ? (
                <input type='text' ref={lastNameRef} defaultValue={userData.last_name} />
              ) : (
                userData.last_name
              )}
            </td>
          </tr>
          <tr>
            <td>Country:</td>
            <td>
              {editMode ? (
                <input type='text' ref={countryRef} defaultValue={userData.country} />
              ) : (
                userData.country
              )}
            </td>
          </tr>
          <tr>
            <td>Address:</td>
            <td>
              {editMode ? (
                <input type='text' ref={addressRef} defaultValue={userData.address} />
              ) : (
                userData.address
              )}
            </td>
          </tr>
          <tr>
            <td>Phone Number:</td>
            <td>
              {editMode ? (
                <input type='text' ref={phoneNumberRef} defaultValue={userData.phone_number} />
              ) : (
                userData.phone_number
              )}
            </td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>
              {editMode ? (
                <input type='text' ref={emailRef} defaultValue={userData.email} />
              ) : (
                userData.email
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* {!editMode && (
        <div>
          <button onClick={handleEditClick}>Edit</button>
        </div>
      )} */}
      {editMode && (
  <div className='updateCancelContainer'>
          <button  className='btn btn-success' onClick={handleUpdate}>Update</button>
          <button  className='btn btn-danger' onClick={handleCancelEdit}>Cancel</button>
        </div>
      )}

<div className='changePasswordContainer'>
        <div className='changePassword btn btn-dark'  onClick={handleChangePasswordClick}>
          Change Password
        </div>
      </div>

      {passwordPopupOpen && (
        <div className='password-popup-container'>
          <div className='password-popup-overlay'></div>
          <div className='password-popup'>
            <h3>Change Password</h3>
            <div>
              <label>
               <h6>Old Password:</h6>
                </label>
                <input
                  type='password'
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />

            </div>
            <div>
              <label>
                <h6>New Password:</h6>
                </label>
                <input
                  type='password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

            </div>
            <div>
              <label>
               <h6> Confirm Password:</h6>
                </label>
                <input
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

            </div>
            <div className='updateCancelContainer'>
              <button onClick={handlePasswordUpdate} className='btn btn-success' >Update Password</button>
              <button onClick={handleCancelPasswordChange} className='btn btn-danger'>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileContainer;
