import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../Firebase";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CrediCard.css';
import '../Account/Account_Detials.css';

function Creditcard_details() {
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

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
        toast.error("Failed to fetch card details");
      }
    };

    fetchcards();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "CreditCard", id));
      setCards(prev => prev.filter(card => card.id !== id));
      toast.success("Card deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete card.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/Card_Edit/${id}`); // Ensure route exists
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Card Details</h3>
      <ToastContainer position="top-right" autoClose={3000} />
      <table className="table table-bordered table-striped">
        <thead className="thead-yellow">
          <tr>
            <th>Holder Name</th>
            <th>Bank Name</th>
            <th>Card Number</th>
            <th>Valid From</th>
            <th>Valid Thru</th>
            <th>CVV</th>
            <th>Card Type</th>
            <th>Card Amount</th>
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
              <td>{account.cvvnumber ? '***' : ''}</td>
              <td>{account.cardtype}</td>
              <td>{account.cardamount}</td>
              <td>{(Number(account.cardamount) - Number(account.balance)).toFixed(2)}</td>
              <td>{account.balance}</td>
              <td>
                <button className="action-btn edit-btn btn btn-sm btn-warning"
                        onClick={() => handleEdit(account.id)}>
                  Edit
                </button>
              </td>
              <td>
                <button className="action-btn delete-btn btn btn-sm btn-danger"
                        onClick={() => handleDelete(account.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Creditcard_details;
