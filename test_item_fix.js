// Test script to verify the item mapping fix
const axios = require('axios');

// Test the specific item ID that was showing as Unknown
const testItemId = 3005970438;

// Korean items data - extracted from the fixed server.js
const itemsData = {
  weapons: {
    // Tier 1 (800 소울)
    715762406: { name: '확장 탄창', cost: 800, tier: 1 },
    1342610602: { name: '고마력 탄환', cost: 800, tier: 1 },
    2712976700: { name: '헤드샷 부스터', cost: 800, tier: 1 },
    4247951502: { name: '관통탄 보호막', cost: 800, tier: 1 },
    2464663797: { name: '속사탄', cost: 800, tier: 1 },
    2789634532: { name: '회복탄', cost: 800, tier: 1 },
    2829779411: { name: '영혼 분쇄 탄환', cost: 800, tier: 1 },
    2502493491: { name: '독성 탄환', cost: 800, tier: 1 },
  },
  vitality: {
    // Tier 1 (800 소울)
    1537272748: { name: '추가 체력', cost: 800, tier: 1 },
    3970837787: { name: '정신력 갑옷', cost: 800, tier: 1 },
    3791587546: { name: '총알 갑옷', cost: 800, tier: 1 },
    2863754076: { name: '추가 재생', cost: 800, tier: 1 },
    3675059374: { name: '추가 지구력', cost: 800, tier: 1 },
    2598983158: { name: '스프린트 부츠', cost: 800, tier: 1 },
    3730717068: { name: '치유 의식', cost: 800, tier: 1 },
    968099481: { name: '추가 체력', cost: 800, tier: 1 },
    395867183: { name: '근접 흡혈', cost: 800, tier: 1 },
  },
  spirit: {
    // Tier 1 (800 소울)
    2095565695: { name: '추가 정신력', cost: 800, tier: 1 },
    1282141666: { name: '신비한 폭발', cost: 800, tier: 1 },
    3677653320: { name: '정신력 타격', cost: 800, tier: 1 },
    3702319013: { name: '한파', cost: 800, tier: 1 },
    859037655: { name: '부패', cost: 800, tier: 1 },
    3574779418: { name: '주입기', cost: 800, tier: 1 },
    1673325555: { name: '정신력 흡혈', cost: 800, tier: 1 },
    
    // Tier 2 (1600+ 소울) - INCLUDING THE FIX
    673001892: { name: '이더 변환', cost: 1600, tier: 2 },
    1656913918: { name: '상급 쿨다운', cost: 1600, tier: 2 },
    3754524659: { name: '향상된 쿨다운', cost: 1600, tier: 2 },
    3005970438: { name: '향상된 리치', cost: 1600, tier: 2 }, // THE FIX!
    2820116164: { name: '향상된 폭발', cost: 1600, tier: 2 },
    3357231760: { name: '향상된 정신력', cost: 1600, tier: 2 },
    3612042342: { name: '신비한 취약성', cost: 1600, tier: 2 },
    3270001687: { name: '퀵실버 재장전', cost: 1600, tier: 2 },
    2800629741: { name: '시드는 채찍', cost: 1600, tier: 2 },
    600033864: { name: '점증하는 노출', cost: 1600, tier: 2 },
    1378931225: { name: '이더 변환', cost: 1600, tier: 2 },
  }
};

// Function to get item by ID
function getItemNameById(itemId) {
  for (const category of Object.values(itemsData)) {
    if (category[itemId]) {
      return category[itemId].name;
    }
  }
  return `Unknown Item (${itemId})`;
}

// Test the specific problematic item
console.log('🔍 Testing item mapping fix...');
console.log(`Item ID ${testItemId}: "${getItemNameById(testItemId)}"`);

// Test a few more common items
const testItems = [3005970438, 2820116164, 3357231760, 1537272748, 2095565695];
console.log('\n📋 Testing multiple items:');
testItems.forEach(itemId => {
  console.log(`${itemId}: "${getItemNameById(itemId)}"`);
});

// Count total items
const totalItems = Object.values(itemsData).reduce((total, category) => 
  total + Object.keys(category).length, 0);
console.log(`\n📊 Total items in mapping: ${totalItems}`);

// Test if this would fix the API response
console.log('\n🧪 Simulating API response:');
const mockMatch = {
  matchId: 38227715,
  hero: "Shiv",
  items: [
    { name: getItemNameById(3005970438), itemId: 3005970438, slot: 0 },
    { name: getItemNameById(2820116164), itemId: 2820116164, slot: 1 },
    { name: getItemNameById(1537272748), itemId: 1537272748, slot: 2 }
  ]
};

console.log('Match items:', JSON.stringify(mockMatch.items, null, 2));