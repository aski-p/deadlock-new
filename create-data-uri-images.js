// Data URI 이미지 생성기 - 외부 서비스 없이 이미지 생성
const fs = require('fs');

// SVG 이미지를 Data URI로 생성하는 함수
function createSVGDataURI(width, height, backgroundColor, textColor, text) {
    const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#${backgroundColor}"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
                  fill="#${textColor}" font-family="Arial, sans-serif" 
                  font-size="${Math.min(width, height) * 0.2}" font-weight="bold">
                ${text}
            </text>
        </svg>
    `;
    
    const base64 = Buffer.from(svg.trim()).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
}

// 게임 아이템별 색상과 텍스트 정의
const itemImages = {
    // Weapon items (빨간색/주황색 계열)
    weapon: [
        { name: 'Basic Magazine', color: '4A90E2', text: 'MAG' },
        { name: 'High-Velocity Mag', color: 'E74C3C', text: 'VEL' },
        { name: 'Headshot Booster', color: 'F39C12', text: 'HEAD' },
        { name: 'Close Quarters', color: '8E44AD', text: 'CQ' },
        { name: 'Berserker', color: 'D35400', text: 'BERK' },
        { name: 'Sharpshooter', color: '27AE60', text: 'SNIP' },
        { name: 'Burst Fire', color: 'E67E22', text: 'BURST' },
        { name: 'Titanic Magazine', color: '3498DB', text: 'TITAN' },
        { name: 'Glass Cannon', color: 'E74C3C', text: 'GLASS' }
    ],
    
    // Vitality items (녹색 계열)
    vitality: [
        { name: 'Extra Health', color: '27AE60', text: 'HP' },
        { name: 'Extra Regen', color: '2ECC71', text: 'REGEN' },
        { name: 'Sprint Boots', color: 'F39C12', text: 'BOOT' },
        { name: 'Healing Rite', color: 'E67E22', text: 'HEAL' },
        { name: 'Bullet Armor', color: '95A5A6', text: 'ARMOR' },
        { name: 'Spirit Armor', color: '9B59B6', text: 'SHIELD' },
        { name: 'Enduring Speed', color: '3498DB', text: 'SPEED' },
        { name: 'Fortitude', color: 'E74C3C', text: 'FORT' },
        { name: 'Colossus', color: '8E44AD', text: 'GIANT' }
    ],
    
    // Spirit items (보라색/파란색 계열)
    spirit: [
        { name: 'Extra Charge', color: 'F1C40F', text: 'CHARGE' },
        { name: 'Mystic Burst', color: 'E67E22', text: 'BURST' },
        { name: 'Infuser', color: '9B59B6', text: 'WAND' },
        { name: 'Spirit Strike', color: 'E74C3C', text: 'FIST' },
        { name: 'Quicksilver Reload', color: '3498DB', text: 'RELOAD' },
        { name: 'Improved Cooldown', color: '27AE60', text: 'CD' },
        { name: 'Improved Reach', color: 'F39C12', text: 'REACH' },
        { name: 'Superior Cooldown', color: '8E44AD', text: 'SUPER' },
        { name: 'Refresher', color: 'D35400', text: 'REFRESH' }
    ]
};

// 카테고리 아이콘
const categoryIcons = [
    { name: 'weapon', color: 'E74C3C', text: '⚔', size: 32 },
    { name: 'vitality', color: '27AE60', text: '♥', size: 32 },
    { name: 'spirit', color: '9B59B6', text: '✦', size: 32 },
    { name: 'souls', color: 'F1C40F', text: '$', size: 20 }
];

console.log('📝 Data URI 이미지 생성 중...');
console.log('');

// 아이템 이미지들 생성
Object.keys(itemImages).forEach(category => {
    console.log(`🎯 ${category.toUpperCase()} 카테고리:`);
    itemImages[category].forEach(item => {
        const dataURI = createSVGDataURI(64, 64, item.color, 'ffffff', item.text);
        console.log(`  ${item.name}: "${dataURI.substring(0, 100)}..."`);
    });
    console.log('');
});

// 카테고리 아이콘들 생성
console.log('🏷️ 카테고리 아이콘:');
categoryIcons.forEach(icon => {
    const dataURI = createSVGDataURI(icon.size, icon.size, icon.color, 'ffffff', icon.text);
    console.log(`  ${icon.name}: "${dataURI.substring(0, 100)}..."`);
});

console.log('');
console.log('💡 사용 방법:');
console.log('위의 Data URI를 복사해서 items.ejs 파일의 image 속성에 직접 붙여넣으면 됩니다.');
console.log('외부 서비스에 의존하지 않고 이미지가 항상 표시됩니다.');

// 실제 코드 생성
console.log('');
console.log('🔧 JavaScript 코드 생성:');
console.log('');

console.log('// 무기 아이템 이미지 (Data URI)');
itemImages.weapon.forEach((item, index) => {
    const dataURI = createSVGDataURI(64, 64, item.color, 'ffffff', item.text);
    console.log(`image: "${dataURI}",`);
});

console.log('');
console.log('// 활력 아이템 이미지 (Data URI)');  
itemImages.vitality.forEach((item, index) => {
    const dataURI = createSVGDataURI(64, 64, item.color, 'ffffff', item.text);
    console.log(`image: "${dataURI}",`);
});

console.log('');
console.log('// 정신력 아이템 이미지 (Data URI)');
itemImages.spirit.forEach((item, index) => {
    const dataURI = createSVGDataURI(64, 64, item.color, 'ffffff', item.text);
    console.log(`image: "${dataURI}",`);
});