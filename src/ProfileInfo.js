import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./Firebase";// adjust path to your Firebase config
import { useNavigate } from "react-router-dom";

function ProfileInfo() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/"); // redirect to login page
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="container mt-4 p-4 border rounded bg-light shadow">
      <h3>User Profile</h3>
      <p><strong>Name:</strong> {userData.name}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Last Login:</strong> {new Date(userData.lastLogin).toLocaleString()}</p>
      <button className="btn btn-danger mt-3" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default ProfileInfo;
