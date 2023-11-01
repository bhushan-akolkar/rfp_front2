import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
// import MobileMenu from './MobileMenu';
import ReactMarkdown from 'react-markdown';
import remarkHtml from 'remark-html';
import remarkReact from 'remark-react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import './show_similar_document.css';

const ChatUI = () => {
  const chatContainerRef = useRef(null);
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading indicator
  const [folderList, setFolderList] = useState([]);
  const [responseData, setResponseData] = useState(null);

  const location = useLocation();
  // const { apiResponse } = location.state;
  const queryParams = new URLSearchParams(location.search);
  const apiResponseQueryParam = queryParams.get('apiResponse');
  const apiResponse = JSON.parse(decodeURIComponent(apiResponseQueryParam));
  const [isDocumentUploadVisible, setIsDocumentUploadVisible] = useState(true);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };
  const [searchInput, setSearchInput] = useState('');

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
        // case ' Document':
        //   window.location.href = '/folder';;
        //   break; 
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
        // case '/folder':
        //   return 'Document';  
      
      default:
        return 'Prompt'; 
    }
  }
  const handleSearchInput = (e) => {
    setSearchInput(e.target.value); 
  };
  const filteredFolderList = folderList.filter((folder) =>
      folder.toLowerCase().startsWith(searchInput.toLowerCase())
    );

    useEffect(() => {

      const apiUrl = '/doc_analyser/docstack/list';
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
      setIsDocumentUploadVisible(false);
      setIsLoading(true);
      const response = await fetch('/get_document_name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folderName }),
      });

      if (response.ok) {

        const secondApiResponse = await fetch('/doc_analyser/similar', {
          method: 'GET',
        });

        if (secondApiResponse.ok) {
          const responseData = await secondApiResponse.json(); 
          setResponseData(responseData);
          // setIsDocumentUploadVisible(responseData && responseData.similar_documents && responseData.similar_documents.length > 0);
          console.log('Response Data in API:', responseData);
          // setResponseData(responseData);
          // setIsDocumentUploadVisible(responseData && responseData.similar_documents && responseData.similar_documents.length > 0);
          // setIsDocumentUploadVisible(false);
        } else {
          console.error('Error fetching response from the second API.');
        }
      } else {
        console.error('Error sending folder name to the API.');
      }
    } catch (error) {
      console.error('Error handling folder click:', error);
    }
    finally {
      setIsLoading(false); 
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
  RFP Analyzer
</div>
<h2 className="titlee">RFP document analyze assistant</h2>

      
      <div className={`sidebar ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="sidebar-header">
          <div className="recent-chat-labell">Recent Uploads</div>
          <div className="divider-container">
            <hr className="divider-below-recent-chat" />
          </div>
          </div>
        <div className="search-bar">
          <input
          type="text"
          value={searchInput}
          onChange={handleSearchInput}
          placeholder="Search folders"
          className="search-input"
        />
        </div>
        {filteredFolderList.map((folder, index) => (
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
            {/* <div onClick={() => handleOptionClick('Document')}>Document</div> */}
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
        {isDocumentUploadVisible && (
  isLoading ? (
    <div className="loading-message">Generating Response...</div>
  ) : (
    <div className="api-response">
      {apiResponse.similar_documents.map((doc, index) => (
        <div key={index} className="response-item">
          <h3>Document Name</h3>
          <div>{doc['Document Name']}</div>

          <h3>Summary</h3>
          <div>{doc['Summary']}</div>

          {doc['link'] && doc['link'].length > 0 && (
            <div>
              <h3>Document Links</h3>
              {doc['link'].map((link, linkIndex) => (
                <div key={linkIndex}>
                  <a
                    href={link}
                    target="_blank"
                    onClick={(e) => {
                      e.preventDefault();
                      const width = 900;
                      const height = 500;
                      const left = window.screen.width / 2 - width / 2;
                      const top = window.screen.height / 2 - height / 2;
                      window.open(link, '', `width=${width},height=${height},top=${top},left=${left}`);
                    }}
                  >
                    {link.split('/')[link.split('/').length - 1]}
                  </a>
                  <br />
                </div>
              ))}
            </div>
          )}

          <hr />
        </div>
      ))}
    </div>
  )
)}
        {isLoading ? (
          <div className="loading-message">Generating Response...</div>
        ) : (
        <div className="api-response">
        {responseData && responseData.similar_documents && responseData.similar_documents.length > 0 ? (
          responseData.similar_documents.map((doc, index) => (
          <div key={index} className="response-item">
          <h3>Document Name</h3>
          <div>{doc['Document Name']}</div>

          <h3>Summary</h3>
          <div>{doc['Summary']}</div>

          {doc['link'] && doc['link'].length > 0 && (
  <div>
    <h3>Document Links</h3>
    {doc['link'].map((link, linkIndex) => (
      <div key={linkIndex}>
        <a
          href={link}
          target="_blank"
          onClick={(e) => {
            e.preventDefault();
            const width = 900;
            const height = 500;
            const left = window.screen.width / 2 - width / 2;
            const top = window.screen.height / 2 - height / 2;
            window.open(link, '', `width=${width},height=${height},top=${top},left=${left}`);
          }}
        >
          {link.split('/')[link.split('/').length - 1]}
        </a>
        <br /> 
      </div>
    ))}
  </div>
)}
            
            <hr />
            </div>
      ))):(
        <div className="no-response"></div>
          )}
  </div>
  
        )}
          <div ref={scrollToBottom}></div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
