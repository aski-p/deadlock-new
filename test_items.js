const axios = require('axios');

async function testItems() {
    try {
        console.log('Testing item data fetching...');
        
        // Test 1: Player API
        const playerResponse = await axios.get('http://localhost:3002/api/v1/players/352358985');
        console.log('\n=== Player API Response ===');
        console.log('Recent matches count:', playerResponse.data.recentMatches?.length || 0);
        
        if (playerResponse.data.recentMatches && playerResponse.data.recentMatches.length > 0) {
            const firstMatch = playerResponse.data.recentMatches[0];
            console.log('\nFirst match data:');
            console.log('- Match ID:', firstMatch.matchId);
            console.log('- Hero:', firstMatch.hero);
            console.log('- Has items?:', !!firstMatch.items);
            console.log('- Items count:', firstMatch.items?.length || 0);
            
            if (firstMatch.items && firstMatch.items.length > 0) {
                console.log('\nFirst 3 items:');
                firstMatch.items.slice(0, 3).forEach((item, index) => {
                    console.log(`  ${index + 1}. ${JSON.stringify(item)}`);
                });
            }
        }
        
        // Test 2: Match History API
        const historyResponse = await axios.get('http://localhost:3002/api/v1/players/352358985/match-history');
        console.log('\n=== Match History API Response ===');
        console.log('Matches count:', historyResponse.data?.length || 0);
        
        if (historyResponse.data && historyResponse.data.length > 0) {
            const firstMatch = historyResponse.data[0];
            console.log('\nFirst match from history:');
            console.log('- Match ID:', firstMatch.matchId);
            console.log('- Has items?:', !!firstMatch.items);
            console.log('- Items count:', firstMatch.items?.length || 0);
        }
        
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testItems();