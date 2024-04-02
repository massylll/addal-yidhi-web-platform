import React from "react";
import "./reportModal.css";

const ReportModal = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div className="modal">
          <div className="overlay" onClick={onClose}></div>
          <div className="modal-content">
            <h2>Report Post</h2>
            <p>Please select a reason for reporting this post:</p>
            <select>
              <option value="Inappropriate language">Inappropriate language</option>
              <option value="Spam">Spam</option>
              <option value="Harassment">Harassment</option>
              <option value="Hate speech">Hate speech</option>
              <option value="Violent content">Violent content</option>
              <option value="False information">False information</option>
              <option value="Irrelevant content">Irrelevant content</option>
            </select>
            <button className="close-modal" onClick={onClose}>
              CLOSE
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportModal;
