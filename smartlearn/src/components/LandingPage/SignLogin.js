import React, { useEffect, useState } from 'react';
import './SignLogin.css';
import DOMPurify from 'dompurify';

import { useLocation } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import jwt_decode from 'jwt-decode';

import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import zxcvbn from 'zxcvbn';

import LittleAlertBox from '../LittleAlertBox';
const SignLogin = ({v}) => {
  const { price } = useParams();

  const [errorAlert,setErrorAlert]=useState("");
  const navigate=useNavigate();

  const token = localStorage.getItem('token');
  const authenticated = token !== null;

  useEffect(() => {
    if (authenticated) {
 navigate("/")
    }



  }, []);


  const location = useLocation();

  const[userSignedIn,setUserSignedIn]=useState(false);
  const[AdminSignedIn,setAdminSignedIn]=useState(false);

  const[userNotSignedIn,setUserNotSignedIn]=useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  // const[signedIn,setSignedIn]=useState(false);
  // const[nptSignedIn,setNotSignedIn]=useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');


    signUpButton.addEventListener('click', () => {
      container.classList.add('right-panel-active');
    });

    signInButton.addEventListener('click', () => {
      container.classList.remove('right-panel-active');
    });

    return () => {
      signUpButton.removeEventListener('click', () => {
        container.classList.add('right-panel-active');
      });

      signInButton.removeEventListener('click', () => {
        container.classList.remove('right-panel-active');
      });
    };
  }, []);

  useEffect(() => {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    const handleClick = () => {
      if (v) {
        container.classList.remove('right-panel-active');
      } else {
        container.classList.add('right-panel-active');
      }
    };

    if (v) {
      container.classList.remove('right-panel-active');
    } else {
      container.classList.add('right-panel-active');
    }

    signUpButton.addEventListener('click', () => {
      container.classList.add('right-panel-active');
    });

    signInButton.addEventListener('click', () => {
      container.classList.remove('right-panel-active');
    });

    return () => {
      signUpButton.removeEventListener('click', handleClick);
      signInButton.removeEventListener('click', handleClick);
    };
  }, [v]);


  const handleSignUp = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const password = formData.get('password');
    const confirmPassword = formData.get('ConfirmPassword');
    const email = formData.get('email');

    if (password !== confirmPassword) {
      console.log('Passwords do not match');


      setErrorAlert('Passwords do not match')
      setTimeout(() => {
        setErrorAlert('');
      }, 1000);


      return;
    }

    // Perform validation
    let isValid = true;

    if (!formData.get('name')) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!formData.get('email')) {
      setEmailError('Email is required');
      isValid = false;
    } else {
      setEmailError('');
    }
    if (!termsAccepted) {
      setErrorAlert('Please accept the Terms and Conditions');
      setTimeout(() => {
        setErrorAlert('');
      }, 1000);
      return;
    }
    if (!formData.get('password')) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      const passwordStrength = zxcvbn(password);
      setPasswordScore(passwordStrength.score);

      if (passwordStrength.score < 3) {
        setPasswordError('Password is not strong enough');
        isValid = false;
      } else {
        setPasswordError('');
      }
    }

    if (!isValid) {
      return;
    }

    fetch(`http://localhost:3001/check-email?email=${email}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.exists) {

                    setErrorAlert('Email already exists. Please choose a different email.')
                setTimeout(() => {
                  setErrorAlert('');
                }, 1000);
        } else {
          const data = {
            name: formData.get('name'),
            last_name: formData.get('LastName'),
            country: formData.get('country'),
            address: formData.get('address'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            password: formData.get('password'),
            role:'user'
          };

          fetch('http://localhost:3001/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
            .then((response) => {
              if (response.ok) {

                alert('User created successfully.');
              } else if (response.status === 409) {

                setErrorAlert('Email already exists. Please choose a different email.')
                setTimeout(() => {
                  setErrorAlert('');
                }, 1000);
              } else {
                console.log('Error creating user');
              }
            })
            .catch((error) => {
              console.error('Error creating user:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error checking email existence:', error);
      });
  };const handleSignIn = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const data = {
      email: formData.get('email-1'),
      password: formData.get('password-1'),
    };

    fetch('http://localhost:3001/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Parse the response as JSON
        } else if (response.status === 404) {
          throw new Error('User not found');
//fix those
          setErrorAlert('password field is empty')
        setTimeout(() => {
          setErrorAlert('');
        }, 1000);

        } else if (response.status === 401) {
          throw new Error('Invalid password');
//fix those
          setErrorAlert('Invalid password')
          setTimeout(() => {
            setErrorAlert('');
          }, 1000);

        } else {
          throw new Error('Error signing in');
        }
      })
      .then((data) => {
        // Store the token in localStorage
        localStorage.setItem('token', data.token);

        // Decode the token and check if the user is an admin or regular user
        const decodedToken = jwt_decode(data.token);
        console.log(decodedToken)
        if (decodedToken.isAdmin) {
          // alert('Admin signed in successfully');
          setAdminSignedIn(true);
          const timer = setTimeout(() => {
            window.location.href = '/AdminDashboard';
          }, 1000);
          // Additional admin logic...
        } else {
          // alert('User signed in successfully');
          setUserSignedIn(true);



        { const timer = setTimeout(() => {

          if (price!=null)
          // navigate(`/payment/${price}`);        //t7el moshkelt litems fil carta ili homa mawjoudin as purchase items deja .
          navigate(`/cart?payment=true`);
          else
            window.location.href = '/';
          }, 1000);
        }
          // Additional regular user logic...

        }

      })
      .catch((error) => {
        console.error('Error signing in:', error);
        alert(error.message);
      });
  };



  return (
    <div className="SignLoginBody">
      <div className="container" id="container">
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>
            {/* <div className="social-container">
              <a href="#" className="social">
                <FacebookIcon />
                <i className="fa fa-facebook"></i>
              </a>
              <a href="#" className="social">
                <GoogleIcon />
                <i className="fa fa-google"></i>
              </a>
              <a href="#" className="social">
                <LinkedInIcon />
                <i className="fa fa-linkedin"></i>
              </a>
            </div>
            <span>or use your email for registration</span> */}
            <input type="text" name="name" placeholder="Name"   required autoComplete="off"  />
            <input type="text" name="LastName" placeholder="Last name"   required autoComplete="off" />
            <input type="text" name="country" placeholder="Country"   required  autoComplete="off" />
            <input type="text" name="address" placeholder="Address"   required autoComplete="off"  />
            <input type="tel" name="phone" placeholder="Phone number"   required autoComplete="off" />

            <input type="email" name="email" placeholder="Email"   required autoComplete="off" />
            <input
  type="password"
  name="password"
  placeholder="Password"

  onChange={(e) => {
    const passwordStrength = zxcvbn(e.target.value);
    setPasswordScore(passwordStrength.score);
  }}     required     autoComplete="off"
/>
{passwordScore > 0 && (
  <div>
    Password strength: {passwordScore}/4
  </div>
)}
{passwordError && <div className="error">{passwordError}</div>}

            <input type="password" name="ConfirmPassword" placeholder="Confirm password"   required autoComplete="off"  />
            <div className='terms-and-conditions'>
            <input className="terms-checkbox" type="checkbox" name="terms" checked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)} />
<label className="terms-label" htmlFor="terms">I accept the <a href="/terms" target="_blank">Terms and Conditions</a></label>
</div>

            <button className="signInButton" type="submit">Sign Up</button>

          </form>
        </div>
        <div className="form-container sign-in-container">
          <form onSubmit={handleSignIn}>
            <h1>Sign In</h1>
            {/* <div className="social-container">
              <a href="#" className="social">
                <FacebookIcon />
                <i className="fa fa-facebook"></i>
              </a>
              <a href="#" className="social">
                <GoogleIcon />
                <i className="fa fa-google"></i>
              </a>
              <a href="#" className="social">
                <LinkedInIcon />
                <i className="fa fa-linkedin"></i>
              </a>
            </div> */}
            {/* <span>or use your account</span> */}

            <input type="email" name="email-1" placeholder="Email"   required autoComplete="off"/>
            <input type="password" name="password-1" placeholder="Password"   required autoComplete="off"/>
            <a href="#">Forgot Your Password?</a>
            <button  type="submit">Sign In</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us, please login with your personal info</p>
              <button className="ghost" id="signIn">
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your details and start your journey with us</p>
              <button  id="signUp">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
      {userSignedIn && (
          <LittleAlertBox message={` User is Successfully Signed In`} isSuccess={true} />
        )}

{AdminSignedIn && (
          <LittleAlertBox message={` Admin is Successfully Signed In`} isSuccess={true} />
        )}

{errorAlert && (
          <LittleAlertBox message={errorAlert} isSuccess={false} />
        )}

    </div>
  );
};

export default SignLogin;
