import React, { useEffect, useState } from 'react';
import "./sideBar.css"
import { Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';


import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';

function SideBar({ pactolusId }) {
  const [chaptersWithQuizzes, setChaptersWithQuizzes] = useState([]);
  const [userId, setUserId] = useState('');
  const [userProgress, setUserProgress] = useState([]);
  const [unlockedChapters, setUnlockedChapters] = useState([]);
  const [completedChapters, setCompletedChapters] = useState([]);
  let isAdmin = false;
  useEffect(() => {
    const token = localStorage.getItem('token');
    const authenticated = token !== null;

    if (authenticated) {
      const decodedToken = jwt_decode(token);
      setUserId(decodedToken.user_id);
      isAdmin = decodedToken.isAdmin;
      console.log("loooooooooooged");
    } else {
      console.log("not loooooooog");
    }
  }, []);

  useEffect(() => {
    // Fetch chapters with quizzes
    fetch(`http://localhost:3001/api/fetchallchapters?pactolusId=${pactolusId}`)
      .then(response => response.json())
      .then(data => {
        setChaptersWithQuizzes(data);
      })
      .catch(error => {
        console.error('Error fetching chapters:', error);
      });
  }, [pactolusId]);

  const fetchUserProgress = async (userId, pactolusId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/userprogress/${userId}/${pactolusId}`);
      if (!response.ok) {
        throw new Error('Error fetching user progress');
      }
      const data = await response.json();
      setUserProgress(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  };

  const pollUserProgress = () => {
    setInterval(() => {
      fetchUserProgress(userId, pactolusId);
    }, 2000); // Fetch user progress every 5 seconds (adjust the interval as needed)
  };

  useEffect(() => {
    if (userId !== '') {
      // Fetch initial user progress
      fetchUserProgress(userId, pactolusId);
      // Start polling for updates
      pollUserProgress();
    }
  }, [userId, pactolusId]);


  useEffect(() => {
    const unlocked = userProgress
      .filter(progress => progress.is_unlocked === 1)
      .map(progress => progress.chapter_id);
    setUnlockedChapters(unlocked);

    const completed = userProgress
    .filter(progress => progress.is_completed === 1)
    .map(progress => progress.chapter_id);
  setCompletedChapters(completed);

  }, [userProgress]);



  const isChapterInUserProgress = (chapterId) => {
    return userProgress.some((progress) => progress.chapter_id === chapterId);
  };

  return (
    <div className="sidebar">
      <h2>Chapters List</h2>
      <ul className="chapters-list">
        {chaptersWithQuizzes.map(([chapterId, quizId], index) => (
          <React.Fragment key={index}>
            {index==0?
             (

              <Link to={`/viewcourse/${pactolusId}/chapter/${chapterId}/${quizId}`} className='custom-link'>
              <li className="unlocked chapter-item" key={`chapter-${chapterId}`}   >
              <LockOpenIcon/>      Chapter {index + 1}
              </li>
              </Link>
             ):
            ((unlockedChapters.includes(chapterId)===true)||completedChapters.includes(chapterId)||(isChapterInUserProgress(chapterId))?(<>
               <Link to={`/viewcourse/${pactolusId}/chapter/${chapterId}/${quizId}`} className='custom-link'>
              <li className="unlocked chapter-item" key={`chapter-${chapterId}`}>
              <LockOpenIcon/>      Chapter {index + 1}
              </li>
              </Link>
            </>
            ):
            (<>

              <li className="locked chapter-item" key={`chapter-${chapterId}`}>
               <LockIcon/> Chapter {index + 1}
              </li>

            </>
            )


           )

             }
            {/* {unlockedChapters.includes(chapterId) ? ( */}
              {/* <Link to={`/viewcourse/${pactolusId}/chapter/${chapterId}/${quizId}`} className='custom-link'>
                <li className="chapter-item" key={`chapter-${chapterId}`}>
                  Chapter {index + 1}
                </li>
              </Link> */}
            {/* // ) : (
            //   <li className="locked chapter-item" key={`chapter-${chapterId}`}>
            //     Chapter {index + 1}
            //   </li>
            // )} */}

            {((unlockedChapters.includes(chapterId)===true) && quizId != null)? (

              <Link to={`/viewcourse/${pactolusId}/quiz/${chapterId}/${quizId}`} className='custom-link'>
                <li className="unlocked quiz-item" key={`quiz-${quizId}`}>
          <LockOpenIcon/>        Quiz {index + 1}
                </li>
              </Link>

            )
:
            (quizId != null&&


               (<li className="locked quiz-item" key={`quiz-${quizId}`}>

<LockIcon/>    Quiz {index + 1}
             </li>)


            )




            }
          </React.Fragment>
        ))}
      </ul>


< div className='bottom'>
<div className='discussion'>    <Link to={`forum`} >discussion chat </Link></div>
<div className='homeIcon'>  <Link to="/"> <HomeIcon/></Link></div>
<div className='dashboard'>
  {!isAdmin?( <Link to="/dashboard/user"> <DashboardIcon /></Link>):( <Link to="/AdminDashboard"> <DashboardIcon /></Link>)

  }



</div>

</div>


    </div>
  );
}

export default SideBar;



