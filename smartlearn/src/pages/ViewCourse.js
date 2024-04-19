
//fetch the first chapter
//and put it in the first route
//when click refrech it gets me back to *

//i am not gonna check every route if it has connected and bought the item...

import React from 'react';
import "./ViewCourse.css"
import image from "./image.png"
import { Routes, Route } from 'react-router-dom';

import Quiz from '../components/ViewCourse/quiz';
import SideBar from '../components/ViewCourse/sideBar';
import ViewChapterBody from '../components/ViewCourse/viewChapterBody';
import Forum from '../components/ViewCourse/forum';


import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import jwt_decode from 'jwt-decode';

function ViewCourse() {

const [chaptersWithQuizzes, setChaptersWithQuizzes] = useState([]);
const{pactolusId}=useParams();
console.log(pactolusId)




  const token = localStorage.getItem('token');
  const authenticated = token !== null;
  let id = '';
  let isAdmin = false;
  let emailAdmin = '';

  const navigate=useNavigate();

let    firstChapterId="";
let    firstQuizId="";

  useEffect(() => {

    fetch(`http://localhost:3001/api/fetchallchapters?pactolusId=${pactolusId}`)
    .then(response => response.json())
    .then(data => {
      setChaptersWithQuizzes(data);
      console.log(data)
      if(chaptersWithQuizzes.length>0)
     {

       firstChapterId=chaptersWithQuizzes[0][0];
      firstQuizId=chaptersWithQuizzes[0][1];

     }
    })
    .catch(error => {
      console.error('Error fetching chapters:', error);
    });


    if (authenticated) {
      const decodedToken = jwt_decode(token);
      id = decodedToken.user_id;
      isAdmin = decodedToken.isAdmin;
      if (isAdmin) emailAdmin = decodedToken.email;
      checkPurchases(id)

    }
    else
    {
      console.log("hellow wtf")
      if(!isAdmin)
  navigate("/")

}


  }, []);


  const checkPurchases = (id) => {

    fetch(`http://localhost:3001/api/purchases/${id}`, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((data) => {
        const purchasedItems = data;
        const hasPurchased = purchasedItems.some((item) => item.pactolusId === parseInt(pactolusId));


        console.log(        purchasedItems[0].pactolusId)
        console.log(purchasedItems)
        console.log(hasPurchased)

        if (!hasPurchased&&!isAdmin) {
          // User has purchased the course, you can allow access to the components
        navigate("/")
        }

      })
      .catch((error) => {
        console.error('Error fetching purchased items:', error);

      });
  };




  return (
    <div className='ViewCourse'>
      <div className='ViewCourseBg'></div>
      <SideBar pactolusId={pactolusId} />
      <Routes>

      <Route path={`quiz/${  firstChapterId}/${firstQuizId}`}  element={<ViewChapterBody chaptersWithQuizzes={chaptersWithQuizzes}/>} index >
      </Route>


       <Route path="quiz/:chapterId/:quizId" element={<Quiz   pactolusId={pactolusId} chaptersWithQuizzes={chaptersWithQuizzes}/>} >
        </Route>
        <Route path="chapter/:chapterId/:quizId" element={<ViewChapterBody  pactolusId={pactolusId} chaptersWithQuizzes={chaptersWithQuizzes}/>} >
        </Route>
        <Route path="forum" element={<Forum pactolusId={pactolusId} />} >
        </Route>


      </Routes>

    </div>
  );
}

export default ViewCourse;
