import { useState, useEffect } from "react";
import api from "../../api/api.js";
import "./SearchBar.css";
import { useGlobalInfoModal } from "../GlobalInfoModal/GlobalInfoModalContext.jsx";
import { getErrorMessage } from "../../utils/errorMessage.js";

function SearchBar() {
    const { showError } = useGlobalInfoModal();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await api.get("/builds", {
                    params: { query },
                });
                setResults(response.data);
            } catch (error) {
                showError("Search unavailable", getErrorMessage(error, "Unable to search builds right now."));
            }
        };
        
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const delay = setTimeout(() => {
            fetchResults();
        }, 300); // wait 300ms after user stops typing

        return () => clearTimeout(delay); // cleanup on each keystroke

    }, [query, showError]);

    return (
        <div className="search-bar">
            <input 
                type="text"
                placeholder="Search builds..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {results.length > 0 && <div className="search-results">
                {results.map((build) => (
                    <div key={build.id} className="search-result-item">
                        <h3>{build.name}</h3>
                        <p>{build.description}</p>
                    </div>
                ))}
            </div>}
        </div>
    );
}

export default SearchBar;
