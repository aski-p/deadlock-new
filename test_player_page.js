// 플레이어 페이지 진단 스크립트
const axios = require('axios');

async function testPlayerPage() {
  const testAccountId = '76561198015042012'; // 매치 데이터가 있는 계정

  try {
    console.log('🔍 플레이어 페이지 진단 시작...\n');

    // 1. API 엔드포인트 테스트
    console.log('📡 API 엔드포인트 테스트:');
    const apiResponse = await axios.get(`http://localhost:3001/api/v1/players/${testAccountId}`);
    const playerData = apiResponse.data;

    console.log(`✅ API 응답 성공 (상태: ${apiResponse.status})`);
    console.log(`- 플레이어: ${playerData.name}`);
    console.log(`- 매치 수: ${playerData.stats?.matches || 0}`);
    console.log(`- 최근 매치: ${playerData.recentMatches?.length || 0}개`);

    if (playerData.recentMatches && playerData.recentMatches.length > 0) {
      console.log('\n🎮 첫 번째 매치 아이템 분석:');
      const firstMatch = playerData.recentMatches[0];
      console.log(`- 매치 ID: ${firstMatch.matchId}`);
      console.log(`- 영웅: ${firstMatch.hero}`);
      console.log(`- 아이템 개수: ${firstMatch.items?.length || 0}`);

      if (firstMatch.items && firstMatch.items.length > 0) {
        firstMatch.items.forEach((item, index) => {
          console.log(`  ${index + 1}. ${item.name} (카테고리: ${item.category || 'unknown'})`);
        });
      }
    }

    // 2. 플레이어 페이지 HTML 테스트
    console.log('\n🌐 플레이어 페이지 HTML 테스트:');
    const pageResponse = await axios.get(`http://localhost:3001/ko/players/${testAccountId}`);
    console.log(`✅ 페이지 로드 성공 (상태: ${pageResponse.status})`);
    console.log(`- 페이지 크기: ${pageResponse.data.length} bytes`);

    // JavaScript 코드 확인
    const htmlContent = pageResponse.data;
    const hasGetItemImage = htmlContent.includes('function getItemImage');
    const hasUpdateMatchesList = htmlContent.includes('function updateMatchesList');
    const hasLoadPlayerData = htmlContent.includes('function loadPlayerData');

    console.log(`- getItemImage 함수 존재: ${hasGetItemImage ? '✅' : '❌'}`);
    console.log(`- updateMatchesList 함수 존재: ${hasUpdateMatchesList ? '✅' : '❌'}`);
    console.log(`- loadPlayerData 함수 존재: ${hasLoadPlayerData ? '✅' : '❌'}`);

    // 아이템 매핑 확인
    const itemImageMapMatch = htmlContent.match(/const itemImageMap = \{[\s\S]*?\};/);
    if (itemImageMapMatch) {
      const itemMapCode = itemImageMapMatch[0];

      // API에서 반환된 아이템들이 매핑에 있는지 확인
      const apiItems = [];
      if (playerData.recentMatches && playerData.recentMatches.length > 0) {
        playerData.recentMatches.forEach(match => {
          if (match.items) {
            match.items.forEach(item => {
              if (!apiItems.includes(item.name)) {
                apiItems.push(item.name);
              }
            });
          }
        });
      }

      console.log('\n🖼️ 아이템 매핑 확인:');
      const missingItems = [];
      apiItems.forEach(itemName => {
        const itemExists =
          itemMapCode.includes(`'${itemName}':`) || itemMapCode.includes(`"${itemName}":`);
        if (itemExists) {
          console.log(`✅ ${itemName}`);
        } else {
          console.log(`❌ ${itemName} - 매핑 누락!`);
          missingItems.push(itemName);
        }
      });

      if (missingItems.length > 0) {
        console.log(`\n⚠️ 누락된 아이템 매핑: ${missingItems.length}개`);
        missingItems.forEach(item => console.log(`- ${item}`));
      } else {
        console.log('\n✅ 모든 아이템 매핑 완료');
      }
    }

    // 3. 실제 이미지 URL 테스트
    console.log('\n🖼️ 실제 이미지 URL 테스트:');
    const sampleItems = ['Berserker', 'Metal Skin', 'Extra Spirit', 'Ethereal Shift'];

    for (const itemName of sampleItems) {
      // 실제 URL 생성 (frontend 매핑 기반)
      const itemImageMap = {
        Berserker: 'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/berserker.webp',
        'Metal Skin':
          'https://cdn.deadlock.coach/vpk/panorama/images/items/vitality/metal_skin.webp',
        'Extra Spirit':
          'https://cdn.deadlock.coach/vpk/panorama/images/items/spirit/extra_spirit.webp',
        'Ethereal Shift':
          'https://cdn.deadlock.coach/vpk/panorama/images/items/spirit/ethereal_shift.webp',
      };

      const imageUrl = itemImageMap[itemName];
      if (imageUrl) {
        try {
          const imageResponse = await axios.head(imageUrl, { timeout: 5000 });
          console.log(`✅ ${itemName}: ${imageResponse.status}`);
        } catch (error) {
          console.log(`❌ ${itemName}: ${error.response?.status || error.message}`);
        }
      }
    }

    console.log('\n🔍 진단 완료!');
    console.log('\n📋 권장사항:');
    console.log('1. 브라우저에서 http://localhost:3001/ko/players/76561198015042012 접속');
    console.log('2. 개발자 도구(F12) → Console 탭에서 오류 확인');
    console.log('3. Network 탭에서 이미지 로딩 상태 확인');
    console.log('4. 아이템 섹션이 표시되는지 확인');
  } catch (error) {
    console.error('❌ 진단 실패:', error.message);
  }
}

testPlayerPage();
