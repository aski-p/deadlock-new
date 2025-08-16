# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚀 Development Commands

### Essential Commands
```bash
# Development
npm run dev                    # Start with nodemon auto-reload
npm start                     # Production start

# Code Quality
npm run lint                  # ESLint check
npm run lint:fix             # ESLint auto-fix
npm run format              # Prettier formatting

# Testing
npm test                     # Currently placeholder - no tests implemented
```

### Railway Deployment
```bash
# Force Railway redeploy by updating trigger file
echo "deployment message - $(date)" > .railway-trigger
git add .railway-trigger && git commit -m "Force Railway redeploy" && git push
```

## 🏗️ Architecture Overview

### Core Technology Stack
- **Backend**: Node.js + Express.js with EJS templating
- **Authentication**: Passport.js with Steam Strategy 
- **Database**: Supabase (PostgreSQL) with auto-initialization
- **External APIs**: Steam Web API, deadlock-api.com for game data
- **Deployment**: Railway with health checks and auto-restart

### Key Application Structure

**Server Architecture** (`server.js`):
- Express app with middleware layers (helmet, compression, rate limiting)
- Steam OAuth authentication flow
- Supabase database auto-initialization with table creation
- Health check endpoint (`/health`) for Railway monitoring
- Environment validation with graceful degradation

**View System** (`views/`):
- EJS layout system with shared `layout.ejs`
- `my-profile.ejs`: Complex user profile with match history, team analysis, Final Items display
- Korean/English localization support throughout templates

**Game Data Integration** (`data/items.js`):
- Comprehensive Deadlock items database organized by category (weapon/vitality/spirit)
- Tier-based pricing system (I: 800, II: 1600, III: 3200, IV: 6400)
- Korean translations with stats and descriptions

### Critical Data Flow Patterns

**Player Profile System**:
1. Steam authentication provides `steamId` and `accountId`
2. Multiple API calls to deadlock-api.com for match data, player stats
3. Complex team arrangement logic ensuring 6v6 display with current user in correct team
4. Player name resolution: handles `Player_숫자` patterns via Steam API lookup with caching
5. Final Items display using direct API calls with item ID → image URL mapping

**Image Management System**:
- Hero images: Fallback to `/abilities/weapon_damage.webp` (verified working URLs)
- Item images: ID-based mapping to `/abilities/` folder with weapon/vitality categorization
- All image URLs use `assets-bucket.deadlock-api.com/assets-api-res/images/abilities/` paths

**Database Operations**:
- Auto-creates Supabase tables (`board_posts`, `board_comments`) on startup
- Handles missing environment variables gracefully for Railway deployment
- SQL function creation for dynamic table management

## 🔧 Development Patterns

### Player Name Resolution
The codebase handles various player name formats:
- `Player_158293321` → Steam API lookup using `account_id`
- Caching system with both `account_id` and extracted numbers
- Multiple API endpoint fallbacks for reliable name resolution

### API Integration Strategy
- **Primary**: deadlock-api.com for match data, player stats
- **Secondary**: Steam Web API for player information
- **Caching**: Session-based caching (`playerNameCache`, `deadlockItemsCache`)
- **Error Handling**: Graceful degradation with fallback values

### Item System Architecture
- Item ID → Image URL mapping for consistent display
- Upgrade system: `upgrade_id` takes precedence over `item_id`
- Category-based image selection (weapon vs vitality items)
- Korean name mapping with English fallbacks

### Environment Configuration
Required for full functionality:
```env
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-key
SESSION_SECRET=your-session-secret
STEAM_API_KEY=your-steam-api-key  # Optional for some features
```

### Railway Deployment Specifics
- Health check endpoint must respond quickly for Railway monitoring
- Graceful degradation when environment variables missing
- Auto-restart policy on failure
- Build uses nixpacks with npm start command

## 🎮 Game-Specific Implementation Details

### Match History Display
Complex logic in `my-profile.ejs` (lines 4400+):
- Ensures 6v6 team display even with incomplete data
- Current user always appears in "우리팀" (our team)
- Final Items fetched via direct API with sold_time_s filtering
- Real-time async player name resolution with loading states

### Image URL Management
Critical fix implemented: All `/heroes/` and `/upgrades/` folder URLs were 404, replaced with working `/abilities/` folder images. When working with images, always verify URLs exist before implementation.

### Korean Localization
- All UI text in Korean with some English fallbacks
- Item names, descriptions, and stats fully localized
- Player communication and error messages in Korean

This architecture prioritizes reliability and user experience with multiple fallback layers for external API dependencies and graceful handling of missing data.