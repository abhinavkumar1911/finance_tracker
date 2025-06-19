import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Firebase"; // Update path as needed
import 'bootstrap/dist/css/bootstrap.min.css';
import './CrediCard.css'

function Creditcard_details() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchcards = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "CreditCard"));
        const cardsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCards(cardsData);
      } catch (error) {
        console.error("Error fetching Cards:", error);
      }
    };

    fetchcards();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Card Details</h3>
      <table className="table table-bordered table-striped">
        <thead className="thead-yellow">
          <tr>
            <th>Holder Name</th>
            <th>Bank Name</th>
            <th>Card Number</th>
            <th>validfrom</th>
            <th>validthro</th>
            <th>cvv</th>
            <th>cardtype</th>
            <th>cardamount</th>
            <th>Used Amount</th>
            <th>Balance Amount</th>
            <th colSpan={2}>Option</th>
          </tr>
        </thead>
        <tbody>
          {cards.map(account => (
            <tr key={account.id}>
    <td>{account.holderName}</td>
    <td>{account.bankName}</td>
    <td>{account.cardNumber}</td>
    <td>{account.validfrom}</td>
    <td>{account.validthru}</td>
    <td>{account.cvvnumber}</td>
    {account.cvvnumber ? '***' : ''}
    <td>{account.cardamount}</td>
    <td>{(Number(account.cardamount) - Number(account.balance)).toFixed(2)}</td>
    <td>{account.balance}</td>
    <td>Edit</td>
    <td>Delete</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Creditcard_details;
