import React, { useState, useEffect } from 'react';
import { addDoc, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './Firebase'; // adjust path as needed
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './Expanse.css'; // You’ll create this for custom animation styles

function Expanse() {
  const [accounts, setAccounts] = useState([]);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [formData, setFormData] = useState({
    amount: '',
    bankName: '',
    accountNumber: '',
    date: '',
    Entity_Type:'',
    reason: '',
    description: '',
  });

  const [incomeList, setIncomeList] = useState([]);
const [expenseList, setExpenseList] = useState([]);

  // Fetch Accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Accounts'));
        const accountsData = querySnapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data(),
}));
        setAccounts(accountsData);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  // Auto-fill account number based on bankName
  useEffect(() => {
    const selected = accounts.find(
      acc => acc.bankName.trim() === formData.bankName.trim()
    );
    setFormData(prev => ({
      ...prev,
      accountNumber: selected ? selected.accountNumber : ''
    }));
  }, [formData.bankName, accounts]);

  // Fetch income and expenses total
  useEffect(() => {
  const fetchSummary = async () => {
    try {
      const incomeSnap = await getDocs(collection(db, 'Income'));
      const incomeData = incomeSnap.docs.map(doc => doc.data());
      setIncomeList(incomeData);
      const incomeSum = incomeData.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0);
      setIncomeTotal(incomeSum);

      const expenseSnap = await getDocs(collection(db, 'Expenses'));
      const expenseData = expenseSnap.docs.map(doc => doc.data());
      setExpenseList(expenseData);
      const expenseSum = expenseData.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0);
      setExpenseTotal(expenseSum);
    } catch (error) {
      console.error('Error fetching summary data:', error);
    }
  };

  fetchSummary();
}, []);


  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
  e.preventDefault();

  const amountNum = parseFloat(formData.amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    toast.warn("Amount must be a positive number.");
    return;
  }

  try {
    // Find the selected account
    const selectedAccount = accounts.find(
      acc => acc.bankName === formData.bankName && acc.accountNumber === formData.accountNumber
    );

    if (!selectedAccount) {
      toast.warn("Selected bank account not found.");
      return;
    }

    const accountRef = doc(db, 'Accounts', selectedAccount.id);
    let newBalance = parseFloat(selectedAccount.balance || 0);

    if (formData.Entity_Type === "Expense") {
      // Deduct from account balance
      newBalance -= amountNum;
      await addDoc(collection(db, 'Expenses'), formData);
      setExpenseList(prev => [...prev, { ...formData }]);
    } else if (formData.Entity_Type === "Income") {
      // Add to account balance
      newBalance += amountNum;
      await addDoc(collection(db, 'Income'), formData);
      setIncomeList(prev => [...prev, { ...formData }]);
    } else {
      toast.wa("Please select a valid Entity Type.");
      return;
    }

    // Update account balance in Firestore
    await updateDoc(accountRef, {
      balance: newBalance
    });

    toast.warn(`${formData.Entity_Type} added successfully!`);

    setFormData({
      amount: '',
      bankName: '',
      accountNumber: '',
      date: '',
      Entity_Type: '',
      reason: '',
      description: '',
    });

    // Re-fetch updated data
    const accSnap = await getDocs(collection(db, 'Accounts'));
    const accData = accSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setAccounts(accData);

  } catch (error) {
    console.error("Error handling transaction:", error);
   toast.warn("Something went wrong!");
  }
};
  const rawBalance = accounts.reduce(
  (total, acc) => total + parseFloat(acc.balance || 0),
  0
);

const totalAccountBalance = Math.max(rawBalance - expenseTotal, 0);

  return (
  <div className="container mt-4">
    <h3 className="mb-4">Add Expense</h3>

    {/* Bootstrap row layout: Left form - Right panel */}
    <div className="row">
      
      {/* LEFT SIDE: Expense Form */}
      <div className="col-md-8">
        {/* Account Summary */}
        <div className="mb-4 p-3 border rounded bg-light">
          <div className="text-center mb-3">
            <h5 className="text-primary fw-bold">
              Total Account Balance: ₹{totalAccountBalance.toFixed(2)}
            </h5>
          </div>
          <div className="d-flex justify-content-between">
            <div className="text-success fw-semibold">
              <strong>Income:</strong> ₹{incomeTotal.toFixed(2)}
            </div>
            <div className="text-danger fw-semibold">
              <strong>Expense:</strong> ₹{expenseTotal.toFixed(2)}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Amount */}
          <div className="mb-3">
            <label className="form-label">Amount</label>
            <input
              type="number"
              name="amount"
              className="form-control"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          {/* Bank Dropdown */}
          <div className="mb-3">
            <label className="form-label">Bank Name</label>
            <select
              name="bankName"
              className="form-select"
              value={formData.bankName}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Bank --</option>
              {accounts.map((acc, index) => (
                <option key={index} value={acc.bankName}>
                  {acc.bankName}
                </option>
              ))}
            </select>
          </div>

          {/* Account Number */}
          <div className="mb-3">
            <label className="form-label">Account Number</label>
            <input
              type="text"
              name="accountNumber"
              className="form-control"
              value={formData.accountNumber}
              readOnly
            />
          </div>

          {/* Date */}
          <div className="mb-3">
            <label className="form-label">Date of Expense</label>
            <input
              type="date"
              name="date"
              className="form-control"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Entity Type */}
          <div className="mb-3">
            <label className="form-label">Entity Type</label>
            <select
              name="Entity_Type"
              className="form-select"
              value={formData.Entity_Type}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Reason --</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
              
            </select>
          </div>


          {/* Reason */}
          <div className="mb-3">
            <label className="form-label">Reason</label>
            <select
              name="reason"
              className="form-select"
              value={formData.reason}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Reason --</option>
              <option value="Rent">Rent</option>
              <option value="Gas">Gas</option>
              <option value="Tuition Fee">Tuition Fee</option>
              <option value="Bus Fare">Bus Fare</option>
              <option value="Electric Bill">Electric Bill</option>
              <option value="Credit Card Payment">Credit Card Payment</option>
              <option value="Subscription">Subscription</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Short Description</label>
            <textarea
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>

      {/* RIGHT SIDE: Income & Expense List */}
      <div className="col-md-4">
        <h5 className="text-success">Income Entries</h5>
<TransitionGroup className="list-group mb-4">
  {incomeList.map((entry, idx) => (
    <CSSTransition key={idx} timeout={300} classNames="fade">
  <div>
    <li className="list-group-item d-flex justify-content-between align-items-center">
      ₹{parseFloat(entry.amount).toFixed(2)} <small>{entry.date}</small>
    </li>
  </div>
</CSSTransition>
  ))}
</TransitionGroup>

        {/* Expense Entries with animation */}
<h5 className="text-danger">Expense Entries</h5>
<TransitionGroup className="list-group">
  {expenseList.map((entry, idx) => (
    <CSSTransition key={idx} timeout={300} classNames="fade">
  <div>
    <li className="list-group-item d-flex justify-content-between align-items-center">
      ₹{parseFloat(entry.amount).toFixed(2)} <small>{entry.date}</small>
    </li>
  </div>
</CSSTransition>
  ))}
</TransitionGroup>
      </div>
    </div>
  </div>
);

}
export default Expanse
