import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../../context/CartContext';
import jwt_decode from 'jwt-decode';


import LittleAlertBox from '../LittleAlertBox';
import './Pactolus.css';
import { Link } from 'react-router-dom';

function Pactolus({ pactolus }) {
  const { addToCart , cartItems} = useContext(CartContext);
  const [purchased, setPurchased] = useState(false);

  const [addedToCart, setAddedToCart] = useState(false);
  const [alreadyInCart, setAlreadyInCart] = useState(false);
  const handleAddToCart = () => {
    const isAlreadyInCart = cartItems.some((item) => item.id === pactolus.id);
    if (isAlreadyInCart) {
      setAlreadyInCart(true);
    } else
    {addToCart(pactolus);
    setAddedToCart(true);
    }

  };

  const token = localStorage.getItem('token');
  const authenticated = token !== null;
  let userId = '';
let isAdmin=false;
  if (authenticated) {
    const decodedToken = jwt_decode(token);
    userId = decodedToken.user_id;
    isAdmin=decodedToken.isAdmin;
  }

  useEffect(() => {
    if (userId !== '') {
      fetch(`http://localhost:3001/api/check-purchase?userId=${userId}&pactolusId=${pactolus.id}`)
        .then((response) => response.json())
        .then((data) => {
          setPurchased(data.purchased);
          console.log(purchased+"pactolusID")
        })
        .catch((error) => {
          console.error('Error occurred while checking purchase:', error);
        });
    }
  }, [userId, pactolus.id]);

  const [showPopUp, setShowPopUp] = useState(false);
  const handleClickDescription=()=> {
    setShowPopUp(true);
  }
  const handleCloseDescription = () => {
    setShowPopUp(false);
  };

  return (
    <div className="pactolus">
      <div className="pactolus-header">
        <h2 className="pactolus-name">{pactolus.name}     <a onClick={handleClickDescription}>
        <span>?</span>
        </a>

        </h2>




        <h3 className="pactolus-price">Price: {pactolus.price} $</h3>
      </div>
      <div className="chapter-list">
        {pactolus.chapters.map((chapter, index) => (
          <div key={chapter.id} className="chapter">
            <h3 className="chapter-title">
              <span className="chapterX">Chapter {index + 1} : </span>
              {chapter.chapter_name}
            </h3>
          </div>
        ))}
      </div>
      {purchased||isAdmin ? (
       <Link to={`/viewCourse/${pactolus.id}`}>
         <button className="add-to-cart-btn btn btn-dark" >

          View Course
          </button>
          </Link>
      ) : (
        <button className="add-to-cart-btn btn btn-dark" onClick={handleAddToCart}>
          Add to Cart
        </button>
      )}

             {/* <button className="add-to-cart-btn"onClick={handleClickDescription}>
         More details about the course
        </button> */}

       {addedToCart && (
          <LittleAlertBox message={`${pactolus.name} course is successfully added to the cart`} isSuccess={true} />
        )}
        {alreadyInCart && (
          <LittleAlertBox message={`${pactolus.name} course is already in the cart`} isSuccess={false} />
        )}
{ showPopUp&&(

<div className="pop-up-overlay">
      <div className="pop-up-content">
        <div className="pop-up-header">

          <h2>{pactolus.name} course description</h2>

        </div>
        <p className="popup-body">{pactolus.description}</p>

        <div onClick={handleCloseDescription} className='cancel-btn btn btn-danger'>Close</div>
      </div>
    </div>

)}

    </div>
  );
}

export default Pactolus;
