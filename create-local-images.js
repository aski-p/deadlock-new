// 로컬 SVG 이미지 생성기 - 직접 서버에 저장
const fs = require('fs');
const path = require('path');

// 각 아이템에 대한 SVG 아이콘 생성
function createItemSVG(category, name, color, icon) {
    return `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#${color}" rx="8"/>
        <text x="32" y="40" text-anchor="middle" fill="white" 
              font-family="Arial, sans-serif" font-size="28" font-weight="bold">
            ${icon}
        </text>
    </svg>`;
}

// 게임 아이템 정의 (색상과 아이콘으로)
const itemDefinitions = {
    weapon: [
        { name: 'basic_magazine', color: '4A90E2', icon: '📦' },
        { name: 'high_velocity_mag', color: 'E74C3C', icon: '⚡' },
        { name: 'headshot_booster', color: 'F39C12', icon: '🎯' },
        { name: 'close_quarters', color: '8E44AD', icon: '⚔️' },
        { name: 'berserker', color: 'D35400', icon: '🪓' },
        { name: 'sharpshooter', color: '27AE60', icon: '🎯' },
        { name: 'burst_fire', color: 'E67E22', icon: '💥' },
        { name: 'titanic_magazine', color: '3498DB', icon: '📦' },
        { name: 'glass_cannon', color: 'E74C3C', icon: '💥' }
    ],
    
    vitality: [
        { name: 'extra_health', color: '27AE60', icon: '💚' },
        { name: 'extra_regen', color: '2ECC71', icon: '🔄' },
        { name: 'sprint_boots', color: 'F39C12', icon: '👟' },
        { name: 'healing_rite', color: 'E67E22', icon: '🧪' },
        { name: 'bullet_armor', color: '95A5A6', icon: '🛡️' },
        { name: 'spirit_armor', color: '9B59B6', icon: '✨' },
        { name: 'enduring_speed', color: '3498DB', icon: '💨' },
        { name: 'fortitude', color: 'E74C3C', icon: '💪' },
        { name: 'colossus', color: '8E44AD', icon: '🏔️' }
    ],
    
    spirit: [
        { name: 'extra_charge', color: 'F1C40F', icon: '⚡' },
        { name: 'mystic_burst', color: 'E67E22', icon: '🔮' },
        { name: 'infuser', color: '9B59B6', icon: '🪄' },
        { name: 'spirit_strike', color: 'E74C3C', icon: '👊' },
        { name: 'quicksilver_reload', color: '3498DB', icon: '🔄' },
        { name: 'improved_cooldown', color: '27AE60', icon: '⏰' },
        { name: 'improved_reach', color: 'F39C12', icon: '📏' },
        { name: 'superior_cooldown', color: '8E44AD', icon: '⏳' },
        { name: 'refresher', color: 'D35400', icon: '🔄' }
    ]
};

async function createAllImages() {
    console.log('🎨 로컬 SVG 이미지 생성 시작...');
    
    const baseDir = path.join(__dirname, 'public', 'images', 'items');
    
    // 기본 디렉토리 생성
    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
    }
    
    for (const [category, items] of Object.entries(itemDefinitions)) {
        console.log(`\n📂 ${category.toUpperCase()} 카테고리 생성...`);
        
        const categoryDir = path.join(baseDir, category);
        if (!fs.existsSync(categoryDir)) {
            fs.mkdirSync(categoryDir, { recursive: true });
        }
        
        for (const item of items) {
            const svgContent = createItemSVG(category, item.name, item.color, item.icon);
            const filename = path.join(categoryDir, `${item.name}.svg`);
            
            fs.writeFileSync(filename, svgContent);
            console.log(`✅ 생성: ${item.name}.svg`);
        }
    }
    
    console.log('\n🎉 모든 이미지 생성 완료!');
    console.log('\n📋 다음 단계:');
    console.log('1. views/items.ejs 파일의 이미지 URL을 "/images/items/category/name.svg"로 변경');
    console.log('2. Git에 이미지 파일들 추가 및 커밋');
    console.log('3. Railway에 배포');
}

if (require.main === module) {
    createAllImages().catch(console.error);
}