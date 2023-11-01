import React, { useState, useRef,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link, useHistory, useLocation } from 'react-router-dom';
// import MobileMenu from './MobileMenu';
import './checklist.css';

const ChatUI = () => {
  const [rfpName, setRfpName] = useState('');
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [documentFile, setDocumentFile] = useState(null); 
    const [isLogoutVisible, setIsLogoutVisible] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const chatContainerRef = useRef(null);
    const fileInputRef = useRef(null);
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const [folderList, setFolderList] = useState([]);
    const [isDocumentUploadVisible, setIsDocumentUploadVisible] = useState(true);
    const [isUploadedDocumentsVisible, setIsUploadedDocumentsVisible] = useState(true);
    const [secondApiResponse, setSecondApiResponse] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [checklistResponse, setChecklistResponse] = useState(null);
  const [isChecklistVisible, setIsChecklistVisible] = useState(false);
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
        // case 'Document':
        //     window.location.href = '/folder';;
        //     break; 
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
        const response = await fetch('/upload_doc', {
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

    // const handleShowSimilarDocument = async () => {
    //   try {
    //     setIsLoading(true);
    //     const response = await fetch('/doc_analyser/docstack/checkpoints');
    //     if (response.ok) {
    //       const data = await response.json();
    //       setIsLoading(false);
    //       const apiResponseQueryParam = encodeURIComponent(JSON.stringify(data));
    //       window.location.href = `/getchecklist?apiResponse=${apiResponseQueryParam}`;
    //     } else {
    //       console.error('Error fetching similar documents.');
    //       setIsLoading(false);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching similar documents:', error);
    //     setIsLoading(false);
    //   }
    // };
     
    const handleShowSimilarDocument = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/doc_analyser/docstack/checkpoints');
        if (response.ok) {
          const data = await response.json();
          setChecklistResponse(data);
          setIsChecklistVisible(true); 
          setIsDocumentUploadVisible(false); 
          setIsUploadedDocumentsVisible(false);
          setIsLoading(false);
        } else {
          console.error('Error fetching similar documents.');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching similar documents:', error);
        setIsLoading(false);
      }
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
        setIsChecklistVisible(false);
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
          
          const secondApiResponse = await fetch('/doc_analyser/checkpoints', {
            method: 'GET',
          });
    
          if (secondApiResponse.ok) {
            const responseData = await secondApiResponse.json(); 
            console.log('Response Data in API:', responseData);
            setResponseData(responseData);
            setIsDocumentUploadVisible(responseData && responseData.similar_documents && responseData.similar_documents.length > 0);
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
          <div className="ask-question-text">Checklist</div>
        </div>
        <hr className="divider" />
        {isDocumentUploadVisible ? (
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
            // style={{ display: 'none' }} 
          />
          </div>
          {/* <br/> */}
          <button className="upload-button" onClick={handleUploadButtonClick}>
            Upload Document
          </button>
        </div>
 ) : null}
  {isLoading ? (
          <div className="loading-message">Generating Response...</div>
        ) : (
    <div className="api-response">
          {responseData && responseData.Checklist && responseData.Checklist.length > 0 ? (
          responseData.Checklist.map((doc, index) => (
          <div key={index} className="response-item">
          <h3>Question</h3>
            <div>{doc['Question']}</div>

            <h3>Answer</h3> 
            <div>{doc['Answer']}</div>

            {doc['link'] && doc['link'].length > 0 && (
  <div>
    <h3>Document Links</h3>
    {doc['link'].map((link, linkIndex) => (
      <div key={linkIndex}>
        <a
          href={`${link}?page=2`}
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
          ))
          ) : null}
          </div>
           )}
          {isUploadedDocumentsVisible && (
        uploadedDocuments.length > 0 && (
  <div className="uploaded-documents">
    <div className="uploaded-document-title">Uploaded Documents:</div>
    {uploadedDocuments.map((document, index) => (
      <div key={index} className="uploaded-document">
        <div className="uploaded-document-name">{document.name}</div>
        {/* Render the uploaded document here */}
        {/* <iframe src={document.data} title={`Uploaded Document ${index + 1}`} /> */}
      </div>
    ))}
            <div className="button-loader-container">
        <button className="similarDoc-button" onClick={handleShowSimilarDocument}>
        Get Checklist
        </button>
         {isLoading && (
        <div className="loader-container">
        <div className="loader"></div>
        </div>
        )} 
        </div>
     </div>
        )
     )}

     <div className="api-response">
     {isChecklistVisible && (
          checklistResponse && checklistResponse.Checklist && checklistResponse.Checklist.length > 0 ? (
          checklistResponse.Checklist.map((doc, index) => (
          <div key={index} className="response-item">
          <h3>Question</h3>
            <div>{doc['Question']}</div>

            <h3>Answer</h3> 
            <div>{doc['Answer']}</div>

            {doc['link'] && doc['link'].length > 0 && (
  <div>
    <h3>Document Links</h3>
    {doc['link'].map((link, linkIndex) => (
      <div key={linkIndex}>
        <a
          href={`${link}?page=2`}
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

          {/* <h3>Links</h3>
          <div>
          {doc.link.map((link, linkIndex) => (
          <a key={linkIndex} href={link} target="_blank" rel="noopener noreferrer">
          Link {linkIndex + 1}
          </a>
          ))}
          </div> */}

          <hr />
          </div>
          ))
          ) :null
          )}
          </div>
        <div ref={chatContainerRef}></div>
      </div>
    </div>
  );
};

export default ChatUI;
