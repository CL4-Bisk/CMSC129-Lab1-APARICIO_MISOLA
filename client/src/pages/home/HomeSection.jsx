import "./HomeSection.css";

import { useState } from "react";
import { getCurrentUser, onAuthStateChangedListener, signInAnonymouslyUser } from "../../firebase/firebase.js";

const auth = getCurrentUser();

onAuthStateChangedListener((user) => {
  if (!user) {
    // Only sign in if there is no existing session
    signInAnonymouslyUser();
  } else {
    // User already exists (even after a restart!)
    console.log("Welcome back, UID:", user.uid);
  }
});

function HomeSection({ setAppSections }) {
  const [user, setUser] = useState(getCurrentUser());

  return (
    <div className="home-section">
      <h2>Home</h2>
      <p>User: {user ? user.uid : "None"}</p>
      <button onClick={() => setAppSections("BUILD-DEFENSE")}>Build Defense</button>
    </div>
  );
}

export default HomeSection;
