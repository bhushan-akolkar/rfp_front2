import React from 'react';
import './Register.css';
import { useHistory } from 'react-router-dom';


const SignInPage = () => {
 
  const history = useHistory(); // Initialize useHistory



  const handleLogin = () => {
    // Add your login logic here if needed
    // Redirect to the "/chat" page when the login button is clicked
    window.location.href = '/chat';
  };
  return (
    <div className="login-container">
      <div className="left-containerr">
        <div className="title">RBI Credit Card compliance assistant</div>
        <div className="subtitle">Ask your query about Credit Card compliance, we will get the best relevant compliance guideline from RBI</div>
      </div>
      <div className="right-containerr">
        <div className='sign-up'>
        <h2 >Sign Up</h2>
        <label className="input-label">Name</label>
        <input className="name-input" type="text" placeholder="Enter your Name" />
        <label className="input-label">Email ID</label>
        <input className="email-input" type="text" placeholder="Enter your email" />
        <label className="input-label">Password</label>
        <input className="password-input" type="password" placeholder="Password" />
        <div className="password-links">
          <a className="signup-link" href="/login">Log In</a>
          
        </div>
       
        <div className="button-container">
      <div className="submit-container">
        <a href="/login" className="submit-button" onClick={handleLogin}>
          Submit
        </a>
      </div>
      
    </div>
      
        
      </div>
      </div>
    </div>
  );
};

export default SignInPage;
