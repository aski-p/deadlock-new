// Test the item generation logic directly
function testItemGeneration() {
  console.log('🔍 Testing item generation logic...');

  // Simulate the getItemNameById function
  const getItemNameById = itemId => {
    const itemMap = {
      715762406: 'Basic Magazine',
      1342610602: 'Close Quarters',
      1437614329: 'Headshot Booster',
      968099481: 'Extra Health',
      2678489038: 'Extra Regen',
      380806748: 'Extra Spirit',
      811521119: 'Spirit Strike',
    };
    return itemMap[itemId] || `Unknown Item (${itemId})`;
  };

  // Simulate mock match items generation
  const generateMockItems = heroName => {
    const heroBuildTemplates = {
      Infernus: {
        weapon: ['Toxic Bullets', 'Monster Rounds', 'Titanic Magazine', 'Glass Cannon'],
        vitality: ['Extra Health', 'Bullet Armor', 'Metal Skin', 'Lifestrike'],
        spirit: ['Extra Spirit', 'Mystic Burst', 'Improved Spirit', 'Boundless Spirit'],
      },
      default: {
        weapon: [
          'Basic Magazine',
          'Monster Rounds',
          'Active Reload',
          'Berserker',
          'Toxic Bullets',
          'Leech',
        ],
        vitality: [
          'Extra Health',
          'Sprint Boots',
          'Bullet Armor',
          'Improved Bullet Armor',
          'Metal Skin',
          'Colossus',
        ],
        spirit: [
          'Extra Spirit',
          'Mystic Burst',
          'Cold Front',
          'Improved Spirit',
          'Ethereal Shift',
          'Boundless Spirit',
        ],
      },
    };

    const buildTemplate = heroBuildTemplates[heroName] || heroBuildTemplates['default'];
    const selectedItems = [];

    // Each category selects 2 items
    ['weapon', 'vitality', 'spirit'].forEach(category => {
      const categoryItems = buildTemplate[category];
      const shuffled = [...categoryItems].sort(() => 0.5 - Math.random());

      for (let i = 0; i < 2 && i < shuffled.length; i++) {
        selectedItems.push({
          name: shuffled[i],
          slot: selectedItems.length + 1,
          category: category,
        });
      }
    });

    return selectedItems;
  };

  // Test item generation for Infernus
  console.log('\n1. Testing Infernus items:');
  const infernusItems = generateMockItems('Infernus');
  console.log('Generated items:', infernusItems);

  // Test item generation for default hero
  console.log('\n2. Testing default hero items:');
  const defaultItems = generateMockItems('SomeHero');
  console.log('Generated items:', defaultItems);

  // Test item image mapping
  console.log('\n3. Testing frontend item image mapping:');

  // Simulate the frontend getItemImage function
  const getItemImage = itemName => {
    const itemImageMap = {
      'Basic Magazine':
        'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/basic_magazine.webp',
      'Toxic Bullets':
        'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/toxic_bullets.webp',
      'Extra Health':
        'https://cdn.deadlock.coach/vpk/panorama/images/items/vitality/extra_health.webp',
      'Extra Spirit':
        'https://cdn.deadlock.coach/vpk/panorama/images/items/spirit/extra_spirit.webp',
    };

    return (
      itemImageMap[itemName] ||
      'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/basic_magazine.webp'
    );
  };

  infernusItems.forEach(item => {
    const imageUrl = getItemImage(item.name);
    console.log(`${item.name} -> ${imageUrl}`);
  });

  console.log('\n✅ Item generation test completed!');
}

testItemGeneration();
