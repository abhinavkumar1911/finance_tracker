import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../Firebase";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../CreditCard/CrediCard.css';
import './Account_Detials.css';

function AccountDetails() {
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Accounts"));
        const accountsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAccounts(accountsData);
      } catch (error) {
        console.error("Error fetching accounts:", error);
        toast.error("Failed to fetch accounts.");
      }
    };

    fetchAccounts();
  }, []);

  const handleEdit = (id) => {
    toast.info("Redirecting to edit page...");
    navigate(`/Account_Edit/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this account?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "Accounts", id));
      setAccounts(prev => prev.filter(account => account.id !== id));
      toast.success("Account deleted successfully!");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account.");
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <h3 className="mb-3">Accounts Details</h3>
      <table className="table table-bordered table-striped">
        <thead className="thead-yellow">
          <tr>
            <th>Holder Name</th>
            <th>Bank Name</th>
            <th>Account Number</th>
            <th>Branch</th>
            <th>MICR Code</th>
            <th>Balance</th>
            <th>Currency</th>
            <th colSpan={2}>Option</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => (
            <tr key={account.id}>
              <td>{account.holderName}</td>
              <td>{account.bankName}</td>
              <td>{account.accountNumber}</td>
              <td>{account.branch}</td>
              <td>{account.micrCode}</td>
              <td>{account.balance}</td>
              <td>{account.currency}</td>
              <td>
                <button className="action-btn edit-btn" onClick={() => handleEdit(account.id)}>Edit</button>
              </td>
              <td>
                <button className="action-btn delete-btn" onClick={() => handleDelete(account.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
}

export default AccountDetails;
