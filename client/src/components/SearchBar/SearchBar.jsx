import { useState, useEffect } from "react";
import axios from "axios";

function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/builds?query=${query}`);
                setResults(response.data);
            } catch (error) {
                console.error("Error fetching results:", error);
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

    }, [query]);

    return (
        <div className="search-bar">
            <input 
                type="text"
                placeholder="Search builds..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <div className="search-results">
                {results.map((build) => (
                    <div key={build.id} className="search-result-item">
                        <h3>{build.name}</h3>
                        <p>{build.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchBar;