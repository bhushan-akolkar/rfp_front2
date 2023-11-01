import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import MobileMenu from './MobileMenu';
import ReactMarkdown from 'react-markdown';
import remarkHtml from 'remark-html';
import remarkReact from 'remark-react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import './Chat.css';

const ChatUI = () => {
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [inputText, setInputText] = useState('');
  const [activeChatIndex, setActiveChatIndex] = useState(null);
  const chatContainerRef = useRef(null);
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [headerText, setHeaderText] = useState('Select a Folder for QA');

  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [allSuggestions, setAllSuggestions] = useState([
    '/search',
    '/new',
    '/checklist',
    '/clear',
    '/help',
    'What are the qualifications and experience expected from potential vendors?',
    'What data quality and cleansing processes are necessary?'
  ]);
  const [searchInput, setSearchInput] = useState('');
  const [folderList, setFolderList] = useState([]);
  const location = useLocation();
  const placeholderText = (
    <div>
      {/* Hi, I am BankerEaze 🤖. These are some commands that you can use to control how I should respond to you.<br /><br />
  
      <strong>Switching the modes</strong><br />
      Following are the commands you can use to switch the modes:<br />
      /search: Enter into search mode<br />
      /chat: Enter into chat mode<br /><br />
  
      <strong>Helper commands</strong><br />
      Following are the commands you can use as helpers:<br />
      /checklist: Create a checklist out of your latest response<br />
      /new: Start a new chat with search mode enabled by default<br /><br />
  
      <strong>Topic commands</strong><br />
      While you are in search mode you can refine your search if you know the topic you want to search for. This will give you better responses.<br />
      Following are the topics which you can type to enter into a refined search mode:<br />
      @Accounting Standards<br />
      @Credit card<br />
      @Asset Liability Management<br />
      @Derivatives<br />
      @Disclosures<br />
      @Financial statements<br />
      @Repo Transactions */}
    </div>
  );
  const [chatPlaceholder, setChatPlaceholder] = useState(placeholderText);
   const [isLoading, setIsLoading] = useState(false); 
   const [selectedOption, setSelectedOption] = useState(getDefaultOption());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserProfileDropdownOpen, setIsUserProfileDropdownOpen] = useState(false);

  const toggleUserProfileDropdown = () => {
    setIsUserProfileDropdownOpen(!isUserProfileDropdownOpen);
  };
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
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
        // case 'Document':
        //   window.location.href = '/folder';;
        //   break; 
      default:
        break;
    }
    
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
        // case '/folder':
        //   return 'Document';  
      
      default:
        return 'Prompt'; 
    }
  }
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleInputChange = (event) => {
    const newText = event.target.value;
    setInputText(newText);

    // if (newText.startsWith('/')) {
    //   setSuggestionsVisible(true);
    // } else {
    //   setSuggestionsVisible(false);
    // }

   // Filter suggestions based on any part of the input
    // const inputTextLower = newText.toLowerCase();
    // const filteredSuggestions = suggestions.filter((suggestion) =>
    //   suggestion.toLowerCase().includes(inputTextLower)
    // );
    const filteredSuggestions = allSuggestions.filter((suggestion) =>
    suggestion.toLowerCase().startsWith(newText.toLowerCase())
  );

    // Update suggestions and make them visible
    setSuggestions(filteredSuggestions);
    setSuggestionsVisible(newText.trim() !== '' && filteredSuggestions.length > 0);
    setChatPlaceholder(newText.trim() === '' ? placeholderText : '');
  };
  
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


  const handleFolderClick = async (folderName) => {
    try {
      
      setHeaderText('Selected Folder: '+folderName);
  
      const response = await fetch('/get_document_name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folderName }),
      });
  
     
    } catch (error) {
      console.error('Error handling folder click:', error);
    } 
  };
  

  const handleSendMessage = async () => {
    if (inputText.trim() !== '') {
      
      const userMessage = { text: inputText, isUser: true };

      setMessages([...messages, userMessage]);
      const response = await fetch(`/doc_analyser/docstack/doc_prompt?text=${inputText}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'text/html'
        },
        
        
        // body: JSON.stringify({ user_input: inputText })
      });
      console.log("response is :",response)
      console.log("function get called :")
      const answer = await response.json();
      console.log('Assistant Messages:', answer);
      const Result = answer['Result']
      console.log("Result is ",Result)
      const Source = answer['Source_Document']
      console.log("source is :",Source)
      console.log(inputText)

      
      // let botResponse = {
      //   text: `Here are the results and the source document for your query:
      //    ${Result}`

      
      
        
        
      // };
      let botResponse = {
        text: (
          <div>
            <h3>Result:</h3>
            <ul>
              {Result.split("-")
                .filter(result => result.trim() !== '')
                .map((result, index) => (
                  <li key={index}>{result}</li>
                ))}
            </ul>
            <h3>Source Document:</h3>
            <table className="table"> 
              <thead className="table-header"> 
                <tr className="table-row">
                  <th className="table-dataheader__item">Document Name </th>
                  <th className="table-dataheader__item">Reference</th>
                  <th className="table-dataheader__item">Page Number</th>
                </tr>
              </thead>
              <tbody>
                  {Source.map((sourceDocument, index) => (
                    <tr className="table-row" key={index}>
                      <td className="table-data">{getTitleFromLink(sourceDocument)}</td>
                      <td className="table-data">
                        <a href={sourceDocument} target="_blank" rel="noopener noreferrer">
                          Link
                        </a>
                      </td>
                      <td className="table-data">{getPageNumberFromLink(sourceDocument)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ),
        };
        // Helper function to extract title from the link
        function getTitleFromLink(link) {
          const parts = link.split('/');
          const lastPart = parts[parts.length - 1];
          // Remove any query parameters or fragments
          const title = lastPart.split('#')[0].split('?')[0];
          const Ctitle = lastPart.split('.pdf')[0].toUpperCase();
          return Ctitle;
        }
        function getPageNumberFromLink(link) {
            const parts = link.split('#page=');
            if (parts.length === 2) {
              return parts[1];
            }
          }
    // let botResponse = {
    //   text: (
    //     <span>
    //       {Result}
    //       {/* {Source} */}
    //     </span>
    //   ),
    //   isUser: false,
    //   isTable: userMessage.isTable,
    // };
    
    // let pdfResponse = {
    //   pdfResponse: (
    //     <div>
    //       {/* PDF content goes here */}
    //       <div>PDF Title</div>
    //       <div>PDF Description</div>
    //       <table>
          
    //         <tr>
    //           <td><a href="link1.pdf">Link 1</a></td>
    //           <td><a href="link2.pdf">Link 2</a></td>
    //           <td><a href="link3.pdf">Link 3</a></td>
    //         </tr>
           
    //       </table>
    //     </div>
    //   ),
    //   isUser: false,
    //   isTable: userMessage.isTable,
    //   pdfResponse: true,
    // };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
      
      if (activeChatIndex !== null) {
        const updatedHistory = [...chatHistory];
        const updatedChat = updatedHistory[activeChatIndex];
        updatedChat.messages = [...updatedChat.messages, userMessage, botResponse];
        setChatHistory(updatedHistory);
      }
      
      setInputText('');
      scrollToBottom();
    }
  };
  const openPdfInMinimizedWindow = (e, pdfUrl) => {
    e.preventDefault();
  
    // Calculate available screen width and height
    const screenWidth = window.screen.availWidth;
    const screenHeight = window.screen.availHeight;
  
    // Set the PDF window dimensions as a percentage of screen width and height
    const windowWidthPercentage = 60; // Adjust as needed
    const windowHeightPercentage = 60; // Adjust as needed
  
    const windowWidth = (screenWidth * windowWidthPercentage) / 100;
    const windowHeight = (screenHeight * windowHeightPercentage) / 100;
  
    // Calculate the top and left positions to center the window
    const topPosition = screenHeight / 2 - windowHeight / 2;
    const leftPosition = screenWidth / 2 - windowWidth / 2;
  
    const newWindow = window.open(
      pdfUrl,
      "_blank",
      `width=${windowWidth}, height=${windowHeight}, top=${topPosition}, left=${leftPosition}`
    );
  
    if (newWindow) {
      newWindow.focus();
    }
  };
  
  
  
  
  
  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
   
    if (messages.length > 0) {
      if (activeChatIndex !== null) {
        const updatedHistory = [...chatHistory];
        updatedHistory[activeChatIndex].messages = messages;
        setChatHistory(updatedHistory);
      } else {
        const firstUserMessage = messages.find((message) => message.isUser);
        const chatName = firstUserMessage.text.split(' ').slice(0, 5).join(' ');
        const newChat = { name: chatName, messages: messages };
        setChatHistory([...chatHistory, newChat]);
      }
    }
    
    setMessages([]);
    setActiveChatIndex(null);
    setChatPlaceholder(placeholderText);
  };

  const handleChatHistoryClick = (index) => {
    setActiveChatIndex(index);
    setMessages(chatHistory[index].messages);
  };

  const handleDeleteChat = (index, event) => {
    event.stopPropagation();

    const updatedHistory = [...chatHistory];
    updatedHistory.splice(index, 1);
    setChatHistory(updatedHistory);

    if (activeChatIndex === index) {
      setMessages([]);
      setActiveChatIndex(null);
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
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

  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion);
    setSuggestionsVisible(false);
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

      {/* {isMobileMenuOpen && <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />} */}
      {/* {isMobileMenuOpen && (
        <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={() => setMobileMenuOpen(!isMobileMenuOpen)} chatHistory={chatHistory} />
      )} */}
      {isMobileMenuOpen && (
  <MobileMenu
    chatHistory={chatHistory}
    isOpen={isMobileMenuOpen}
    toggleMenu={toggleMobileMenu}
    handleChatHistoryClick={handleChatHistoryClick}
    activeChatIndex={activeChatIndex}
    handleDeleteChat={handleDeleteChat}
  />
)} 
<div className="logo" >
  RFP Analyzer
</div>
<h2 className="titlee">RFP document analyze assistant</h2>

      
      <div className={`sidebar ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="sidebar-header">
          <div className="recent-chat-label">Recent Chat</div>
          <div className="divider-container">
            <hr className="divider-below-recent-chat" />
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
        {/* {isLogoutVisible && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )} */}
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
          <button className="clear-chat-button" onClick={() => setMessages([])}>
            Clear Chat
          </button>
          <button className="new-chat-button" onClick={handleNewChat}>
            New Chat
          </button>
        </div>
        <div className="header-text">
        <div className="ask-question-text">{headerText}</div>
        </div>
        <hr className="divider" />
        <div className="chat-messages" ref={chatContainerRef}>
        <div className={`chat-placeholder ${chatPlaceholder ? 'visible' : ''}`}>
          {chatPlaceholder}
        </div>
        {isLoading ? ( 
  <div className="loading-indicator">...</div>
) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
            >
              <div className={`message-content ${message.isUser ? 'user-content' : 'bot-content'}`}>
                {message.isUser ? (
                  <div className="user-icon">
                    <img src="/user-3-black.png" alt="User" />
                  </div>
                ) : (
                  <div className="bot-icon">
                    <img src="bot-removebg-preview.png" alt="User" />
                  </div>
                )}
                {/* {message.pdfResponse ? (
          <div className="pdf-response">
            
          </div>
        ) : ( */}
                <div className={`message-text ${message.isUser ? 'user-text' : 'bot-text'}`}>
                  {message.isUser ? (
                    message.text
                  ) : (
                    <>
                     <div className="bot-response">
                      {message.text}
                    </div>
                      {message.additionalText && (
                        <div className="bot-response">{message.additionalText}</div>
                      )}
                    </>
                  )}
                </div>
                {/* )} */}
              </div>
              {message.isUser ? null : <hr className={`message-divider ${message.isUser ? 'user-divider' : 'bot-divider'}`} />}
            </div>
          
          ))
)}
          <div ref={scrollToBottom}></div>
        </div>
        <div className="input-box-container">
       
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder="Enter your query"
            className="input-box"
          />
           <div className={`suggestions-container ${suggestionsVisible ? 'visible' : ''}`}>
          {suggestionsVisible && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
          {/* {suggestionsVisible && (
            <div className="suggestions">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )} */}
          <button onClick={handleSendMessage} className="send-button">
            <div className="send-button-image">
              <img src={process.env.PUBLIC_URL + '/paper-plane.png'} alt="User Profile" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;