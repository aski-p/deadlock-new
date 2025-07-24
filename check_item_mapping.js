// API에서 실제 사용되는 아이템들이 getItemImage 함수에 매핑되어 있는지 확인
const apiItems = [
  'Basic Magazine', 'Berserker', 'Boundless Spirit', 'Bullet Armor', 'Cold Front',
  'Colossus', 'Echo Shard', 'Extra Health', 'Extra Spirit', 'Improved Bullet Armor',
  'Improved Spirit', 'Kinetic Dash', 'Leech', 'Magic Carpet', 'Majestic Leap',
  'Melee Charge', 'Metal Skin', 'Monster Rounds', 'Mystic Burst', 'Pristine Emblem',
  'Sprint Boots', 'Superior Cooldown', 'Tesla Bullets', 'Titanic Magazine', 'Toxic Bullets'
];

// player-detail.ejs의 getItemImage 함수에서 매핑 확인 (축약된 버전)
const itemImageMap = {
  // Weapon Items
  'Basic Magazine': 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/basic_magazine.webp',
  'Berserker': 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/berserker.webp',
  'Kinetic Dash': 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/kinetic_dash.webp',
  'Leech': 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/toxic_bullets.webp',
  'Melee Charge': 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/melee_charge.webp',
  'Monster Rounds': 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/monster_rounds.webp',
  'Pristine Emblem': 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/pristine_emblem.webp',
  'Tesla Bullets': 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/tesla_bullets.webp',
  'Titanic Magazine': 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/titanic_magazine.webp',
  'Toxic Bullets': 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/toxic_bullets.webp',

  // Vitality Items
  'Bullet Armor': 'https://cdn.deadlock.coach/vpk/panorama/images/items/vitality/extra_health.webp',
  'Colossus': 'https://cdn.deadlock.coach/vpk/panorama/images/items/vitality/colossus.webp',
  'Extra Health': 'https://cdn.deadlock.coach/vpk/panorama/images/items/vitality/extra_health.webp',
  'Improved Bullet Armor': 'https://cdn.deadlock.coach/vpk/panorama/images/items/vitality/metal_skin.webp',
  'Majestic Leap': 'https://cdn.deadlock.coach/vpk/panorama/images/items/vitality/majestic_leap.webp',
  'Metal Skin': 'https://cdn.deadlock.coach/vpk/panorama/images/items/vitality/metal_skin.webp',
  'Sprint Boots': 'https://cdn.deadlock.coach/vpk/panorama/images/items/vitality/sprint_boots.webp',

  // Spirit Items
  'Boundless Spirit': 'https://cdn.deadlock.coach/vpk/panorama/images/items/spirit/boundless_spirit.webp',
  'Cold Front': 'https://cdn.deadlock.coach/vpk/panorama/images/items/spirit/cold_front.webp',
  'Echo Shard': 'https://cdn.deadlock.coach/vpk/panorama/images/items/spirit/echo_shard.webp',
  'Extra Spirit': 'https://cdn.deadlock.coach/vpk/panorama/images/items/spirit/extra_spirit.webp',
  'Improved Spirit': 'https://cdn.deadlock.coach/vpk/panorama/images/items/spirit/improved_spirit.webp',
  'Magic Carpet': 'https://cdn.deadlock.coach/vpk/panorama/images/items/spirit/magic_carpet.webp',
  'Mystic Burst': 'https://cdn.deadlock.coach/vpk/panorama/images/items/spirit/mystic_burst.webp',
  'Superior Cooldown': 'https://cdn.dreamhack.deadlock.coach/images/items/spirit/superior_cooldown.webp'
};

console.log('🔍 API 아이템 매핑 확인 결과:\n');

const missingItems = [];
const mappedItems = [];

apiItems.forEach(itemName => {
  if (itemImageMap[itemName]) {
    mappedItems.push(itemName);
    console.log(`✅ ${itemName}`);
  } else {
    missingItems.push(itemName);
    console.log(`❌ ${itemName} - 매핑 없음`);
  }
});

console.log(`\n📊 요약:`);
console.log(`✅ 매핑됨: ${mappedItems.length}개`);
console.log(`❌ 누락됨: ${missingItems.length}개`);

if (missingItems.length > 0) {
  console.log(`\n⚠️ 누락된 아이템들:`);
  missingItems.forEach(item => console.log(`  - ${item}`));
}