const axios = require('axios');

async function testAPI() {
  try {
    console.log('🌐 Testing Deadlock API endpoints...');

    // Test different API endpoints
    const endpoints = [
      'https://api.deadlock-api.com/v1/leaderboard/north-america',
      'https://api.deadlock-api.com/v1/leaderboard/asia',
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`\n🔍 Testing: ${endpoint}`);
        const response = await axios.get(endpoint, {
          timeout: 5000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });

        if (response.data && response.data.length > 0) {
          console.log(`✅ Success! Got ${response.data.length} entries`);

          // Get first player's account ID to test with
          const firstPlayer = response.data[0];
          if (firstPlayer && firstPlayer.player && firstPlayer.player.accountId) {
            const testAccountId = firstPlayer.player.accountId;
            console.log(`🎯 Found test account ID: ${testAccountId} (${firstPlayer.player.name})`);

            // Test match history for this account
            try {
              console.log(`🔍 Testing match history for ${testAccountId}...`);
              const matchResponse = await axios.get(
                `https://api.deadlock-api.com/v1/players/${testAccountId}/match-history`,
                {
                  timeout: 10000,
                  headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                  },
                }
              );

              if (matchResponse.data && Array.isArray(matchResponse.data)) {
                console.log(`📊 Match history: ${matchResponse.data.length} matches found`);

                // Count heroes
                const heroCount = {};
                let infernusCount = 0;

                matchResponse.data.forEach(match => {
                  const heroId = match.hero_id;
                  if (heroId === 11) {
                    infernusCount++;
                    console.log(
                      `🔥 Infernus match found: Match ID ${match.match_id}, Hero ID ${heroId}`
                    );
                  }

                  if (!heroCount[heroId]) {
                    heroCount[heroId] = 0;
                  }
                  heroCount[heroId]++;
                });

                console.log(`🔥 Total Infernus matches: ${infernusCount}`);
                console.log(
                  `📈 Top heroes by ID:`,
                  Object.entries(heroCount)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([id, count]) => `${id}:${count}`)
                    .join(', ')
                );

                return; // Exit after first successful test
              } else {
                console.log(`❌ No match data found`);
              }
            } catch (matchError) {
              console.log(`❌ Match history error: ${matchError.message}`);
            }
          }
        } else {
          console.log(`❌ No data returned`);
        }
      } catch (error) {
        console.log(`❌ Error: ${error.message}`);
      }
    }
  } catch (error) {
    console.error(`❌ General error:`, error.message);
  }
}

testAPI();
