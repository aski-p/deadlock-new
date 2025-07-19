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