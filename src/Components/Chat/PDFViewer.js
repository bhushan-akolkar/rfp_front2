import React from 'react';
import './PDFViewer.css';

const PDFViewer = ({ pdfUrl, onClose }) => {
  return (
    <div className="pdf-modal">
      <div className="pdf-modal-content">
        <span className="pdf-close" onClick={onClose}>&times;</span>
        <iframe
          className="pdf-iframe"
          src={pdfUrl}
          frameborder="0"
          width="100%"
          height="100%"
        ></iframe>
      </div>
    </div>
  );
};

export default PDFViewer;
