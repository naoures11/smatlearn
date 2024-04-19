import React, { useState, useEffect, useRef } from 'react';
import "./viewChapterBody.css";
import jwt_decode from 'jwt-decode';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
function ViewChapterBody({ chaptersWithQuizzes, pactolusId }) {

  const { chapterId, quizId } = useParams();
  const [chapterData, setChapterData] = useState(null);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const playerRef = useRef(null);
  const [disabled, setDisabled] = useState(true);
  const [fetchedUserProgressData, setFetchedUserProgressData] = useState([]);
  const [unlocked, setUnlocked] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(null);
const[playedSecondsUserProgressData,setPlayedSecondsUserProgressData]=useState(0);


const [ableToInsert, setAbleToInsert] = useState(false);

  const token = localStorage.getItem('token');
  const authenticated = token !== null;

  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (authenticated) {
      const decodedToken = jwt_decode(token);
      setUserId(decodedToken.user_id);

    } else {

    }
  }, [authenticated]);



  const cq = [parseInt(chapterId), parseInt(quizId)];
  const cqIndex = chaptersWithQuizzes.findIndex((chapter) => {
    return chapter[0] === cq[0] && chapter[0] === cq[0];
  });


  let nextChapterId = null;
  let nextQuizId = null;


  if (chaptersWithQuizzes.length > cqIndex + 1) {
    nextChapterId = chaptersWithQuizzes[cqIndex + 1][0];
    nextQuizId = chaptersWithQuizzes[cqIndex + 1][1];
  }


  const fetchChapterData = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/chapter/${chapterId}`);
      const data = await response.json();
      setChapterData(data);
    } catch (error) {
      console.error(error);
    }
    // playerRef.current.seekTo(0);
    setDisabled(true);
    setPlaying(false);
  };

  const fetchUserProgress = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/userprogress/${userId}/${pactolusId}/${chapterId}`);
      const data = await response.json();
      console.log(data)
  if(data=="meow")
  setAbleToInsert(true)
      if(data!="meow")
      {
        console.log("first fetch")
        console.log(data[0])
      setFetchedUserProgressData(data[0]);
       setPlayedSecondsUserProgressData(fetchedUserProgressData.seconds_played);
       setIsUnlocked(fetchedUserProgressData.is_unlocked === 1);
       setPlayedSeconds(fetchedUserProgressData.seconds_played);
       setDisabled(fetchedUserProgressData.is_unlocked !== 1);
       setUnlocked(fetchedUserProgressData.is_unlocked === 1);

           if (playerReady) {
            console.log("meow")
           playerRef.current.seekTo(fetchedUserProgressData.seconds_played);
             setDisabled(false);
            // setPlaying(false);

            if (fetchedUserProgressData.seconds_played > videoDuration / 2)
            setIsUnlocked(true)
          }


      }

    } catch (error) {
      console.error(error);
    }
  };

  const [playerReady, setPlayerReady] = useState(false);


  const handlePlayerReady = () => {
    setPlayerReady(true);
  };



  useEffect(() => {
    const insertUserProgress = () => {

      const userProgressData = {
        userId: userId,
        pactolusId: pactolusId,
        chapterId: chapterId,
        isUnlocked: isUnlocked,
        secondsPlayed: playedSeconds,
      };

      if (ableToInsert) {
      console.log("meopw2")
        fetch('http://localhost:3001/api/userprogress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userProgressData),
        })
          .then(response => response.json())
          .then(data => {
            setFetchedUserProgressData(userProgressData)
            console.log(fetchedUserProgressData)
            console.log("fetched")



          })}

    };
    insertUserProgress()


  }, [ableToInsert]);
  const handleNext = () => {

    const userProgressData = {
      userId: userId,
      pactolusId: pactolusId,
      chapterId: chapterId,
      isUnlocked: isUnlocked,
      secondsPlayed: playedSeconds,
    };
    if (fetchedUserProgressData || fetchedUserProgressData.length !== 0)
    {
      fetch('http://localhost:3001/api/userprogress', {
        method: 'PUT', // Use PUT method for updating instead of POST
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userProgressData),
      })
        .then(response => response.json())
        .then(data => {
          console.log('User progress updated successfully');
          // Do something with the response data if needed
        })
        .catch(error => {
          console.error('Error updating user progress:', error);
        });
    }
        setPlayedSeconds(0);
        setDisabled(true);
        playerRef.current.seekTo(0);

      };


      useEffect(() => {
        const fetchData = async () => {
          if (authenticated && userId !== "") {
            try {
              await fetchChapterData();
              await fetchUserProgress();

            } catch (error) {
              // Handle errors here
            }
          }
        };

        fetchData();
      }, [userId, chapterId, quizId, playerReady]);


  const handleDuration = (duration) => {
    setVideoDuration(duration);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes}:${formattedSeconds}`;
  };

  const handleProgress = (progress) => {
    // if(!fetchedUserProgressData &&( fetchedUserProgressData.length === 0))
    setPlayedSeconds(progress.playedSeconds);

    if(playedSeconds===0)
     playerRef.current.seekTo(0);


  if ((!fetchedUserProgressData && fetchedUserProgressData.length === 0) ||(progress.playedSeconds > videoDuration / 2))

   {

      setDisabled(false);

      setIsUnlocked(true);
    }

  };




  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  const handlePlay = () => {
    setPlaying(true);

  };

  const handlePause = () => {
    setPlaying(false);
  };

  return (
    <div className="ViewChapterBody" onContextMenu={handleContextMenu}>
      <div className="chapter-wrapper">
      {(chapterData&& fetchedUserProgressData.length !== 0)? (
        <>
          <div className='chapter-name'>{chapterData.chapter_name}</div>
          <div className="video-player">
          <ReactPlayer
            url={require('./1.mp4')}
            playing={playing}
            onReady={handlePlayerReady}
            controls={isUnlocked}
            onProgress={handleProgress}
            onDuration={handleDuration}
            ref={playerRef}
            config={{
              file: {
                attributes: {
                  controlsList: 'nodownload',
                  disablePictureInPicture: true,
                  onContextMenu: (e) => e.preventDefault()
                },
              },
            }}
          />
          </div>
          {(!fetchedUserProgressData.is_unlocked)&&(

       <>

<div className='control-pannel'>
          {playing ? (
            <div onClick={handlePause}><PauseCircleOutlineIcon/></div>
          ) : (
            <div onClick={handlePlay}><PlayCircleOutlineIcon/></div>
          )}

</div>
   <p>Played: {formatTime(playedSeconds)} seconds</p>

       </>
          )
          }



<div className="chapter-text" dangerouslySetInnerHTML={{__html: chapterData.text }}>{ }</div>
<div className='next-button-wrap'>
          {disabled ? (
            <div className='btn btn-outline-secondary next-button'>
              Next
            </div>
          ) : (
              quizId.toString() !== "null" ? (

                  <div onClick={handleNext}  className="btn btn-outline-dark next-button">
                     <Link to={`/viewcourse/${pactolusId}/quiz/${chapterId}/${quizId}`}>
                    Next
                    </Link>
                  </div>

              ) : (nextChapterId!=null&&
                 (
                    <div onClick={handleNext}  className="btn btn-outline-dark next-button">
                      <Link to={`/viewcourse/${pactolusId}/chapter/${nextChapterId}/${nextQuizId}`}>
                      Next
                      </Link>

                    </div>





                  )
                )
            )
          }
          </div>
        </>
      ) : (
          <p>Loading chapter data...</p>
        )}
        </div>
    </div>
  );
}

export default ViewChapterBody;
