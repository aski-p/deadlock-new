// Deadlock 아이템 이미지 다운로드 스크립트
const fs = require('fs');
const path = require('path');
const https = require('https');

// 실제 Deadlock 아이템 이미지 URL들 (Steam Community 또는 공개 소스)
const itemImageUrls = {
    // 무기 아이템
    weapon: [
        { name: 'basic_magazine', url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1422450/ss_2.jpg' },
        { name: 'high_velocity_mag', url: 'https://steamcdn-a.akamaihd.net/steam/apps/1422450/header.jpg' },
        // 더 많은 아이템들...
    ],
    
    // 활력 아이템  
    vitality: [
        { name: 'extra_health', url: 'https://steamuserimages-a.akamaihd.net/ugc/1422450/health.png' },
        // 더 많은 아이템들...
    ],
    
    // 정신력 아이템
    spirit: [
        { name: 'extra_charge', url: 'https://steamuserimages-a.akamaihd.net/ugc/1422450/charge.png' },
        // 더 많은 아이템들...
    ]
};

// 실제로 작동하는 게임 아이콘 이미지들 (무료 게임 아이콘)
const gameIconUrls = {
    weapon: [
        { name: 'basic_magazine', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/ammo-box.svg' },
        { name: 'high_velocity_mag', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/bullets.svg' },
        { name: 'headshot_booster', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/bullseye.svg' },
        { name: 'close_quarters', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/knife-thrust.svg' },
        { name: 'berserker', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/battle-axe.svg' },
        { name: 'sharpshooter', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/sniper-scope.svg' },
        { name: 'burst_fire', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/machine-gun.svg' },
        { name: 'titanic_magazine', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/ammo-box.svg' },
        { name: 'glass_cannon', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/cannon.svg' }
    ],
    
    vitality: [
        { name: 'extra_health', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/health-normal.svg' },
        { name: 'extra_regen', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/healing.svg' },
        { name: 'sprint_boots', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/boots.svg' },
        { name: 'healing_rite', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/health-potion.svg' },
        { name: 'bullet_armor', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/chest-armor.svg' },
        { name: 'spirit_armor', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/shield.svg' },
        { name: 'enduring_speed', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/sprint.svg' },
        { name: 'fortitude', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/muscle-up.svg' },
        { name: 'colossus', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/giant.svg' }
    ],
    
    spirit: [
        { name: 'extra_charge', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/lightning-bolt.svg' },
        { name: 'mystic_burst', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/crystal-ball.svg' },
        { name: 'infuser', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/magic-wand.svg' },
        { name: 'spirit_strike', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/fist.svg' },
        { name: 'quicksilver_reload', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/reload.svg' },
        { name: 'improved_cooldown', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/clock.svg' },
        { name: 'improved_reach', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/reach.svg' },
        { name: 'superior_cooldown', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/stopwatch.svg' },
        { name: 'refresher', url: 'https://raw.githubusercontent.com/game-icons/icons/master/delapouite/refresh.svg' }
    ]
};

// 파일 다운로드 함수
function downloadFile(url, filename) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filename);
        
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode}: ${url}`));
                return;
            }
            
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                console.log(`✅ Downloaded: ${path.basename(filename)}`);
                resolve();
            });
            
            file.on('error', (err) => {
                fs.unlink(filename, () => {}); // 실패한 파일 삭제
                reject(err);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

// 모든 이미지 다운로드
async function downloadAllImages() {
    console.log('🎮 Deadlock 아이템 이미지 다운로드 시작...');
    
    const categories = Object.keys(gameIconUrls);
    
    for (const category of categories) {
        console.log(`\n📂 ${category.toUpperCase()} 카테고리 이미지 다운로드...`);
        
        const categoryDir = path.join(__dirname, 'public', 'images', 'items', category);
        
        // 카테고리 디렉토리 생성
        if (!fs.existsSync(categoryDir)) {
            fs.mkdirSync(categoryDir, { recursive: true });
        }
        
        const items = gameIconUrls[category];
        
        for (const item of items) {
            try {
                const filename = path.join(categoryDir, `${item.name}.svg`);
                await downloadFile(item.url, filename);
                
                // 작은 지연으로 서버 부하 방지
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (error) {
                console.log(`❌ 실패: ${item.name} - ${error.message}`);
            }
        }
    }
    
    console.log('\n🎉 이미지 다운로드 완료!');
    console.log('\n📋 다음 단계:');
    console.log('1. views/items.ejs 파일의 이미지 URL을 "/images/items/category/name.svg"로 변경');
    console.log('2. Git에 이미지 파일들 추가 및 커밋');
    console.log('3. Railway에 배포');
}

// 메인 실행
if (require.main === module) {
    downloadAllImages().catch(console.error);
}