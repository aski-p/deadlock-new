const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// EJS layout configuration
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key-for-development',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Temporarily disable for debugging
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Check if Steam API key is configured
const steamApiKey = process.env.STEAM_API_KEY;
const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT;
const baseUrl = isProduction ? 'https://deadlock-new-production.up.railway.app' : 'http://localhost:3000';

console.log('🔧 Environment check:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT);
console.log('- Steam API Key:', steamApiKey ? 'Configured' : 'Missing');
console.log('- Base URL:', baseUrl);

// Steam Strategy (only if API key is available)
if (steamApiKey) {
  passport.use(new SteamStrategy({
      returnURL: `${baseUrl}/auth/steam/return`,
      realm: baseUrl,
      apiKey: steamApiKey
    },
  async (identifier, profile, done) => {
    try {
      // Extract Steam ID from identifier
      const steamId = identifier.split('/').pop();
      
      // Get additional user info from Steam API
      const userResponse = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${steamId}`);
      const userData = userResponse.data.response.players[0];
      
      // Steam 아바타 URL을 Cloudflare CDN으로 변환
      let avatarUrl = userData.avatarfull || userData.avatarmedium || userData.avatar;
      if (avatarUrl) {
        avatarUrl = avatarUrl.replace('avatars.steamstatic.com', 'avatars.cloudflare.steamstatic.com');
      }

      const user = {
        steamId: steamId,
        accountId: steamId, // For Deadlock API compatibility
        username: userData.personaname,
        avatar: avatarUrl,
        profileUrl: userData.profileurl,
        profile: profile
      };
      
      return done(null, user);
    } catch (error) {
      console.error('Steam authentication error:', error);
      return done(error, null);
    }
  }
));

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
} else {
  console.log('⚠️ Steam API key not configured - Steam authentication disabled');
}

// Steam API utility functions
const steamAPI = {
  async getPlayerStats(steamId) {
    try {
      const response = await axios.get(`http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=1422450&key=${process.env.STEAM_API_KEY}&steamid=${steamId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching player stats:', error);
      return null;
    }
  },
  
  async getRecentGames(steamId) {
    try {
      const response = await axios.get(`http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${steamId}&format=json`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent games:', error);
      return null;
    }
  }
};

// Routes
app.get('/', (req, res) => {
  res.render('index', { 
    user: req.user,
    title: '박근형의 데드락'
  });
});

app.get('/ko', (req, res) => {
  res.render('index', { 
    user: req.user,
    title: '박근형의 데드락'
  });
});

app.get('/ko/leaderboards/europe', (req, res) => {
  res.render('leaderboards', { 
    user: req.user,
    region: 'europe',
    title: 'European Leaderboards - 박근형의 데드락'
  });
});

app.get('/ko/leaderboards/asia', (req, res) => {
  res.render('leaderboards', { 
    user: req.user,
    region: 'asia',
    title: 'Asian Leaderboards - 박근형의 데드락'
  });
});

app.get('/ko/leaderboards/north-america', (req, res) => {
  res.render('leaderboards', { 
    user: req.user,
    region: 'north-america',
    title: 'North American Leaderboards - 박근형의 데드락'
  });
});

app.get('/ko/leaderboards/south-america', (req, res) => {
  res.render('leaderboards', { 
    user: req.user,
    region: 'south-america',
    title: 'South American Leaderboards - 박근형의 데드락'
  });
});

app.get('/ko/leaderboards/oceania', (req, res) => {
  res.render('leaderboards', { 
    user: req.user,
    region: 'oceania',
    title: 'Oceania Leaderboards - 박근형의 데드락'
  });
});

// Steam Auth Routes (only if Steam is configured)
if (steamApiKey) {
  app.get('/auth/steam',
    passport.authenticate('steam', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/');
    }
  );

  app.get('/auth/steam/return',
    passport.authenticate('steam', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect('/');
    }
  );
} else {
  // Fallback routes when Steam is not configured
  app.get('/auth/steam', (req, res) => {
    res.status(503).json({ 
      error: 'Steam authentication not configured',
      message: 'Please set STEAM_API_KEY environment variable'
    });
  });

  app.get('/auth/steam/return', (req, res) => {
    res.redirect('/?error=steam_not_configured');
  });
}

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

// 실제 데드락 리더보드 API 호출 (모든 지역)
const fetchDeadlockLeaderboard = async (region, page = 1, limit = 50) => {
  try {
    console.log(`🔍 실제 데드락 API 조회: ${region}`);
    
    // 지역별 API 엔드포인트 매핑
    const regionEndpoints = {
      'asia': 'Asia',
      'europe': 'Europe', 
      'north-america': 'NAmerica',
      'south-america': 'SAmerica',
      'oceania': 'Oceania'
    };
    
    const apiRegion = regionEndpoints[region];
    if (!apiRegion) {
      console.log(`❌ 지원하지 않는 지역: ${region}`);
      return null;
    }
    
    // deadlock-api.com의 실제 리더보드 API 호출
    const response = await axios.get(`https://api.deadlock-api.com/v1/leaderboard/${apiRegion}`, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });

    if (response.data && response.data.entries && Array.isArray(response.data.entries)) {
      console.log(`✅ 실제 데드락 API 성공! ${response.data.entries.length}명의 플레이어 데이터 획득`);
      
      // API 응답을 우리 형식으로 변환 (전체 1000명, 페이징 없음)
      const convertedData = await convertDeadlockApiToOurFormat(response.data.entries, region);
      return convertedData;
    }

    console.log('❌ 데드락 API 응답 형식 오류:', response.data);
    return null;
    
  } catch (error) {
    console.log(`❌ 데드락 API 실패: ${error.message}`);
    return null;
  }
};

// Steam ID 변환 헬퍼 함수들
const convertToSteamId64 = (accountId) => {
  try {
    // accountId가 이미 64-bit Steam ID인 경우
    if (accountId && accountId.toString().startsWith('76561198')) {
      return accountId.toString();
    }
    
    // 32-bit account ID를 64-bit Steam ID로 변환
    if (accountId && !isNaN(accountId)) {
      const steamId64 = BigInt('76561197960265728') + BigInt(accountId);
      return steamId64.toString();
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

const isValidSteamId64 = (steamId) => {
  try {
    // Steam ID는 76561197960265728 이상이어야 함
    const id = BigInt(steamId);
    const minSteamId = BigInt('76561197960265728');
    const maxSteamId = BigInt('76561202255233023'); // 현실적인 최대값
    
    return id >= minSteamId && id <= maxSteamId;
  } catch (error) {
    return false;
  }
};

// 데드락 API 응답을 우리 형식으로 변환 (전체 데이터, 페이징 없음)
const convertDeadlockApiToOurFormat = async (apiData, region) => {
  try {
    // 영웅 ID 매핑 (실제 API에서 사용하는 ID)
    const heroIdMapping = {
      1: 'Abrams',
      2: 'Bebop', 
      3: 'Dynamo',
      4: 'Grey Talon',
      6: 'Haze',
      7: 'Infernus',
      8: 'Ivy',
      10: 'Kelvin',
      11: 'Lady Geist',
      12: 'Lash',
      13: 'McGinnis',
      14: 'Mo & Krill',
      15: 'Paradox',
      16: 'Pocket',
      17: 'Seven',
      18: 'Shiv',
      19: 'Vindicta',
      20: 'Viscous',
      25: 'Warden',
      27: 'Wraith',
      31: 'Yamato',
      50: 'Mirage',
      52: 'Lash',
      58: 'Calico',
      60: 'Holliday'
    };

    // 메달/랭크 매핑
    const getMedalFromRank = (ranked_rank, ranked_subrank) => {
      if (ranked_rank >= 11) return 'Eternus';
      if (ranked_rank >= 10) return 'Phantom';
      if (ranked_rank >= 9) return 'Oracle';
      if (ranked_rank >= 8) return 'Ritualist';
      if (ranked_rank >= 7) return 'Alchemist';
      if (ranked_rank >= 6) return 'Arcanist';
      return 'Initiate';
    };

    // 먼저 기본 플레이어 데이터 생성
    const convertedPlayers = apiData.map((player) => {
      const heroes = player.top_hero_ids ? 
        player.top_hero_ids.slice(0, 3).map(heroId => heroIdMapping[heroId] || null).filter(hero => hero !== null) : 
        [];

      // Steam ID 변환 로직 개선
      let steamId = null;
      if (player.possible_account_ids && player.possible_account_ids.length > 0) {
        // 각 possible_account_id를 확인하여 유효한 Steam ID 찾기
        for (const accountId of player.possible_account_ids) {
          const steamId64 = convertToSteamId64(accountId);
          if (steamId64 && isValidSteamId64(steamId64)) {
            steamId = steamId64;
            break;
          }
        }
      }
      
      // 유효한 Steam ID가 없으면 기본값 사용
      if (!steamId) {
        steamId = `76561198${String(player.rank).padStart(9, '0')}`;
      }

      // 기본 영웅이 없으면 랜덤 영웅 할당
      const finalHeroes = heroes.length > 0 ? heroes : [Object.values(heroIdMapping)[Math.floor(Math.random() * Object.values(heroIdMapping).length)]];

      return {
        rank: player.rank,
        player: {
          name: player.account_name || `Player_${player.rank}`,
          avatar: `https://avatars.cloudflare.steamstatic.com/b5bd56c1aa4644a474a2e4972be27ef9e82e517e_full.jpg`, // 기본 아바타
          steamId: steamId,
          accountId: player.possible_account_ids && player.possible_account_ids.length > 0 ? player.possible_account_ids[0] : player.rank,
          country: getRandomCountryFlag(region)
        },
        heroes: finalHeroes,
        medal: getMedalFromRank(player.ranked_rank || 7, player.ranked_subrank || 1),
        subrank: player.ranked_subrank || 1,
        score: player.badge_level || Math.floor(4500 - (player.rank * 5)),
        wins: Math.floor(Math.random() * 500) + 100,
        losses: Math.floor(Math.random() * 200) + 50
      };
    });

    // Steam API로 실제 아바타 가져오기 (배치 처리, 상위 100명만)
    if (steamApiKey) {
      try {
        const topPlayers = convertedPlayers.slice(0, 300); // 상위 300명 처리 (더 많은 실제 아바타)
        const steamIds = topPlayers
          .filter(p => p.player.steamId && isValidSteamId64(p.player.steamId))
          .map(p => p.player.steamId);

        if (steamIds.length > 0) {
          console.log(`🎮 Steam API 아바타 조회 시작: ${steamIds.length}명의 유효한 Steam ID (총 ${topPlayers.length}명 중)`);

          // Steam API 배치 처리 (최대 100개씩)
          const batchSize = 100;
          const batches = [];
          for (let i = 0; i < steamIds.length; i += batchSize) {
            batches.push(steamIds.slice(i, i + batchSize));
          }

          for (const batch of batches) {
            try {
              const steamResponse = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/`, {
                params: {
                  key: steamApiKey,
                  steamids: batch.join(',')
                },
                timeout: 10000
              });

              if (steamResponse.data && steamResponse.data.response && steamResponse.data.response.players) {
                const steamUsers = steamResponse.data.response.players;
                console.log(`✅ Steam API 배치 응답: ${steamUsers.length}명의 유저 데이터 수신`);
                
                // 각 Steam 유저 데이터를 매칭해서 아바타 및 국가 정보 업데이트
                steamUsers.forEach(steamUser => {
                  const playerIndex = convertedPlayers.findIndex(p => p.player.steamId === steamUser.steamid);
                  if (playerIndex !== -1) {
                    let avatarUrl = steamUser.avatarfull || steamUser.avatarmedium || steamUser.avatar;
                    
                    // Steam 아바타 URL을 Cloudflare CDN으로 변환
                    if (avatarUrl && avatarUrl !== '') {
                      // 기본 아바타인지 확인 (다양한 기본 아바타 패턴)
                      const defaultAvatarPatterns = [
                        'b5bd56c1aa4644a474a2e4972be27ef9e82e517e', // Steam 기본 아바타 1
                        'fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb', // Steam 기본 아바타 2
                        'c5d56249ee5d28a07db4ac9f7f60af961fab5426', // Steam 기본 아바타 3
                        'fe6d8d616d1f31b2c2e8b7e7e9c0d4b7e5d8e4f7', // Steam 기본 아바타 4
                        '38ea4b5e76b9330b9acc2ae14f7b1a46f0d8bb99'  // Steam 기본 아바타 5
                      ];
                      
                      const isDefaultAvatar = defaultAvatarPatterns.some(pattern => avatarUrl.includes(pattern));
                      
                      if (!isDefaultAvatar) {
                        // avatars.steamstatic.com을 avatars.cloudflare.steamstatic.com으로 변경
                        avatarUrl = avatarUrl.replace('avatars.steamstatic.com', 'avatars.cloudflare.steamstatic.com');
                        
                        convertedPlayers[playerIndex].player.avatar = avatarUrl;
                        convertedPlayers[playerIndex].player.name = steamUser.personaname || convertedPlayers[playerIndex].player.name;
                        
                        console.log(`🖼️ 아바타 업데이트: ${steamUser.personaname} -> ${avatarUrl}`);
                      } else {
                        console.log(`⚪ 기본 아바타 스킵: ${steamUser.personaname}`);
                      }
                    }
                    
                    // 국가 정보 업데이트
                    if (steamUser.loccountrycode) {
                      const countryFlag = getCountryFlag(steamUser.loccountrycode);
                      convertedPlayers[playerIndex].player.country = countryFlag;
                      convertedPlayers[playerIndex].player.countryCode = steamUser.loccountrycode;
                      console.log(`🌍 국가 업데이트: ${steamUser.personaname} -> ${steamUser.loccountrycode} ${countryFlag}`);
                    }
                  }
                });
              }
            } catch (error) {
              console.log(`❌ Steam API 배치 호출 실패:`, error.message);
            }
            
            // 배치 간 짧은 지연
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          console.log(`✅ Steam API 아바타 업데이트 완료`);
        } else {
          console.log(`⚠️ 유효한 Steam ID가 없습니다`);
        }
      } catch (error) {
        console.log(`❌ Steam API 아바타 처리 전체 실패:`, error.message);
      }
    } else {
      console.log(`⚠️ Steam API 키가 설정되지 않았습니다`);
    }

    // 2000등까지만 표시
    const limitedPlayers = convertedPlayers.slice(0, 2000);

    return {
      data: limitedPlayers,
      pagination: {
        current_page: 1,
        total_pages: 1,
        total_count: limitedPlayers.length,
        per_page: limitedPlayers.length
      },
      region: region,
      steam_data_included: true,
      data_source: 'deadlock_api_real'
    };

  } catch (error) {
    console.error('데드락 API 데이터 변환 오류:', error);
    return null;
  }
};

// Steam 플레이어 국가 정보 가져오기
const getPlayerCountryFromSteam = async (steamId) => {
  if (!steamApiKey || !steamId || !isValidSteamId64(steamId)) {
    return null;
  }

  try {
    const response = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/`, {
      params: {
        key: steamApiKey,
        steamids: steamId
      },
      timeout: 5000
    });

    if (response.data && response.data.response && response.data.response.players && response.data.response.players.length > 0) {
      const player = response.data.response.players[0];
      return player.loccountrycode; // ISO 국가 코드 (예: "CN", "KR", "US")
    }
  } catch (error) {
    console.log(`❌ Steam 국가 정보 조회 실패 (${steamId}):`, error.message);
  }
  
  return null;
};

// 국가 코드를 플래그 이모지로 변환
const getCountryFlag = (countryCode) => {
  const countryToFlag = {
    'CN': '🇨🇳', 'KR': '🇰🇷', 'JP': '🇯🇵', 'TW': '🇹🇼', 'TH': '🇹🇭', 'VN': '🇻🇳',
    'SG': '🇸🇬', 'MY': '🇲🇾', 'PH': '🇵🇭', 'ID': '🇮🇩', 'IN': '🇮🇳', 'AU': '🇦🇺', 'NZ': '🇳🇿',
    'US': '🇺🇸', 'CA': '🇨🇦', 'MX': '🇲🇽',
    'DE': '🇩🇪', 'GB': '🇬🇧', 'FR': '🇫🇷', 'ES': '🇪🇸', 'IT': '🇮🇹', 'PL': '🇵🇱', 'RU': '🇷🇺',
    'SE': '🇸🇪', 'NO': '🇳🇴', 'DK': '🇩🇰', 'NL': '🇳🇱', 'BE': '🇧🇪', 'AT': '🇦🇹', 'CH': '🇨🇭', 'FI': '🇫🇮',
    'BR': '🇧🇷', 'AR': '🇦🇷', 'CL': '🇨🇱', 'CO': '🇨🇴', 'PE': '🇵🇪', 'UY': '🇺🇾', 'EC': '🇪🇨', 'VE': '🇻🇪'
  };
  
  return countryToFlag[countryCode] || '🌍';
};

// 지역별 랜덤 국가 플래그 반환 (fallback)
const getRandomCountryFlag = (region) => {
  const regionFlags = {
    'europe': ['🇩🇪', '🇬🇧', '🇫🇷', '🇪🇸', '🇮🇹', '🇵🇱', '🇷🇺', '🇸🇪', '🇳🇴', '🇩🇰', '🇳🇱', '🇧🇪', '🇦🇹', '🇨🇭', '🇫🇮'],
    'asia': ['🇰🇷', '🇯🇵', '🇨🇳', '🇹🇼', '🇹🇭', '🇻🇳', '🇸🇬', '🇲🇾', '🇵🇭', '🇮🇩', '🇮🇳', '🇦🇺', '🇳🇿'],
    'north-america': ['🇺🇸', '🇨🇦', '🇲🇽'],
    'south-america': ['🇧🇷', '🇦🇷', '🇨🇱', '🇨🇴', '🇵🇪', '🇺🇾', '🇪🇨', '🇻🇪', '🇧🇴', '🇵🇾'],
    'oceania': ['🇦🇺', '🇳🇿', '🇫🇯', '🇵🇬', '🇳🇨', '🇻🇺', '🇸🇧', '🇹🇴', '🇼🇸', '🇰🇮']
  };
  
  const flags = regionFlags[region] || regionFlags['asia'];
  return flags[Math.floor(Math.random() * flags.length)];
};

// Steam 데이터를 데드락 리더보드 형식으로 변환
const convertSteamToDeadlockFormat = (steamPlayers, region, page) => {
  const heroes = ['Abrams', 'Bebop', 'Dynamo', 'Grey Talon', 'Haze', 'Infernus', 'Ivy', 'Kelvin', 'Lady Geist', 'Lash', 'McGinnis', 'Mo & Krill', 'Paradox', 'Pocket', 'Seven', 'Shiv', 'Vindicta', 'Viscous', 'Warden', 'Wraith', 'Yamato'];
  const medals = ['Eternus', 'Phantom', 'Oracle', 'Ritualist', 'Alchemist', 'Arcanist', 'Initiate'];
  const startRank = (page - 1) * 50 + 1;

  const players = steamPlayers.map((player, index) => {
    return {
      rank: startRank + index,
      player: {
        name: player.personaname || `Player_${region}_${index}`,
        avatar: player.avatarfull || player.avatarmedium || player.avatar,
        steamId: player.steamid,
        country: getCountryFromSteamLocation(player.loccountrycode) || '🌍'
      },
      heroes: heroes.slice(index % 3, (index % 3) + 2), // 임시로 2-3개 영웅
      medal: medals[index % medals.length],
      subrank: Math.floor(Math.random() * 6) + 1,
      score: Math.floor(4500 - (startRank + index) * 5),
      wins: Math.floor(Math.random() * 500) + 100,
      losses: Math.floor(Math.random() * 200) + 50
    };
  });

  return {
    data: players,
    pagination: {
      current_page: page,
      total_pages: 20,
      total_count: 1000,
      per_page: 50
    },
    region: region,
    steam_data_included: true,
    data_source: 'steam_api'
  };
};

// Steam 국가 코드를 이모지로 변환
const getCountryFromSteamLocation = (countryCode) => {
  const countryFlags = {
    'US': '🇺🇸', 'CA': '🇨🇦', 'MX': '🇲🇽',
    'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷', 'ES': '🇪🇸', 'IT': '🇮🇹',
    'CN': '🇨🇳', 'JP': '🇯🇵', 'KR': '🇰🇷', 'TW': '🇹🇼', 'SG': '🇸🇬',
    'RU': '🇷🇺', 'PL': '🇵🇱', 'SE': '🇸🇪', 'NO': '🇳🇴', 'DK': '🇩🇰'
  };
  return countryFlags[countryCode] || '🌍';
};

// 기존 더미 데이터 생성 함수 (백업용)
const generateRealPlayerData = async (region, page = 1, limit = 50) => {
  const regions = {
    'europe': ['🇩🇪', '🇬🇧', '🇫🇷', '🇪🇸', '🇮🇹', '🇵🇱', '🇷🇺', '🇸🇪', '🇳🇴', '🇩🇰'],
    'asia': ['🇰🇷', '🇯🇵', '🇨🇳', '🇹🇼', '🇹🇭', '🇻🇳', '🇸🇬', '🇲🇾', '🇵🇭', '🇮🇩'],
    'north-america': ['🇺🇸', '🇨🇦', '🇲🇽', '🇺🇸', '🇨🇦', '🇺🇸', '🇨🇦', '🇺🇸', '🇲🇽', '🇺🇸']
  };

  const heroes = ['Abrams', 'Bebop', 'Dynamo', 'Grey Talon', 'Haze', 'Infernus', 'Ivy', 'Kelvin', 'Lady Geist', 'Lash', 'McGinnis', 'Mo & Krill', 'Paradox', 'Pocket', 'Seven', 'Shiv', 'Vindicta', 'Viscous', 'Warden', 'Wraith', 'Yamato'];
  const medals = ['Eternus', 'Phantom', 'Oracle', 'Ritualist', 'Alchemist', 'Arcanist', 'Initiate'];
  
  const data = [];
  const startRank = (page - 1) * limit + 1;
  const regionFlags = regions[region] || regions['asia'];

  // 지역별 고유한 플레이어 이름 생성
  const generateRegionPlayerNames = (region, count) => {
    const regionNames = {
      'europe': ['EliteGamer_EU', 'ProPlayer_DE', 'TopSkill_UK', 'Champion_FR', 'MasterGamer_ES', 'ProShooter_IT', 'SkillMaster_PL', 'ElitePlayer_RU', 'TopGamer_SE', 'ProSkill_NO'],
      'asia': ['박근형', 'ProGamer_KR', 'SkillMaster_JP', 'ElitePlayer_CN', 'TopGamer_TW', 'Champion_TH', 'ProShooter_VN', 'MasterPlayer_SG', 'SkillGamer_MY', 'EliteSkill_PH'],
      'north-america': ['ProPlayer_US', 'EliteGamer_CA', 'TopSkill_MX', 'Champion_USA', 'MasterGamer_CAN', 'ProShooter_US', 'SkillMaster_CA', 'ElitePlayer_MX', 'TopGamer_USA', 'ProSkill_CAN']
    };
    return regionNames[region] || regionNames['asia'];
  };

  // 페이지와 지역 기반으로 고유한 Steam ID 생성
  const generateUniqueSteamId = (region, page, index) => {
    const regionCode = { 'europe': '100', 'asia': '200', 'north-america': '300' }[region] || '200';
    const pageCode = String(page).padStart(3, '0');
    const indexCode = String(index).padStart(3, '0');
    return `76561198${regionCode}${pageCode}${indexCode}`;
  };

  // 지역별 아바타 풀
  const getRegionAvatars = (region) => {
    const avatarPools = {
      'europe': [
        'https://avatars.steamstatic.com/b5bd56c1aa4644a474a2e4972be27ef9e82e517e_full.jpg',
        'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
        'https://avatars.steamstatic.com/c5d56249ee5d28a07db4ac9f7f60af961fab5426_full.jpg'
      ],
      'asia': [
        'https://avatars.steamstatic.com/fee5d0d1e4e3f654dd690c4c8b9ee508a9e4ce61_full.jpg',
        'https://avatars.steamstatic.com/b40b5206f877ce94ad8a68b51fa07e2dcb15a8c5_full.jpg',
        'https://avatars.steamstatic.com/a1b2c3d4e5f6789012345678901234567890abcd_full.jpg'
      ],
      'north-america': [
        'https://avatars.steamstatic.com/1234567890abcdef1234567890abcdef12345678_full.jpg',
        'https://avatars.steamstatic.com/abcdef1234567890abcdef1234567890abcdef12_full.jpg',
        'https://avatars.steamstatic.com/567890abcdef1234567890abcdef1234567890ab_full.jpg'
      ]
    };
    return avatarPools[region] || avatarPools['asia'];
  };

  const regionPlayerNames = generateRegionPlayerNames(region, limit);
  const regionAvatars = getRegionAvatars(region);

  try {
    // 전체 페이지 데이터 생성
    for (let i = 0; i < limit; i++) {
      const rank = startRank + i;
      const uniqueSteamId = generateUniqueSteamId(region, page, i);
      
      // 지역별 고유한 플레이어 이름 생성
      let playerName;
      if (region === 'asia' && rank === 1) {
        playerName = '박근형';
      } else {
        const nameIndex = (page - 1) * limit + i;
        playerName = regionPlayerNames[nameIndex % regionPlayerNames.length];
        if (nameIndex >= regionPlayerNames.length) {
          playerName += '_' + Math.floor(nameIndex / regionPlayerNames.length);
        }
      }

      let playerData = {
        rank: rank,
        player: {
          name: playerName,
          avatar: regionAvatars[i % regionAvatars.length],
          steamId: uniqueSteamId,
          country: regionFlags[i % regionFlags.length]
        },
        heroes: heroes.slice((i + page) % 5, ((i + page) % 5) + Math.floor(Math.random() * 3) + 1),
        medal: medals[Math.floor((rank - 1) / 7) % medals.length],
        subrank: Math.floor(Math.random() * 6) + 1,
        score: Math.floor(4500 - (rank * 5) - Math.random() * 100),
        wins: Math.floor(Math.random() * 500) + 100,
        losses: Math.floor(Math.random() * 200) + 50
      };

      // Steam API에서 실제 사용자 정보 가져오기 시도 (처음 몇 명만)
      if (steamApiKey && i < 3) {
        try {
          // 실제 Steam ID 풀에서 가져오기
          const realSteamIds = [
            '76561198123456789', '76561198234567890', '76561198345678901'
          ];
          const realSteamId = realSteamIds[i % realSteamIds.length];
          
          const userResponse = await axios.get(
            `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${realSteamId}`,
            { timeout: 3000 }
          );
          
          if (userResponse.data.response.players.length > 0) {
            const steamUser = userResponse.data.response.players[0];
            // 실제 Steam 데이터가 있어도 지역별 고유성을 위해 이름에 지역 접미사 추가
            playerData.player.name = steamUser.personaname + '_' + region.toUpperCase();
            playerData.player.avatar = steamUser.avatarfull || steamUser.avatarmedium || steamUser.avatar;
            playerData.player.steamId = realSteamId;
          }
        } catch (error) {
          console.log(`Steam API 호출 실패 for player ${i}:`, error.message);
          // 실패시 생성된 고유 데이터 사용
        }
      }

      data.push(playerData);
    }

    return {
      data: data,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(1000 / limit),
        total_count: 1000,
        per_page: limit
      },
      region: region,
      steam_data_included: steamApiKey ? true : false
    };

  } catch (error) {
    console.error('Steam API 데이터 생성 오류:', error);
    // 오류 발생시 기본 모의 데이터 반환
    return generateMockLeaderboardData(region, page, limit);
  }
};

// 백업용 모의 데이터 생성 함수
const generateMockLeaderboardData = (region, page = 1, limit = 50) => {
  const regions = {
    'europe': ['🇩🇪', '🇬🇧', '🇫🇷', '🇪🇸', '🇮🇹', '🇵🇱', '🇷🇺', '🇸🇪', '🇳🇴', '🇩🇰'],
    'asia': ['🇰🇷', '🇯🇵', '🇨🇳', '🇹🇼', '🇹🇭', '🇻🇳', '🇸🇬', '🇲🇾', '🇵🇭', '🇮🇩'],
    'north-america': ['🇺🇸', '🇨🇦', '🇲🇽', '🇺🇸', '🇨🇦', '🇺🇸', '🇨🇦', '🇺🇸', '🇲🇽', '🇺🇸']
  };

  const heroes = ['Abrams', 'Bebop', 'Dynamo', 'Grey Talon', 'Haze', 'Infernus', 'Ivy', 'Kelvin', 'Lady Geist', 'Lash', 'McGinnis', 'Mo & Krill', 'Paradox', 'Pocket', 'Seven', 'Shiv', 'Vindicta', 'Viscous', 'Warden', 'Wraith', 'Yamato'];
  const medals = ['Eternus', 'Phantom', 'Oracle', 'Ritualist', 'Alchemist', 'Arcanist', 'Initiate'];
  const avatars = [
    'https://avatars.steamstatic.com/b5bd56c1aa4644a474a2e4972be27ef9e82e517e_full.jpg',
    'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
    'https://avatars.steamstatic.com/c5d56249ee5d28a07db4ac9f7f60af961fab5426_full.jpg',
    'https://avatars.steamstatic.com/fee5d0d1e4e3f654dd690c4c8b9ee508a9e4ce61_full.jpg',
    'https://avatars.steamstatic.com/b40b5206f877ce94ad8a68b51fa07e2dcb15a8c5_full.jpg'
  ];

  const data = [];
  const startRank = (page - 1) * limit + 1;
  const regionFlags = regions[region] || regions['asia'];

  for (let i = 0; i < limit; i++) {
    const rank = startRank + i;
    const playerNames = region === 'asia' ? 
      ['박근형', 'DeadlockPro_KR', 'TopPlayer_JP', 'EliteGamer_CN', 'SkillMaster_TW', 'ProShooter_SG', 'GameChanger_TH', 'ClutchKing_VN', 'TacticalPlayer_MY', 'DeadlockGod_PH'] :
      region === 'europe' ?
      ['EliteGamer_EU', 'ProPlayer_DE', 'TopSkill_UK', 'Champion_FR', 'MasterGamer_ES', 'ProShooter_IT', 'SkillMaster_PL', 'ElitePlayer_RU', 'TopGamer_SE', 'ProSkill_NO'] :
      ['ProPlayer_US', 'EliteGamer_CA', 'TopSkill_MX', 'Champion_USA', 'MasterGamer_CAN', 'ProShooter_US', 'SkillMaster_CA', 'ElitePlayer_MX', 'TopGamer_USA', 'ProSkill_CAN'];

    // 지역과 페이지 기반 고유한 이름 생성
    let playerName;
    if (region === 'asia' && rank === 1) {
      playerName = '박근형';
    } else {
      const nameIndex = (page - 1) * limit + i;
      playerName = playerNames[nameIndex % playerNames.length];
      if (nameIndex >= playerNames.length) {
        playerName += '_' + Math.floor(nameIndex / playerNames.length);
      }
    }

    // 지역과 페이지 기반 고유한 Steam ID 생성
    const regionCode = { 'europe': '100', 'asia': '200', 'north-america': '300' }[region] || '200';
    const pageCode = String(page).padStart(3, '0');
    const indexCode = String(i).padStart(3, '0');
    const uniqueSteamId = `76561198${regionCode}${pageCode}${indexCode}`;

    data.push({
      rank: rank,
      player: {
        name: playerName,
        avatar: avatars[i % avatars.length],
        steamId: uniqueSteamId,
        country: regionFlags[i % regionFlags.length]
      },
      heroes: heroes.slice((i + page) % 5, ((i + page) % 5) + Math.floor(Math.random() * 3) + 1),
      medal: medals[Math.floor((rank - 1) / 7) % medals.length],
      subrank: Math.floor(Math.random() * 6) + 1,
      score: Math.floor(4500 - (rank * 5) - Math.random() * 100),
      wins: Math.floor(Math.random() * 500) + 100,
      losses: Math.floor(Math.random() * 200) + 50
    });
  }

  return {
    data: data,
    pagination: {
      current_page: page,
      total_pages: Math.ceil(1000 / limit),
      total_count: 1000,
      per_page: limit
    },
    region: region,
    steam_data_included: false
  };
};

// API Routes
app.get('/api/v1/auth/login/ko', (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      user: {
        steamId: req.user.steamId,
        accountId: req.user.accountId,
        username: req.user.username,
        avatar: req.user.avatar
      }
    });
  } else {
    res.json({
      success: false,
      message: 'Not authenticated'
    });
  }
});

// Leaderboard API endpoint
app.get('/api/v1/leaderboards/:region', async (req, res) => {
  try {
    const { region } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const hero = req.query.hero || 'all';
    const medal = req.query.medal || 'all';

    if (!['europe', 'asia', 'north-america', 'south-america', 'oceania'].includes(region)) {
      return res.status(400).json({ error: 'Invalid region' });
    }

    console.log(`📊 리더보드 요청: ${region}, 페이지 ${page}, Steam API: ${steamApiKey ? '활성화' : '비활성화'}`);

    // 1단계: 실제 데드락 API 시도
    const realDeadlockData = await fetchDeadlockLeaderboard(region, page, limit);
    if (realDeadlockData) {
      console.log('✅ 실제 데드락 API 데이터 사용');
      return res.json(realDeadlockData);
    }

    // 2단계: 백업 데이터 생성 (더미 데이터)
    console.log('⚠️ 실제 API 없음 - 백업 데이터 사용');
    let leaderboardData = await generateRealPlayerData(region, page, limit);

    // Apply filters
    if (hero !== 'all') {
      leaderboardData.data = leaderboardData.data.filter(player => 
        player.heroes.some(h => h.toLowerCase().replace(/[^a-z]/g, '') === hero.toLowerCase().replace(/[^a-z]/g, ''))
      );
    }

    if (medal !== 'all') {
      leaderboardData.data = leaderboardData.data.filter(player => 
        player.medal.toLowerCase() === medal.toLowerCase()
      );
    }

    console.log(`✅ 리더보드 데이터 생성 완료: ${leaderboardData.data.length}명, Steam 데이터: ${leaderboardData.steam_data_included}`);

    res.json(leaderboardData);
  } catch (error) {
    console.error('Leaderboard API error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard data' });
  }
});

// 플레이어 상세 정보 API - 실제 리더보드 데이터 기반 (캐싱 적용)
app.get('/api/v1/players/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;
    const cacheKey = `player-${accountId}`;
    
    // 캐시 확인
    const cached = getCachedData(cacheKey);
    if (cached) {
      console.log(`💾 캐시된 플레이어 데이터 사용: ${accountId}`);
      return res.json(cached);
    }
    
    console.log(`🔍 플레이어 상세 정보 요청: ${accountId}`);
    
    // 모든 지역에서 플레이어 찾기
    let foundPlayer = null;
    let foundRegion = null;
    
    const regions = ['asia', 'europe', 'north-america', 'south-america', 'oceania'];
    
    for (const region of regions) {
      console.log(`🔍 ${region} 지역에서 플레이어 검색 중...`);
      const leaderboardData = await fetchDeadlockLeaderboard(region, 1, 200); // 상위 200명까지 검색
      
      if (leaderboardData && leaderboardData.data) {
        // Account ID로 플레이어 찾기
        foundPlayer = leaderboardData.data.find(player => 
          player.player.accountId == accountId || 
          player.player.steamId == accountId ||
          player.rank == accountId
        );
        
        if (foundPlayer) {
          foundRegion = region;
          console.log(`✅ ${region} 지역에서 플레이어 발견: ${foundPlayer.player.name}`);
          break;
        }
      }
    }
    
    if (!foundPlayer) {
      console.log(`❌ 리더보드에서 플레이어를 찾을 수 없음: ${accountId}`);
      console.log(`🔄 Steam API 기반 기본 프로필 생성 시도...`);
      
      // 리더보드에서 찾지 못한 경우 Steam API 기반 기본 프로필 생성
      const steamId = convertToSteamId64(accountId);
      
      let defaultPlayerInfo = {
        accountId: accountId,
        steamId: steamId,
        name: `Player_${accountId}`,
        avatar: 'https://avatars.cloudflare.steamstatic.com/b5bd56c1aa4644a474a2e4972be27ef9e82e517e_full.jpg',
        country: '🌍',
        countryCode: null,
        region: 'unknown',
        leaderboardRank: null,
        stats: {
          matches: Math.floor(Math.random() * 200) + 50,
          winRate: Math.floor(Math.random() * 30) + 45, // 45-75% (일반 플레이어)
          laneWinRate: Math.floor(Math.random() * 30) + 50,
          kda: (Math.random() * 3 + 1.5).toFixed(1), // 1.5-4.5 (일반 플레이어)
          headshotPercent: Math.floor(Math.random() * 20) + 15,
          soulsPerMin: Math.floor(Math.random() * 150) + 350,
          damagePerMin: Math.floor(Math.random() * 800) + 2200,
          healingPerMin: Math.floor(Math.random() * 300) + 200
        },
        rank: {
          medal: 'Arcanist', // 기본 랭크
          subrank: Math.floor(Math.random() * 6) + 1,
          score: Math.floor(Math.random() * 1000) + 2000
        },
        heroes: [
          { name: 'Abrams', matches: Math.floor(Math.random() * 30) + 10, winRate: Math.floor(Math.random() * 30) + 45 },
          { name: 'Bebop', matches: Math.floor(Math.random() * 25) + 8, winRate: Math.floor(Math.random() * 30) + 45 },
          { name: 'Haze', matches: Math.floor(Math.random() * 20) + 5, winRate: Math.floor(Math.random() * 30) + 45 }
        ],
        recentMatches: generateRecentMatches(['Abrams', 'Bebop', 'Haze'])
      };

      // 전체 매치 분석 시도
      console.log(`🔍 실제 매치 데이터 분석 시작: ${accountId}`);
      const matchAnalysis = await fetchAndAnalyzeAllMatches(accountId);
      
      if (matchAnalysis) {
        // 실제 매치 데이터가 있는 경우 정확한 통계 사용
        defaultPlayerInfo.stats = {
          matches: matchAnalysis.totalMatches,
          winRate: parseFloat(matchAnalysis.winRate),
          laneWinRate: Math.floor(Math.random() * 30) + 50, // 라인 승률은 별도 API 필요
          kda: parseFloat(matchAnalysis.averageKDA.ratio),
          headshotPercent: Math.floor(Math.random() * 20) + 15, // 헤드샷은 별도 API 필요
          soulsPerMin: matchAnalysis.avgSoulsPerMin,
          damagePerMin: matchAnalysis.avgDamagePerMin,
          healingPerMin: Math.floor(Math.random() * 300) + 200 // 힐링은 별도 API 필요
        };
        defaultPlayerInfo.heroes = matchAnalysis.topHeroes;
        defaultPlayerInfo.recentMatches = matchAnalysis.recentMatches;
        defaultPlayerInfo.averageKDA = matchAnalysis.averageKDA;
        
        console.log(`✅ 실제 매치 데이터 적용: ${matchAnalysis.totalMatches}경기, 승률 ${matchAnalysis.winRate}%`);
      }

      // Steam API로 실제 정보 가져오기 시도
      if (steamApiKey && steamId && isValidSteamId64(steamId)) {
        try {
          const steamResponse = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/`, {
            params: {
              key: steamApiKey,
              steamids: steamId
            },
            timeout: 5000
          });

          if (steamResponse.data && steamResponse.data.response && steamResponse.data.response.players && steamResponse.data.response.players.length > 0) {
            const steamUser = steamResponse.data.response.players[0];
            
            defaultPlayerInfo.name = steamUser.personaname || defaultPlayerInfo.name;
            if (steamUser.avatarfull) {
              defaultPlayerInfo.avatar = steamUser.avatarfull.replace('avatars.steamstatic.com', 'avatars.cloudflare.steamstatic.com');
            }
            if (steamUser.loccountrycode) {
              defaultPlayerInfo.country = getCountryFlag(steamUser.loccountrycode);
              defaultPlayerInfo.countryCode = steamUser.loccountrycode;
            }
            
            console.log(`✅ Steam API 기반 프로필 정보 업데이트: ${defaultPlayerInfo.name}`);
          }
        } catch (error) {
          console.log(`❌ Steam API 호출 실패:`, error.message);
        }
      }
      
      setCachedData(cacheKey, defaultPlayerInfo, CACHE_TTL);
      return res.json(defaultPlayerInfo);
    }

    // 실제 리더보드 데이터 기반으로 플레이어 정보 구성
    let playerInfo = {
      accountId: foundPlayer.player.accountId || accountId,
      steamId: foundPlayer.player.steamId,
      name: foundPlayer.player.name,
      avatar: foundPlayer.player.avatar,
      country: foundPlayer.player.country,
      countryCode: foundPlayer.player.countryCode || null,
      region: foundRegion,
      leaderboardRank: foundPlayer.rank,
      stats: {
        matches: generateRealisticMatches(foundPlayer.rank, foundPlayer.medal),
        winRate: generateRealisticWinRate(foundPlayer.rank, foundPlayer.medal),
        laneWinRate: generateRealisticLaneWinRate(foundPlayer.rank, foundPlayer.medal),
        kda: generateRealisticKDA(foundPlayer.rank, foundPlayer.medal),
        headshotPercent: generateRealisticHeadshot(foundPlayer.rank, foundPlayer.medal),
        soulsPerMin: generateRealisticSouls(foundPlayer.rank, foundPlayer.medal),
        damagePerMin: generateRealisticDamage(foundPlayer.rank, foundPlayer.medal),
        healingPerMin: generateRealisticHealing(foundPlayer.rank, foundPlayer.medal)
      },
      rank: {
        medal: foundPlayer.medal,
        subrank: foundPlayer.subrank,
        score: foundPlayer.score
      },
      heroes: foundPlayer.heroes ? foundPlayer.heroes.map(heroName => ({
        name: heroName,
        matches: Math.floor(Math.random() * 50) + 10,
        winRate: Math.floor(Math.random() * 40) + 50
      })) : [
        { name: 'Abrams', matches: Math.floor(Math.random() * 50) + 10, winRate: Math.floor(Math.random() * 40) + 50 },
        { name: 'Bebop', matches: Math.floor(Math.random() * 30) + 5, winRate: Math.floor(Math.random() * 40) + 50 },
        { name: 'Haze', matches: Math.floor(Math.random() * 25) + 5, winRate: Math.floor(Math.random() * 40) + 50 }
      ],
      recentMatches: generateRecentMatches(foundPlayer.heroes)
    };

    // 리더보드에서 찾은 플레이어도 실제 매치 데이터로 분석
    console.log(`🔍 리더보드 플레이어 ${playerInfo.name}의 실제 매치 데이터 분석 시작...`);
    const matchAnalysis = await fetchAndAnalyzeAllMatches(accountId);
    
    if (matchAnalysis) {
      // 실제 매치 데이터가 있는 경우 정확한 통계로 대체
      playerInfo.stats = {
        matches: matchAnalysis.totalMatches,
        winRate: parseFloat(matchAnalysis.winRate),
        laneWinRate: playerInfo.stats.laneWinRate, // 기존값 유지 (별도 API 필요)
        kda: parseFloat(matchAnalysis.averageKDA.ratio),
        headshotPercent: playerInfo.stats.headshotPercent, // 기존값 유지 (별도 API 필요)
        soulsPerMin: matchAnalysis.avgSoulsPerMin,
        damagePerMin: matchAnalysis.avgDamagePerMin,
        healingPerMin: playerInfo.stats.healingPerMin // 기존값 유지 (별도 API 필요)
      };
      playerInfo.heroes = matchAnalysis.topHeroes;
      playerInfo.recentMatches = matchAnalysis.recentMatches;
      playerInfo.averageKDA = matchAnalysis.averageKDA;
      
      console.log(`✅ 리더보드 플레이어 실제 매치 데이터 적용: ${matchAnalysis.totalMatches}경기, 승률 ${matchAnalysis.winRate}%`);
    }

    console.log(`✅ 플레이어 정보 생성 완료: ${playerInfo.name} (${foundRegion}, 순위: ${foundPlayer.rank})`);
    setCachedData(cacheKey, playerInfo, CACHE_TTL);
    res.json(playerInfo);
    
  } catch (error) {
    console.error('Player detail API error:', error);
    res.status(500).json({ error: 'Failed to fetch player details' });
  }
});

// 간단한 메모리 캐시
const memoryCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5분

function getCachedData(key) {
  const cached = memoryCache.get(key);
  if (cached && Date.now() < cached.expires) {
    return cached.data;
  }
  return null;
}

function setCachedData(key, data, ttl = CACHE_TTL) {
  memoryCache.set(key, {
    data: data,
    expires: Date.now() + ttl
  });
}

// 빠른 영웅 스탯 생성 함수
function generateFastHeroStats(accountId) {
  const heroNames = ['Abrams', 'Bebop', 'Dynamo', 'Haze', 'Infernus', 'Ivy', 'Kelvin', 'Lash'];
  const seed = parseInt(accountId) || 12345;
  
  // 시드 기반 랜덤으로 일관된 결과 보장
  function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }
  
  const heroCount = 5 + (seed % 4); // 5-8개 영웅
  const selectedHeroes = heroNames.slice(0, heroCount);
  
  return selectedHeroes.map((heroName, index) => {
    const heroSeed = seed + index * 1000;
    const matches = 15 + Math.floor(seededRandom(heroSeed) * 35); // 15-50
    const winRate = 45 + Math.floor(seededRandom(heroSeed + 1) * 40); // 45-85%
    const wins = Math.floor(matches * winRate / 100);
    
    return {
      hero: heroName,
      name: heroName,
      matches: matches,
      wins: wins,
      losses: matches - wins,
      winRate: winRate,
      avgKills: (seededRandom(heroSeed + 2) * 6 + 3).toFixed(1),
      avgDeaths: (seededRandom(heroSeed + 3) * 4 + 2).toFixed(1),
      avgAssists: (seededRandom(heroSeed + 4) * 10 + 8).toFixed(1),
      avgKda: (seededRandom(heroSeed + 5) * 2.5 + 1.5).toFixed(1),
      avgSouls: Math.floor(seededRandom(heroSeed + 6) * 150 + 350),
      avgDamage: Math.floor(seededRandom(heroSeed + 7) * 800 + 2200),
      avgHealing: Math.floor(seededRandom(heroSeed + 8) * 400 + 200)
    };
  }).sort((a, b) => b.matches - a.matches);
}

// 영웅 ID를 이름으로 변환하는 맵핑
const heroIdMap = {
  1: 'Abrams', 2: 'Bebop', 4: 'Grey Talon', 6: 'Infernus', 7: 'Ivy', 
  8: 'Kelvin', 10: 'Lash', 11: 'McGinnis', 13: 'Paradox', 
  14: 'Pocket', 15: 'Seven', 16: 'Calico', 18: 'Viscous', 19: 'Shiv', 
  20: 'Shiv', 25: 'Vindicta', 27: 'Dynamo', 31: 'Lash', 35: 'Wraith', 
  50: 'Vindicta', 52: 'Shiv', 58: 'Vyper', 60: 'Yamato'
};

// 영웅별 스탯 API - 실제 API 데이터 변환
app.get('/api/v1/players/:accountId/hero-stats', async (req, res) => {
  try {
    const { accountId } = req.params;
    const cacheKey = `hero-stats-${accountId}`;
    
    // 캐시 확인
    const cached = getCachedData(cacheKey);
    if (cached) {
      return res.json(cached);
    }
    
    // 실제 API 호출 시도
    try {
      const response = await axios.get(`https://api.deadlock-api.com/v1/players/${accountId}/hero-stats`, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (response.data && Array.isArray(response.data)) {
        // 실제 API 데이터를 프론트엔드 형식으로 변환
        const heroStats = response.data
          .filter(hero => hero.matches_played > 0) // 플레이한 영웅만
          .map(hero => {
            const heroName = heroIdMap[hero.hero_id] || `Hero ${hero.hero_id}`;
            const winRate = hero.matches_played > 0 ? Math.round((hero.wins / hero.matches_played) * 100) : 0;
            const avgKda = hero.deaths_per_min > 0 ? 
              ((hero.kills_per_min + hero.assists_per_min) / hero.deaths_per_min).toFixed(1) : 
              (hero.kills_per_min + hero.assists_per_min).toFixed(1);
            
            return {
              hero: heroName,
              name: heroName,
              matches: hero.matches_played,
              wins: hero.wins,
              winRate: winRate,
              avgKills: (hero.kills_per_min * (hero.time_played / 60000)).toFixed(1),
              avgDeaths: (hero.deaths_per_min * (hero.time_played / 60000)).toFixed(1),
              avgAssists: (hero.assists_per_min * (hero.time_played / 60000)).toFixed(1),
              avgKda: avgKda,
              avgSouls: Math.round(hero.networth_per_min || 0),
              avgDamage: Math.round(hero.damage_per_min || 0),
              avgHealing: Math.round(hero.damage_mitigated_per_min || 0)
            };
          })
          .sort((a, b) => b.matches - a.matches) // 많이 플레이한 순으로 정렬
          .slice(0, 10); // 상위 10개만
        
        console.log(`✅ 실제 영웅 스탯 API 변환 완료: ${heroStats.length}개 영웅`);
        setCachedData(cacheKey, heroStats);
        return res.json(heroStats);
      }
    } catch (error) {
      console.log(`❌ 실제 영웅 스탯 API 실패: ${error.message}`);
    }
    
    // 백업: 빠른 더미 영웅 스탯 생성
    const heroStats = generateFastHeroStats(accountId);
    setCachedData(cacheKey, heroStats);
    
    console.log(`✅ 백업 영웅 스탯 생성: ${heroStats.length}개 영웅`);
    res.json(heroStats);
    
  } catch (error) {
    console.error('Hero stats API error:', error);
    res.status(500).json({ error: 'Failed to fetch hero stats' });
  }
});

// 빠른 매치 히스토리 생성 함수
function generateFastMatchHistory(accountId, limit = 10) {
  // 더미 데이터 생성 비활성화 - 항상 빈 배열 반환
  console.log('⚠️ generateFastMatchHistory 호출됨 - 빈 배열 반환');
  return [];
}

// 전체 매치 데이터 분석 함수 - 정확한 통계 계산
const fetchAndAnalyzeAllMatches = async (accountId) => {
  try {
    console.log(`🔍 플레이어 ${accountId} 전체 매치 분석 시작...`);
    
    // 실제 Deadlock API에서 전체 매치 히스토리 가져오기
    const response = await axios.get(`https://api.deadlock-api.com/v1/players/${accountId}/match-history`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.data || !Array.isArray(response.data)) {
      console.log(`❌ 매치 데이터 없음: ${accountId}`);
      return null;
    }

    const matches = response.data;
    console.log(`📊 총 ${matches.length}경기 데이터 분석 중...`);

    // 통계 계산
    let totalMatches = matches.length;
    let wins = 0;
    let totalKills = 0;
    let totalDeaths = 0;
    let totalAssists = 0;
    let totalSouls = 0;
    let totalDamage = 0;
    let heroStats = {};

    matches.forEach(match => {
      // 승리 카운트
      if (match.win_loss === true || match.win_loss === 'win') {
        wins++;
      }
      
      // KDA 누적
      totalKills += match.kills || 0;
      totalDeaths += match.deaths || 0;
      totalAssists += match.assists || 0;
      
      // 소울 및 데미지 누적
      totalSouls += match.net_worth || 0;
      totalDamage += match.player_damage || 0;
      
      // 영웅별 통계
      const heroId = match.hero_id;
      const heroName = getHeroNameById(heroId);
      
      if (!heroStats[heroName]) {
        heroStats[heroName] = {
          matches: 0,
          wins: 0,
          kills: 0,
          deaths: 0,
          assists: 0
        };
      }
      
      heroStats[heroName].matches++;
      if (match.win_loss === true || match.win_loss === 'win') {
        heroStats[heroName].wins++;
      }
      heroStats[heroName].kills += match.kills || 0;
      heroStats[heroName].deaths += match.deaths || 0;
      heroStats[heroName].assists += match.assists || 0;
    });

    // 통계 계산
    const winRate = totalMatches > 0 ? ((wins / totalMatches) * 100).toFixed(1) : 0;
    const avgKills = totalMatches > 0 ? (totalKills / totalMatches).toFixed(1) : 0;
    const avgDeaths = totalMatches > 0 ? (totalDeaths / totalMatches).toFixed(1) : 0;
    const avgAssists = totalMatches > 0 ? (totalAssists / totalMatches).toFixed(1) : 0;
    const kdaRatio = totalDeaths > 0 ? ((totalKills + totalAssists) / totalDeaths).toFixed(2) : (totalKills + totalAssists).toFixed(2);
    const avgSoulsPerMin = totalMatches > 0 ? Math.round(totalSouls / totalMatches) : 0;
    const avgDamagePerMin = totalMatches > 0 ? Math.round(totalDamage / totalMatches) : 0;

    // 상위 영웅 순서대로 정렬
    const sortedHeroes = Object.entries(heroStats)
      .map(([hero, stats]) => ({
        name: hero,
        matches: stats.matches,
        winRate: stats.matches > 0 ? ((stats.wins / stats.matches) * 100).toFixed(1) : 0,
        avgKills: stats.matches > 0 ? (stats.kills / stats.matches).toFixed(1) : 0,
        avgDeaths: stats.matches > 0 ? (stats.deaths / stats.matches).toFixed(1) : 0,
        avgAssists: stats.matches > 0 ? (stats.assists / stats.matches).toFixed(1) : 0
      }))
      .sort((a, b) => b.matches - a.matches);

    const analysis = {
      totalMatches,
      wins,
      winRate,
      averageKDA: {
        kills: avgKills,
        deaths: avgDeaths,
        assists: avgAssists,
        ratio: kdaRatio
      },
      avgSoulsPerMin,
      avgDamagePerMin,
      topHeroes: sortedHeroes.slice(0, 10),
      recentMatches: matches.slice(0, 10).map(match => ({
        matchId: match.match_id || match.id,
        hero: getHeroNameById(match.hero_id),
        result: (match.win_loss === true || match.win_loss === 'win') ? '승리' : '패배',
        duration: match.duration || 0,
        kills: match.kills || 0,
        deaths: match.deaths || 0,
        assists: match.assists || 0,
        souls: match.net_worth || 0,
        damage: match.player_damage || 0,
        kda: match.deaths > 0 ? ((match.kills + match.assists) / match.deaths).toFixed(1) : (match.kills + match.assists).toFixed(1),
        playedAt: match.start_time || new Date().toISOString()
      }))
    };

    console.log(`✅ 분석 완료: ${totalMatches}경기, 승률 ${winRate}%, 주력 영웅: ${sortedHeroes.slice(0, 3).map(h => `${h.name}(${h.matches}경기)`).join(', ')}`);
    return analysis;
    
  } catch (error) {
    console.error(`❌ 매치 분석 실패 (${accountId}):`, error.message);
    return null;
  }
};

// 영웅 ID를 이름으로 변환하는 함수
const getHeroNameById = (heroId) => {
  const heroMap = {
    1: 'Abrams', 2: 'Bebop', 4: 'Grey Talon', 6: 'Infernus', 7: 'Ivy', 
    8: 'Kelvin', 10: 'Lash', 11: 'McGinnis', 13: 'Paradox', 
    14: 'Pocket', 15: 'Seven', 16: 'Calico', 18: 'Viscous', 19: 'Shiv', 
    20: 'Shiv', 25: 'Vindicta', 27: 'Dynamo', 31: 'Lash', 35: 'Wraith', 
    50: 'Vindicta', 52: 'Shiv', 58: 'Vyper', 60: 'Yamato'
  };
  return heroMap[heroId] || `Hero_${heroId}`;
};

// 매치 히스토리 API - 실제 API 데이터 변환
app.get('/api/v1/players/:accountId/match-history', async (req, res) => {
  try {
    const { accountId } = req.params;
    const limit = Math.min(parseInt(req.query.limit) || 10, 20); // 최대 20개로 제한
    const cacheKey = `match-history-${accountId}-${limit}`;
    
    // 강제 새로고침을 위해 캐시 건너뛰기 (임시)
    const forceRefresh = req.query.refresh === 'true';
    
    // 캐시 확인 (강제 새로고침이 아닌 경우에만)
    if (!forceRefresh) {
      const cached = getCachedData(cacheKey);
      if (cached) {
        console.log(`📦 캐시된 매치 히스토리 반환: ${cached.length}개`);
        return res.json(cached);
      }
    }
    
    // 실제 API 호출 시도
    try {
      console.log(`🌐 API 호출 시작: https://api.deadlock-api.com/v1/players/${accountId}/match-history`);
      const response = await axios.get(`https://api.deadlock-api.com/v1/players/${accountId}/match-history`, {
        timeout: 10000, // 타임아웃 증가
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      console.log(`📡 API 응답 상태: ${response.status}, 데이터 타입: ${typeof response.data}, 배열 여부: ${Array.isArray(response.data)}, 길이: ${response.data?.length}`);
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        // match_id 기준으로 내림차순 정렬 (높은 번호 = 최신 매치)
        const sortedMatches = response.data.sort((a, b) => (b.match_id || 0) - (a.match_id || 0));
        console.log(`🎯 최신 매치 ID: ${sortedMatches[0]?.match_id}`);
        console.log(`🎯 가장 오래된 매치 ID: ${sortedMatches[sortedMatches.length - 1]?.match_id}`);
        console.log(`📊 전체 매치 수: ${response.data.length}, 상위 ${limit}개 선택`);
        
        // 실제 API 데이터를 프론트엔드 형식으로 변환
        const matches = sortedMatches
          .slice(0, limit) // 요청된 수만큼만
          .map(match => {
            const heroName = heroIdMap[match.hero_id] || `Hero ${match.hero_id}`;
            const isWin = match.match_result === 1;
            const durationSeconds = match.match_duration_s || 0;
            const durationFormatted = `${Math.floor(durationSeconds / 60)}:${(durationSeconds % 60).toString().padStart(2, '0')}`;
            
            // KDA 계산
            const kills = match.player_kills || 0;
            const deaths = match.player_deaths || 0;
            const assists = match.player_assists || 0;
            const kda = deaths > 0 ? ((kills + assists) / deaths).toFixed(1) : (kills + assists).toFixed(1);
            
            // 시간 계산 (Unix timestamp -> ISO string)
            const playedAt = match.start_time ? 
              new Date(match.start_time * 1000).toISOString() : 
              new Date().toISOString();
            
            return {
              matchId: match.match_id,
              hero: heroName,
              result: isWin ? '승리' : '패배',
              duration: durationSeconds,
              durationFormatted: durationFormatted,
              kills: kills,
              deaths: deaths,
              assists: assists,
              souls: match.net_worth || 0,
              damage: Math.round((match.net_worth || 0) * 0.8), // 추정치
              healing: Math.round((match.net_worth || 0) * 0.1), // 추정치
              kda: kda,
              playedAt: playedAt,
              heroLevel: match.hero_level || 1,
              lastHits: match.last_hits || 0,
              denies: match.denies || 0
            };
          });
        
        console.log(`✅ 실제 매치 히스토리 API 변환 완료: ${matches.length}개 매치`);
        console.log(`🎮 첫 번째 매치: ID ${matches[0]?.matchId} - ${matches[0]?.hero} - ${matches[0]?.result}`);
        console.log(`🎮 마지막 매치: ID ${matches[matches.length - 1]?.matchId} - ${matches[matches.length - 1]?.hero} - ${matches[matches.length - 1]?.result}`);
        setCachedData(cacheKey, matches);
        return res.json(matches);
      }
    } catch (error) {
      console.log(`❌ 실제 매치 히스토리 API 실패: ${error.message}`);
      // API 실패 시 빈 배열 반환 (더미 데이터 대신)
      console.log(`⚠️ API 호출 실패로 빈 매치 히스토리 반환`);
      setCachedData(cacheKey, []);
      return res.json([]);
    }
    
    // 여기에 도달하면 API는 성공했지만 데이터가 없거나 형식이 잘못된 경우
    console.log(`⚠️ API 성공했지만 유효한 데이터 없음 - 빈 배열 반환`);
    setCachedData(cacheKey, []);
    res.json([]);
    
  } catch (error) {
    console.error('Match history API error:', error);
    res.status(500).json({ error: 'Failed to fetch match history' });
  }
});

// 랭크 기반 현실적인 통계 생성 함수들
const getMedalScore = (medal) => {
  const medalScores = {
    'Eternus': 11, 'Phantom': 10, 'Oracle': 9, 'Ritualist': 8,
    'Alchemist': 7, 'Arcanist': 6, 'Initiate': 5
  };
  return medalScores[medal] || 5;
};

const generateRealisticMatches = (rank, medal) => {
  const medalScore = getMedalScore(medal);
  // 높은 랭크일수록 더 많은 게임 수 (100-800게임)
  const baseMatches = Math.max(100, Math.min(800, 100 + (medalScore * 60) + (Math.random() * 200)));
  return Math.floor(baseMatches);
};

const generateRealisticWinRate = (rank, medal) => {
  const medalScore = getMedalScore(medal);
  // 랭크가 높을수록 높은 승률 (50-95%)
  let baseWinRate = 50 + (medalScore * 4) + (Math.random() * 10);
  
  // 상위 10등 이내는 보너스
  if (rank <= 10) baseWinRate += 10;
  else if (rank <= 50) baseWinRate += 5;
  
  return Math.min(95, Math.max(50, Math.floor(baseWinRate)));
};

const generateRealisticLaneWinRate = (rank, medal) => {
  const winRate = generateRealisticWinRate(rank, medal);
  // 라인 승률은 전체 승률보다 약간 높음
  return Math.min(98, winRate + Math.floor(Math.random() * 8));
};

const generateRealisticKDA = (rank, medal) => {
  const medalScore = getMedalScore(medal);
  // 높은 랭크일수록 높은 KDA (1.5-12.0)
  const baseKDA = 1.5 + (medalScore * 0.8) + (Math.random() * 2);
  
  // 상위 10등 이내는 보너스
  if (rank <= 10) return (baseKDA + 2).toFixed(1);
  else if (rank <= 50) return (baseKDA + 1).toFixed(1);
  
  return baseKDA.toFixed(1);
};

const generateRealisticHeadshot = (rank, medal) => {
  const medalScore = getMedalScore(medal);
  // 높은 랭크일수록 높은 헤드샷 (10-40%)
  const baseHeadshot = 10 + (medalScore * 2) + (Math.random() * 8);
  return Math.min(40, Math.max(10, Math.floor(baseHeadshot)));
};

const generateRealisticSouls = (rank, medal) => {
  const medalScore = getMedalScore(medal);
  // 높은 랭크일수록 높은 소울/분 (400-800)
  const baseSouls = 400 + (medalScore * 30) + (Math.random() * 100);
  return Math.floor(baseSouls);
};

const generateRealisticDamage = (rank, medal) => {
  const medalScore = getMedalScore(medal);
  // 높은 랭크일수록 높은 데미지/분 (2500-6000)
  const baseDamage = 2500 + (medalScore * 200) + (Math.random() * 800);
  return Math.floor(baseDamage);
};

const generateRealisticHealing = (rank, medal) => {
  const medalScore = getMedalScore(medal);
  // 높은 랭크일수록 높은 힐링/분 (200-1000)
  const baseHealing = 200 + (medalScore * 50) + (Math.random() * 200);
  return Math.floor(baseHealing);
};

// 플레이어 최근 매치 생성 (실제 영웅 기반)
const generateRecentMatches = (playerHeroes) => {
  // 플레이어가 플레이하는 영웅들을 우선적으로 사용, 없으면 기본 영웅
  const heroes = playerHeroes && playerHeroes.length > 0 ? 
    playerHeroes : 
    ['Abrams', 'Bebop', 'Haze', 'Infernus', 'Ivy', 'Dynamo'];
  
  const results = ['승리', '패배'];
  
  const matches = [];
  for (let i = 0; i < 10; i++) {
    // 플레이어의 영웅을 더 자주 선택 (80% 확률)
    const usePlayerHero = Math.random() < 0.8 && playerHeroes && playerHeroes.length > 0;
    const selectedHero = usePlayerHero ? 
      playerHeroes[Math.floor(Math.random() * playerHeroes.length)] :
      heroes[Math.floor(Math.random() * heroes.length)];
    
    // 최근일수록 더 좋은 성과를 보이도록 조정
    const recentBonus = Math.max(0, (10 - i) * 0.05); // 최근 매치일수록 승률 보너스
    const winChance = 0.5 + recentBonus;
    
    matches.push({
      id: Date.now() - (i * 3600000), // 1시간씩 빼기
      result: Math.random() < winChance ? '승리' : '패배',
      hero: selectedHero,
      kills: Math.floor(Math.random() * 15) + 5, // 5-20 킬
      deaths: Math.floor(Math.random() * 8) + 2, // 2-10 데스
      assists: Math.floor(Math.random() * 20) + 5, // 5-25 어시스트
      damage: Math.floor(Math.random() * 40000) + 25000, // 25k-65k 데미지
      healing: Math.floor(Math.random() * 8000) + 2000, // 2k-10k 힐링
      duration: Math.floor(Math.random() * 20) + 25, // 25-45분
      teamRank: Math.floor(Math.random() * 6) + 1, // 1-6등
      timestamp: new Date(Date.now() - (i * 3600000)).toISOString()
    });
  }
  
  return matches;
};

app.get('/api/player/:steamId/stats', async (req, res) => {
  try {
    const { steamId } = req.params;
    const stats = await steamAPI.getPlayerStats(steamId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch player stats' });
  }
});

app.get('/api/player/:steamId/recent', async (req, res) => {
  try {
    const { steamId } = req.params;
    const recentGames = await steamAPI.getRecentGames(steamId);
    res.json(recentGames);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent games' });
  }
});

// Steam ID 검색 API
app.get('/api/v1/players/steam-search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query required' });
    }

    console.log(`🔍 Steam 검색 요청: ${query}`);

    // Steam ID 64 형태인지 확인
    if (query.startsWith('76561198') && query.length === 17) {
      // Steam ID 64를 Account ID로 변환
      const accountId = (BigInt(query) - BigInt('76561197960265728')).toString();
      console.log(`✅ Steam ID 변환: ${query} → ${accountId}`);
      
      // 변환된 Account ID로 플레이어 정보 가져오기
      try {
        const playerResponse = await axios.get(`http://localhost:${PORT}/api/v1/players/${accountId}`);
        return res.json({
          found: true,
          player: playerResponse.data,
          searchMethod: 'steam_id_conversion'
        });
      } catch (error) {
        console.log(`❌ 변환된 Account ID로 플레이어 찾기 실패: ${accountId}`);
      }
    }

    // Deadlock API steam-search 시도
    try {
      const response = await axios.get(`https://api.deadlock-api.com/v1/players/steam-search`, {
        params: { query },
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.data && response.data.length > 0) {
        const foundPlayer = response.data[0];
        console.log(`✅ Steam 검색 성공: ${foundPlayer.personaname || foundPlayer.name}`);
        
        return res.json({
          found: true,
          player: {
            accountId: foundPlayer.account_id,
            steamId: foundPlayer.steam_id,
            name: foundPlayer.personaname || foundPlayer.name,
            avatar: foundPlayer.avatar
          },
          searchMethod: 'deadlock_api_search'
        });
      }
    } catch (error) {
      console.log(`❌ Deadlock API Steam 검색 실패:`, error.message);
    }

    // 검색 결과 없음
    res.json({
      found: false,
      message: 'Player not found',
      suggestions: [
        'Steam ID 64 형태로 검색해보세요 (76561198으로 시작하는 17자리)',
        'Player ID나 이름으로 검색해보세요'
      ]
    });

  } catch (error) {
    console.error('Steam search API error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// 플레이어 상세 페이지 라우트
app.get('/ko/players/:accountId', (req, res) => {
  const { accountId } = req.params;
  res.render('player-detail', { 
    user: req.user,
    accountId: accountId,
    title: `플레이어 정보 - 박근형의 데드락`
  });
});

// 플레이어 검색 페이지 라우트
app.get('/ko/search', (req, res) => {
  res.render('player-search', {
    user: req.user,
    title: '플레이어 검색 - 박근형의 데드락'
  });
});

// 개인 프로필 페이지 라우트 (로그인 필요)
app.get('/ko/profile', (req, res) => {
  if (!req.user) {
    return res.redirect('/auth/steam');
  }
  
  // Steam ID를 32-bit account ID로 변환
  let accountId = null;
  
  console.log(`🔍 프로필 요청 사용자 정보:`, {
    steamId: req.user.steamId,
    accountId: req.user.accountId,
    username: req.user.username
  });
  
  if (req.user.steamId && req.user.steamId !== 'undefined') {
    try {
      // Steam ID를 Account ID로 변환
      const steamIdBig = BigInt(req.user.steamId);
      const baseSteamId = BigInt('76561197960265728');
      const convertedAccountId = (steamIdBig - baseSteamId).toString();
      
      // 변환된 값이 유효한지 확인
      if (convertedAccountId && convertedAccountId !== '0' && !convertedAccountId.includes('-')) {
        accountId = convertedAccountId;
        console.log(`✅ Steam ID 변환 성공: ${req.user.steamId} → ${accountId}`);
      } else {
        console.log(`⚠️ 변환된 Account ID가 유효하지 않음: ${convertedAccountId}`);
        accountId = req.user.steamId; // fallback
      }
    } catch (error) {
      console.error('❌ Steam ID 변환 오류:', error);
      accountId = req.user.steamId; // fallback
    }
  } else {
    accountId = req.user.accountId || req.user.steamId || '12345678'; // 최종 fallback
  }
  
  // accountId가 여전히 null이면 기본값 사용
  if (!accountId || accountId === 'undefined' || accountId === 'null') {
    console.log(`⚠️ Account ID가 없어서 기본값 사용`);
    accountId = '12345678'; // 테스트용 기본값
  }
  
  console.log(`👤 프로필 페이지 요청: ${req.user.username} (최종 Account ID: ${accountId})`);
  
  res.render('my-profile', { 
    user: req.user,
    accountId: accountId,
    title: `내 프로필 - 박근형의 데드락`
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      railway: !!process.env.RAILWAY_ENVIRONMENT,
      steamConfigured: !!steamApiKey
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { 
    user: req.user,
    title: 'Page Not Found - 박근형의 데드락'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 박근형의 데드락 server running on port ${PORT}`);
  console.log(`🔗 URL: ${baseUrl}`);
  console.log(`🎮 Steam API: ${steamApiKey ? 'Configured' : 'Missing (authentication disabled)'}`);
  console.log(`🌐 Environment: ${isProduction ? 'Production' : 'Development'}`);
  console.log(`📊 Health check: ${baseUrl}/health`);
});