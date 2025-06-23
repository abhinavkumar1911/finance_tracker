import React, {  useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../Firebase";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../CreditCard/CrediCard.css';
import './Account_Detials.css';


function BankAccounts() {
  const [formData, setFormData] = useState({
    holderName: '',
    bankName: '',
    accountNumber: '',
    branch: '',
    micrCode: '',
    balance: '',
    currency: 'INR',
  });

  const [errors, setErrors] = useState({});
  const [formattedBalance, setFormattedBalance] = useState('');

  const bankOptions = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
    'Punjab National Bank', 'Kotak Mahindra Bank', 'Bank of Baroda',
    'Union Bank of India', 'Canara Bank', 'Yes Bank',
  ];

  const currencyOptions = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'balance') {
      const number = parseFloat(value);
      if (!isNaN(number)) {
        setFormattedBalance(
          new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: formData.currency || 'INR',
          }).format(number)
        );
      } else {
        setFormattedBalance('');
      }
    }

    if (name === 'currency' && formData.balance) {
      const number = parseFloat(formData.balance);
      if (!isNaN(number)) {
        setFormattedBalance(
          new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: value,
          }).format(number)
        );
      }
    }
  };

  const validate = () => {
  const newErrors = {};
  console.log("Running validation with data:", formData);

  if (!formData.holderName.trim()) newErrors.holderName = "Holder name is required";
  if (!formData.bankName) newErrors.bankName = "Please select a bank";
  if (!/^\d{16}$/.test(formData.accountNumber)) newErrors.accountNumber = "Account number must be 16 digits";
  if (!formData.branch.trim()) newErrors.branch = "Branch name is required";
  if (!/^[a-zA-Z0-9]{9}$/.test(formData.micrCode)) {
  newErrors.micrCode = "MICR code must be 9 alphanumeric characters";
}
  if (!formData.balance || isNaN(formData.balance)) newErrors.balance = "Balance must be a valid number";

  console.log("Validation errors:", newErrors);

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Submitting from..",formData)
  if (validate()) {
    try {
        console.log("Attempting to write to collection 'Accounts'");
      await addDoc(collection(db, "Accounts"), {
        ...formData,
        balance: parseFloat(formData.balance),
        createdAt: new Date(),
      });

      toast.success('✅ Bank account created successfully!');
      console.log("DB Connected: Collection 'Accounts'");

      // Reset form
      setFormData({
        holderName: '',
        bankName: '',
        accountNumber: '',
        branch: '',
        micrCode: '',
        balance: '',
        currency: 'INR',
      });
      setFormattedBalance('');
      setErrors({});
    } catch (error) {
      console.error("🚨 Firestore error:", error);
     toast.error('❌ Error saving data. Check console.');
    }
  } else {
    console.log("Validation failed:", errors);
  }
};




  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Bank Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Holder Name */}
        <div>
          <label className="block font-medium">Account Holder Name</label>
          <input
            type="text"
            name="holderName"
            value={formData.holderName}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors.holderName && <p className="text-red-500 text-sm">{errors.holderName}</p>}
        </div>

        {/* Bank Name */}
        <div>
          <label className="block font-medium">Bank Name</label>
          <select
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">Select a bank</option>
            {bankOptions.map((bank, idx) => (
              <option key={idx} value={bank}>{bank}</option>
            ))}
          </select>
          {errors.bankName && <p className="text-red-500 text-sm">{errors.bankName}</p>}
        </div>

        {/* Account Number */}
        <div>
          <label className="block font-medium">Account Number</label>
          <input
            type="text"
            name="accountNumber"
            maxLength="16"
            value={formData.accountNumber}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors.accountNumber && <p className="text-red-500 text-sm">{errors.accountNumber}</p>}
        </div>

        {/* Branch */}
        <div>
          <label className="block font-medium">Branch</label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors.branch && <p className="text-red-500 text-sm">{errors.branch}</p>}
        </div>

        {/* MICR Code */}
        <div>
          <label className="block font-medium">MICR Code</label>
          <input
            type="text"
            name="micrCode"
            maxLength="9"
            value={formData.micrCode}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors.micrCode && <p className="text-red-500 text-sm">{errors.micrCode}</p>}
        </div>

        {/* Currency */}
        <div>
          <label className="block font-medium">Currency</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            {currencyOptions.map((currency, idx) => (
              <option key={idx} value={currency}>{currency}</option>
            ))}
          </select>
        </div>

        {/* Balance */}
        <div>
          <label className="block font-medium">Account Balance</label>
          <input
            type="number"
            name="balance"
            value={formData.balance}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors.balance && <p className="text-red-500 text-sm">{errors.balance}</p>}
          {formattedBalance && (
            <p className="text-green-600 text-sm mt-1">
              Formatted: <strong>{formattedBalance}</strong>
            </p>
          )}
        </div>

        <button
          type="submit">
          Create Account
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default BankAccounts;
