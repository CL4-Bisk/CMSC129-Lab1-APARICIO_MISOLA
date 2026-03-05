import "./ItemList.css";
import { useEffect, useState } from "react";
import axios from "axios";

function ItemList() {
    const [items, setItems] = useState([]);
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/items");
                setItems(response.data);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };
        fetchItems();
    }, []);

    return (
        <div className="item-list">
            {items.map((item) => (
                <div key={item.id} className="item-item">
                    <strong>{item.name}</strong> - {item.description}
                </div>
            ))}
        </div>
    );
}

export default ItemList;