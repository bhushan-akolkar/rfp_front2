import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
// import MobileMenu from './MobileMenu';
import ReactMarkdown from 'react-markdown';
import remarkHtml from 'remark-html';
import remarkReact from 'remark-react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import './Document.css';

const ChatUI = () => {
  const chatContainerRef = useRef(null);
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [secondApiResponse, setSecondApiResponse] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const location = useLocation();
  // const { apiResponse } = location.state;
  // const queryParams = new URLSearchParams(location.search);
  // const apiResponseQueryParam = queryParams.get('apiResponse');
  // const apiResponse = JSON.parse(decodeURIComponent(apiResponseQueryParam));
  const [folderList, setFolderList] = useState([]);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };
  const [selectedOption, setSelectedOption] = useState(getDefaultOption());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserProfileDropdownOpen, setIsUserProfileDropdownOpen] = useState(false);

  const toggleUserProfileDropdown = () => {
    setIsUserProfileDropdownOpen(!isUserProfileDropdownOpen);
  };
  const handleOptionClick = (option) => {
    
    switch (option) {
      case 'Prompt':
        window.location.href = '/chat';
        break;
      case 'Similar Document':
        window.location.href = '/document';
        break;
      case 'Checklist':
        window.location.href = '/checklist';
        break;
      case 'All Documents':
        window.location.href = '/all';;
        break;
        case ' Document':
            window.location.href = '/folder';;
            break;  
      default:
        break;
    }
    setSelectedOption(option);
    setIsDropdownOpen(false);
    
  };
  const handleUserOptionClick = (option) => {
    switch (option) {
      case 'Profile':
        window.location.href = '/profile';
        break;
      case 'Logout':
        window.location.href = '/login';
        break;
      case 'Sidebar Toggle':
        // Add your logic for sidebar toggle here
        break;
      default:
        break;
    }
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  useEffect(() => {
    localStorage.setItem('selectedOption', selectedOption);
  }, [selectedOption]);

  function getDefaultOption() {
    const currentPathname = location.pathname;
    switch (currentPathname) {
      case '/chat':
        return 'Prompt';
      case '/document':
        return 'Similar Document';
      case '/checklist':
        return 'Checklist';
      case '/all_documents':
        return 'All Documents';
      case '/similardocument':
        return 'Similar Document';
      case '/getchecklist':
        return 'Checklist';
      case '/folder':
            return 'Document';  
        
      default:
        return 'Prompt'; 
    }
  }

  

  useEffect(() => {
      
    const apiUrl = 'https://your-api-endpoint.com/get_folders';
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setFolderList(data.docstack_list);
      })
      .catch((error) => {
        console.error('Error fetching folder list:', error);
      });
  }, []);
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleFolderClick = async (folderName) => {
    try {
      
      const response = await fetch('https://your-api-endpoint.com/send_folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folderName }),
      });

      if (response.ok) {
        
        const secondApiResponse = await fetch('https://your-api-endpoint.com/second_api', {
          method: 'GET',
        });
  
        if (secondApiResponse.ok) {
          const responseData = await secondApiResponse.json(); 
          console.log('Response Data in API:', responseData);
          setResponseData(responseData);
        } else {
          console.error('Error fetching response from the second API.');
        }
      } else {
        console.error('Error sending folder name to the API.');
      }
    } catch (error) {
      console.error('Error handling folder click:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    window.location.href = '/login';
  };

  const toggleLogout = () => {
    setIsLogoutVisible(!isLogoutVisible);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  console.log('Response Data in Component:', responseData);
  return (
    <div className={`chat-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <button
        className={`hamburger-button ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={toggleMobileMenu}
      >
        <div className="hamburger-icon"></div>
        <div className="hamburger-icon"></div>
        <div className="hamburger-icon"></div>
      </button>

     
<div className="logo" >
  Banker Eaze
</div>
<h2 className="titlee">Finance Regulatory compliance assistant</h2>

      
      <div className={`sidebar ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="sidebar-header">
          <div className="recent-chat-labell">Recent Uploads</div>
          <div className="divider-container">
            <hr className="divider-below-recent-chat" />
          </div>
          
        </div>
        {folderList.map((folder, index) => (
          <div
            key={index}
            className="folder-item"
            onClick={() => handleFolderClick(folder)} 
          >
            {folder}
          </div>
        ))}
      </div>
      <div className="bottom-left-section">
  <p className="bottom-left-text">Product From</p>
  <img src="dataease-logo.png" alt="Product Image" className="bottom-left-image" />
</div>

      <div className="user-profile-container">
        {/* <label className="mode-switch">
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={toggleDarkMode}
          />
          <span className="slider">
            <span className="mode-label light-label">Light</span>
            <span className="mode-label dark-label">Dark</span>
          </span>
        </label> */}
         <div className="dropdownn">
        <button className="dropbtn" onClick={toggleDropdown}>
          {selectedOption } &#9660;
        </button>
        {isDropdownOpen && (
          <div className="dropdown-content">
            <div onClick={() => handleOptionClick('Prompt')}>Prompt</div>
            <div onClick={() => handleOptionClick('Similar Document')}>Similar Document</div>
            <div onClick={() => handleOptionClick('Checklist')}>Checklist</div>
            <div onClick={() => handleOptionClick('All Documents')}>All Documents</div>
            <div onClick={() => handleOptionClick('Document')}>Document</div>
          </div>
        )}
      </div>
        <button className="user-profile-button" onClick={toggleUserProfileDropdown}>
          <div className="user-profile-image">
            <img src={process.env.PUBLIC_URL + '/user-3-line.png'} alt="User Profile" />
          </div>
        </button>
        {isUserProfileDropdownOpen && (
        <div className="user-profile-dropdown">
          <div onClick={() => handleUserOptionClick('Profile')}>Profile</div>
          <div onClick={() => handleUserOptionClick('Logout')}>Logout</div>
          <div onClick={() => handleUserOptionClick('Sidebar Toggle')}>Sidebar Toggle</div>
        </div>
      )}
      </div>

      <div className={`chat-content ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="header-buttons">
          
          </div>

        <div className="header-textt">
          <div className="ask-question-text">Similar Document</div>
        </div>
        <hr className="divider" />
        <div className="chat-messagess" ref={chatContainerRef}>
   
        <div className="api-response">
        {/* {responseData !== null  ( */}
        {responseData  (
            responseData.map((data, index) => (
              <div key={index} className="response-item">
                <h3>Document Name</h3>
                <div>{data['Document Name']}</div>

                <h3>Summary</h3>
                <div>{data['Summary']}</div>

                <h3>Links</h3>
                <div>
                  {data.link.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Link {linkIndex + 1}
                    </a>
                  ))}
                </div>

                <hr />
              </div>
            ))
          ) }
        
  </div>
  {/* <div className="button-loader-container">
                <button className="similarDoc-button" onClick={handleShowSimilarDocument}>
                Get Similar Document
                </button>
                {isLoading && (
                <div className="loader-container">
                <div className="loader"></div>
            </div>
            )}
             </div> */}
  

          <div ref={scrollToBottom}></div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
