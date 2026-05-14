import "./HomeSection.css";

import { useState, useEffect } from "react";
import { onAuthStateChangedListener, signInAnonymouslyUser } from "../../firebase/firebase.js";
import ItemList from "../../components/ItemList/ItemList.jsx";
import { useGlobalInfoModal } from "../../components/GlobalInfoModal/GlobalInfoModalContext.jsx";
import { getErrorMessage } from "../../utils/errorMessage.js";

function HomeSection({ setAppSections }) {
  const { showError } = useGlobalInfoModal();
  const [user, setUser] = useState(null);
  const [category, setCategory] = useState("");
  const categories = ["", "Defense", "Attack", "Magic", "Movement"];

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        setUser(user);
      } else {
        signInAnonymouslyUser().then(setUser).catch((error) => {
          showError("Sign-in failed", getErrorMessage(error, "Unable to sign in anonymously right now."));
        });
      }
    });

    return () => unsubscribe();
  }, [showError]);

  return (
    <main className="shop-page home-section">
      <section className="shop-frame">
        <header className="shop-header">
          <div className="shop-title-group">
            <p className="shop-kicker">ML o aKO Loadout</p>
            <h1 className="shop-title">Item Shop</h1>
          </div>
          <div className="shop-user">Player: {user ? user.displayName : "Signing in..."}</div>
        </header>

        <div className="shop-body shop-layout">
          <aside className="shop-sidebar">
            <h3>Categories</h3>
            <div className="category-list">
              {categories.map((itemCategory) => (
                <button
                  key={itemCategory || "All"}
                  className={`category-button ${category === itemCategory ? "is-active" : ""}`}
                  onClick={() => setCategory(itemCategory)}
                  type="button"
                >
                  {itemCategory || "All Items"}
                </button>
              ))}
            </div>
          </aside>

          <section className="shop-panel item-list-container">
            <div className="shop-panel-header">
              <div>
                <h2>{category || "All Items"}</h2>
                <p className="shop-panel-subtitle">Browse equipment and prepare a defensive build.</p>
              </div>
              <div className="shop-actions">
                <select
                  className="shop-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  aria-label="Filter items by category"
                >
                  {categories.map((itemCategory) => (
                    <option key={itemCategory || "All"} value={itemCategory}>
                      {itemCategory || "All Items"}
                    </option>
                  ))}
                </select>
                <button className="shop-button primary" onClick={() => setAppSections("BUILD-DEFENSE")} type="button">
                  Build Defense
                </button>
                <button className="shop-button primary calculate-button" onClick={() => setAppSections("CALCULATE-DAMAGE")} type="button">
                  Calculator
                </button>
              </div>
            </div>
            <div className="shop-panel-body">
              <ItemList category={category} />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default HomeSection;
