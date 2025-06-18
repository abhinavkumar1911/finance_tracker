import { signInWithPopup, signOut } from "firebase/auth";
import React, { useState , useEffect} from "react";
import { auth, provider, db } from "../Firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import for navigation

function LoginWithGmail() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Initialize navigation

 const handleGoogleLogin = async () => {
  try {
    console.log("Attempting Google login...")
    const result = await signInWithPopup(auth, provider)
    console.log("Login successful")

    const loggedInUser = result.user
    console.log("User details:", loggedInUser)

      // Save user to Firestore
      await setDoc(doc(db, "users", loggedInUser.uid), {
        name: loggedInUser.displayName,
        email: loggedInUser.email,
        photoURL: loggedInUser.photoURL,
        uid: loggedInUser.uid,
      });

      console.log("User saved to Firestore:", loggedInUser.displayName)

      // Navigate to dashboard (or any protected route)
      navigate("/dashboard")
    } catch (error) {
      console.error("Google login failed:", error.message)
    }
  };
// Automatically trigger login on component mount

  useEffect(() => {
    handleGoogleLogin()
  }, [])



  return (
    
        <div style={{ textAlign: "center", marginTop: "50px" }}>
      <p>Redirecting to Google sign-in...</p>
    </div>
  );
}

export default LoginWithGmail;
