import "./BuildList.css";
import axios from "axios";
import { useState, useEffect } from "react";

function BuildList() {
  const [builds, setBuilds] = useState([]);

  useEffect(() => {
    // This is the "URL including the port" part:
    axios.get("http://localhost:5000/api/builds")
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