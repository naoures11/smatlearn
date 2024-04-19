import React, { useState, useEffect, useRef } from 'react';
import './adminProfileContainer.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import face from './face.png';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';


function AdminProfileContainer() {
  const [adminData, setAdminData] = useState([]);
  const nameRef = useRef('');
  const emailRef = useRef('');
  const lastNameRef = useRef('');
  const [editMode, setEditMode] = useState(false);
  const [passwordPopupOpen, setPasswordPopupOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    // Fetch admin data when the component mounts
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin');
      const data = await response.json();
      setAdminData(data[0]);
    } catch (error) {
      console.error('Error fetching admin data: ', error);
    }
  };

  const handleUpdate = async () => {
    const updatedAdminData = {
      email: emailRef.current.value || adminData.email,
      name: nameRef.current.value || adminData.name,
      last_name: lastNameRef.current.value || adminData.last_name,
    };

    try {
      await fetch('http://localhost:3001/api/admin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAdminData),
      });
      // Fetch updated admin data after successful update
      fetchAdminData();
      setEditMode(false);
      // Clear the form fields

      // Optional: You can display a success message here if needed
    } catch (error) {
      console.error('Error updating admin data: ', error);
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
        body: JSON.stringify({ email : adminData.email ,password: oldPassword ,role:"admin" }),
      });
      const data = await response.json();
      const isPasswordCorrect = data.isPasswordCorrect;

      if (!isPasswordCorrect) {
        alert("Old password is incorrect");
        return;
      }

      // Password validation passed, proceed with updating the password
      const updatedAdminData = {
        password: newPassword,
        email:adminData.email,
        role:"admin"
      };

      const updateResponse = await fetch('http://localhost:3001/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAdminData),
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
    <div className='pc'>
      <div className='line-1'>
        <div className='prof-pic'>
        <img src="https://www.svgrepo.com/show/28109/user.svg" alt='Profile' />
        </div>
        <div className='editButton' onClick={handleEditClick}>
          <SettingsOutlinedIcon />
        </div>


      </div>

      <h2>Admin Profile</h2>
      <table className='profile-table'>
        <tbody>
          <tr>
            <td>Email:</td>
            <td>
              {editMode ? (
                <input type='text' ref={emailRef} defaultValue={adminData.email} />
              ) : (
                adminData.email
              )}
            </td>
          </tr>
          <tr>
            <td>Name:</td>
            <td>
              {editMode ? (
                <input type='text' ref={nameRef} defaultValue={adminData.name} />
              ) : (
                adminData.name
              )}
            </td>
          </tr>
          <tr>
            <td>Last Name:</td>
            <td>
              {editMode ? (
                <input
                  type='text'
                  ref={lastNameRef}
                  defaultValue={adminData.last_name}
                />
              ) : (
                adminData.last_name
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
          <div onClick={handleUpdate} className='update-btn btn btn-success'>Update</div>
          <div onClick={handleCancelEdit} className='cancel-btn btn btn-danger'>Cancel</div>
        </div>
      )}



<div className='changePasswordContainer'>
        <div className='changePassword btn btn-dark' onClick={handleChangePasswordClick}>Change Password</div>
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
              <h6>  New Password:</h6>
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
              <button  onClick={handlePasswordUpdate} className='btn btn-success'>Update Password</button>
              <button onClick={handleCancelPasswordChange} className='btn btn-danger'>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminProfileContainer;

