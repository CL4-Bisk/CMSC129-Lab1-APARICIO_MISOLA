import "./BuildDefenseSection.css";
import { useState } from "react";

function BuildDefenseSection({ setAppSections }) {
  const [defense, setDefense] = useState("none");
  const [defenseName, setDefenseName] = useState("");
  const [defenseDescription, setDefenseDescription] = useState("");
  const [defenseImage, setDefenseImage] = useState("");
    const handleDefenseChange = (event) => {
        setDefense(event.target.value);
    };
    const handleDefenseNameChange = (event) => {
        setDefenseName(event.target.value);
    };
    const handleDefenseDescriptionChange = (event) => {
        setDefenseDescription(event.target.value);
    };
    const handleDefenseImageChange = (event) => {
        setDefenseImage(event.target.value);
    };
  return (
    <div className="build-defense-section">
      <h2>Build Defense</h2>
      <label>
        Defense:
        <select value={defense} onChange={handleDefenseChange}>
          <option value="none">None</option>
          <option value="armor">Armor</option>
          <option value="shield">Shield</option>
        </select>
      </label>
      <label>
        Name:
        <input type="text" value={defenseName} onChange={handleDefenseNameChange} />
      </label>
      <label>
        Description:
        <input type="text" value={defenseDescription} onChange={handleDefenseDescriptionChange} />
      </label>
      <label>
        Image:
        <input type="text" value={defenseImage} onChange={handleDefenseImageChange} />
      </label>
      <button onClick={() => setAppSections("HOME")}>Back</button>
    </div>
  );
}

export default BuildDefenseSection;