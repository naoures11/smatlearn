// import React, { useState } from 'react';
// import './PopUpQuizz.css';

// function PopUpQuizz({ title, onCancel, chapterId }) {
//   const [quizQuestion, setQuizQuestion] = useState('');
//   const [responses, setResponses] = useState([]);
//   const [correctResponseIndex, setCorrectResponseIndex] = useState(-1);

//   const handleSaveQuiz = () => {
//     const quizData = {
//       question: quizQuestion,
//       responses: responses,
//       correctResponseIndex: correctResponseIndex,
//       chapterId: chapterId // Add the chapterId to the quiz data
//     };

//     fetch('http://localhost:3001/api/quiz', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(quizData),
//     })
//       .then(response => response.json())
//       .then(result => {
//         // Handle the response if needed
//         console.log(result);
//         // Perform any other necessary actions
//         handleCancelQuiz();
//       })
//       .catch(error => {
//         // Handle the error if needed
//         console.error(error);
//       });
//   };

//   const handleCancelQuiz = () => {
//     setQuizQuestion('');
//     setResponses([]);
//     setCorrectResponseIndex(-1);
//     onCancel();
//   };

//   const handleQuestionChange = event => {
//     setQuizQuestion(event.target.value);
//   };

//   const handleResponseChange = (index, event) => {
//     const updatedResponses = [...responses];
//     updatedResponses[index] = event.target.value;
//     setResponses(updatedResponses);
//   };

//   const handleCorrectResponseChange = index => {
//     setCorrectResponseIndex(index);
//   };

//   const handleAddResponse = () => {
//     const updatedResponses = [...responses, ''];
//     setResponses(updatedResponses);
//   };

//   const handleDelete = index => {
//     const updatedResponses = [...responses];
//     updatedResponses.splice(index, 1);
//     setResponses(updatedResponses);
//   };

//   return (
//     <div className="popup-container">
//       <div className="popup-background"></div>
//       <div className="popup-content">
//         <h2>{title}</h2>
//         <table className="quiz-table">
//           <thead>
//             <tr>
//               <th>Question</th>
//               <th>Possible Responses</th>
//               <th>Correct Response</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td>
//                 <textarea
//                   placeholder="Enter quiz question"
//                   value={quizQuestion}
//                   onChange={handleQuestionChange}
//                 />
//               </td>
//               <td>
//                 {responses.map((response, index) => (
//                   <div key={index} className="response-input-row">
//                     <input
//                       type="text"
//                       placeholder={`Enter response ${index + 1}`}
//                       value={response}
//                       onChange={event => handleResponseChange(index, event)}
//                     />
//                   </div>
//                 ))}
//                 <button className="add-response-button" onClick={handleAddResponse}>
//                   Add Response
//                 </button>
//               </td>
//               <td>
//                 {responses.map((response, index) => (
//                   <label key={index}>
//                     <input
//                       type="radio"
//                       checked={correctResponseIndex === index}
//                       onChange={() => handleCorrectResponseChange(index)}
//                     />
//                     {`Response ${index + 1}`}
//                   </label>
//                 ))}
//               </td>
//               <td className="actions-row">
//                 {responses.map((response, index) => (
//                   <div key={index} className="delete-response-container">
//                     <button className="delete-response-button" onClick={() => handleDelete(index)}>
//                       Delete
//                     </button>
//                   </div>
//                 ))}
//               </td>
//             </tr>
//           </tbody>
//         </table>
//         <div>
//           <button className="save-button" onClick={handleSaveQuiz}>
//             Save
//           </button>
//           <button className="cancel-button" onClick={handleCancelQuiz}>
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PopUpQuizz;



import React, { useState, useEffect } from 'react';
import './PopUpQuizz.css';

