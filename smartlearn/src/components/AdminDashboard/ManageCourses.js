import React, { useState, useEffect } from 'react';
import "./ManageCourses.css";
import r from "./r.png";
import { AddCircleOutlineOutlined, SettingsOutlined, DeleteForeverOutlined } from '@mui/icons-material';
import { ArrowBackIos } from '@mui/icons-material';



//for add pactolus
import Popup from './PopUp';

import DeleteConfirmationDialog from '../dialoguePopUp';

import ManageCoursesChapters from './ManageCoursesChapters';
import { Link } from 'react-router-dom';
function ManageCourses() {
  const [selectedPactolusId, setSelectedPactolusId] = useState(null);
  const [showChapters, setShowChapters] = useState(false);
  const [showAddPactolusPopup, setShowAddPactolusPopup] = useState(false);
  const [newPactolusName, setNewPactolusName] = useState('');
  const [newPactolusPrice, setNewPactolusPrice] = useState('');
  const [newPactolusDescription, setNewPactolusDescription] = useState('');
  const [pactolusList, setPactolusList] = useState([]);







  const fetchPactolusList = () => {
    fetch('http://localhost:3001/api/pactolus')
      .then(response => response.json())
      .then(data => setPactolusList(data))
      .catch(error => console.error(error));

  };

  useEffect(() => {
    fetchPactolusList();
  }, []);

  const handleEditPactolus = (pactolusId) => {
    const selectedPactolus = pactolusList.find((pactolus) => pactolus.id === pactolusId);
    setNewPactolusName(selectedPactolus.name);
    setNewPactolusPrice(selectedPactolus.price)
    setNewPactolusDescription(selectedPactolus.description)
    setSelectedPactolusId(pactolusId);
    setShowAddPactolusPopup(true);
  };

  const handleAddPactolus = () => {
    setShowAddPactolusPopup(true);
  };



  const handleCancelAddPactolus = () => {
    setSelectedPactolusId(null);
    setNewPactolusName('');
    setNewPactolusPrice('');
    setNewPactolusDescription('');
    setShowAddPactolusPopup(false);
  };





  const handleSavePactolus = () => {
    if (!newPactolusName) {
      alert('Please enter the pactolus name.');
      return;
    }

    else if (!newPactolusPrice) {
      alert('Please enter the pactolus price.');
      return;
    }

   else if (!newPactolusDescription) {
      alert('Please enter the pactolus description.');
      return;
    }
    else
    {



    if (selectedPactolusId !== null) {
      // Editing an existing pactolus
      const updatedPactolusList = pactolusList.map((pactolus) => {
        if (pactolus.id === selectedPactolusId) {
          return {
            ...pactolus,
            name: newPactolusName,
            price: newPactolusPrice,
            description:newPactolusDescription
          };
        }
        return pactolus;
      });







      // Update the pactolus in the database
      console.log(selectedPactolusId + "selected pactolus id ")
      fetch(`http://localhost:3001/api/pactolus/${selectedPactolusId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newPactolusName, price: newPactolusPrice ,description:newPactolusDescription}),

      })
        .then(response => response.json())
        .then(result => {
          // Handle the response if needed
          console.log(result);
          // Update the state or perform any other necessary actions
          setSelectedPactolusId(null);
          setNewPactolusName('');
          setNewPactolusPrice('');
          setShowAddPactolusPopup(false);
          fetchPactolusList(); // Update the pactolus list after editing
        })
        .catch(error => {
          // Handle the error if needed
          console.error(error);
        });

      setPactolusList(updatedPactolusList);
    } else {
      // Adding a new pactolus
      // Add the new pactolus to the database
      fetch('http://localhost:3001/api/pactolus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newPactolusName, price: newPactolusPrice,description:newPactolusDescription }),

      })
        .then(response => response.json())
        .then(result => {
          // Handle the response if needed
          console.log(result);
          // Update the state or perform any other necessary actions
          const newPactolus = {
            id: result.id,
            name: newPactolusName,

            price:newPactolusPrice,
            description:newPactolusDescription,
            chapters: [],
          };
          setPactolusList([...pactolusList, newPactolus]);
          setNewPactolusName('');
          setNewPactolusDescription('');
          setNewPactolusPrice('');
          setShowAddPactolusPopup(false);
          fetchPactolusList(); // Update the pactolus list after adding
        })
        .catch(error => {
          // Handle the error if needed
          console.error(error);
        });
    }    }
  };


  const handleDeletePactolus = (pactolusId) => {
    // Check if the deleted pactolus is currently selected
    const isCurrentlySelected = selectedPactolusId === pactolusId;

    // Delete the pactolus from the database
    fetch(`http://localhost:3001/api/pactolus/${pactolusId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(result => {
        // Handle the response if needed
        console.log(result);
        // Perform any other necessary actions
        fetchPactolusList(); // Update the pactolus list after deleting

        // Clear the selected pactolus if it was the deleted pactolus
        if (isCurrentlySelected) {
          setSelectedPactolusId(null);
        }
      })
      .catch(error => {
        // Handle the error if needed
        console.error(error);
      });
      setIsDeleteDialogOpen(false)
  };


  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseIdToDelte,setCourseIdToDelete] = useState(0);

  return (
    <div className='ManageCourses'>

{showChapters ? (

<div>
  <div className='PactolusName'>
   Chapters List
  </div>
  <div className="ReturnButton" onClick={() => setShowChapters(false)}>
    <ArrowBackIos />   {selectedPactolusId !== null && pactolusList.find(pactolus => pactolus.id === selectedPactolusId).name}
  </div>
</div>
) : (
<div className='PactolusName'>
  Courses List
</div>
)}



      {showChapters ? (
       <ManageCoursesChapters pactolusId={selectedPactolusId}/>
      ) : (
        <div>
        <div className='PactolusWrap'>
          {pactolusList.map((pactolus) => (
            <div
              className={`Pactolus-1 ${selectedPactolusId === pactolus.id ? 'selected' : ''}`}
              key={pactolus.id} >

              <img src={r} alt="Pactolus" />
              <div className='PactolusName-1'>{pactolus.name}</div>
              <div className='PactolusInformations-1'>{pactolus.price} $</div>
              <div className="EditDeleteContainer">
                  <div className='EditPactolus' onClick={() => handleEditPactolus(pactolus.id)}>
                    <SettingsOutlined />
                  </div>
                  <div className='DeletePactolus'  onClick={() => {setIsDeleteDialogOpen(true);setCourseIdToDelete(pactolus.id)}}
                 >
                    <DeleteForeverOutlined />
                  </div>
                </div>



              <div     className="addButton "  onClick={() => {

                setSelectedPactolusId(pactolus.id);
                setShowChapters(true);
              }}>Manage chapters</div>

              <div className="addButton " >
              <Link to={`/viewCourse/${pactolus.id}`}>
                View Course
                </Link>
              </div>


            </div>
          ))}


        </div>


          <div className='addButton' onClick={handleAddPactolus}>
            <AddCircleOutlineOutlined />
            Add Pactolus
          </div>



      </div>
      )}
        {setIsDeleteDialogOpen&&(   <DeleteConfirmationDialog
  open={isDeleteDialogOpen}
  onClose={() => setIsDeleteDialogOpen(false)}
  onConfirm={() => handleDeletePactolus(courseIdToDelte)}
/>
)
}
      {showAddPactolusPopup && (
      <Popup
      title={selectedPactolusId ? "Edit Course" : "Add Course"}

      value={newPactolusName}
      onChange={value => setNewPactolusName(value)}
      onPriceChange={value => setNewPactolusPrice(value)}
      onDescriptionChange={value => setNewPactolusDescription(value)}
      DescriptionValue={newPactolusDescription}
      onSave={handleSavePactolus}
      onCancel={handleCancelAddPactolus}
      onEdit={handleCancelAddPactolus}
      editValue={selectedPactolusId !== null}
      priceValue={newPactolusPrice} // Pass the price value
    />
      ) }









    </div>
  );
}

export default ManageCourses;
