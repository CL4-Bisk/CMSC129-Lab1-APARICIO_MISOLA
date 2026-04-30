const express = require("express");

const router = express.Router();
const ITEMS_URL = "https://raw.githubusercontent.com/p3hndrx/MLBB-API/refs/heads/main/v1/item-meta-final.json";
const ITEM_IMAGE_BASE_URL = "https://mlbb.tools/items";

async function fetchItemsData() {
  const response = await fetch(ITEMS_URL);

  if (!response.ok) {
    throw new Error(`MLBB API returned ${response.status}`);
  }

  return response.json();
}

function toSlug(value = "") {
  return value
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatLabel(value) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeModifiers(modifiers = []) {
  return modifiers
    .flatMap((modifier) =>
      Object.entries(modifier).map(([key, value]) => ({
        label: formatLabel(key),
        value,
      }))
    )
    .filter((modifier) => modifier.value !== undefined && modifier.value !== null && modifier.value !== "");
}

function normalizeEffects(effects = [], nameKey) {
  return effects
    .filter((effect) => effect.description && effect.description !== "null")
    .map((effect) => ({
      name: effect[nameKey] && effect[nameKey] !== "null" ? effect[nameKey] : "Effect",
      description: effect.description,
    }));
}

function normalizeItem(item) {
  const details = item.data?.[0] || {};
  const iconSlug = toSlug(item.icon || item.item_name);

  return {
    id: item.id,
    name: item.item_name,
    category: item.item_category,
    tier: item.item_tier,
    icon: item.icon,
    imageUrl: iconSlug ? `${ITEM_IMAGE_BASE_URL}/${iconSlug}.webp` : "",
    cost: details.cost || "",
    summary: details.summary ? formatLabel(details.summary) : "",
    stats: normalizeModifiers(details.modifiers),
    active: normalizeEffects(details.active, "active_name"),
    passive: normalizeEffects(details.passive, "passive_name"),
    uniquePassive: normalizeEffects(details.unique_passive, "unique_passive_name"),
    buildPath: details.build_path || [],
  };
}

async function getNormalizedItems() {
  const data = await fetchItemsData();

  return {
    title: data.title,
    revdate: data.revdate,
    patch: data.patch,
    source: data.source,
    imageSource: "https://mlbb.tools",
    data: data.data.map(normalizeItem),
  };
}

router.get("/all-items", async (req, res) => {
  try {
    const data = await getNormalizedItems();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch MLBB data" });
  }
});

router.get("/defense-items", async (req, res) => {
  try {
    const data = await getNormalizedItems();
    const defenseItems = data.data.filter((item) => item.category === "Defense");
    res.json({ ...data, data: defenseItems });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch MLBB data" });
  }
});

module.exports = router;
