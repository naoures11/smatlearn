import React from 'react';
import { Route, Routes, Router } from 'react-router-dom';
import { useRef,useState, useEffect } from 'react';


import './LandingPage.css';




import NavBar from '../components/LandingPage/NavBar';
import SignLogin from '../components/LandingPage/SignLogin';


import Artist from '../components/LandingPage/artist';
import Courses from '../components/LandingPage/courses';
import Contact from '../components/LandingPage/contact';
import AboutUs from '../components/LandingPage/aboutUs';
import Cart from '../components/LandingPage/Cart';
import Privacy from '../components/LandingPage/privacy';
import Terms from '../components/LandingPage/terms';
import PactolusList from '../components/LandingPage/PactolusList';
import Footer from '../components/LandingPage/footer';
import PaymentForm from '../components/LandingPage/PaymentForm';

const LandingPageContent = () => {
  const [text, setText] = useState('');
  const [cursor, setCursor] = useState(true);
  const bg={
    backgroundImage:'url({bg})'
  }


  const [words, setWords] = useState("");

  const [websiteData, setWebsiteData] = useState({});

  useEffect(() => {
    fetchWebsiteData(); // Fetch website data when the component mounts
  }, []);

  const fetchWebsiteData = () => {
    fetch('http://localhost:3001/website')
      .then((response) => response.json())
      .then((data) => {
        setWebsiteData(data);
        console.log(data);
        console.log(data.header_text);
        setWords(data.header_text)
      })
      .catch((error) => {
        console.error('Error fetching website data:', error);
      });
  };


  useEffect(() => {

console.log("meooooooooow")
console.log(words)
    let currentLetter = -1;
    console.log(words)
    let interval = setInterval(() => {

      if (currentLetter >= words.length-1) {
        setText('');
        setCursor(true);
        currentLetter = -1;
        return;
      }
      currentLetter++;
      // learn in yellow
      //  if (currentLetter<=4)
      //  setText(prevText => prevText + `<span style="color: yellow">${words[currentLetter]}</span>`);
      //  dangerouslySetInnerHTML={{ __html:text }}
      // else
      setText(prevText => prevText + words[currentLetter]);
         console.log(currentLetter)
      if (currentLetter === words.length - 1) {
        setCursor(false);
      } else {
        setCursor(true);
      }


    }, 200);

    return () => clearInterval(interval);
  }, [words]);





  const ball1Ref = useRef(null);
  const ball2Ref = useRef(null);
  const ball3Ref = useRef(null);



  useEffect(() => {

    const wrapper = document.querySelector('.wrapper');

    const b1 = document.querySelector('.ball-1').getBoundingClientRect();
    const b2 = document.querySelector('.ball-2').getBoundingClientRect();
    const b3 = document.querySelector('.ball-3').getBoundingClientRect();

    const diagonalCenter = {
      // x: (b2.getBoundingClientRect().y - b1.getBoundingClientRect().y)/2 +b1.getBoundingClientRect().y ,
      x:wrapper.offsetWidth / 2,
      y: wrapper.offsetHeight / 2,
    };
    console.log(diagonalCenter.x)
    const ball1 = ball1Ref.current;
    const ball2 = ball2Ref.current;
    const ball3 = ball3Ref.current;

    const ball1StartPos = { x: ball1.offsetLeft, y: ball1.offsetTop };
    const ball2StartPos = { x: ball2.offsetLeft, y: ball2.offsetTop };
    const ball3StartPos = { x: ball3.offsetLeft, y: ball3.offsetTop };

    const ball1EndPos = {

      y: diagonalCenter.x,
    };
    const ball2EndPos = {
      x: diagonalCenter.x - ball2.offsetWidth / 2,
      y: diagonalCenter.y - ball2.offsetHeight / 2,
    };
    const ball3EndPos = {
      x: diagonalCenter.x - ball3.offsetWidth / 2,
      y: diagonalCenter.y - ball3.offsetHeight / 2,
    };

    const animationDuration = 2000;

    const animate = (element, start, end, duration) => {
      const range = {
        x: end.x - start.x,
        y: end.y - start.y,
      };
      const startTime = performance.now();
      const step = currentTime => {
        const elapsed = currentTime - startTime;
        const t = elapsed / duration;
        element.style.left = start.x + range.x * t + 'px';
        element.style.top = start.y + range.y * t + 'px';
        if (elapsed < duration) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    };


    setTimeout(() => {
      animate(ball1, ball1StartPos, ball1EndPos, animationDuration);
      animate(ball2, ball2StartPos, ball2EndPos, animationDuration);
      animate(ball3, ball3StartPos, ball3EndPos, animationDuration);


    }, 2000);

    setTimeout(() => {
      const ball1StartPos1 = {  y: ball1EndPos.y};
      const ball2StartPos1 = { x: ball2EndPos.x, y: ball2EndPos.y };
      const ball3StartPos1 = { x: ball3EndPos.x, y: ball3EndPos.y};

      const ball1EndPos1 = { x: b1.x, y: b1.y };
      const ball2EndPos1 = { x: b2.x, y: b2.y };
      const ball3EndPos1 = { x: b3.x, y: b3.y };

      animate(ball1, ball1StartPos1, ball1EndPos1, animationDuration);
      animate(ball2, ball2StartPos1, ball2EndPos1, animationDuration);
      animate(ball3, ball3StartPos1, ball3EndPos1, animationDuration);

    }, 5000);



  }, []);

  const pactolusListRef = useRef(null);

  const handleDiscoverClick = () => {
    if (pactolusListRef.current) {
      pactolusListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
   <div>
    <div className='first'>
    <div className="wrapper">
    <div className="ball ball-1" ref={ball1Ref}></div>
      <div className="ball ball-2" ref={ball2Ref}></div>
      <div className="ball ball-3"ref={ball3Ref}></div>
      <div className="box-container" >
        <div className="box-content">
          {text}
          {cursor && <span>|</span>}
        </div>
      </div>

  </div>
    {/* <div className="illustration">
      <img src="https://cdn.dribbble.com/users/2172117/screenshots/4952373/_____still_2x.gif?compress=1&resize=400x300" alt="image" style={{ width: '500px' }} />
    </div> */}

    </div>


    <div className='featured-wrap'>
        <div className='featured-container'>
          <div className='featured-text'>{websiteData.features_text}</div>
          <div className='discover-button sc_call_to_action_button sc_item_button' onClick={handleDiscoverClick}>
            Discover our courses
          </div>
        </div>
      </div>


  <div ref={pactolusListRef}>
        <PactolusList />
      </div>
 </div>
  );
};

const LandingPage = () => {
  return (
    <div className='lp'>
      <NavBar />


      <Routes>
        <Route path="*" element={<LandingPageContent />} index >
         </Route>

        <Route path="Login" element={<SignLogin v={true} />} >
        </Route>
        <Route path="/Login/:price" element={<SignLogin v={true} />} >
        </Route>

        <Route path="SignUp" element={<SignLogin v={false} />} >
         </Route>

         <Route path="courses" element={<Courses/>} >
         </Route>

         <Route path="artist" element={<Artist/>} >
         </Route>

         <Route path="contact" element={<Contact />} >
         </Route>
         <Route path="aboutUs" element={<AboutUs />} >
         </Route>

         <Route path="cart" element={<Cart />} >
         </Route>
         <Route path="terms" element={<Terms />} >
         </Route>
         <Route path="privacy" element={<Privacy />} >
         </Route>


         {/* <Route path="cart/:payment" element={<Cart />} >
         </Route> */}
         <Route path="/payment/:price" element={<PaymentForm />} >
         </Route>







      </Routes>




      <Footer/>
    </div>
  );
};

export default LandingPage;
