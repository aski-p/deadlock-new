// Validate all item image URLs
const axios = require('axios');

async function validateAllItemImages() {
  console.log('🔍 Validating all item image URLs...');
  
  // All items that could be generated
  const allPossibleItems = [
    // Weapon items
    'Basic Magazine', 'Monster Rounds', 'Active Reload', 'Berserker', 'Toxic Bullets', 'Leech',
    'Close Quarters', 'Headshot Booster', 'Tesla Bullets', 'Titanic Magazine', 'Glass Cannon',
    'Sharpshooter', 'Crippling Headshot', 'Lucky Shot',
    
    // Vitality items  
    'Extra Health', 'Sprint Boots', 'Bullet Armor', 'Improved Bullet Armor', 'Metal Skin', 'Colossus',
    'Lifestrike', 'Spirit Armor', 'Improved Spirit Armor',
    
    // Spirit items
    'Extra Spirit', 'Mystic Burst', 'Cold Front', 'Improved Spirit', 'Ethereal Shift', 'Boundless Spirit',
    'Superior Duration', 'Echo Shard', 'Mystic Reverb'
  ];
  
  // Frontend item image mapping (comprehensive)
  const itemImageMap = {
    // Weapon Items
    'Basic Magazine': 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/basic_magazine.webp',
    'Close Quarters': 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/close_quarters.webp', 
    'Headshot Booster': 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/headshot_booster.webp',
    'Monster Rounds': 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/monster_rounds.webp',
    'Active Reload': 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/active_reload.webp',
    'Berserker': 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/berserker.webp',
    'Sharpshooter': 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/headshot_booster.webp',
    'Tesla Bullets': 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/tesla_bullets.webp',
    'Titanic Magazine': 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/titanic_magazine.webp',
    'Toxic Bullets': 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/toxic_bullets.webp',
    'Glass Cannon': 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/glass_cannon.webp',
    'Crippling Headshot': 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/crippling_headshot.webp',
    'Lucky Shot': 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/lucky_shot.webp',
    'Leech': 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/toxic_bullets.webp',

    // Vitality Items
    'Extra Health': 'https://cdn.deadlock.coach/vpk/panorama/images/items/vitality/extra_health.webp',
    'Sprint Boots': 'https://cdn.deadlock.coach/vpk/panorama/images/items/vitality/sprint_boots.webp',
    'Bullet Armor': 'https://cdn.deadlock.coach/vpk/panorama/images/items/vitality/extra_health.webp',
    'Improved Bullet Armor': 'https://cdn.deadlock.coach/vpk/panorama/images/items/vitality/metal_skin.webp',
    'Metal Skin': 'https://cdn.deadlock.coach/vpk/panorama/images/items/vitality/metal_skin.webp',
    'Colossus': 'https://cdn.deadlock.coach/vpk/panorama/images/items/vitality/colossus.webp',
    'Lifestrike': 'https://cdn.deadlock.coach/vpk/panorama/images/items/vitality/lifestrike.webp',
    'Spirit Armor': 'https://cdn.deadlock.coach/vpk/panorama/images/items/vitality/spirit_lifesteal.webp',
    'Improved Spirit Armor': 'https://cdn.deadlock.coach/vpk/panorama/images/items/vitality/metal_skin.webp',

    // Spirit Items
    'Extra Spirit': 'https://cdn.deadlock.coach/vpk/panorama/images/items/spirit/extra_spirit.webp',
    'Mystic Burst': 'https://cdn.deadlock.coach/vpk/panorama/images/items/spirit/mystic_burst.webp',
    'Cold Front': 'https://cdn.deadlock.coach/vpk/panorama/images/items/spirit/cold_front.webp',
    'Improved Spirit': 'https://cdn.deadlock.coach/vpk/panorama/images/items/spirit/improved_spirit.webp',
    'Ethereal Shift': 'https://cdn.deadlock.coach/vpk/panorama/images/items/spirit/ethereal_shift.webp',
    'Boundless Spirit': 'https://cdn.deadlock.coach/vpk/panorama/images/items/spirit/boundless_spirit.webp',
    'Superior Duration': 'https://cdn.deadlock.coach/vpk/panorama/images/items/spirit/superior_duration.webp',
    'Echo Shard': 'https://cdn.deadlock.coach/vpk/panorama/images/items/spirit/echo_shard.webp',
    'Mystic Reverb': 'https://cdn.deadlock.coach/vpk/panorama/images/items/spirit/mystic_reverb.webp'
  };
  
  console.log(`\nTesting ${allPossibleItems.length} possible items...\n`);
  
  const results = {
    working: [],
    broken: [],
    missing: []
  };
  
  for (const itemName of allPossibleItems) {
    const imageUrl = itemImageMap[itemName];
    
    if (!imageUrl) {
      results.missing.push(itemName);
      console.log(`❌ MISSING: ${itemName} - No URL mapping`);
      continue;
    }
    
    try {
      const response = await axios.head(imageUrl, { timeout: 5000 });
      results.working.push(itemName);
      console.log(`✅ OK: ${itemName}`);
    } catch (error) {
      results.broken.push(itemName);
      const status = error.response?.status || 'NETWORK_ERROR';
      console.log(`❌ BROKEN: ${itemName} - ${status}`);
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`✅ Working: ${results.working.length}`);
  console.log(`❌ Broken: ${results.broken.length}`);
  console.log(`⚠️ Missing: ${results.missing.length}`);
  
  if (results.broken.length > 0) {
    console.log('\n🔧 Broken items that need fixing:');
    results.broken.forEach(item => console.log(`  - ${item}`));
  }
  
  if (results.missing.length > 0) {
    console.log('\n⚠️ Missing mappings:');
    results.missing.forEach(item => console.log(`  - ${item}`));
  }
}

validateAllItemImages().catch(console.error);