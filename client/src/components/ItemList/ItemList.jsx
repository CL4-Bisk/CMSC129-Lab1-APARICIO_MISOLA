import "./ItemList.css";
import { useEffect, useState } from "react";
import axios from "axios";

function ItemList({ category }) {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/items");
                setItems(response.data.data);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };
        fetchItems();
    }, []);

    const filtered = category
        ? items.filter(item => item.item_category === category)
        : items;

    return (
        <div className="item-list">
            {filtered.map((item) => (
                <div key={item.id} className="item-item">
                    <strong>{item.item_name}</strong> — {item.item_category}
                </div>
            ))}
        </div>
    );
}

export default ItemList;