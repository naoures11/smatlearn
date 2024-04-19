import React, { useState } from 'react';
import "./Dashboard.css";

import AdminDashboard from '../components/AdminDashboard/AdminDashboard';
import ManageCourses from '../components/AdminDashboard/ManageCourses';
import ManageUsers from '../components/AdminDashboard/ManageUsers';

import ManageProfile from '../components/AdminDashboard/ManageProfile';
import ManageWebsite from '../components/AdminDashboard/ManageWebsite';



import HomeIcon from '@mui/icons-material/Home';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

import PortraitIcon from '@mui/icons-material/Portrait';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';

import PannelItem from '../components/UserDashboard/PannelItem';

import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { Link } from 'react-router-dom';

function Dashboard() {
  const [activeComponent, setActiveComponent] = useState("AdminDashboard");

  const [comments, setComments] = useState([]);
  const [purchases, setPurchases] = useState([]);

  const [notifications, setNotifications] = useState([]);


  const [showNotification, setShowNotification] = useState(false);
  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };


  const fetchData = async () => {
    try {
      const purchasesResponse = await fetch('http://localhost:3001/api/purchases');
      const purchasesData = await purchasesResponse.json();
      setPurchases(purchasesData);

      const commentsResponse = await fetch('http://localhost:3001/api/comments');
      const commentsData = await commentsResponse.json();
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    // Merge and sort the comments and purchases
    const mergedNotifications = [...comments, ...purchases];
    mergedNotifications.sort((a, b) => {
      const dateA = new Date(a.date_of_creation || a.date_of_purchase);
      const dateB = new Date(b.date_of_creation || b.date_of_purchase);
      return dateB - dateA;
    });
    setNotifications(mergedNotifications);
  }, [comments, purchases]);


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
  const renderNotifications = () => {
    return notifications.map((notification) => {
      if (notification.comment_id) {
        // Render comment notification
        return (



          <div key={notification.comment_id} className='comment-notification'>
            <Link to={`/viewCourse/${notification.pactolus_id}/true`}>

            <h5>{notification.user_name} commented on {notification.pactolus_name}</h5>
            <p>{notification.comment_text}</p>
            <p>On : { formatDate (notification.date_of_creation)}</p>
            </Link>
          </div>

        );
      } else  {
        // Render purchase notification
        return (
          <div key={notification.id}>
            <h5>{notification.user_name} made a purchase</h5>
            <p>Purchased: {notification.pactolus_name}</p>
            <p>On : { formatDate (notification.date_of_purchase)}</p>
          </div>
        );
      }
    });
  };





  const renderComponent = () => {
    console.log(activeComponent)
    switch (activeComponent) {
      case "AdminDashboard":
        return <AdminDashboard />;
      case "manageUsers":
        return <ManageUsers />;
      case "manageCourses":
        return <ManageCourses />;

      case "manageProfile":
        return <ManageProfile />;
        case "manageWebsite":
          return <ManageWebsite />;
      default:
        return null;
    }
  };

  let userName = '';
  let isAdmin = false;

let navigate=useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('token');
    const authenticated = token !== null; // Check if token exists
    console.log(token);
    console.log(authenticated);



    if (authenticated) {
      console.log("authenticated")
      const decodedToken = jwt_decode(token);
      userName = decodedToken.name; // Get the user's name from the decoded token
      console.log(decodedToken);
      isAdmin = decodedToken.isAdmin;
       if (!isAdmin)
      navigate('/')
  console.log("what if fuck")
    }
    else{
      navigate('/')
    }


  }, []);


  const handleLogout = () => {

  const token = localStorage.getItem('token');
  const authenticated = token !== null;
    localStorage.removeItem('token');
    navigate('/')
    console.log(token);
    console.log(authenticated);
    console.log()
  };

  return (
    (
    <div className='bg'>
      <div className='eclipse-1'></div>
      <div className='eclipse-3'></div>
      <div className='eclipse-2'></div>
      <div className='wrap'>
        <div className='c-1'>
          <div className='topright'>

            {showNotification && (
      <div className="notification-box">
               <h2>Notifications</h2>
      {renderNotifications()}
      </div>
    )}
    <div className='topright'>
   <div className='shopCart'><NotificationsNoneOutlinedIcon onClick={toggleNotification}/></div>
   <div className='homeIcon'>  <Link to="/"> <HomeIcon/></Link></div>
<div className='logOut'>   <Link to="/" onClick={handleLogout}> <LogoutOutlinedIcon  /></Link></div>
</div>
          </div>
        </div>

        <div className='c-2'>
        <div className='pannel'>
          <PannelItem
            icon={<DashboardIcon />}
            name="Admin Dashboard"
            onClick={() => setActiveComponent("AdminDashboard")}
            isSelected={activeComponent === "AdminDashboard"}
          />
          <PannelItem
            icon={<LockOpenIcon />}
            name="Manage Users"
            onClick={() => setActiveComponent("manageUsers")}
            isSelected={activeComponent === "manageUsers"}
          />
          <PannelItem
            icon={<SchoolOutlinedIcon />}
            name="Manage Courses"
            onClick={() => setActiveComponent("manageCourses")}
            isSelected={activeComponent === "manageCourses"}
          />

          <PannelItem
            icon={<PortraitIcon  />}
            name="Manage Profile"
            onClick={() => setActiveComponent("manageProfile")}
            isSelected={activeComponent === "manageProfile"}
          />
         <PannelItem
            icon={<SchoolOutlinedIcon />}
            name="Manage Website"
            onClick={() => setActiveComponent("manageWebsite")}
            isSelected={activeComponent === "manageWebsite"}
          />
        </div>
        {renderComponent()}
      </div>
      </div>
    </div>)
  );
}

export default Dashboard;
