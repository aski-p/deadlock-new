// Test the complete item flow from server to frontend
const axios = require('axios');

async function testCompleteItemFlow() {
  console.log('🔍 Testing complete item flow from server to frontend...');

  // Test 1: Create a mock match with known items and hero
  console.log('\n1. Testing mock match data generation...');

  // Simulate the server-side item generation for a known hero
  const mockMatch = {
    match_id: 12345,
    hero_id: 1, // Infernus
    player_team: 0,
    match_result: 0, // Win
    match_duration_s: 1800, // 30 minutes
    player_kills: 8,
    player_deaths: 4,
    player_assists: 12,
    net_worth: 15000,
  };

  // Server-side hero name mapping
  const getHeroNameById = heroId => {
    const heroMap = {
      1: 'Infernus',
      2: 'Seven',
      3: 'Vindicta',
    };
    return heroMap[heroId] || `Hero_${heroId}`;
  };

  const heroName = getHeroNameById(mockMatch.hero_id);
  console.log(`Hero: ${heroName}`);

  // Server-side item template for Infernus
  const heroBuildTemplates = {
    Infernus: {
      weapon: ['Toxic Bullets', 'Monster Rounds', 'Titanic Magazine', 'Glass Cannon'],
      vitality: ['Extra Health', 'Bullet Armor', 'Metal Skin', 'Lifestrike'],
      spirit: ['Extra Spirit', 'Mystic Burst', 'Improved Spirit', 'Boundless Spirit'],
    },
  };

  const buildTemplate = heroBuildTemplates[heroName];
  const selectedItems = [];

  // Generate 6 items (2 from each category)
  ['weapon', 'vitality', 'spirit'].forEach(category => {
    const categoryItems = buildTemplate[category];
    // Pick first 2 items for predictable testing
    for (let i = 0; i < 2 && i < categoryItems.length; i++) {
      selectedItems.push({
        name: categoryItems[i],
        slot: selectedItems.length + 1,
        category: category,
      });
    }
  });

  console.log('Generated items:', selectedItems);

  // Test 2: Check frontend image mapping
  console.log('\n2. Testing frontend image mapping...');

  // Frontend item image mapping (copy from player-detail.ejs)
  const frontendItemImageMap = {
    // Weapon Items
    'Basic Magazine':
      'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/basic_magazine.webp',
    'Monster Rounds':
      'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/monster_rounds.webp',
    'Toxic Bullets':
      'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/toxic_bullets.webp',
    'Titanic Magazine':
      'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/titanic_magazine.webp',
    'Glass Cannon': 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/glass_cannon.webp',

    // Vitality Items
    'Extra Health':
      'https://cdn.deadlock.coach/vpk/panorama/images/items/vitality/extra_health.webp',
    'Bullet Armor':
      'https://cdn.deadlock.coach/vpk/panorama/images/items/vitality/bullet_armor.webp',
    'Metal Skin': 'https://cdn.deadlock.coach/vpk/panorama/images/items/vitality/metal_skin.webp',
    Lifestrike: 'https://cdn.deadlock.coach/vpk/panorama/images/items/vitality/lifestrike.webp',

    // Spirit Items
    'Extra Spirit': 'https://cdn.deadlock.coach/vpk/panorama/images/items/spirit/extra_spirit.webp',
    'Mystic Burst': 'https://cdn.deadlock.coach/vpk/panorama/images/items/spirit/mystic_burst.webp',
    'Improved Spirit':
      'https://cdn.deadlock.coach/vpk/panorama/images/items/spirit/improved_spirit.webp',
    'Boundless Spirit':
      'https://cdn.deadlock.coach/vpk/panorama/images/items/spirit/boundless_spirit.webp',
  };

  const getItemImage = itemName => {
    return (
      frontendItemImageMap[itemName] ||
      'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/basic_magazine.webp'
    );
  };

  selectedItems.forEach(item => {
    const imageUrl = getItemImage(item.name);
    const isDefault =
      imageUrl ===
      'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/basic_magazine.webp';
    const status = isDefault ? '❌ DEFAULT' : '✅ MAPPED';
    console.log(`${status} ${item.name} -> ${imageUrl}`);
  });

  // Test 3: Check if URLs are accessible
  console.log('\n3. Testing image URL accessibility...');

  for (const item of selectedItems) {
    const imageUrl = getItemImage(item.name);
    if (
      imageUrl !== 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/basic_magazine.webp'
    ) {
      try {
        const response = await axios.head(imageUrl, { timeout: 5000 });
        console.log(`✅ ${item.name}: ${response.status} ${response.statusText}`);
      } catch (error) {
        console.log(
          `❌ ${item.name}: ${error.response?.status || 'NETWORK_ERROR'} - ${error.message}`
        );
      }
    }
  }

  console.log('\n✅ Complete item flow test finished!');
}

testCompleteItemFlow().catch(console.error);
