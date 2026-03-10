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
    <div className="build-defense-section">
      <h2>Build Defense</h2>

      <SearchBar />
      
      <div className="form-group">
        <label>Build Name:</label>
        <input 
          type="text" 
          placeholder="Enter build name"
          value={defenseName} 
          onChange={(e) => setDefenseName(e.target.value)} 
        />
        
        <label>Type:</label>
        <select value={defense} onChange={(e) => setDefense(e.target.value)}>
          {Object.entries(DEFENSE_TYPES).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>

        <ItemList category={DEFENSE_TYPES[defense]}/>

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