import "./ItemList.css";
import { useEffect, useState } from "react";
import api from "../../api/api.js";

function ItemList({ category }) {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const fetchAllItems = async () => {
            try {
                const response = await api.get("/all-items");
                setItems(response.data.data);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };
        fetchAllItems();
    }, []);

    const filtered = category
        ? items.filter(item => item.category === category)
        : items;

    const getItemInitials = (name = "") => {
        return name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0])
            .join("")
            .toUpperCase();
    };

    const visibleItem = selectedItem || filtered[0];

    return (
        <div className="item-browser">
            <div className="item-list">
                {filtered.length === 0 ? (
                    <div className="item-empty">No items found.</div>
                ) : (
                    filtered.map((item) => (
                        <button
                            key={item.id || item.name}
                            className={`item-item ${visibleItem?.id === item.id ? "is-selected" : ""}`}
                            onClick={() => setSelectedItem(item)}
                            type="button"
                        >
                            <div className="item-icon">
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt="" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                                ) : null}
                                <span>{getItemInitials(item.name)}</span>
                            </div>
                            <div className="item-info">
                                <strong>{item.name}</strong>
                                <span>{item.category}</span>
                            </div>
                            {item.cost && <div className="item-cost">{item.cost}</div>}
                        </button>
                    ))
                )}
            </div>

            {visibleItem && (
                <aside className="item-detail-panel">
                    <div className="item-detail-top">
                        <div className="item-icon detail-icon">
                            {visibleItem.imageUrl ? (
                                <img src={visibleItem.imageUrl} alt="" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                            ) : null}
                            <span>{getItemInitials(visibleItem.name)}</span>
                        </div>
                        <div>
                            <h3>{visibleItem.name}</h3>
                            <p>{visibleItem.summary || visibleItem.category}</p>
                        </div>
                    </div>

                    <div className="item-meta-row">
                        <span>{visibleItem.category}</span>
                        {visibleItem.cost && <strong>{visibleItem.cost} gold</strong>}
                    </div>

                    {visibleItem.stats.length > 0 && (
                        <div className="item-detail-block">
                            <h4>Stats</h4>
                            <div className="item-stat-list">
                                {visibleItem.stats.map((stat) => (
                                    <div key={`${stat.label}-${stat.value}`} className="item-stat">
                                        <span>{stat.label}</span>
                                        <strong>+{stat.value}</strong>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {visibleItem.uniquePassive.length > 0 && (
                        <div className="item-detail-block">
                            <h4>Unique Passive</h4>
                            {visibleItem.uniquePassive.map((effect) => (
                                <p key={`${effect.name}-${effect.description}`}>
                                    <strong>{effect.name}:</strong> {effect.description}
                                </p>
                            ))}
                        </div>
                    )}
                </aside>
            )}
        </div>
    );
}

export default ItemList;
