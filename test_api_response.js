// 실제 API 응답에서 아이템 데이터 확인
const axios = require('axios');

async function testApiResponse() {
  try {
    console.log('🧪 API 응답에서 아이템 데이터 테스트 중...\n');

    // 로컬 서버에서 플레이어 데이터 가져오기
    // Test with different account IDs
    const testAccountIds = ['1486063236', '76561198015042012', '123456789'];

    for (const testAccountId of testAccountIds) {
      console.log(`\n🔍 Testing account ID: ${testAccountId}`);

      try {
        const response = await axios.get(
          `http://localhost:3001/api/v1/players/${testAccountId}?refresh=true`,
          {
            timeout: 10000,
          }
        );

        const playerData = response.data;

        console.log('📊 플레이어 기본 정보:');
        console.log(`- 이름: ${playerData.name}`);
        console.log(`- 계정 ID: ${playerData.accountId}`);
        console.log(`- 총 매치: ${playerData.stats?.matches || 0}`);
        console.log();

        console.log('🎮 최근 매치 데이터:');
        if (playerData.recentMatches && playerData.recentMatches.length > 0) {
          playerData.recentMatches.forEach((match, index) => {
            console.log(`📋 매치 ${index + 1}:`);
            console.log(`  - ID: ${match.matchId}`);
            console.log(`  - 영웅: ${match.hero}`);
            console.log(`  - 결과: ${match.result}`);
            console.log(`  - 아이템 개수: ${match.items ? match.items.length : 0}`);

            if (match.items && match.items.length > 0) {
              console.log(`  - 아이템 목록:`);
              match.items.forEach(item => {
                console.log(`    • ${item.name} (${item.category || 'unknown'})`);
              });
            } else {
              console.log(`  - ❌ 아이템 데이터 없음`);
            }
            console.log();
          });
        } else {
          console.log('❌ 최근 매치 데이터 없음');
        }
      } catch (error) {
        console.log(`❌ Account ${testAccountId} 실패: ${error.message}`);
      }
    }

    console.log('🖼️ 아이템 이미지 URL 테스트:');

    // 테스트용 아이템들
    const testItems = [
      'Toxic Bullets',
      'Monster Rounds',
      'Extra Health',
      'Metal Skin',
      'Extra Spirit',
      'Boundless Spirit',
    ];

    const getItemImage = itemName => {
      const itemImageMap = {
        'Toxic Bullets':
          'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/toxic_bullets.webp',
        'Monster Rounds':
          'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/monster_rounds.webp',
        'Extra Health':
          'https://cdn.deadlock.coach/vpk/panorama/images/items/vitality/extra_health.webp',
        'Metal Skin':
          'https://cdn.deadlock.coach/vpk/panorama/images/items/vitality/metal_skin.webp',
        'Extra Spirit':
          'https://cdn.deadlock.coach/vpk/panorama/images/items/spirit/extra_spirit.webp',
        'Boundless Spirit':
          'https://cdn.deadlock.coach/vpk/panorama/images/items/spirit/boundless_spirit.webp',
      };
      return (
        itemImageMap[itemName] ||
        'https://cdn.deadlock.coach/vpk/panorama/images/items/weapon/basic_magazine.webp'
      );
    };

    for (const itemName of testItems) {
      const imageUrl = getItemImage(itemName);
      console.log(`🖼️ ${itemName}: ${imageUrl}`);

      try {
        const imageResponse = await axios.head(imageUrl, { timeout: 5000 });
        console.log(`  ✅ 이미지 로드 성공 (${imageResponse.status})`);
      } catch (error) {
        console.log(`  ❌ 이미지 로드 실패: ${error.response?.status || error.message}`);
      }
    }

    console.log('\n🔍 결론:');
    console.log('1. API 응답에서 recentMatches의 items 필드 확인');
    console.log('2. 아이템 이미지 URL이 모두 접근 가능한지 확인');
    console.log('3. Frontend JavaScript getItemImage 함수와 일치하는지 확인');
  } catch (error) {
    console.error('❌ 테스트 실패:', error.message);
  }
}

testApiResponse();
