import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../../context/CartContext';
import jwt_decode from 'jwt-decode';
import { Link } from 'react-router-dom';
import r from "./r.png";
import "./AllCourses.css";
import LittleAlertBox from '../LittleAlertBox';
function AllCourses() {
  const { addToCart, cartItems } = useContext(CartContext);
  const [purchased, setPurchased] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [alreadyInCart, setAlreadyInCart] = useState(false);
  const [pactolusList, setPactolusList] = useState([]);
const[pactolusInTheCart,setPactolusInTheCart]=useState("");
  const handleAddToCart = (pactolus) => {
    setPactolusInTheCart(pactolus.name)
    const isAlreadyInCart = cartItems.some((item) => item.id === pactolus.id);
    if (isAlreadyInCart) {
      setAlreadyInCart(true);
    } else {
      addToCart(pactolus);
      setAddedToCart(true);
    }
  };

  const token = localStorage.getItem('token');
  const authenticated = token !== null;
  let userId = '';
  let isAdmin = false;

  if (authenticated) {
    const decodedToken = jwt_decode(token);
    userId = decodedToken.user_id;
    isAdmin = decodedToken.isAdmin;
  }

  useEffect(() => {
    fetchPactolusData();
  }, []);

  const fetchPactolusData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/pactolus');
      if (response.ok) {
        const data = await response.json();
        setPactolusList(data);
        console.log(data);
      } else {
        throw new Error('Error fetching pactolus data');
      }
    } catch (error) {
      console.error('Error fetching pactolus data:', error);
    }
  };

  useEffect(() => {
    if (userId !== '') {
      pactolusList.forEach((pactolus) => {
        fetch(`http://localhost:3001/api/check-purchase?userId=${userId}&pactolusId=${pactolus.id}`)
          .then((response) => response.json())
          .then((data) => {
            setPurchased((prevPurchased) => ({
              ...prevPurchased,
              [pactolus.id]: data.purchased
            }));
            console.log(purchased + " pactolusID");
          })
          .catch((error) => {
            console.error('Error occurred while checking purchase:', error);
          });
      });
    }
  }, [userId, pactolusList]);

  return (
    <div className='ManageCourses'>
      <div className='PactolusName'>
       All Courses List
      </div>

      <div className='PactolusWrap'>
        {pactolusList.map((pactolus) => (
          <div
            className={`Pactolus-1`}
            key={pactolus.id}
          >
            <img src={r} alt="Pactolus" />
            <div className='PactolusName-1'>{pactolus.name}</div>

            {purchased[pactolus.id] || isAdmin ? (

                <div className='addButton'>
                         <Link to={`/viewCourse/${pactolus.id}`}>
                  View Course
                  </Link>
                </div>

            ) : (
              <div className='addButton' onClick={() => handleAddToCart(pactolus)}>
                Add to Cart
              </div>
            )}

          </div>

        ))}
      </div>
      {addedToCart && (
          <LittleAlertBox message={`${pactolusInTheCart} course is successfully added to cart`} isSuccess={true} />
        )}
        {alreadyInCart && (
          <LittleAlertBox message={`${pactolusInTheCart} course is already in the cart`} isSuccess={false} />
        )}

    </div>
  );
}

export default AllCourses;









// import React from 'react'
// import { useState , useEffect } from 'react';
// import r from "./r.png"
// import "./AllCourses.css"
// import { CartContext } from '../../context/CartContext';
// import { useContext } from 'react';
// import jwt_decode from 'jwt-decode';
// import { Link } from 'react-router-dom';
// function AllCourses() {
//   const [pactolusList, setPactolusList] = useState([]);
//   const [selectedPactolusId, setSelectedPactolusId] = useState(null);
//   const [purchased, setPurchased] = useState(false);
//   const { addToCart , cartItems} = useContext(CartContext);

//   const [addedToCart, setAddedToCart] = useState(false);
//   const [alreadyInCart, setAlreadyInCart] = useState(false);
//   const handleAddToCart = () => {
//     const isAlreadyInCart = cartItems.some((item) => item.id === pactolus.id);
//     if (isAlreadyInCart) {
//       setAlreadyInCart(true);
//     } else
//     {addToCart(pactolus);
//     setAddedToCart(true);
//     }

//   };
//   const token = localStorage.getItem('token');
//   const authenticated = token !== null;
//   let userId = '';
// let isAdmin=false;
//   if (authenticated) {
//     const decodedToken = jwt_decode(token);
//     userId = decodedToken.user_id;
//     isAdmin=decodedToken.isAdmin;
//   }

//   useEffect(() => {
//     if (userId !== '') {
//       fetch(`http://localhost:3001/api/check-purchase?userId=${userId}&pactolusId=${pactolus.id}`)
//         .then((response) => response.json())
//         .then((data) => {
//           setPurchased(data.purchased);
//           console.log(purchased+"pactolusID")
//         })
//         .catch((error) => {
//           console.error('Error occurred while checking purchase:', error);
//         });
//     }
//   }, [userId, pactolus.id]);



//   const fetchPactolusList = () => {
//     fetch('http://localhost:3001/api/pactolus')
//       .then(response => response.json())
//       .then(data => setPactolusList(data))
//       .catch(error => console.error(error));

//   };

//   useEffect(() => {
//     fetchPactolusList();
//   }, []);

//   return (
//     <div className='ManageCourses'>
//       <div className='PactolusName'>
//   Pactolus List
// </div>

// <div className='PactolusWrap'>
//           {pactolusList.map((pactolus) => (
//             <div
//               className={`Pactolus-1`}
//               key={pactolus.id}

//             >
//               <img src={r} alt="Pactolus" />
//               <div className='PactolusName-1'>{pactolus.name}</div>


//               {purchased ? (

//          <div className="add-to-cart-btn">
//    <Link to={`/viewCourse/${pactolus.id}`}>
//           View Course
//           </Link>
//           </div>

//       ) : (
//         <div className="add-to-cart-btn" onClick={handleAddToCart}>
//           Add to Cart
//         </div>
//       )}




// {/*
//               <div  className="addButton" >add to cart</div>
//               <div  className="addButton" >view course</div> */}



//             </div>
//           ))}



//         </div>
//     </div>
//   )
// }

// export default AllCourses
