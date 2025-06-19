import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../Firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Creditcard() {
  const [formData, setFormData] = useState({
    holderName: '',
    bankName: '',
    cardNumber: '',
    validfrom: '',
    validthru: '',
    cvvnumber: '',
    cardamount: '',
    balance: '',
    currency: 'INR',
    cardtype: '',
  });

  const [errors, setErrors] = useState({});
  const [formattedBalance, setFormattedBalance] = useState('');

  const bankOptions = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
    'Punjab National Bank', 'Kotak Mahindra Bank', 'Bank of Baroda',
    'Union Bank of India', 'Canara Bank', 'Yes Bank',
  ];

  const currencyOptions = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];

  const cardtypeOptions = ['RUPAY CARD', 'MASTER CARD', 'VISA CARD'];

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

  // Format card number as xxxx-xxxx-xxxx-xxxx
  const handleCardNumberChange = (e) => {
    const { value } = e.target;
    const formatted = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1-');
    setFormData((prev) => ({
      ...prev,
      cardNumber: formatted,
    }));
  };

  // Format MM/YY for validfrom and validthru
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const formatted = value.replace(/\D/g, '').slice(0, 4); // Ensure it's only MMYY
    const formattedDate = formatted.length >= 2 ? `${formatted.slice(0, 2)}/${formatted.slice(2, 4)}` : formatted;
    setFormData((prev) => ({
      ...prev,
      [name]: formattedDate,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.holderName.trim()) newErrors.holderName = "Holder name is required";
    if (!formData.bankName) newErrors.bankName = "Please select a bank";
    if (!/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(formData.cardNumber)) newErrors.cardNumber = "Card number must be in xxxx-xxxx-xxxx-xxxx format";
    if (!formData.validfrom.trim()) newErrors.validfrom = "Valid From date is required";
    if (!formData.validthru.trim()) newErrors.validthru = "Valid Thru date is required";
    if (!/^\d{3}$/.test(formData.cvvnumber)) newErrors.cvvnumber = "CVV must be 3 digits";
    if (!formData.cardamount || isNaN(formData.cardamount)) newErrors.cardamount = "Card amount must be a valid number";
    if (!formData.balance || isNaN(formData.balance)) newErrors.balance = "Balance must be a valid number";
    if (!formData.cardtype) newErrors.cardtype = "Please select a card type";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await addDoc(collection(db, "CreditCard"), {
          ...formData,
          balance: parseFloat(formData.balance),
          createdAt: new Date(),
        });

        toast.success('✅ Credit Card account created successfully!');

        // Reset form
        setFormData({
          holderName: '',
          bankName: '',
          cardNumber: '',
          validfrom: '',
          validthru: '',
          cvvnumber: '',
          cardamount: '',
          balance: '',
          currency: 'INR',
          cardtype: '',
        });
        setFormattedBalance('');
        setErrors({});
      } catch (error) {
        toast.error('❌ Error saving data. Check console.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Credit Card Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card Holder Name */}
        <div>
          <label className="block font-medium">Card Holder Name</label>
          <input
            type="text"
            name="holderName"
            value={formData.holderName}
            onChange={handleChange}
            className="w-full border rounded p-3 text-lg"
          />
          {errors.holderName && <p className="text-red-500 text-sm">{errors.holderName}</p>}
        </div>

        {/* Card Number */}
        <div>
          <label className="block font-medium">Card Number</label>
          <input
            type="text"
            name="cardNumber"
            placeholder='xxxx-xxxx-xxxx-xxxx'
            maxLength="19"
            value={formData.cardNumber}
            onChange={handleCardNumberChange}
            className="w-full border rounded p-2"
          />
          {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
        </div>

        {/* Bank Name and Card Type on Same Line */}
        <div className="flex gap-4">
          {/* Bank Name */}
          <div className="flex-1">
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

          {/* Card Type */}
          <div className="flex-1">
            <label className="block font-medium">Card Type</label>
            <select
              name="cardtype"
              value={formData.cardtype}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="">Select a card type</option>
              {cardtypeOptions.map((type, idx) => (
                <option key={idx} value={type}>{type}</option>
              ))}
            </select>
            {errors.cardtype && <p className="text-red-500 text-sm">{errors.cardtype}</p>}
          </div>
        </div>
{/* Valid From, Valid Thru, and CVV Number in a single row */}
<div className="flex gap-4">
  {/* Valid From */}
  <div className="w-1/3">
    <label className="block font-medium">Valid From</label>
    <input
      type="text"
      name="validfrom"
      value={formData.validfrom}
      onChange={handleDateChange}
      placeholder="MM/YY"
      className="w-full border rounded p-2"
    />
    {errors.validfrom && <p className="text-red-500 text-sm">{errors.validfrom}</p>}
  </div>

  {/* Valid Thru */}
  <div className="w-1/3">
    <label className="block font-medium">Valid Thru</label>
    <input
      type="text"
      name="validthru"
      value={formData.validthru}
      onChange={handleDateChange}
      placeholder="MM/YY"
      className="w-full border rounded p-2"
    />
    {errors.validthru && <p className="text-red-500 text-sm">{errors.validthru}</p>}
  </div>

  {/* CVV */}
  <div className="w-1/3">
    <label className="block font-medium">CVV Number</label>
    <input
      type="text"
      name="cvvnumber"
      maxLength="3"
      value={formData.cvvnumber}
      onChange={handleChange}
      className="w-full border rounded p-2"
    />
    {errors.cvvnumber && <p className="text-red-500 text-sm">{errors.cvvnumber}</p>}
  </div>
</div>





        {/* Card Amount, Currency, and Balance in one row */}
        <div className="flex gap-4">
          {/* Card Amount */}
          <div className="flex-1">
            <label className="block font-medium">Card Amount</label>
            <input
              type="number"
              name="cardamount"
              value={formData.cardamount}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
            {errors.cardamount && <p className="text-red-500 text-sm">{errors.cardamount}</p>}
          </div>


          {/* Account Balance */}
          <div className="flex-1">
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
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Add Card
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Creditcard;
