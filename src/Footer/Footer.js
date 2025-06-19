import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="/Dashboard">Home</a>
        <a href="/About">About</a>
        <a href="/Contact">Contact</a>
      </div>
      <div className="footer-bottom">
        <p className="mb-1">© 2025 FinanceTracker. All rights reserved.</p>
        <p className="mb-0">Contact: support@financetracker.com</p>
      </div>
    </footer>
  );
}

export default Footer;
