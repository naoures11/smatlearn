import React from 'react'
import  "./ClientProfile.css";

import { useState } from 'react';


import Popup from '../components/UserDashboard/popup';

import HomeIcon from '@mui/icons-material/Home';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PortraitIcon from '@mui/icons-material/Portrait';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';



// import { CircularProgressbar } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';
import UserDashboard from '../components/UserDashboard/UserDashboard';
import AllCourses from '../components/UserDashboard/AllCourses';
import UnlockedCourses from '../components/UserDashboard/UnlockedCourses';
import ManageProfile from '../components/UserDashboard/ManageProfile';
import { Link, useNavigate } from 'react-router-dom';
import PannelItem from '../components/UserDashboard/PannelItem';

import jwt_decode from 'jwt-decode';
import { useParams } from 'react-router-dom';
import { useEffect,useContext } from 'react';
import { CartContext } from '../context/CartContext';

function ClientProfile() {
  const { cartItemCount, fetchCartItemCount } = useContext(CartContext);

  const { component } = useParams();
  const [activeComponent, setActiveComponent] = useState(component=="unlockedcourses"?"UnlockedCourses":"UserDashboard");
  // if (component === "unlockedcourses") {
  //  <UnlockedCourses />;
  //  console.log("meow")
  // }

  const navigate=useNavigate();
  const handleLogout = () => {

    const token = localStorage.getItem('token');
    const authenticated = token !== null;
      localStorage.removeItem('token');
      navigate('/')
      console.log(token);
      console.log(authenticated);
      console.log()
    };
  useEffect(() => {
    const token = localStorage.getItem('token');
    const authenticated = token !== null; // Check if token exists
    console.log(token);
    console.log(authenticated);

    let userName = '';
    let isAdmin = false;

    if (authenticated) {
      const decodedToken = jwt_decode(token);
      userName = decodedToken.name; // Get the user's name from the decoded token
      console.log(decodedToken);
      isAdmin = decodedToken.isAdmin;
  console.log("what if fuck")
    }
    else if (!authenticated||isAdmin)
      navigate('/')

  }, []);


  const renderComponent = () => {


    switch (activeComponent) {
      case "UserDashboard":
        return <UserDashboard />;
      case "UnlockedCourses":
        return <UnlockedCourses setActiveComponent={setActiveComponent} />;
      case "AllCourses":
        return <AllCourses />;
        case "ManageProfile":
          return <ManageProfile />;
      default:
        return null;
    }
  };


  return (
    <div className='bg'>

      <div className='eclipse-1'></div>
      <div className='eclipse-3'></div>
            <div className='eclipse-2'></div>

       <div className='wrap'>

            <div className='c-1'>

{/*
            <div className="website-icon">
                <img src={oud}/>
             </div> */}
                            <div className='topright'>

                              {/* <NotificationsNoneOutlinedIcon/> */}

                          <div className='shopCart'>  <Link to="/cart" > <ShoppingCartOutlinedIcon/>     {cartItemCount}</Link></div>
                          <div className='homeIcon'>  <Link to="/"> <HomeIcon/></Link></div>
                          <div className='logOut'>   <Link to="/" onClick={handleLogout}> <LogoutOutlinedIcon  /></Link></div>
                            </div>

            </div>


                <div className='c-2'>


                        <div className='pannel'>

                              <PannelItem
                              icon={<DashboardIcon/>}
                              name="Client Dashboard"
                              onClick={() => setActiveComponent("UserDashboard")}
                              isSelected={activeComponent === "UserDashboard"}
                            />
                              <PannelItem
                             icon={<LockOpenIcon/>}
                             name="Unlocked Courses"
                              onClick={() => setActiveComponent("UnlockedCourses")}
                              isSelected={activeComponent === "UnlockedCourses"}
                            />
                            {/* <Link to="courses"> */}
                              <PannelItem
                           icon={<SchoolOutlinedIcon/>}
                           name="All Courses"
                              onClick={() => setActiveComponent("AllCourses")}
                              isSelected={activeComponent === "AllCourses"}
                            />
                            {/* </Link> */}
                             <PannelItem
                           icon={<PortraitIcon />}
                           name="Manage Profile"
                              onClick={() => setActiveComponent("ManageProfile")}
                              isSelected={activeComponent === "ManageProfile"}
                            />


                      </div>
        {renderComponent()}








                </div>




       </div>




    </div>
  )
}

export default ClientProfile
