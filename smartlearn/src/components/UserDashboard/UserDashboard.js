import React, { useState, useEffect } from 'react';
import welcome from './welcome.png';
import "./UserDashboard.css"
import jwt_decode from 'jwt-decode';
import { ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserDashboard() {
  const token = localStorage.getItem('token');
  const authenticated = token !== null;
  console.log(token);
  console.log(authenticated);

  let userName = '';
  let decodedToken = {};
  if (authenticated) {
    decodedToken = jwt_decode(token);
    userName = decodedToken.name;
  }

  const [purchasedCourses, setPurchasedCourses] = useState([]);

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/purchases/${decodedToken.user_id}`);
        const data = await response.json();
        setPurchasedCourses(data);
        console.log(data);

        // Fetch chapters and user progress for each purchased course
        for (const course of data) {
          const chaptersResponse = await fetch(`http://localhost:3001/api/fetchallchapters/?pactolusId=${course.pactolusId}`);
          const chaptersData = await chaptersResponse.json();
          console.log(chaptersData); // Array of chapters for the current course

          const userProgressResponse = await fetch(`http://localhost:3001/api/userprogress/${decodedToken.user_id}/${course.pactolusId}`);
          const userProgressData = await userProgressResponse.json();
          console.log(userProgressData); // User progress for the current course

          const totalChapters = chaptersData.length;
          const openedChapters = userProgressData.length;
          let  progressPercentage=0;
          if (totalChapters!=0)
          progressPercentage = ((openedChapters / totalChapters) * 100).toFixed(2);

          console.log('Progress Percentage:', progressPercentage);

          // Update the purchasedCourses array with progress percentage
          setPurchasedCourses((prevCourses) => {
            return prevCourses.map((prevCourse) => {
              if (prevCourse.pactolusId === course.pactolusId) {
                console.log("meooooooooooooow"+progressPercentage)
                return { ...prevCourse, progress: progressPercentage };

              }
              return prevCourse;
            });
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPurchasedCourses();
  }, [authenticated, token]);

  return (
    <div className='wrapper-1'>
      <div className='welcome-container'>
        <span className='welcome-back-text'>Welcome back, {userName}!</span>
        <img src={welcome} alt='Welcome' />
      </div>

<div className='userprogress'>
  <h5>User Progress</h5>
  <div className='progress-container'>
  <h5>Progress per course</h5>
  <table>

    <tbody>
      {purchasedCourses.map((course) => (
        <tr key={course.pactolusId}>
          <td>{course.pactolusName}</td>
          <td>
            {course.progress === 0 ? (
              <ProgressBar now={0} label={`0% completed`} animated striped />
            ) : (
              <ProgressBar now={course.progress || 0} label={`${course.progress || 0}% completed`} animated striped />
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>



</div>


    </div>
  );
}

export default UserDashboard;
