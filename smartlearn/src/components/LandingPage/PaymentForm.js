import React, { useContext } from 'react';
import "./PaymentForm.css";
import { useNavigate, useParams  }from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import LittleAlertBox from '../LittleAlertBox';
import { useState } from 'react';
import { useEffect } from 'react';

import jwt_decode from 'jwt-decode';
function PaymentForm() {
  const { price } = useParams();
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);

 const navigate=useNavigate();

 const token = localStorage.getItem('token');
 const authenticated = token !== null;

 useEffect(() => {
   if (!authenticated) {
navigate("/")
   }



 }, []);

 const [successAlert,setSuccessAlert]=useState("");
  const handlePay = (event) => {
    event.preventDefault();
    // Retrieve the IDs of the items bought
    const itemIds = cartItems.map((item) => item.id);
    console.log(cartItems)
    const itemNames= cartItems.map((item) => item.name);
    // Display the IDs in an alert


    // Call the purchaseItems function from the CartContext if needed

    const token = localStorage.getItem('token');
    const authenticated = token !== null; // Check if token exists
    console.log(token)
    console.log(authenticated)
    let userId = ''; // Define userId variable

    if (authenticated) {
      const decodedToken = jwt_decode(token);
      userId = decodedToken.user_id; // Get the user's ID from the decoded token
      console.log(userId);
    }

    // ...

    fetch('http://localhost:3001/api/purchases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId, // Use the userId variable
        pactolus_ids: cartItems, // Assuming pactolusIds is an array of pactolus IDs
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Purchase saved successfully');
          removeFromCart(itemIds);
          clearCart();
          setSuccessAlert(`Items bought : ${itemNames.join(' , ')}`);
          // setSuccessAlert(`Items bought IDs: ${itemIds.join(', ')}`);
          setTimeout(() => {
            setSuccessAlert('');

          navigate("/dashboard/unlockedcourses");

          }, 2000); // Delay of 1 second (1000 milliseconds)


        } else {
          console.error('Failed to save the purchase');
        }
      })
      .catch((error) => {
        console.error('Error occurred while saving the purchase:', error);
      });


  };
    return (
      <div className="paymentForm">
        <div id="Checkout" className="inline">
          <h1>Pay Invoice</h1>
          <div className="card-row">
            <span className="visa"></span>
            <span className="mastercard"></span>
            <span className="amex"></span>
            <span className="discover"></span>
          </div>
          <form>
            <div className="form-group">
              <label htmlFor="PaymentAmount">Payment amount</label>
              <div className="amount-placeholder">
                <span>$</span>
                <span>{price}</span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="NameOnCard">Name on card</label>
              <input
                id="NameOnCard"
                className="form-control"
                type="text"
                maxLength="255"
              />
            </div>
            <div className="form-group">
              <label htmlFor="CreditCardNumber">Card number</label>
              <input
                id="CreditCardNumber"
                className="null card-image form-control"
                type="text"
              />
            </div>
            <div className="expiry-date-group form-group">
              <label htmlFor="ExpiryDate">Expiry date</label>
              <input
                id="ExpiryDate"
                className="form-control"
                type="text"
                placeholder="MM / YY"
                maxLength="7"
              />
            </div>
            <div className="security-code-group form-group">
              <label htmlFor="SecurityCode">Security code</label>
              <div className="input-container">
                <input
                  id="SecurityCode"

                  className="form-control"
                  type="password"
                />

              </div>

            </div>
            <div className="zip-code-group form-group">
              <label htmlFor="ZIPCode">ZIP/Postal code</label>
              <div className="input-container">
                <input
                  id="ZIPCode"
                  className="form-control"
                  type="text"
                  maxLength="10"
                />
                <a
                  tabIndex="0"
                  role="button"
                  data-toggle="popover"
                  data-trigger="focus"
                  data-placement="left"
                  data-content="Enter the ZIP/Postal code for your credit card billing address."
                >
                  <i className="fa fa-question-circle"></i>
                </a>
              </div>
            </div>
            <button
                     id="PayButton"
                     className="btn btn-block btn-success submit-button"
                     type="submit"
                     onClick={handlePay}
            >
              <span className="submit-button-lock"></span>
              <span className="align-middle">Pay ${price}</span>
            </button>
          </form>
        </div>
        {successAlert && (
          <LittleAlertBox message={successAlert} isSuccess={true} />
        )}
      </div>
    );
  };

  export default PaymentForm;



