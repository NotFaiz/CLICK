// Initialize variables
let clicks = 0; // Total clicks
let clickPower = 1; // How much each click adds
let autoClickerPower = 0; // Auto-clicker power

// Define upgrades
const upgrades = [
  {
    name: "Basic Click Boost",
    description: "+1 Click Power",
    baseCost: 10,
    costMultiplier: 1.15, // Cost increases by 15% each time
    effectMultiplier: 1, // Effect increases linearly
    category: "Click Power",
    purchases: 0, // Tracks how many times this upgrade has been bought
    action: () => {
      clickPower += 1 * upgrades[0].purchases; // Scale effect based on purchases
    }
  },
  {
    name: "Auto Clicker",
    description: "+1 Auto Click per second",
    baseCost: 50,
    costMultiplier: 1.2, // Cost increases by 20% each time
    effectMultiplier: 1, // Effect increases linearly
    category: "Auto-Clicker",
    purchases: 0,
    action: () => {
      autoClickerPower += 1 * upgrades[1].purchases; // Scale effect based on purchases
    }
  },
  {
    name: "Special Bonus",
    description: "+10 Clicks instantly",
    baseCost: 20,
    costMultiplier: 1.1, // Cost increases by 10% each time
    effectMultiplier: 1, // Effect increases linearly
    category: "Special",
    purchases: 0,
    action: () => {
      clicks += 10 * upgrades[2].purchases; // Scale effect based on purchases
    }
  }
];

// Load saved data from localStorage
function loadGame() {
  const savedData = JSON.parse(localStorage.getItem('clickerGame'));
  if (savedData) {
    clicks = savedData.clicks || 0;
    clickPower = savedData.clickPower || 1;
    autoClickerPower = savedData.autoClickerPower || 0;

    // Restore upgrade states
    upgrades.forEach((upgrade, index) => {
      if (savedData.upgrades && savedData.upgrades[index]) {
        upgrade.purchases = savedData.upgrades[index].purchases || 0;
      }
    });
  }
  updateDisplay();
}

// Save game state to localStorage
function saveGame() {
  const dataToSave = {
    clicks,
    clickPower,
    autoClickerPower,
    upgrades: upgrades.map(upgrade => ({ purchases: upgrade.purchases }))
  };
  localStorage.setItem('clickerGame', JSON.stringify(dataToSave));
}

// Update the display
function updateDisplay() {
  document.getElementById('counter').textContent = clicks;

  // Update upgrade availability and costs
  upgrades.forEach(upgrade => {
    const button = document.querySelector(`#upgrade-${upgrade.name.replace(/ /g, '-')}`);
    if (button) {
      const currentCost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.purchases));
      if (clicks >= currentCost) {
        button.classList.remove('hidden');
        button.textContent = `${upgrade.name} - Cost: ${currentCost} (${upgrade.description})`;
      } else {
        button.classList.add('hidden');
      }
    }
  });
}

// Handle clicking the main button
document.getElementById('clickButton').addEventListener('click', () => {
  clicks += clickPower;
  updateDisplay();
  saveGame();
});

// Auto-clicker functionality
function autoClick() {
  clicks += autoClickerPower;
  updateDisplay();
  saveGame();
}

// Dynamically generate upgrade buttons
function generateUpgrades() {
  const upgradeContainer = document.getElementById('upgrades');
  const categories = {};

  upgrades.forEach(upgrade => {
    if (!categories[upgrade.category]) {
      const categoryTitle = document.createElement('h3');
      categoryTitle.className = 'category-title';
      categoryTitle.textContent = upgrade.category;
      upgradeContainer.appendChild(categoryTitle);
      categories[upgrade.category] = true;
    }

    const button = document.createElement('button');
    button.id = `upgrade-${upgrade.name.replace(/ /g, '-')}`;
    button.className = 'upgrade hidden';

    button.addEventListener('click', () => {
      const currentCost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.purchases));
      if (clicks >= currentCost) {
        clicks -= currentCost;
        upgrade.purchases += 1; // Increment purchase count
        upgrade.action(); // Apply the upgrade's effect
        updateDisplay();
        saveGame();
      } else {
        alert('Not enough clicks to purchase this upgrade!');
      }
    });

    upgradeContainer.appendChild(button);
  });
}

// start auto-clicker interval
setInterval(autoClick, 1000);

// load the game on page load
loadGame();
generateUpgrades();
updateDisplay();
