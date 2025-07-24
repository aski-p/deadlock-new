// Test the Infernus counting logic with mock data

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

// Create mock match data with 12 Infernus matches
function createMockMatches() {
  const matches = [];
  
  // Add 12 Infernus matches (hero_id: 11)
  for (let i = 1; i <= 12; i++) {
    matches.push({
      match_id: 1000 + i,
      hero_id: 11, // Infernus
      player_kills: Math.floor(Math.random() * 15) + 5,
      player_deaths: Math.floor(Math.random() * 10) + 2,
      player_assists: Math.floor(Math.random() * 20) + 5,
      net_worth: Math.floor(Math.random() * 20000) + 15000,
      match_duration_s: Math.floor(Math.random() * 1200) + 1200, // 20-40 minutes
      player_team: Math.random() > 0.5 ? 1 : 2,
      match_result: Math.random() > 0.5 ? 1 : 2,
      denies: Math.floor(Math.random() * 30) + 10
    });
  }
  
  // Add some matches with other heroes
  const otherHeroes = [15, 6, 7, 2, 25]; // Bebop, Abrams, Wraith, Seven, Vindicta
  for (let i = 0; i < 20; i++) {
    const heroId = otherHeroes[Math.floor(Math.random() * otherHeroes.length)];
    matches.push({
      match_id: 2000 + i,
      hero_id: heroId,
      player_kills: Math.floor(Math.random() * 15) + 5,
      player_deaths: Math.floor(Math.random() * 10) + 2,
      player_assists: Math.floor(Math.random() * 20) + 5,
      net_worth: Math.floor(Math.random() * 20000) + 15000,
      match_duration_s: Math.floor(Math.random() * 1200) + 1200,
      player_team: Math.random() > 0.5 ? 1 : 2,
      match_result: Math.random() > 0.5 ? 1 : 2,
      denies: Math.floor(Math.random() * 30) + 10
    });
  }
  
  return matches;
}

// Simulate the hero counting logic from fetchAndAnalyzeAllMatches
function analyzeMatches(matches) {
  console.log(`📊 Analyzing ${matches.length} total matches...`);
  
  let heroStats = {};
  let infernusMatchCount = 0;
  
  matches.forEach((match, index) => {
    try {
      const heroId = match.hero_id;
      const heroName = getHeroNameById(heroId);
      
      // Debug logging for Infernus
      if (heroId === 11) {
        infernusMatchCount++;
        console.log(`🔥 Infernus match ${infernusMatchCount} found - Match ID: ${match.match_id}, Hero ID: ${heroId}, Hero Name: ${heroName}`);
      }
      
      // Initialize hero stats if not exists
      if (!heroStats[heroName]) {
        heroStats[heroName] = {
          matches: 0,
          wins: 0,
          kills: 0,
          deaths: 0,
          assists: 0
        };
      }
      
      // Increment match count
      heroStats[heroName].matches++;
      
      // Check win/loss
      let isMatchWin = false;
      if (match.player_team !== undefined && match.match_result !== undefined) {
        isMatchWin = match.player_team === match.match_result;
      }
      
      if (isMatchWin) {
        heroStats[heroName].wins++;
      }
      
      // Add other stats
      heroStats[heroName].kills += match.player_kills || 0;
      heroStats[heroName].deaths += match.player_deaths || 0;
      heroStats[heroName].assists += match.player_assists || 0;
      
    } catch (error) {
      console.log(`❌ Error analyzing match ${index}: ${error.message}`);
    }
  });
  
  // Results
  console.log(`\n📈 Hero Statistics:`);
  Object.entries(heroStats)
    .sort((a, b) => b[1].matches - a[1].matches)
    .forEach(([hero, stats]) => {
      const winRate = stats.matches > 0 ? ((stats.wins / stats.matches) * 100).toFixed(1) : 0;
      console.log(`  ${hero}: ${stats.matches} matches (${winRate}% win rate)`);
    });
  
  // Infernus specific results
  const infernusStats = heroStats['Infernus'];
  console.log(`\n🔥 Infernus Verification:`);
  console.log(`  Infernus matches found during processing: ${infernusMatchCount}`);
  console.log(`  Infernus in final heroStats: ${infernusStats ? infernusStats.matches : 0}`);
  
  if (infernusStats && infernusStats.matches !== 12) {
    console.log(`❌ MISMATCH! Expected 12 Infernus matches, got ${infernusStats.matches}`);
  } else if (infernusStats && infernusStats.matches === 12) {
    console.log(`✅ SUCCESS! Infernus count is correct: ${infernusStats.matches} matches`);
  } else {
    console.log(`❌ ERROR! No Infernus stats found in heroStats object`);
  }
  
  return { heroStats, infernusMatchCount };
}

// Run the test
console.log('🧪 Testing Infernus counting logic...\n');

const mockMatches = createMockMatches();
const results = analyzeMatches(mockMatches);

// Verify the hero ID mapping
console.log(`\n🔍 Hero ID Verification:`);
console.log(`  Hero ID 11 maps to: "${getHeroNameById(11)}"`);
console.log(`  Is "Infernus" === "Infernus"? ${getHeroNameById(11) === 'Infernus'}`);

console.log(`\n🎯 Test Complete!`);