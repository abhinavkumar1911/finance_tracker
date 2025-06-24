import React, { useState, useEffect, useMemo } from 'react';
import { addDoc, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './Firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './Expanse.css';

function Expanse() {
  const [accounts, setAccounts] = useState([]);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [formData, setFormData] = useState({
    amount: '',
    accountType: '',
    bankName: '',
    accountNumber: '',
    date: '',
    Entity_Type: '',
    reason: '',
    selectedCardNumber: '',
    description: '',
  });

  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [creditCards, setCreditCards] = useState([]);

  const incomeRefs = useMemo(() => incomeList.map(() => React.createRef()), [incomeList]);
  const expenseRefs = useMemo(() => expenseList.map(() => React.createRef()), [expenseList]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Accounts'));
        const accountsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAccounts(accountsData);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    const fetchCreditCards = async () => {
      try {
        const snap = await getDocs(collection(db, 'CreditCard'));
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCreditCards(data);
      } catch (err) {
        toast.warn("Error fetching credit cards");
        console.error("Error fetching credit cards", err);
      }
    };
    fetchCreditCards();
  }, []);

  useEffect(() => {
    const selected = accounts.find(acc => acc.bankName.trim() === formData.bankName.trim());
    setFormData(prev => ({ ...prev, accountNumber: selected ? selected.accountNumber : '' }));
  }, [formData.bankName, accounts]);

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
        expenseData.sort((a, b) => new Date(b.date) - new Date(a.date));
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
    // If Entity Type is Expense
    if (formData.Entity_Type === "Expense") {
      await addDoc(collection(db, 'Expenses'), formData);
      setExpenseList(prev => [...prev, { ...formData }]);

      // If account type is Saving AC
      if (formData.accountType === "Saving AC") {
        const selectedAccount = accounts.find(
          acc => acc.bankName === formData.bankName && acc.accountNumber === formData.accountNumber
        );

        if (!selectedAccount) {
          toast.warn("Bank account not found.");
          return;
        }

        const accountRef = doc(db, 'Accounts', selectedAccount.id);
        const newBalance = parseFloat(selectedAccount.balance || 0) - amountNum;
        await updateDoc(accountRef, { balance: newBalance });

        // 💡 NEW LOGIC: If reason is Credit Card Payment, update credit card info
    if (formData.reason === "Credit Card Payment") {
      const matchedCard = creditCards.find(card => card.cardNumber === formData.selectedCardNumber);
      if (!matchedCard) {
        toast.warn("Credit card not found.");
        return;
      }

      const cardRef = doc(db, "CreditCard", matchedCard.id);
      const updatedUsedAmount = parseFloat(matchedCard.usedAmount || 0) - amountNum;
      const updatedBalance = parseFloat(matchedCard.balance || 0) + amountNum;

      await updateDoc(cardRef, {
        usedAmount: updatedUsedAmount,
        balance: updatedBalance,
      });
    }

      } else if (formData.accountType === "Credit Card") {
        const matchedCard = creditCards.find(card => card.cardNumber === formData.selectedCardNumber);
        if (!matchedCard) {
          toast.warn("Credit card not found.");
          return;
        }
    

        const cardRef = doc(db, "CreditCard", matchedCard.id);
        const updatedUsedAmount = parseFloat(matchedCard.usedAmount || 0) + amountNum;
        const updatedBalance = parseFloat(matchedCard.balance || 0) - amountNum;

        await updateDoc(cardRef, {
          
          usedAmount: updatedUsedAmount,
          balance: updatedBalance,
        });
      }

    } 
    
     else if (formData.Entity_Type === "Income") {
      await addDoc(collection(db, 'Income'), formData);
      setIncomeList(prev => [...prev, { ...formData }]);

      const selectedAccount = accounts.find(
        acc => acc.bankName === formData.bankName && acc.accountNumber === formData.accountNumber
      );

      if (!selectedAccount) {
        toast.warn("Bank account not found.");
        return;
      }

      const accountRef = doc(db, 'Accounts', selectedAccount.id);
      const newBalance = parseFloat(selectedAccount.balance || 0) + amountNum;
      await updateDoc(accountRef, { balance: newBalance });
    } else {
      toast.warn("Please select a valid Entity Type.");
      return;
    }

    toast.success(`${formData.Entity_Type} added successfully!`);

    // Reset form
    setFormData({
      amount: '', accountType: '', bankName: '', accountNumber: '', date: '', Entity_Type: '', reason: '', selectedCardNumber: '', description: '',
    });

    // Refresh Accounts
    const accSnap = await getDocs(collection(db, 'Accounts'));
    const accData = accSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAccounts(accData);

    // Refresh Credit Cards
    const snap = await getDocs(collection(db, 'CreditCard'));
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCreditCards(data);

  } catch (error) {
    console.error("Error in submit:", error);
    toast.error("Something went wrong while submitting!");
  }
};


  const rawBalance = accounts.reduce((total, acc) => total + parseFloat(acc.balance || 0), 0);
  const totalAccountBalance = Math.max(rawBalance - expenseTotal, 0);

  const showBankFields = formData.accountType === "Saving AC";
  const showCreditFields = formData.accountType === "Credit Card";

  return (
    <div className="container mt-4">
      <h3 className="mb-4 fw-bold">Add Expense</h3>
      <div className="row">
        <div className="col-md-8">
          <div className="mb-4 p-3 border rounded bg-light">
            <div className="text-center mb-3">
              <h5 className="text-primary fw-bold">
                Total Account Balance: ₹{totalAccountBalance.toFixed(2)}
              </h5>
            </div>
            <div className="d-flex justify-content-between">
              <div className="text-success fw-semibold"><strong>Income:</strong> ₹{incomeTotal.toFixed(2)}</div>
              <div className="text-danger fw-semibold"><strong>Expense:</strong> ₹{expenseTotal.toFixed(2)}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Amount</label>
              <input type="number" name="amount" className="form-control" value={formData.amount} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Account Type</label>
              <select name="accountType" className="form-select" value={formData.accountType} onChange={handleChange}>
                <option value="">-- Select Account Type --</option>
                <option value="Saving AC">Saving AC</option>
                <option value="Credit Card">Credit Card</option>
              </select>
            </div>

            {showBankFields && (
              <>
                <div className="mb-3">
                  <label className="form-label">Bank Name</label>
                  <select name="bankName" className="form-select" value={formData.bankName} onChange={handleChange} required>
                    <option value="">-- Select Bank --</option>
                    {accounts.map((acc, index) => (
                      <option key={index} value={acc.bankName}>{acc.bankName}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Account Number</label>
                  <input type="text" name="accountNumber" className="form-control" value={formData.accountNumber} readOnly />
                </div>
              </>
            )}

            {showCreditFields && (
              <div className="mb-3">
                <label className="form-label">Credit Card Number</label>
                <select className="form-select" name="selectedCardNumber" value={formData.selectedCardNumber} onChange={handleChange} required>
                  <option value="">-- Select Card --</option>
                  {creditCards.map((card, index) => (
                    <option key={index} value={card.cardNumber}>{card.cardNumber}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Date of Expense</label>
              <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Entity Type</label>
              <select name="Entity_Type" className="form-select" value={formData.Entity_Type} onChange={handleChange} required>
                <option value="">-- Select Reason --</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Reason</label>
              <select name="reason" className="form-select" value={formData.reason} onChange={handleChange} required>
                <option value="">-- Select Reason --</option>
                <option value="Rent">Rent</option>
                <option value="Gas">Gas</option>
                <option value="Tuition Fee">Tuition Fee</option>
                <option value="Bus Fare">Bus Fare</option>
                <option value="Electric Bill">Electric Bill</option>
                <option value="Salary">Salary</option>
                <option value="Loan">Loan</option>
                <option value="Credit Card Payment">Credit Card Payment</option>
                <option value="Subscription">Subscription</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {formData.Entity_Type === "Expense" && formData.reason === "Credit Card Payment" && (
  <div className="mb-3">
    <label className="form-label">Credit Card Number</label>
    <select
      className="form-select"
      name="selectedCardNumber"
      value={formData.selectedCardNumber}
      onChange={handleChange}
      required
    >
      <option value="">-- Select Card --</option>
      {creditCards.map((card, index) => (
        <option key={index} value={card.cardNumber}>
          {card.cardNumber}
        </option>
      ))}
    </select>
  </div>
)}

            <div className="mb-3">
              <label className="form-label">Short Description</label>
              <textarea name="description" className="form-control" value={formData.description} onChange={handleChange} rows="3"></textarea>
            </div>

            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>

        <div className="col-md-4">
          <h5 className="text-success">Income Entries</h5>
          <TransitionGroup className="list-group mb-4">
            {incomeList.map((entry, idx) => (
              <CSSTransition key={idx} timeout={300} classNames="fade" nodeRef={incomeRefs[idx]}>
                <li ref={incomeRefs[idx]} className="list-group-item">
                  <div className="row">
                    <div className="col-4 fw-semibold text-dark">₹{parseFloat(entry.amount).toFixed(2)}</div>
                    <div className="col-4 text-muted"><small>{entry.date}</small></div>
                  </div>
                  {entry.description && (
                    <div className="mt-1 text-secondary fw-bold">
                      <small className="d-block text-wrap">{entry.description}</small>
                    </div>
                  )}
                </li>
              </CSSTransition>
            ))}
          </TransitionGroup>

          <h5 className="text-danger">Expense Entries</h5>
          <TransitionGroup className="list-group">
            {expenseList.map((entry, idx) => (
              <CSSTransition key={idx} timeout={300} classNames="fade" nodeRef={expenseRefs[idx]}>
                <li ref={expenseRefs[idx]} className="list-group-item">
                  <div className="row">
                    <div className="col-4 fw-semibold text-dark">₹{parseFloat(entry.amount).toFixed(2)}</div>
                    <div className="col-4 text-muted"><small>{entry.date}</small></div>
                  </div>
                  {entry.description && (
                    <div className="mt-1 text-secondary fw-bold">
                      <small className="d-block text-wrap">{entry.description}</small>
                    </div>
                  )}
                </li>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>
      </div>
    </div>
  );
}

export default Expanse;
