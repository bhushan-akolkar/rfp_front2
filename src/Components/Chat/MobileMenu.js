import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';


const MobileMenu = ({ isOpen, toggleMenu,chatHistory,activeChatIndex,handleChatHistoryClick,handleDeleteChat }) => {

  
  console.log("Received chatHistory in MobileMenu: ", chatHistory);

  return (
    <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
      <button className="hamburger-button" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </button>
      <div className="sidebar-content">
      <div className="sidebar-header">
        <div className="recent-chat-label">Recent Chat</div>
        <div className="divider-container">
    <hr className="divider-below-recent-chat" /> {/* Divider below Recent Chat */}
  </div>
  </div>      
  {isOpen && (
          <div className="chat-history">
            {chatHistory.map((entry, index) => (
              <button
                key={index}
                className={`chat-history-entry`}
                onClick={() => handleChatHistoryClick(index)}
              >
                {entry.name}
                {index === activeChatIndex && (
                  <button
                    className="delete-button"
                    onClick={(event) => handleDeleteChat(index, event)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </button>
            ))}
          </div>
        )}


<hr className="divider1" />
 {/* <div className="user-profile-container">
  <div className="user-profile">
          <button
            className="user-profile-button"
            type="button"
            onClick={toggleLogout}
          >
            <div className="user-profile-content">
              
              <div className="user-profile-name">User Profile</div>
              
            </div>
          
          </button>
          {isLogoutVisible && (
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          )}
          </div> 
          <div className="user-profile-button"> 
             <button
              className={`mode-button ${isDarkMode ? 'dark' : 'light'}`}
              onClick={toggleDarkMode}
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button> 

 <label className="mode-switch">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleDarkMode}
            />
            <span className="slider">
              <span className="mode-label light-label">Light </span>
              <span className="mode-label dark-label">Dark </span>
            </span>
          </label> 
          
    
           </div>
          
        </div>  */}
      
        {/* )} */}
        {/* <div className="user-profile-container">
        <label className="mode-switch">
      <input
        type="checkbox"
        checked={isDarkMode}
        onChange={toggleDarkMode}
      />
      <span className="slider">
        <span className="mode-label light-label">Light</span>
        <span className="mode-label dark-label">Dark</span>
      </span>
    </label>
    <button className="user-profile-button" type="button" onClick={toggleLogout}>
    <div className="user-profile-image">
    <img
        src={process.env.PUBLIC_URL + '/user-3-line.png'}
        alt="User Profile"
      />
    </div>
    </button>
    {isLogoutVisible && (
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    )}
    
  </div> */}
      </div>
    </div>
  );
};

export default MobileMenu;
