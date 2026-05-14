import "./ItemDescription.css";
import { useState, useEffect } from "react";
import api from "../../api/api.js";
import { useGlobalInfoModal } from "../GlobalInfoModal/GlobalInfoModalContext.jsx";
import { getErrorMessage } from "../../utils/errorMessage.js";

function ItemDescription() {
  const { showError } = useGlobalInfoModal();
  const [builds, setBuilds] = useState([]);

  useEffect(() => {
    api.get("/builds")
      .then((res) => setBuilds(res.data))
      .catch((error) => showError("Build list unavailable", getErrorMessage(error, "Unable to fetch saved builds right now.")));
  }, [showError]);

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

export default ItemDescription;
