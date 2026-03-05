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
    }, [query]);

    return (
        <div className="search-bar">
            <input 
                type="text"
                placeholder="Search builds..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
    );
}

export default SearchBar;