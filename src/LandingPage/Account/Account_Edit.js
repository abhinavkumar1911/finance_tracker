import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase';

function AccountEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    holderName: '',
    bankName: '',
    accountNumber: '',
    branch: '',
    micrCode: '',
    balance: '',
    currency: 'INR', // Default currency
  });

  useEffect(() => {
    const fetchAccount = async () => {
      const docRef = doc(db, 'Accounts', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          holderName: data.holderName || '',
          bankName: data.bankName || '',
          accountNumber: data.accountNumber || '',
          branch: data.branch || '',
          micrCode: data.micrCode || '',
          balance: data.balance || '',
          currency: data.currency || 'INR',
        });
      } else {
        console.log('No such document!');
      }
    };
    fetchAccount();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docRef = doc(db, 'Accounts', id);
    await updateDoc(docRef, formData);
    navigate('/AccountDetails');
  };
  const currencyOptions = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];

  return (
    <div className="container mt-4">
      <h3>Edit Account</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Account Holder Name</label>
          <input
            type="text"
            className="form-control"
            name="holderName"
            value={formData.holderName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Bank Name</label>
          <input
            type="text"
            className="form-control"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Account Number</label>
          <input
            type="text"
            className="form-control"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Branch</label>
          <input
            type="text"
            className="form-control"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">MICR Code</label>
          <input
            type="text"
            className="form-control"
            name="micrCode"
            value={formData.micrCode}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Balance</label>
          <input
            type="number"
            className="form-control"
            name="balance"
            value={formData.balance}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Currency</label>
          <select
            className="form-select"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            required
          >
             {currencyOptions.map((currency, idx) => (
              <option key={idx} value={currency}>{currency}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Update Account</button>
      </form>
    </div>
  );
}

export default AccountEdit;
