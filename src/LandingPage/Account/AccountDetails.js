import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Firebase"; // Update path as needed
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CreditCard/CrediCard.css'

function AccountDetails() {
  const [accounts, setAccounts] = useState([]);

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
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Accounts Details</h3>
      <table className="table table-bordered table-striped">
        <thead className="thead-dark">
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
              <td>Edit</td>
              <td>Delete</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AccountDetails;
