import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
    </BrowserRouter>
);



// import React from "react";
// import store from "./store";

// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import CartReducer from './redux/CartReducer';
// import { Provider } from 'react-redux';
// import { createStore } from 'redux';
// import { BrowserRouter } from 'react-router-dom';
// import reportWebVitals from './reportWebVitals';
// const store = createStore(CartReducer);

// ReactDOM.render(
//   <Provider store={store}>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </Provider>,
//   document.getElementById('root')
// );



// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { createStore } from 'redux'
// import { Provider } from 'react-redux';
// import { BrowserRouter } from 'react-router-dom';
// import CartReducer from './redux/CartReducer';
// import App from './App';
// import reportWebVitals from './reportWebVitals';


// const store = createStore(CartReducer);

// const root = ReactDOM.createRoot(document.getElementById('root'))
// root.render(
//   <Provider store={store}>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </Provider>
// )





// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
