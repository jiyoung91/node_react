import React from 'react';
import {
  BrowserRouter as Router,
  Routes,//Switch,
  Route,
  Link
} from "react-router-dom";
import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';

const App = () => {
  return (
    <div className='App'>
    <Router>
      <Routes>
        <Route path="/" element={ <LandingPage /> } />
        <Route path="/login" element={ <LoginPage /> }/>
        <Route path="/register" element={ <RegisterPage /> }/>
      </Routes>
    </Router>
    </div>
  );
};

export default App;
