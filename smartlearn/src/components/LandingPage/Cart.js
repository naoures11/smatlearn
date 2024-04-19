import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import './Cart.css';
import { Link, useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import LittleAlertBox from '../LittleAlertBox';


function Cart() {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const payment = queryParams.get('payment');
  const navigate = useNavigate();
  useEffect(() => {
    // if (payment=='true')
    // navigate(`/payment/${totalSum}`);
    console.log(payment)
  },[])
  const totalSum = cartItems.reduce((sum, item) => sum + item.price, 0);

  const token = localStorage.getItem('token');
  const authenticated = token !== null;
  console.log(token);
  console.log(authenticated);



  const [pactolusList, setPactolusList] = useState([]);

  // useEffect(() => {
  //   fetchPactolusData();
  // }, []);
  // useEffect(() => {
  //   cartItems.forEach((cartItem) => {
  //     const itemExistsInPactolus = pactolusList.some((pactolus) => pactolus.id === cartItem.id);
  //     if (itemExistsInPactolus) {
  //       removeFromCart(cartItem.id);
  //     }
  //   });
  // }, [cartItems, pactolusList, removeFromCart]);

  const fetchPactolusData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/pactolus');
      if (response.ok) {
        const data = await response.json();
        setPactolusList(data);
        // console.log("meow")
        console.log(data)
      } else {
        throw new Error('Error fetching pactolus data');
      }
    } catch (error) {
      console.error('Error fetching pactolus data:', error);
    }
  };

  useEffect(() => {
    const fetchPurchasedItems = async () => {
      try {
        // Decode the user ID from the token
        const token = localStorage.getItem('token');
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.user_id;

        // Fetch the user's purchased items from the server using the user ID
        const response = await fetch(`http://localhost:3001/api/purchases/${userId}`);
        if (response.ok) {
          const purchasedItems = await response.json();
          console.log("purch")
        console.log(purchasedItems)
        console.log(cartItems)
          // Iterate over the purchased items and remove them from the cart
          purchasedItems.forEach((purchasedItem) => {
            const itemToRemove = cartItems.find((item) => item.id   === purchasedItem.pactolusId            );
            if (itemToRemove) {
              removeFromCart(itemToRemove.id );
            }
          });
        } else {
          // Handle error response
          // ...
        }
      } catch (error) {
        // Handle fetch error
        // ...
      }
    };

    if (authenticated) {
      fetchPurchasedItems();
    }
  }, [authenticated, cartItems, removeFromCart]);

  const handleCheckout = () => {
    if (authenticated) {
      navigate(`/payment/${totalSum}`);
    } else {
      setErrorAlert('Login First !')
      setTimeout(() => {
        setErrorAlert('');
        navigate(`/Login/${totalSum}`);
      }, 2000); // Delay of 1 second (1000 milliseconds)


    }
  };

  const handleRemoveAll = () => {
    clearCart();
  };
  const [errorAlert,setErrorAlert]=useState("");
  return (
    <div className="cart-container">

      {cartItems.length === 0 ? (

    <div className='empty-cart'>
    <h2 className="cart-title-1">Shopping Cart</h2>
         <img src='https://thenounproject.com/api/private/icons/685015/edit/?backgroundShape=SQUARE&backgroundShapeColor=%23000000&backgroundShapeOpacity=0&exportSize=752&flipX=false&flipY=false&foregroundColor=%23000000&foregroundOpacity=1&imageFormat=png&rotation=0'/>
        <p className="empty-cart-message">
          Your cart is empty.
          <br />

            <div className='addButton'>
            <Link to="/courses">Browse Courses </Link></div>

        </p>
      </div>

      ) : (
        <>
             <div className="cart-title">Shopping Cart</div>

        <table className="cart-table" >
          <thead>
            <tr>
              <th scope="col" class="border-0">
              <div class="py-2">Course Name</div>
                </th>
              <th scope="col" class="border-0">
              <div class="py-2">Course Price</div>
                </th>
              <th scope="col" class="border-0">
              <div class="py-2 shopping-action">Actions</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>${item.price}</td>
                <td>
                  <button className="remove-button" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td></td>
              <td></td>
              <td > <button className="remove-button" onClick={handleRemoveAll}>
                  Remove All
                </button>

                </td>
            </tr>

          </tbody>
          <tfoot>
            <tr>
              <td  className="total-price-text">
                Total:
              </td>

              <td className="total-price">${totalSum}</td>
            </tr>
            <tr>
              <td colSpan="3" className="checkout-row">

                <button className="btn btn-dark" onClick={handleCheckout}>
                  Checkout
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
        </>
      )}
           {errorAlert && (
          <LittleAlertBox message={errorAlert} isSuccess={false} />
        )}
            {/* {successAlert && (
          <LittleAlertBox message={successAlert} isSuccess={true} />
        )} */}
    </div>
  );
}

export default Cart;
