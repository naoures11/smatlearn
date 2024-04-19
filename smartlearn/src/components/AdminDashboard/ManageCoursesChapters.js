import React, { useState, useEffect } from 'react';
import { AddCircleOutlineOutlined, SettingsOutlined, DeleteForeverOutlined } from '@mui/icons-material';
import r from "./r.png";



import './ManageCoursesChapters.css';
import PopUpChapter from './PopUpChapter';
import PopUpQuizz from './PopUpQuizz';

import DeleteConfirmationDialog from '../dialoguePopUp';


function ManageCoursesChapters({pactolusId}) {
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [showAddChapterPopup, setShowAddChapterPopup] = useState(false);
  const [newChapterName, setNewChapterName] = useState('');
  const [newChapterVideo, setNewChapterVideo] = useState('');
  const [newChapterText, setNewChapterText] = useState('');
  const [editChapter,setEditChapter] = useState(false);



  const [chaptersList, setChaptersList] = useState([]);

  const [quizsaved, setQuizSaved] = useState(null);

  useEffect(() => {
    fetchChaptersList();
    console.log("chapters list"+chaptersList)
  }, []);

  const fetchChaptersList = () => {
    fetch(`http://localhost:3001/api/chapters/${pactolusId}`)
      .then(response => response.json())
      .then(data => {
        setChaptersList(data);
        console.log("Chapters List:", data);
      })
      .catch(error => console.error(error));
  };




  const handleAddChapter = () => {
    setNewChapterName('');
    setNewChapterVideo('');
    setNewChapterText('');
    setShowAddChapterPopup(true);
  };

  const handleEditChapter = (chapterId) => {
    const selectedChapter = chaptersList.find((chapter) => chapter.id === chapterId);


    setNewChapterName(selectedChapter.chapter_name);
    setNewChapterVideo(selectedChapter.video); // Set the video value, not the text
    setNewChapterText(selectedChapter.text); // Set the text value, not the video
    setSelectedChapterId(chapterId);
    setShowAddChapterPopup(true);


  };


  const handleCancelAddChapter = () => {
    setSelectedChapterId(null);
    setNewChapterName('');
    setNewChapterVideo('');
    setNewChapterText('');
    setShowAddChapterPopup(false);
    setEditChapter(false)
  };
  const handleSaveChapter = () => {
    setEditChapter(false)
    if (selectedChapterId !== null) {
      // Updating an existing chapter
      const updatedChapterList = chaptersList.map(chapter => {
        if (chapter.id === selectedChapterId) {
          return {
            ...chapter,
            name: newChapterName,
            text: newChapterText,
            video: newChapterVideo,
          };
        }
        return chapter;
      });

      fetch(`http://localhost:3001/api/chapters/${selectedChapterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newChapterName,
          text: newChapterText,
          video: newChapterVideo,
        }),
      })
        .then(response => response.json())
        .then(result => {
          // Handle the response if needed
          console.log(result);
          // Update the state or perform any other necessary actions
          setChaptersList(updatedChapterList);
          handleCancelAddChapter();
          fetchChaptersList();
        })
        .catch(error => {
          // Handle the error if needed
          console.error(error);
        });
    } else {
      // Adding a new chapter
      const newChapter = {
        name: newChapterName,
        text: newChapterText,
        video: newChapterVideo,
        pactolusId: pactolusId, // Include the pactolusId here
      };

      fetch(`http://localhost:3001/api/chapters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newChapter),
      })
        .then(response => response.json())
        .then(result => {
          // Handle the response if needed
          console.log(result);
          // Update the state or perform any other necessary actions
          newChapter.id = result.id; // Assign the generated ID to the new chapter
          setChaptersList([...chaptersList, newChapter]);
          handleCancelAddChapter();
          fetchChaptersList();
        })
        .catch(error => {
          // Handle the error if needed
          console.error(error);
        });
    }
    fetchChaptersList()
  };

  const handleDeleteChapter = chapterId => {
    const updatedChapterList = chaptersList.filter(chapter => chapter.id !== chapterId);

    fetch(`http://localhost:3001/api/chapters/${chapterId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(result => {
        // Handle the response if needed
        console.log(result);
        // Perform any other necessary actions
        setChaptersList(updatedChapterList);
      })
      .catch(error => {
        // Handle the error if needed
        console.error(error);
      });
      fetchChaptersList()
  };


//quiz


const handleAddQuiz = (chapterId) => {
  setSelectedChapterId(chapterId);

};
const handleFetchChaptersList = () => {
  fetchChaptersList();
};



const handleDeleteQuiz = (quizId) => {
  fetch(`http://localhost:3001/api/quiz/${quizId}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(result => {
      // Handle the response if needed
      console.log(result);
      // Perform any other necessary actions

      // Remove the quiz from the selected chapter
      const updatedChaptersList = chaptersList.map(chapter => {
        if (chapter.quiz_id === quizId) {
          return {
            ...chapter,
            quiz_id: null,
          };
        }
        return chapter;
      });

      setChaptersList(updatedChaptersList);
    })
    .catch(error => {
      // Handle the error if needed
      console.error(error);
    });
};




