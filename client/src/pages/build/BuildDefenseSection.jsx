import "./BuildDefenseSection.css";
import { useState } from "react";
import api from "../../api/api.js";
import BuildList from "../../components/BuildList/BuildList.jsx";
import ItemList from "../../components/ItemList/ItemList.jsx";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import { useGlobalInfoModal } from "../../components/GlobalInfoModal/GlobalInfoModalContext.jsx";
import { getErrorMessage } from "../../utils/errorMessage.js";

const MAX_BUILD_SLOTS = 6;

function BuildDefenseSection({ setAppSections }) {
  const { showConfirm, showError, showInfo } = useGlobalInfoModal();
  const [defense, setDefense] = useState("none");
  const [defenseName, setDefenseName] = useState("");
  const [defenseDescription, setDefenseDescription] = useState("");
  const [selectedItems, setSelectedItems] = useState(Array(MAX_BUILD_SLOTS).fill(null));
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);
  const [buildListVersion, setBuildListVersion] = useState(0);

  const DEFENSE_TYPES = {
    none: "None",
    armor: "Physical Defense",
    shield: "Magical Defense",
    hybrid: "Hybrid Defense"
  };

  const getItemKey = (item) => item?.id || item?.name;
  const filledSlots = selectedItems.filter(Boolean).length;

  const handleItemPick = (item) => {
    const next = [...selectedItems];
    const activeItem = next[activeSlotIndex];
    const clickedItemKey = getItemKey(item);
    const existingIndex = next.findIndex((slotItem) => getItemKey(slotItem) === clickedItemKey);

    if (existingIndex === activeSlotIndex) {
      next[activeSlotIndex] = null;
      setSelectedItems(next);
      return;
    }

    if (existingIndex !== -1) {
      next[existingIndex] = activeItem || null;
      next[activeSlotIndex] = item;
      setSelectedItems(next);
      return;
    }

    next[activeSlotIndex] = item;
    setSelectedItems(next);

    const firstEmptyIndex = next.findIndex((slotItem) => !slotItem);
    if (firstEmptyIndex !== -1) {
      setActiveSlotIndex(firstEmptyIndex);
    }
  };

  const handleSlotClick = (slotIndex) => {
    if (slotIndex === activeSlotIndex && selectedItems[slotIndex]) {
      const next = [...selectedItems];
      next[slotIndex] = null;
      setSelectedItems(next);
      return;
    }

    setActiveSlotIndex(slotIndex);
  };

  const handleSave = async () => {
    if (!defenseName.trim()) {
      showInfo("Missing build name", "Please enter a build name before saving.");
      return;
    }

    if (filledSlots !== MAX_BUILD_SLOTS) {
      showInfo("Incomplete build", "Please fill all 6 item slots before saving.");
      return;
    }

    const shouldSave = await showConfirm(
      "Save Defense Build",
      "Save this defense build with the selected 6 items?",
      { confirmLabel: "Save build", cancelLabel: "Cancel" }
    );
    if (!shouldSave) {
      return;
    }

    const newBuild = {
      name: defenseName,
      type: defense,
      description: defenseDescription,
      items: selectedItems.map((item, slotIndex) => ({
        slot: slotIndex + 1,
        id: item?.id || null,
        name: item?.name || "",
        category: item?.category || "",
        cost: item?.cost || "",
        imageUrl: item?.imageUrl || "",
      })),
    };

    try {
      await api.post("/builds", newBuild);

      showInfo("Defense saved", "Your defense build was saved successfully.");
      setDefenseName("");
      setDefense("none");
      setDefenseDescription("");
      setSelectedItems(Array(MAX_BUILD_SLOTS).fill(null));
      setActiveSlotIndex(0);
      setBuildListVersion((value) => value + 1);
    } catch (error) {
      showError("Save failed", getErrorMessage(error, "Failed to save defense. Please try again."));
    }
  };

  return (
    <main className="shop-page build-defense-section">
      <section className="shop-frame">
        <header className="shop-header">
          <div className="shop-title-group">
            <p className="shop-kicker">Defense Workshop</p>
            <h1 className="shop-title">Build Defense</h1>
          </div>
          <div className="shop-actions">
            <button className="shop-button ghost" onClick={() => setAppSections("HOME")} type="button">
              Back to Shop
            </button>
          </div>
        </header>

        <div className="shop-body">
          <SearchBar />

          <div className="shop-grid-two">
            <section className="shop-card-panel">
              <h3>Build Details</h3>
              <div className="field-grid build-form">
                <label>
                  Build Name
                  <input
                    type="text"
                    placeholder="Enter build name"
                    value={defenseName}
                    onChange={(e) => setDefenseName(e.target.value)}
                  />
                </label>

                <label>
                  Type
                  <select value={defense} onChange={(e) => setDefense(e.target.value)}>
                    {Object.entries(DEFENSE_TYPES).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Notes
                  <textarea
                    placeholder="Counter item plan, enemy damage type, or timing notes"
                    value={defenseDescription}
                    onChange={(e) => setDefenseDescription(e.target.value)}
                  />
                </label>

                <button className="shop-button primary" onClick={handleSave} type="button">
                  Save Defense
                </button>
              </div>

              <div className="build-slots-panel">
                <div className="build-slots-header">
                  <h4>Defense Slots</h4>
                  <span>{filledSlots}/{MAX_BUILD_SLOTS} selected</span>
                </div>
                <div className="build-slots-grid">
                  {selectedItems.map((item, index) => (
                    <button
                      key={`build-slot-${index + 1}`}
                      className={`build-slot ${activeSlotIndex === index ? "is-active" : ""} ${item ? "is-filled" : ""}`}
                      onClick={() => handleSlotClick(index)}
                      type="button"
                    >
                      <span className="build-slot-number">Slot {index + 1}</span>
                      <strong className="build-slot-name">{item?.name || "Empty Slot"}</strong>
                    </button>
                  ))}
                </div>
                <p className="build-slots-hint">
                  Click a slot, then click an item. Click the same item again or re-click an active occupied slot to remove it.
                </p>
              </div>

              <BuildList refreshKey={buildListVersion} />
            </section>

            <section className="shop-panel">
              <div className="shop-panel-header">
                <div>
                  <h2>Defense Items</h2>
                  <p className="shop-panel-subtitle">Pick armor, shields, and hybrid counters.</p>
                </div>
              </div>
              <div className="shop-panel-body">
                <ItemList
                  category="Defense"
                  onItemPick={handleItemPick}
                  selectedItems={selectedItems}
                />
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

export default BuildDefenseSection;
