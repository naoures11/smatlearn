
import "./App.css"
import LandingPage from "./pages/LandingPage";
import  React from "react";
import { Route, Routes} from "react-router-dom";

import ClientProfile from "./pages/ClientProfile";
import Dashboard from "./pages/Dashboard";

import { CartProvider } from "./context/CartContext";

import ViewCourse from "./pages/ViewCourse";
import Quiz from "./components/ViewCourse/quiz";

function App() {

	return (

              <CartProvider>

       <div className="app">





<Routes>
        <Route path="*" element={<LandingPage />} index >
         </Route>
		 <Route path="/AdminDashboard" element={<Dashboard/>} >
         </Route>

         <Route path="/dashboard/:component" element={<ClientProfile/>} >
         </Route>

         <Route path="/viewCourse/:pactolusId" element={<ViewCourse/>} >

         </Route>
    <Route path="/viewCourse/:pactolusId/*" element={<ViewCourse/>}/>
         {/* <Route path="/viewCourse/:pactolusId/*" element={<ViewCourse/>}/> */}
         {/* <Route path="/viewCourse/:pactolusId/quiz" element={<Quiz />} /> */}

         {/* <Route path="/viewCourse/:pactolusId/:forum" element={<ViewCourse />} /> */}






</Routes>






	   </div>




</CartProvider>
	);

}

export default App;
