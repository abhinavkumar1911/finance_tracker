import React from 'react';
import './About.css'; // Optional: for styling

function About() {
  return (
    <div className="about-container">
      <h1>About Finance Tracker</h1>
      <p>
        Finance Tracker is a simple and effective tool designed to help you manage your personal finances.
        With this application, you can track your income and expenses, monitor your balance, and gain insights into your spending habits.
      </p>

      {/* Adding Image */}
      <div className="about-image">
        <img src="/images/finance-graphic.png" alt="Finance Tracker Overview" />
      </div>

      <h2>Key Features</h2>
      <ul>
        <li>📝 Add and manage income and expense transactions</li>
        <li>📊 View real-time balance and transaction history</li>
        <li>📁 Categorize spending (e.g., Food, Rent, Travel)</li>
        <li>📅 Filter transactions by date or category</li>
        <li>📈 Visualize your spending with charts</li>
        <li>💾 Save your data locally or via the cloud</li>
      </ul>

      <h2>Why Use Finance Tracker?</h2>
      <p>
        Understanding where your money goes is the first step toward financial freedom. Finance Tracker helps you stay on top of your budget and avoid overspending. Whether you're saving for a goal or trying to reduce debt, this tool makes financial tracking easy and intuitive.
      </p>

      <h3>Start taking control of your money today!</h3>
    </div>
  );
};

export default About;