const handleCancelQuiz = () => {
  setSelectedChapterId(null);
};
const handleEditQuiz = chapterId => {
  setSelectedChapterId(chapterId);
  // setsh(true);
};
const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
const [chapterIdToDelete,setChapterIdToDelete] = useState(0);
const [quizIdToDelete,setQuizIdToDelete] = useState(0);
  return (
    <div>

      <div className="ChapterList">



{chaptersList.map((chapter) => (
  <div className={`Chapter-1 ${selectedChapterId === chapter.id ? 'selected' : ''}`} key={chapter.id}>

    <div className='PactolusName-1'>{chapter.chapter_name}</div>
<div className='edit_delete'>
    <div className="EditChapter" onClick={() => {handleEditChapter(chapter.id);setEditChapter(true);}}>
      <SettingsOutlined />
    </div>
    <div className='DeleteChapter' onClick={() => {handleDeleteChapter(chapter.id);setChapterIdToDelete(chapter.id)}

    }>
      <DeleteForeverOutlined />
    </div>
    </div>

    <div className='ChapterInformations-1'>{chapter.information}</div>

      <div>

        {chapter.quiz_id==null? (
             <div className="edit_delete">
           <div className='AddQuiz' onClick={() => handleAddQuiz(chapter.id)}>
        <div className="addbtn" >Add Quiz </div>
        </div>

      </div>): (
     <div className="edit_delete">  <div className='AddQuiz' onClick={() => handleEditQuiz(chapter.id)}>
      <div className="addbtn" >Edit Quiz </div>
      </div>

      <div className='AddQuiz' onClick={() => {handleDeleteQuiz(chapter.quiz_id);setQuizIdToDelete(chapter.quiz_id)}}>
      <div className="addbtn" >Delete Quiz </div>
      </div>



      </div>
      )}




      </div>




  </div>
))}



      </div>

      <div className='addButton' onClick={handleAddChapter}>
        <AddCircleOutlineOutlined />
        Add Chapter
      </div>

      {(selectedChapterId !== null && editChapter !== true) && (
  <PopUpQuizz
    title={chaptersList.find(chapter => chapter.id === selectedChapterId).quiz_id ? "Edit Quiz" : "Add Quiz"}
    onQuizSaved={handleFetchChaptersList}
    onCancel={handleCancelQuiz}
    chapterId={selectedChapterId}
    quizId={chaptersList.find(chapter => chapter.id === selectedChapterId)?.quiz_id}
  />
)}


{showAddChapterPopup && (
  <PopUpChapter
    title={selectedChapterId ? "Edit chapter" : "Add chapter"}
    value={newChapterName}
    videoValue={newChapterVideo}
    textValue={newChapterText}
    onChange={(name, value) => {
      if (name === 'newChapterName') {
        setNewChapterName(value);
      } else if (name === 'newChapterVideo') {
        setNewChapterVideo(value);
      } else if (name === 'newChapterText') {
        setNewChapterText(value);
      }
    }}

    onSave={handleSaveChapter}
    onCancel={handleCancelAddChapter}
    onEdit={handleCancelAddChapter} // This will trigger the edit functionality
    editValue={selectedChapterId !== null} // Indicates whether it's in edit mode
  />
)}

{isDeleteDialogOpen && chapterIdToDelete && (
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteChapter}
      />
    )}

    {isDeleteDialogOpen && quizIdToDelete && (
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteQuiz}
      />
    )}

    </div>
  );
}

export default ManageCoursesChapters;










