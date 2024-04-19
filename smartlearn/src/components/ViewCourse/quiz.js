import React, { useState, useEffect } from 'react';
import './quiz.css';

import jwt_decode from 'jwt-decode';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Quiz({chaptersWithQuizzes,pactolusId}) {
  const {chapterId,quizId}=useParams();
  const cq=[parseInt(chapterId),parseInt(quizId)];



  const cqIndex = chaptersWithQuizzes.findIndex((chapter) => {
    return chapter[0] === cq[0] && chapter[1] === cq[1];
  });

  console.log(cqIndex);

  let nextChapterId=null
  let nextQuizId=null
  console.log(chaptersWithQuizzes.length)

  // 2 0 = ok
  // 2 1 = not okay
  if(chaptersWithQuizzes.length>cqIndex+1)
  {
     nextChapterId=chaptersWithQuizzes[cqIndex+1][0]
    nextQuizId=chaptersWithQuizzes[cqIndex+1][1]
  }


  const [quizData, setQuizData] = useState(null);
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    // if (selectedQuizId && selectedQuizId.length > 0) {
      fetchQuizData(chapterId);

    // }
    resetQuiz()
  }, [quizId]);

  const fetchQuizData = (chapterId) => {
    fetch(`http://localhost:3001/api/viewcoursequiz/${chapterId}`)
      .then((response) => response.json())
      .then((data) => {
        setQuizData(data);
      })
      .catch((error) => {
        console.error(error);
        // Handle error
      });
  };

  const handleChoiceChange = (questionIndex, choiceId) => {
    const updatedQuizData = { ...quizData };
    const question = updatedQuizData[0].questions[questionIndex];
console.log(    question)
    if (question.multiple_correct) {
      if (!question.selectedChoice) {
        question.selectedChoice = [choiceId];
        console.log("meow")
      } else {
        if (question.selectedChoice.includes(choiceId)) {
          question.selectedChoice = question.selectedChoice.filter((id) => id !== choiceId);
          console.log("meow1")
        } else {
          question.selectedChoice.push(choiceId);
          console.log("meow2")
        }
      }
    } else {
      question.selectedChoice = choiceId;
    }

    setQuizData(updatedQuizData);
  };

  const countCorrectChoices = (question) => {
    let correctCount = 0;
    question.choices.forEach((choice) => {
      if (choice.is_correct) {
        correctCount++;
      }
    });
    question.multiple_correct=correctCount>1
    console.log(question.multiple_correct)
    return correctCount;
  };
