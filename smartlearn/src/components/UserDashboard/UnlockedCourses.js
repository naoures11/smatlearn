// import React, { useState, useEffect } from 'react';
// import jwt_decode from 'jwt-decode';
// import { Link } from 'react-router-dom';
// import r from './r.png'

// import "./UnlockedCourses.css"
// function UnlockedCourses({setActiveComponent}) {
//   const [purchasedPactolusItems, setPurchasedPactolusItems] = useState([]);
//   const token = localStorage.getItem('token');
//   const authenticated = token !== null;
//   let userId =""

//   if (authenticated)
//  {   const decodedToken = jwt_decode(token);



//   userId = decodedToken.user_id;
// }





//   useEffect(() => {
//     fetchPurchasedPactolusItems();
//   }, []);

//   const fetchPurchasedPactolusItems = () => {
//     // Make a fetch request to the API endpoint that retrieves the purchased Pactolus items
//     fetch(`http://localhost:3001/api/purchases/${userId}`, {
//       method: 'GET'
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         setPurchasedPactolusItems(data);
//       })
//       .catch((error) => {
//         console.error('Error fetching purchased Pactolus items:', error);
//       });
//   };

//   return (
//     <div className='ManageCourses'>

//       <div className='PactolusName'>
//       Unlocked Courses
// </div>
//       {purchasedPactolusItems.length === 0 ? (
//           <div className='PactolusWrap'>
//         <div className='noitemsfound'>No purchased courses found.
//         <div className='addButton'    onClick={() => setActiveComponent("AllCourses")}>
//        {/* <Link to="/courses">  */}
//         Browse Courses
//         {/* </Link> */}
//         </div>
//         </div>
//         </div>
//       ) : (
//         <div className='PactolusWrap'>
//           {purchasedPactolusItems.map((item) => (
//              <div
//              className={`Pactolus-1 `}
//              key={item.pactolusId}
//      >
//                    <img src={r} alt="Pactolus" />
//                    <div className='PactolusName-1'>{item.pactolusName}</div>





//               <div className='addButton' >
//               <Link to={`/viewCourse/${item.pactolusId}`}>
//                 View Courses
//               </Link>
//               </div>



//          </div>








//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default UnlockedCourses;




import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { Link } from 'react-router-dom';
import r from './r.png'

import { ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import "./UnlockedCourses.css"
function UnlockedCourses({setActiveComponent}) {



  const [purchasedPactolusItems, setPurchasedPactolusItems] = useState([]);
  const token = localStorage.getItem('token');
  const authenticated = token !== null;
  let userId =""
  let userName = '';
  let decodedToken = {};
  if (authenticated)
 {      decodedToken = jwt_decode(token);
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



  useEffect(() => {
    fetchPurchasedPactolusItems();
  }, []);

  const fetchPurchasedPactolusItems = () => {
    // Make a fetch request to the API endpoint that retrieves the purchased Pactolus items
    fetch(`http://localhost:3001/api/purchases/${userId}`, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((data) => {
        setPurchasedPactolusItems(data);
      })
      .catch((error) => {
        console.error('Error fetching purchased Pactolus items:', error);
      });
  };

  return (
    <div className='ManageCourses'>

      <div className='PactolusName'>
      Unlocked Courses
</div>
      {purchasedCourses.length === 0 ? (
          <div className='PactolusWrap'>
        <div className='noitemsfound'>No purchased courses found.
        <div className='addButton'    onClick={() => setActiveComponent("AllCourses")}>
       {/* <Link to="/courses">  */}
        Browse Courses
        {/* </Link> */}
        </div>
        </div>
        </div>
      ) : (
        <div className='PactolusWrap'>
          {purchasedCourses.map((item) => (
             <div
             className={`Pactolus-1 `}
             key={item.pactolusId}
     >
                   <img src={r} alt="Pactolus" />
                   <div className='PactolusName-1'>{item.pactolusName}</div>





              <div className='addButton' >
              <Link to={`/viewCourse/${item.pactolusId}`}>
                View Courses
              </Link>
              </div>

<div className='progress-wrap'>
              {item.progress === 0 ? (
  <ProgressBar now={0} label={`0% completed`} animated striped />
) : (
  <ProgressBar now={item.progress || 0} label={`${item.progress || 0}% completed`} animated striped />
)}
</div>

</div>






          ))}
        </div>
      )}
    </div>
  );
}

export default UnlockedCourses;
