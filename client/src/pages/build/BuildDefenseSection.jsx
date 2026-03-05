import "./BuildDefenseSection.css";
import { useState } from "react";
import axios from "axios";
import BuildList from "../../components/BuildList/BuildList";
import ItemList from "../../components/ItemList/ItemList";

function BuildDefenseSection({ setAppSections }) {
  const [defense, setDefense] = useState("none");
  const [defenseName, setDefenseName] = useState("");
  const [defenseDescription, setDefenseDescription] = useState("");

  const handleSave = async () => {
    const newBuild = {
      name: defenseName,
      type: defense,
      description: defenseDescription,
    };

    try {
      const response = await axios.get("http://localhost:5000/api/builds", newBuild);

      if (response.ok) {
        alert("Defense Saved!");
        // Refresh the page or update state here
      }
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  return (
    <div className="build-defense-section">
      <h2>Build Defense</h2>
      
      <div className="form-group">
        <label>Build Name:</label>
        <input 
          type="text" 
          value={defenseName} 
          onChange={(e) => setDefenseName(e.target.value)} 
        />
        
        <label>Type:</label>
        <select value={defense} onChange={(e) => setDefense(e.target.value)}>
          <option value="none">None</option>
          <option value="armor">Physical Defense</option>
          <option value="shield">Magical Defense</option>
        </select>

        <div className="defense-list-container">
          <div className="defense-image-list">
            <div className="defense-image-item" onClick={() => setDefense("armor")}>
              <img src="/images/armor.png" alt="Armor" />
              <span>Physical Defense</span>
            </div>
            <div className="defense-image-item" onClick={() => setDefense("shield")}>
              <img src="/images/shield.png" alt="Shield" />
              <span>Magical Defense</span>
            </div>
          </div>
        </div>

        <ItemList />

        <button onClick={handleSave}>Save Defense</button>
      </div>

      <button onClick={() => setAppSections("HOME")}>Back</button>

      <hr />
      {/* 3. YOU MUST ADD THIS TAG TO SEE THE LIST ON SCREEN */}
      <BuildList /> 
    </div>
  );
}

export default BuildDefenseSection;