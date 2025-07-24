// Find correct URLs for broken items
const axios = require('axios');

async function findCorrectUrls() {
  const brokenItems = [
    'Leech',
    'Sharpshooter',
    'Bullet Armor',
    'Improved Bullet Armor',
    'Spirit Armor',
    'Improved Spirit Armor',
  ];

  const baseUrl = 'https://cdn.deadlock.coach/vpk/panorama/images/items';

  console.log('🔍 Trying alternative URLs for broken items...\n');

  for (const item of brokenItems) {
    console.log(`Testing ${item}:`);

    // Convert to different naming conventions
    const variations = [
      item.toLowerCase().replace(/ /g, '_'),
      item.toLowerCase().replace(/ /g, '-'),
      item.toLowerCase().replace(/'/g, '').replace(/ /g, '_'),
      item.toLowerCase().replace(/'/g, '').replace(/ /g, '-'),
      item.toLowerCase().replace(/ /g, ''),
      // Special cases
      item === 'Leech' ? 'vampiric_burst' : null,
      item === 'Sharpshooter' ? 'headshot_booster' : null,
      item === 'Bullet Armor' ? 'kinetic_armor' : null,
      item === 'Improved Bullet Armor' ? 'improved_kinetic_armor' : null,
      item === 'Spirit Armor' ? 'spirit_lifesteal' : null,
      item === 'Improved Spirit Armor' ? 'improved_spirit_lifesteal' : null,
    ].filter(Boolean);

    // Determine category
    let category = 'weapon';
    if (
      item.includes('Health') ||
      item.includes('Armor') ||
      item.includes('Stamina') ||
      item.includes('Lifesteal')
    ) {
      category = 'vitality';
    } else if (item.includes('Spirit') || item.includes('Burst') || item.includes('Cold')) {
      category = 'spirit';
    }

    for (const variation of variations) {
      const testUrl = `${baseUrl}/${category}/${variation}.webp`;

      try {
        const response = await axios.head(testUrl, { timeout: 3000 });
        console.log(`  ✅ FOUND: ${testUrl}`);
        break;
      } catch (error) {
        console.log(`  ❌ ${variation}: ${error.response?.status || 'ERROR'}`);
      }
    }
    console.log('');
  }

  console.log('💡 Alternative approach - using generic fallback images:');
  console.log('  Weapon items -> basic_magazine.webp');
  console.log('  Vitality items -> extra_health.webp');
  console.log('  Spirit items -> extra_spirit.webp');
}

findCorrectUrls().catch(console.error);
