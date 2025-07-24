const axios = require('axios');

// Hero mapping from server.js
const getHeroNameById = (heroId) => {
  const heroMap = {
    1: 'Dynamo', 2: 'Seven', 4: 'Lady Geist', 6: 'Abrams', 7: 'Wraith', 
    8: 'McGinnis', 10: 'Paradox', 11: 'Infernus', 12: 'Kelvin', 13: 'Haze', 
    14: 'Holliday', 15: 'Bebop', 16: 'Calico', 17: 'Grey Talon', 18: 'Mo & Krill', 19: 'Shiv', 
    20: 'Ivy', 25: 'Vindicta', 27: 'Yamato', 31: 'Lash', 35: 'Viscous', 
    50: 'Pocket', 52: 'Mirage', 58: 'Viper', 59: 'Unknown_59', 60: 'Sinclair', 61: 'Unknown_61', 62: 'Mo & Krill', 63: 'Dynamo'
  };
  return heroMap[heroId] || `Hero_${heroId}`;
};

async function testInfernusCount(accountId) {
  try {
    console.log(`🔍 Testing Infernus count for account ${accountId}...`);
    
    // Get match history from API
    const response = await axios.get(`https://api.deadlock-api.com/v1/players/${accountId}/match-history`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.data || !Array.isArray(response.data)) {
      console.log(`❌ No match data for account ${accountId}`);
      return;
    }

    const matches = response.data;
    console.log(`📊 Total matches found: ${matches.length}`);

    // Count hero occurrences
    const heroCount = {};
    let infernusMatches = [];

    matches.forEach((match, index) => {
      const heroId = match.hero_id;
      const heroName = getHeroNameById(heroId);
      
      if (!heroCount[heroName]) {
        heroCount[heroName] = 0;
      }
      heroCount[heroName]++;
      
      // Track Infernus matches specifically
      if (heroId === 11) {
        infernusMatches.push({
          matchIndex: index + 1,
          matchId: match.match_id,
          heroId: heroId,
          heroName: heroName
        });
        console.log(`🔥 Found Infernus match ${infernusMatches.length}: Match ID ${match.match_id}, Index ${index + 1}`);
      }
    });

    // Results
    console.log(`\n📈 Hero Statistics:`);
    Object.entries(heroCount)
      .sort((a, b) => b[1] - a[1])
      .forEach(([hero, count]) => {
        console.log(`  ${hero}: ${count} matches`);
      });

    console.log(`\n🔥 Infernus Summary:`);
    console.log(`  Total Infernus matches: ${infernusMatches.length}`);
    console.log(`  Infernus in heroCount: ${heroCount['Infernus'] || 0}`);
    
    if (infernusMatches.length > 0) {
      console.log(`  Infernus match IDs: ${infernusMatches.map(m => m.matchId).join(', ')}`);
    }

  } catch (error) {
    console.error(`❌ Error testing account ${accountId}:`, error.message);
  }
}

// Test with a few different account IDs
async function runTests() {
  const testAccounts = [15042012, 63061652, 123456789];
  
  for (const accountId of testAccounts) {
    console.log(`\n${'='.repeat(50)}`);
    await testInfernusCount(accountId);
    console.log(`${'='.repeat(50)}\n`);
  }
}

runTests();