const axios = require('axios');

async function findNewItemIds() {
  try {
    console.log('🔍 새로운 아이템 ID들 수집 중...');
    const response = await axios.get('https://deadlock-new-production.up.railway.app/api/v1/players/76561198015042012');
    const data = response.data;
    
    const allItems = [];
    data.recentMatches?.forEach(match => {
      if (match.items) {
        match.items.forEach(item => {
          if (item.name.startsWith('Unknown Item (')) {
            const id = item.name.match(/Unknown Item \((\d+)\)/)?.[1];
            if (id && !allItems.includes(id)) {
              allItems.push(id);
            }
          }
        });
      }
    });
    
    console.log('🆔 발견된 모든 Unknown Item ID들:');
    allItems.sort().forEach(id => {
      console.log(`  ${id}: 'Unknown Item (${id})'`);
    });
    
    console.log(`\n📊 총 ${allItems.length}개의 새로운 ID 발견`);
    console.log('💡 1656913918 포함 여부:', allItems.includes('1656913918') ? '✅ 발견됨' : '❌ 없음');
    
    // 기존 매핑된 ID들과 비교
    const existingIds = [
      '2460791803', '1458044103', '1537272748', '1835738020',
      '3977876567', '3970837787', '3791587546', '2095565695',
      '1282141666', '1955841979', '339443430', '673001892',
      '3812615317', '3731635960', '865846625', '1414319208'
    ];
    
    const newIds = allItems.filter(id => !existingIds.includes(id));
    console.log(`\n🆕 새로 추가해야 할 ID들 (${newIds.length}개):`);
    newIds.forEach(id => {
      console.log(`  ${id}: '???', // TODO: 아이템 이름 확인 필요`);
    });
    
  } catch (error) {
    console.error('❌ 오류:', error.message);
  }
}

findNewItemIds();