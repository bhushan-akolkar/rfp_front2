import React from 'react';
import './Login.css';
import { useHistory } from 'react-router-dom';


const SignInPage = () => {
 
  const history = useHistory(); 



  const handleLogin = () => {
   
    window.location.href = '/chat';
  };
  return (
    <div className="login-container">
      <div className="left-container">
        <div className="title">RBI Credit Card compliance assistant</div>
        <div className="subtitle">Ask your query about Credit Card compliance, we will get the best relevant compliance guideline from RBI</div>
      </div>
      <div className="right-container">
        <h2 className="sign-up">Sign In</h2>
        <label className="input-label">Email ID</label>
        <input className="email-input" type="text" placeholder="Enter your email" />
        <label className="input-label">Password</label>
        <input className="password-input" type="password" placeholder="Password" />
        <div className="password-links">
          <a className="signup-link" href="/register">Sign Up</a>
          <a className="reset-password-link" href="#resetpassword">Reset Password</a>
        </div>
       
        <div className="button-container">
      <div className="submit-container">
        <a href="/chat" className="submit-button" onClick={handleLogin}>
          Submit
        </a>
      </div>
      <div className="google-login-container">
        <a href="/google-login" className="google-login-button">
          <img src="/google icon.png" alt="Google Icon" />
        </a>
      </div>
    </div>
       
        
      </div>
    </div>
  );
};

export default SignInPage;
