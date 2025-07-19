// Global app functionality

// Steam login status checker
let steamLoginStatus = null;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        // Check Steam login status
        await checkSteamLoginStatus();
        
        // Initialize navigation
        initializeNavigation();
        
        // Initialize page-specific functionality
        initializePageSpecific();
        
        console.log('✅ Deadlock Coach app initialized');
    } catch (error) {
        console.error('❌ Error initializing app:', error);
    }
}

async function checkSteamLoginStatus() {
    try {
        const response = await fetch('/api/v1/auth/login/ko');
        const data = await response.json();
        
        steamLoginStatus = data.success ? data.user : null;
        
        if (steamLoginStatus) {
            console.log('🎮 Steam user logged in:', steamLoginStatus.username);
            updateUIForLoggedInUser();
        } else {
            console.log('🔐 No Steam user logged in');
        }
    } catch (error) {
        console.error('Error checking Steam login status:', error);
        steamLoginStatus = null;
    }
}

function updateUIForLoggedInUser() {
    // Update user avatar and info if elements exist
    const userAvatars = document.querySelectorAll('.user-avatar');
    const usernames = document.querySelectorAll('.username');
    
    userAvatars.forEach(avatar => {
        if (steamLoginStatus && steamLoginStatus.avatar) {
            avatar.src = steamLoginStatus.avatar;
            avatar.alt = steamLoginStatus.username;
        }
    });
    
    usernames.forEach(username => {
        if (steamLoginStatus && steamLoginStatus.username) {
            username.textContent = steamLoginStatus.username;
        }
    });
}

function initializeNavigation() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && !navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initializePageSpecific() {
    const currentPath = window.location.pathname;
    
    // Home page functionality
    if (currentPath === '/' || currentPath === '/ko') {
        initializeHomePage();
    }
    
    // Leaderboards functionality
    if (currentPath.includes('/leaderboards/')) {
        initializeLeaderboards();
    }
    
    // Stats page functionality
    if (currentPath.includes('/stats')) {
        initializeStatsPage();
    }
}

function initializeHomePage() {
    console.log('🏠 Initializing home page');
    
    // Animate hero stats on scroll
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        });
        
        statCards.forEach(card => observer.observe(card));
    }
    
    // Feature cards hover effect
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function initializeLeaderboards() {
    console.log('🏆 Initializing leaderboards page');
    
    // This function is mainly handled in the EJS template
    // but we can add additional functionality here if needed
    
    // Add loading states for filters
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', () => {
            showLoadingState();
        });
    });
}

function initializeStatsPage() {
    console.log('📊 Initializing stats page');
    
    // Load user stats if logged in
    if (steamLoginStatus) {
        loadUserStats(steamLoginStatus.steamId);
    }
}

function showLoadingState() {
    const loading = document.getElementById('table-loading');
    const table = document.getElementById('leaderboard-table');
    
    if (loading && table) {
        loading.style.display = 'flex';
        table.style.display = 'none';
    }
}

function hideLoadingState() {
    const loading = document.getElementById('table-loading');
    const table = document.getElementById('leaderboard-table');
    
    if (loading && table) {
        loading.style.display = 'none';
        table.style.display = 'table';
    }
}

async function loadUserStats(steamId) {
    try {
        console.log('📈 Loading stats for Steam ID:', steamId);
        
        // Load recent games
        const recentResponse = await fetch(`/api/player/${steamId}/recent`);
        const recentData = await recentResponse.json();
        
        // Load game stats
        const statsResponse = await fetch(`/api/player/${steamId}/stats`);
        const statsData = await statsResponse.json();
        
        console.log('Recent games data:', recentData);
        console.log('Stats data:', statsData);
        
        return {
            recent: recentData,
            stats: statsData
        };
    } catch (error) {
        console.error('Error loading user stats:', error);
        return null;
    }
}

// Utility functions
function formatNumber(num) {
    return new Intl.NumberFormat('ko-KR').format(num);
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}시간 ${minutes}분`;
    } else {
        return `${minutes}분`;
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Steam API utilities
const SteamAPI = {
    async getPlayerSummary(steamId) {
        try {
            const response = await fetch(`/api/player/${steamId}/summary`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching player summary:', error);
            return null;
        }
    },
    
    async getPlayerStats(steamId) {
        try {
            const response = await fetch(`/api/player/${steamId}/stats`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching player stats:', error);
            return null;
        }
    },
    
    async getRecentGames(steamId) {
        try {
            const response = await fetch(`/api/player/${steamId}/recent`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching recent games:', error);
            return null;
        }
    }
};

// Export for use in other scripts
window.DeadlockCoach = {
    steamLoginStatus,
    checkSteamLoginStatus,
    loadUserStats,
    showLoadingState,
    hideLoadingState,
    SteamAPI,
    formatNumber,
    formatTime,
    debounce
};