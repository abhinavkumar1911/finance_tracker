// src/pages/Contact.js

import React from 'react';
import './Contact.css'; 

function Contact() {
  return (
    <div className="contact-container">
      <h1>Contact Information</h1>
      <p>If you have any questions, feedback, or need assistance, feel free to reach out to us!</p>

      <div className="contact-details">
        <h2>Contact Information</h2>
        <ul>
          <li>📧 <strong>Email:</strong> support@financetracker.com</li>
          <li>📞 <strong>Phone:</strong> +1 (800) 123-4567</li>
          <li>🌍 <strong>Website:</strong> <a href="https://www.financetracker.com" target="_blank" rel="noopener noreferrer">www.financetracker.com</a></li>
          <li>📱 <strong>Social Media:</strong></li>
          <ul>
            <li>🔹 <a href="https://www.facebook.com/FinanceTracker" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li>🔹 <a href="https://twitter.com/FinanceTracker" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            <li>🔹 <a href="https://www.linkedin.com/company/financetracker" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          </ul>
        </ul>
      </div>

      <p>We're here to help! Feel free to get in touch with us through any of the channels above.</p>
    </div>
  );
}

export default Contact;
