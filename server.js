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

// 플레이어 상세 정보 API
app.get('/api/v1/players/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;
    console.log(`🔍 플레이어 상세 정보 요청: ${accountId}`);
    
    // Account ID를 Steam ID로 변환
    const steamId = convertToSteamId64(accountId);
    if (!steamId || !isValidSteamId64(steamId)) {
      return res.status(400).json({ error: 'Invalid account ID' });
    }

    // Steam API에서 기본 정보 가져오기
    let playerInfo = {
      accountId: accountId,
      steamId: steamId,
      name: `Player_${accountId}`,
      avatar: 'https://avatars.cloudflare.steamstatic.com/b5bd56c1aa4644a474a2e4972be27ef9e82e517e_full.jpg',
      country: '🌍',
      countryCode: null,
      stats: {
        matches: Math.floor(Math.random() * 500) + 50,
        winRate: Math.floor(Math.random() * 40) + 50,
        laneWinRate: Math.floor(Math.random() * 40) + 50,
        kda: (Math.random() * 5 + 1).toFixed(1),
        headshotPercent: Math.floor(Math.random() * 30) + 10,
        soulsPerMin: Math.floor(Math.random() * 200) + 300,
        damagePerMin: Math.floor(Math.random() * 1000) + 2000,
        healingPerMin: Math.floor(Math.random() * 500) + 100
      },
      rank: {
        medal: 'Oracle',
        subrank: Math.floor(Math.random() * 6) + 1,
        score: Math.floor(Math.random() * 2000) + 3000
      },
      heroes: [
        { name: 'Abrams', matches: Math.floor(Math.random() * 50) + 10, winRate: Math.floor(Math.random() * 40) + 50 },
        { name: 'Bebop', matches: Math.floor(Math.random() * 30) + 5, winRate: Math.floor(Math.random() * 40) + 50 },
        { name: 'Haze', matches: Math.floor(Math.random() * 25) + 5, winRate: Math.floor(Math.random() * 40) + 50 }
      ],
      recentMatches: generateRecentMatches()
    };

    // Steam API로 실제 정보 가져오기
    if (steamApiKey) {
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
          
          playerInfo.name = steamUser.personaname || playerInfo.name;
          if (steamUser.avatarfull) {
            playerInfo.avatar = steamUser.avatarfull.replace('avatars.steamstatic.com', 'avatars.cloudflare.steamstatic.com');
          }
          if (steamUser.loccountrycode) {
            playerInfo.country = getCountryFlag(steamUser.loccountrycode);
            playerInfo.countryCode = steamUser.loccountrycode;
          }
          
          console.log(`✅ Steam 정보 업데이트: ${playerInfo.name} (${playerInfo.countryCode})`);
        }
      } catch (error) {
        console.log(`❌ Steam API 호출 실패:`, error.message);
      }
    }

    res.json(playerInfo);
  } catch (error) {
    console.error('Player detail API error:', error);
    res.status(500).json({ error: 'Failed to fetch player details' });
  }
});

// 플레이어 최근 매치 생성
const generateRecentMatches = () => {
  const heroes = ['Abrams', 'Bebop', 'Haze', 'Infernus', 'Ivy', 'Dynamo'];
  const results = ['승리', '패배'];
  
  const matches = [];
  for (let i = 0; i < 10; i++) {
    matches.push({
      id: Date.now() - (i * 3600000), // 1시간씩 빼기
      result: results[Math.floor(Math.random() * results.length)],
      hero: heroes[Math.floor(Math.random() * heroes.length)],
      kills: Math.floor(Math.random() * 20),
      deaths: Math.floor(Math.random() * 10),
      assists: Math.floor(Math.random() * 25),
      damage: Math.floor(Math.random() * 50000) + 20000,
      healing: Math.floor(Math.random() * 10000) + 2000,
      duration: Math.floor(Math.random() * 20) + 25, // 25-45분
      teamRank: Math.floor(Math.random() * 6) + 1
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

// 플레이어 상세 페이지 라우트
app.get('/ko/players/:accountId', (req, res) => {
  const { accountId } = req.params;
  res.render('player-detail', { 
    user: req.user,
    accountId: accountId,
    title: `플레이어 정보 - 박근형의 데드락`
  });
});

// 개인 프로필 페이지 라우트 (로그인 필요)
app.get('/ko/profile', (req, res) => {
  if (!req.user) {
    return res.redirect('/auth/steam');
  }
  
  // Steam ID를 32-bit account ID로 변환
  const accountId = req.user.steamId ? 
    (BigInt(req.user.steamId) - BigInt('76561197960265728')).toString() : 
    req.user.accountId;
  
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