let selectedChoices = [];

  const calculateScore = () => {
    let totalQuestions = 0;
    let correctAnswers = 0;

    quizData[0].questions.forEach((question) => {
      totalQuestions++;
      console.log( question.selectedChoice)

      const correctChoices = question.choices.filter((choice) => choice.is_correct);
      selectedChoices = question.selectedChoice;
      const correctChoiceCount = countCorrectChoices(question);
      let allCorrect = true;


      const sorted_cc=  correctChoices.map((choice) => choice.id).sort();
      question.sorted_cc=sorted_cc;


     let sorted_sc= Array.isArray(selectedChoices) ? question.selectedChoice.sort():[question.selectedChoice];
      question.sorted_sc= sorted_sc;
      if (Array.isArray(selectedChoices)) {
        if (selectedChoices.length !== correctChoiceCount) {
          allCorrect = false;
        } else {
          allCorrect =  JSON.stringify(sorted_cc) === JSON.stringify(sorted_sc);

          console.log(sorted_cc + sorted_sc)

        }
      }

      if (allCorrect) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / totalQuestions) * 100;
    alert(`Your score: ${score}%`);
    setSubmit(true);

    const token = localStorage.getItem('token');
    const authenticated = token !== null;
    let id = '';


    if (authenticated) {
      const decodedToken = jwt_decode(token);
      id = decodedToken.user_id;

    }



    const data = {
      user_id: id,
      quiz_id:quizId[0],
      score: score,
      number_of_correct_answsers:correctAnswers
    };



      const userChoices = [];

      quizData[0].questions.forEach((question) => {
        const selectedChoices = question.selectedChoice;

        if (Array.isArray(selectedChoices)) {
          selectedChoices.forEach((choiceId) => {
            userChoices.push({
              user_id: id,
              quiz_id: quizId,
              question_id: question.id,
              choice_id: choiceId
            });
          });
        } else {
          userChoices.push({
            user_id: id,
            quiz_id: quizId,
            question_id: question.id,
            choice_id: selectedChoices
          });
        }
      });

      const data1 = {
        userChoices: userChoices
      };

      fetch('http://localhost:3001/api/saveuserchoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data1),
      })
        .then((response) => response.json())
        .then((response) => {
          // Handle the response from the server
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
          // Handle error
        });



        fetch(`http://localhost:3001/api/userprogress/${id}/${pactolusId}/${chapterId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(response => response.json())
          .then(data => {
            console.log('user progress data updated in the database:', data);
          })
          .catch(error => {
            console.error('Error updating user progress data:', error);
          });


  };

  const resetQuiz = () => {
    setSubmit(false);
    // if (quizData) {
    //   const updatedQuizData = { ...quizData };
    //   updatedQuizData[0].questions.forEach((question) => {
    //   question.selectedChoice = null;
    //   });
    //   setQuizData(updatedQuizData);
    //   }

  };
  useEffect(() => {
    fetchQuizData(chapterId);

    if (submit) {
      const token = localStorage.getItem('token');
      const authenticated = token !== null;
      let id = '';

      if (authenticated) {
        const decodedToken = jwt_decode(token);
        id = decodedToken.user_id;
      }

      fetch(`http://localhost:3001/api/fetchuserchoices/${id}/${quizId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user choices');
        }
        return response.json();
      })
      .then(data => {
        console.log(data); // Log the received data
        const selectedChoices = [];
        if (Array.isArray(data) && data.length > 0) {
          data.forEach(item => {
            const selectedChoice = item.choices.find(choice => choice.id === item.selected_choice_id);
            selectedChoices.push(selectedChoice);
          });
        }
        console.log(selectedChoices); // Log the selected choices
        console.log("meooow")
        // setChoices(selectedChoices);
      })
      .catch(error => {
        console.error(error);
      });

    }

    resetQuiz();
  }, [quizId]);

  return (
    <div className='viewQuiz'>
      {submit ? (
        <>
          {/* <h2>Quiz {quizId}</h2> */}
          <form>

              {quizData[0].questions.map((question, questionIndex) => (
                <div
                  key={question.id}
                  className={`question ${
                    JSON.stringify(question.sorted_cc) === (JSON.stringify(question.sorted_sc))
                      ? 'correct'
                      : 'incorrect'
                  }`}
                >
                <p>{question.question_text}</p>
                {question.choices.map((choice) => (
                  <div key={choice.id} className='choice'>
                    {countCorrectChoices(question) > 1 ? (
                      <input
                        type='checkbox'
                        id={choice.id}
                        name={`question-${question.id}`}
                        value={choice.id}
                        onChange={() => handleChoiceChange(questionIndex, choice.id)}
                        disabled
                      />
                    ) : (
                      <input
                        type='radio'
                        id={choice.id}
                        name={`question-${question.id}`}
                        value={choice.id}
                        checked={question.selectedChoice === choice.id}
                        onChange={() => handleChoiceChange(questionIndex, choice.id)}
                        disabled
                      />
                    )}
                    <label htmlFor={choice.id}>{choice.choice_text}   {choice.choice_text} {choice.is_correct ?"(correct choice)":""}</label>
                  </div>
                ))}
                <p>Number of correct choices: {countCorrectChoices(question)}</p>
              </div>
            ))}
          </form>

          <button onClick={resetQuiz}>Reset</button>

          {nextChapterId!=null&&

<Link to={`/viewcourse/${pactolusId}/chapter/${nextChapterId}/${nextQuizId}`}>
 <button>
 Next
</button>

</Link>

}



        </>
      ) : (
        <>
          {/* <h2>Quiz {quizId}</h2> */}
          <form>
            {quizData && quizData[0].questions.map((question, questionIndex) => (

<> <div className='question-name'>Question 1</div>
              <div key={question.id} className='question'>

                <p>{question.question_text}</p>
                {question.choices.map((choice) => (
                  <div key={choice.id} className='choice'>
                    {countCorrectChoices(question) > 1 ? (
                      <input
                        type='checkbox'
                        id={choice.id}
                        name={`question-${question.id}`}
                        value={choice.id}
                        onChange={() => handleChoiceChange(questionIndex, choice.id)}
                      />
                    ) : (
                      <input
                        type='radio'
                        id={choice.id}
                        name={`question-${question.id}`}
                        value={choice.id}
                        checked={question.selectedChoice === choice.id}
                        onChange={() => handleChoiceChange(questionIndex, choice.id)}
                      />


                    )}
                    <label htmlFor={choice.id}>{choice.choice_text}</label>
                  </div>
                ))}
                {/* <p>Number of correct choices: {countCorrectChoices(question)}</p> */}
              </div>
              </>
            ))}
          </form>
          <div className='next-button-wrap'>
          <div onClick={calculateScore}  className="btn btn-outline-dark next-button">
     Submit
          </div>
          </div>
        </>

      )}
    </div>
  );
}

export default Quiz;

























