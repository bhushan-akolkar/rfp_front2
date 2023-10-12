import React, { useState, useRef,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link, useHistory, useLocation } from 'react-router-dom';
// import MobileMenu from './MobileMenu';
import './Similar_Document.css';

const ChatUI = () => {
  const [rfpName, setRfpName] = useState('');
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [documentFile, setDocumentFile] = useState(null); // Add state for the uploaded document
    const [isLogoutVisible, setIsLogoutVisible] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const chatContainerRef = useRef(null);
    const fileInputRef = useRef(null);
    const history = useHistory();
    const location = useLocation();
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };
  const [selectedOption, setSelectedOption] = useState(getDefaultOption());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [folderList, setFolderList] = useState([]);
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
      default:
        break;
    }
    setSelectedOption(option);
    setIsDropdownOpen(false);
    
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
          case '/similardocument':
            return 'Similar Document';
          case '/getchecklist':
            return 'Checklist';
      default:
        return 'Prompt'; // Default to 'Prompt' if the path doesn't match any known option
    }
  }
  const handleDocumentUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setDocumentFile(file); 
      const documentName = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        const documentDataUrl = e.target.result;
        // setUploadedDocuments((prevDocuments) => [
        //   ...prevDocuments,
        //   { name: documentName, data: documentDataUrl },
        // ]);
      };
      reader.readAsDataURL(file);
      setDocumentFile(file);
    }
  };
  

  const handleUploadButtonClick = async () => {
   
    if (!documentFile || !rfpName) {
      console.error('Please upload a document before clicking the "Upload Document" button.');
      return;
    }
     
      const formData = new FormData();
      formData.append('rfpName', rfpName);
      formData.append('documents', documentFile);
      console.log(formData);
      try {
        
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
        const response = await fetch('https://b43f-103-181-14-151.ngrok-free.app/doc_analyser/dockstack/upload_doc', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          const documentName = documentFile.name;
        setUploadedDocuments((prevDocuments) => [
          ...prevDocuments,
          { name: documentName },
        ]);
          setDocumentFile(null);
          setRfpName('');
        } else {
          console.error('Error uploading document to the API');
        }
      } catch (error) {
        console.error('Error uploading document:', error);
      }
    };

    const handleShowSimilarDocument = async () => {
      try {
        const response = await fetch('https://your-api-endpoint.com/similar_documents');
        if (response.ok) {
          const data = await response.json();
          const apiResponseQueryParam = encodeURIComponent(JSON.stringify(data));
          window.location.href = `/similardocument?apiResponse=${apiResponseQueryParam}`;
        } else {
          console.error('Error fetching similar documents.');
        }
      } catch (error) {
        console.error('Error fetching similar documents:', error);
      }
    };
  
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

  const handleLogout = () => {
   
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
            <div key={index} className="folder-item">
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
          </div>
        )}
      </div>
        <button className="user-profile-button" type="button" onClick={toggleLogout}>
          <div className="user-profile-image">
            <img src={process.env.PUBLIC_URL + '/user-3-line.png'} alt="User Profile" />
          </div>
        </button>
        {isLogoutVisible && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

      <div className={`chat-content ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="header-buttons">
          
        </div>
        <div className="header-textt">
          <div className="ask-question-text">Similar Documents</div>
        </div>
        <hr className="divider" />

        <div className="document-upload-container">
        <img src="file-plus.png" alt="img" className="docimage" />
        <div className="upload-text">
    Drag and drop your document here or upload.
  </div>
  <div className="file-size-text">
    Max. file size 24 MB.
  </div>
  <div className="input-container">
  <input
          type="text"
          value={rfpName}
          onChange={(e) => setRfpName(e.target.value)}
          placeholder="RFP Name"
          className="rfp-name-input"
        />
        {/* <br/> */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleDocumentUpload}
            accept=".pdf" 
            // style={{ display: 'none' }} // hide the file input
          />
          </div>
          {/* <br/> */}
          <button className="upload-button" onClick={handleUploadButtonClick}>
            Upload Document
          </button>
        </div>

        {uploadedDocuments.length > 0 && (
  <div className="uploaded-documents">
    <div className="uploaded-document-title">Uploaded Documents:</div>
    {uploadedDocuments.map((document, index) => (
      <div key={index} className="uploaded-document">
        <div className="uploaded-document-name">{document.name}</div>
        {/* Render the uploaded document here */}
        {/* <iframe src={document.data} title={`Uploaded Document ${index + 1}`} /> */}
      </div>
    ))}
    <button className="similarDoc-button" onClick={handleShowSimilarDocument}>
            Get Similar Document
          </button>
     </div>
     )}
     
        <div ref={chatContainerRef}></div>
      </div>
    </div>
  );
};

export default ChatUI;
