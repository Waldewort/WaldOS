// --- WALDOLLUTION LOGIK (17 ITEMS / ENGLISH / GRID VIEW) ---
const waldollutionData = {
  banana: {
    title: "Banana",
    icon: "🍌",
    time: "1 to 3 months",
    fact: "Although biodegradable, the decomposition in central European forests takes several months due to the thick skin."
  },
  apple: {
    title: "Apple Core",
    icon: "🍎",
    time: "2 to 4 weeks",
    fact: "Rich in nutrients, but takes longer in cold forest soils; it rapidly attracts insects and wildlife."
  },
  orange: {
    title: "Orange Peel",
    icon: "🍊",
    time: "6 months to 2 years",
    fact: "Treated with natural waxes and essential oils, making citrus peels much tougher to decompose than local fruit."
  },
  tissue: {
    title: "Paper Towel",
    icon: "🤧",
    time: "1 to 5 months",
    fact: "Moist paper towels often contain tear-resistant synthetic fibers that burden the environment."
  },
  cigarette: {
    title: "Cigarette Butt",
    icon: "🚬",
    time: "10 to 15 years",
    fact: "A single filter contains thousands of chemical toxins and can pollute up to 40 liters of groundwater!"
  },
  gum: {
    title: "Chewing Gum",
    icon: "🍬",
    time: "5 years",
    fact: "Modern chewing gums are mostly made from petroleum-based synthetic rubber (plastic), not natural sap."
  },
  bag: {
    title: "Plastic Bag",
    icon: "🛍️",
    time: "20 to 500+ years",
    fact: "Often mistaken for jellyfish by wildlife and sea turtles; breaks down into dangerous microplastics over time."
  },
  styrofoam: {
    title: "Styrofoam Cup",
    icon: "☕",
    time: "500 years to forever",
    fact: "Expanded polystyrene does not biodegrade biologically; it only fragments into smaller toxic particles."
  },
  shoe: {
    title: "Leather Shoe",
    icon: "👞",
    time: "25 to 40 years",
    fact: "Heavy tanning chemicals and glues used in shoe manufacturing can leach into the soil, harming microorganisms."
  },
  can: {
    title: "Aluminum Can",
    icon: "🥤",
    time: "80 to 200 years",
    fact: "Aluminum does not rot, but oxidizes slowly. Recycling an aluminum can saves 95% of the energy needed to make a new one!"
  },
  steelcan: {
    title: "Steel Can",
    icon: "🥫",
    time: "50 years",
    fact: "Rusts and breaks down faster than aluminum, leaving iron oxide deposits in the forest floor."
  },
  diaper: {
    title: "Disposable Diaper",
    icon: "🚼",
    time: "400 to 500 years",
    fact: "Made of a mixture of plastic, wood pulp, and superabsorbent polymers that persist in landfills and nature for centuries."
  },
  net: {
    title: "Fishing Net (Nylon)",
    icon: "🕸️",
    time: "600 years",
    fact: "Responsible for severe 'ghost fishing', trapping birds, fish, and forest animals near water bodies for generations."
  },
  bottle: {
    title: "Plastic Bottle (PET)",
    icon: "🍾",
    time: "450 years",
    fact: "Does not decompose naturally; instead, photo-degradation splits it into microscopic plastic particles."
  },
  cardboard: {
    title: "Cardboard Box",
    icon: "📦",
    time: "2 months",
    fact: "Clean cardboard breaks down quickly when exposed to moisture, but waxed or coated boxes last much longer."
  },
  pad: {
    title: "Sanitary Pad",
    icon: "🛡️",
    time: "500 to 800 years",
    fact: "Contains plastic backings, adhesives, and synthetic materials, making it virtually non-biodegradable in the wild."
  },
  glass: {
    title: "Glass Bottle",
    icon: "🫙",
    time: "Over 1,000 years",
    fact: "Glass does not rot at all. It is chemically inert, forms no toxic substances, and can be recycled infinitely."
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const gridContainer = document.querySelector("#waldollution-grid");

  function renderWaldollutionGrid(selectedKey = "banana") {
    if (!gridContainer) return;
    gridContainer.innerHTML = "";

    Object.keys(waldollutionData).forEach(key => {
      const item = waldollutionData[key];
      const tile = document.createElement("div");
      tile.className = `waldollution-tile ${key === selectedKey ? "active" : ""}`;
      
      tile.innerHTML = `
        <span class="waldollution-tile-icon">${item.icon}</span>
        <span class="waldollution-tile-name">${item.title}</span>
      `;

      tile.addEventListener("click", () => {
        document.querySelectorAll(".waldollution-tile").forEach(t => t.classList.remove("active"));
        tile.classList.add("active");
        updateWaldollutionDisplay(key);
      });

      gridContainer.appendChild(tile);
    });
  }

  function updateWaldollutionDisplay(key) {
    const item = waldollutionData[key];
    if (item) {
      document.querySelector("#waldollution-icon").innerText = item.icon;
      document.querySelector("#waldollution-item-title").innerText = item.title;
      document.querySelector("#waldollution-time").innerText = item.time;
      document.querySelector("#waldollution-fact").innerText = item.fact;
    }
  }

  renderWaldollutionGrid("banana");
});