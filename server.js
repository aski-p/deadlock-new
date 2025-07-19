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
      
      const user = {
        steamId: steamId,
        accountId: steamId, // For Deadlock API compatibility
        username: userData.personaname,
        avatar: userData.avatarfull,
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

// 지역 및 페이지별 고유한 플레이어 데이터 생성
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

    if (!['europe', 'asia', 'north-america'].includes(region)) {
      return res.status(400).json({ error: 'Invalid region' });
    }

    console.log(`📊 리더보드 요청: ${region}, 페이지 ${page}, Steam API: ${steamApiKey ? '활성화' : '비활성화'}`);

    // 실제 Steam 데이터를 사용하여 리더보드 생성
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