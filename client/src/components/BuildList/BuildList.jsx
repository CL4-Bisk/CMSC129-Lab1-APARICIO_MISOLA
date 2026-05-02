import "./BuildList.css";
import { useState, useEffect } from "react";
import api from "../../api/api.js";

function BuildList() {
  const [builds, setBuilds] = useState([]);

  useEffect(() => {
    api.get("/builds")
      .then((res) => setBuilds(res.data))
      .catch((err) => console.error("Error fetching builds:", err));
  }, []);

  return (
    <div className="build-list">
      <h3>Existing Defenses</h3>
      {builds.length === 0 ? <p>No defenses built yet.</p> : 
        builds.map(build => (
          <div key={build.id} className="build-item">
            <strong>{build.name}</strong> - {build.type}
          </div>
        ))
      }
    </div>
  );
}

export default BuildList;
