import "./BuildDefenseSection.css";
import { useState } from "react";
import axios from "axios";
import BuildList from "../../components/BuildList/BuildList.jsx";
import ItemList from "../../components/ItemList/ItemList.jsx";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";

function BuildDefenseSection({ setAppSections }) {
  const [defense, setDefense] = useState("none");
  const [defenseName, setDefenseName] = useState("");
  const [defenseDescription, setDefenseDescription] = useState("");

  const DEFENSE_TYPES = {
    none: "None",
    armor: "Physical Defense",
    shield: "Magical Defense",
    hybrid: "Hybrid Defense"
  }

  const handleSave = async () => {
    if (!defenseName.trim()) {
      alert("Please enter a build name!");
      return;
    }

    const newBuild = {
      name: defenseName,
      type: defense,
      description: defenseDescription,
    };

    try {
      await axios.post("http://localhost:5000/api/builds", newBuild);

      alert("Defense Saved!");
      // Refresh the page or update state here
      setDefenseName("");
      setDefense("none");
      setDefenseDescription("");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save defense. Please try again.");
    }
  };

  return (
    <main className="shop-page build-defense-section">
      <section className="shop-frame">
        <header className="shop-header">
          <div className="shop-title-group">
            <p className="shop-kicker">Defense Workshop</p>
            <h1 className="shop-title">Build Defense</h1>
          </div>
          <div className="shop-actions">
            <button className="shop-button ghost" onClick={() => setAppSections("HOME")} type="button">
              Back to Shop
            </button>
          </div>
        </header>

        <div className="shop-body">
          <SearchBar />

          <div className="shop-grid-two">
            <section className="shop-card-panel">
              <h3>Build Details</h3>
              <div className="field-grid build-form">
                <label>
                  Build Name
                  <input
                    type="text"
                    placeholder="Enter build name"
                    value={defenseName}
                    onChange={(e) => setDefenseName(e.target.value)}
                  />
                </label>

                <label>
                  Type
                  <select value={defense} onChange={(e) => setDefense(e.target.value)}>
                    {Object.entries(DEFENSE_TYPES).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Notes
                  <textarea
                    placeholder="Counter item plan, enemy damage type, or timing notes"
                    value={defenseDescription}
                    onChange={(e) => setDefenseDescription(e.target.value)}
                  />
                </label>

                <button className="shop-button primary" onClick={handleSave} type="button">
                  Save Defense
                </button>
              </div>

              <BuildList />
            </section>

            <section className="shop-panel">
              <div className="shop-panel-header">
                <div>
                  <h2>Defense Items</h2>
                  <p className="shop-panel-subtitle">Pick armor, shields, and hybrid counters.</p>
                </div>
              </div>
              <div className="shop-panel-body">
                <ItemList category="Defense" />
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

export default BuildDefenseSection;
