import "./HomeSection.css";

import { useState, useEffect } from "react";
import { onAuthStateChangedListener, signInAnonymouslyUser } from "../../firebase/firebase.js";

function HomeSection({ setAppSections }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        setUser(user);
      } else {
        signInAnonymouslyUser().then(setUser).catch((error) => {
          console.error("Failed to sign in anonymously:", error);
        });
      }
      console.log("Auth state changed:", user.uid);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="home-section">
      <h2>Home</h2>
      <p>UID: {user ? user.displayName : "None"}</p>
      <button onClick={() => setAppSections("BUILD-DEFENSE")}>
        Build Defense
      </button>
    </div>
  );
}

export default HomeSection;
