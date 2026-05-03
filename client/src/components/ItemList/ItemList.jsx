import "./ItemList.css";
import { useEffect, useState } from "react";
import api from "../../api/api.js";

const ITEMS_PER_PAGE = 8;

function getPaginationItems(currentPage, totalPages) {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
        return [1, 2, 3, 4, "end-ellipsis", totalPages];
    }

    if (currentPage >= totalPages - 2) {
        return [1, "start-ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "start-ellipsis", currentPage - 1, currentPage, currentPage + 1, "end-ellipsis", totalPages];
}

function ItemList({ category }) {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

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

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const pageStart = (currentPage - 1) * ITEMS_PER_PAGE;
    const pagedItems = filtered.slice(pageStart, pageStart + ITEMS_PER_PAGE);
    const paginationItems = getPaginationItems(currentPage, totalPages);

    useEffect(() => {
        setCurrentPage(1);
        setSelectedItem(null);
    }, [category]);

    useEffect(() => {
        setCurrentPage((page) => Math.min(page, totalPages));
    }, [totalPages]);

    const getItemInitials = (name = "") => {
        return name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0])
            .join("")
            .toUpperCase();
    };

    const getItemKey = (item) => item?.id || item?.name;
    const visibleItem = selectedItem || pagedItems[0] || filtered[0];

    const goToPage = (page) => {
        const nextPage = Math.min(Math.max(page, 1), totalPages);
        setCurrentPage(nextPage);
        setSelectedItem(null);
    };

    return (
        <div className="item-browser">
            <div className="item-list-wrap">
                <div className="item-list">
                {filtered.length === 0 ? (
                    <div className="item-empty">No items found.</div>
                ) : (
                    pagedItems.map((item) => (
                        <button
                            key={getItemKey(item)}
                            className={`item-item ${getItemKey(visibleItem) === getItemKey(item) ? "is-selected" : ""}`}
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

                {filtered.length > ITEMS_PER_PAGE && (
                    <div className="list-pagination" aria-label="Item pages">
                        <button
                            className="pagination-button"
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            type="button"
                            aria-label="Previous item page"
                        >
                            <span className="pagination-full-label">Prev</span>
                            <span className="pagination-short-label">{"<"}</span>
                        </button>
                        {paginationItems.map((page) => (
                            typeof page === "number" ? (
                                <button
                                    key={page}
                                    className={`pagination-button page-number ${currentPage === page ? "is-active" : ""}`}
                                    onClick={() => goToPage(page)}
                                    type="button"
                                    aria-current={currentPage === page ? "page" : undefined}
                                >
                                    {page}
                                </button>
                            ) : (
                                <span key={page} className="pagination-ellipsis" aria-hidden="true">...</span>
                            )
                        ))}
                        <button
                            className="pagination-button"
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            type="button"
                            aria-label="Next item page"
                        >
                            <span className="pagination-full-label">Next</span>
                            <span className="pagination-short-label">{">"}</span>
                        </button>
                    </div>
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