function PopUpQuizz({ title, onCancel, chapterId, quizId, onQuizSaved }) {
  const [questions, setQuestions] = useState([{ question: '', responses: [''], correctResponses: [] }]);

  useEffect(() => {
    if (quizId) {
      fetch(`http://localhost:3001/api/quiz/${quizId}`)
        .then(response => response.json())
        .then(result => {
          setQuestions(result.questions);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [quizId]);

  const handleSaveQuiz = () => {
    // Prepare quiz data for submission
    const quizData = {
      questions: questions,
      chapterId: chapterId
    };

    if (quizId) {
      // Update existing quiz
      fetch(`http://localhost:3001/api/quiz/${quizId}`, {
        method: 'DELETE',
      })
        .then(response => response.json())
        .then(result => {
          // Handle the response if needed
          console.log(result);
          // Perform any other necessary actions

          // Remove the quiz from the selected chapter
        })
        .catch(error => {
          // Handle the error if needed
          console.error(error);
        });

      fetch('http://localhost:3001/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      })
        .then(response => response.json())
        .then(result => {
          // Handle the response if needed
          console.log(result);
          onQuizSaved();
          // Perform any other necessary actions
        })
        .catch(error => {
          // Handle the error if needed
          console.error(error);
        });
    } else {
      // Create a new quiz
      fetch('http://localhost:3001/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      })
        .then(response => response.json())
        .then(result => {
          // Handle the response if needed
          console.log(result);
          onQuizSaved();
          // Perform any other necessary actions
        })
        .catch(error => {
          // Handle the error if needed
          console.error(error);
        });
    }

    handleCancelQuiz();
  };

  const handleCancelQuiz = () => {
    setQuestions([{ question: '', responses: [''], correctResponses: [] }]);
    onCancel();
  };

  const handleQuestionChange = (index, event) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = event.target.value;
    setQuestions(updatedQuestions);
  };

  const handleResponseChange = (questionIndex, responseIndex, event) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].responses[responseIndex] = event.target.value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectResponseChange = (questionIndex, responseIndex) => {
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      const question = updatedQuestions[questionIndex];
      const isChecked = question.correctResponses.includes(responseIndex);

      if (isChecked) {
        question.correctResponses = question.correctResponses.filter(
          response => response !== responseIndex
        );
      } else {
        question.correctResponses.push(responseIndex);
      }

      return updatedQuestions;
    });
  };

  const handleAddQuestion = () => {
    setQuestions(prevQuestions => [
      ...prevQuestions,
      { question: '', responses: [''], correctResponses: [] },
    ]);
  };

  const handleDeleteQuestion = questionIndex => {
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions.splice(questionIndex, 1);
      return updatedQuestions;
    });
  };

  const handleAddResponse = questionIndex => {
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].responses.push('');
      return updatedQuestions;
    });
  };

  const handleDeleteResponse = (questionIndex, responseIndex) => {
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].responses.splice(responseIndex, 1);
      return updatedQuestions;
    });
  };

  return (
    <div className="popup-container-quiz">
      <div className="popup-background-quiz"></div>
      <div className="popup-content-quiz">
        <h2>{title}</h2>
        <table className="quiz-table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Possible choices</th>
              <th>Correct choices</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question, questionIndex) => (
              <tr key={questionIndex}>
                <td>
                  <textarea
                    placeholder="Enter quiz question"
                    value={question.question}
                    onChange={event => handleQuestionChange(questionIndex, event)}
                  />
                </td>
                <td >
                  {question.responses.map((response, responseIndex) => (
                    <div key={responseIndex} className="response-input-row">
                      <input
                        type="text"
                        placeholder={`Enter response ${responseIndex + 1}`}
                        value={response}
                        onChange={event => handleResponseChange(questionIndex, responseIndex, event)}
                      />
                      <button
                        className="delete-response-button btn btn-danger"
                        onClick={() => handleDeleteResponse(questionIndex, responseIndex)}
                      >
                        Delete Response {responseIndex + 1}
                      </button>
                    </div>
                  ))}
                  <button
                    className="add-response-button btn btn-success"

                    onClick={() => handleAddResponse(questionIndex)}
                  >
                    Add Response
                  </button>
                </td>
                <td>
                {question.responses.map((response, responseIndex) => (
  <label key={responseIndex} className='correctChoicesTd'>
    <input
      className="form-check-input" type="checkbox" id="flexCheckChecked"
      checked={question.correctResponses.includes(responseIndex)}
      onChange={() => handleCorrectResponseChange(questionIndex, responseIndex)}
    />
     <label class="form-check-label" for="flexCheckChecked">{`Response ${responseIndex + 1}`}</label>








  </label>
))}

                </td>
                <td className="actions-row">
                  <div className="delete-response-container">
                    <button
                      className="delete-response-button btn btn-danger"
                      onClick={() => handleDeleteQuestion(questionIndex)}
                    >
                      Delete Question
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="4">
                <button onClick={handleAddQuestion}className='btn btn-success' >Add a Question</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div className='updateCancelContainer'>
          <button className="save-button" onClick={handleSaveQuiz}>
            Save
          </button>
          <button className="cancel-button" onClick={handleCancelQuiz}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopUpQuizz;
