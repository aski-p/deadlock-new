const fs = require('fs');
const path = require('path');
const https = require('https');

// Try alternative naming patterns or search for missing images
const BASE_URL = 'https://cdn.deadlock.coach/vpk/panorama/images/items/';

// Items that failed to download (404 errors)
const missingItems = {
    weapon: ['high_velocity_mag', 'sharpshooter'],
    vitality: ['bullet_armor', 'spirit_armor'], 
    spirit: ['infuser', 'improved_reach']
};

// Alternative naming patterns to try
const namingVariations = [
    '', // original
    '_t1', '_t2', '_t3', // tier suffixes
    '_sm', '_md', '_lg', // size suffixes
    '_icon', '_image' // common suffixes
];

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    console.log(`✅ Downloaded: ${path.basename(filepath)}`);
                    resolve(true);
                });
            } else {
                fs.unlink(filepath, () => {}); // Delete empty file
                resolve(false);
            }
        }).on('error', () => {
            fs.unlink(filepath, () => {}); // Delete empty file
            resolve(false);
        });
    });
}

async function findAndDownloadImage(category, itemName) {
    const outputDir = `/home/aski/deadlock-new/public/images/items/${category}`;
    
    console.log(`🔍 Searching for ${itemName}...`);
    
    // Try different naming patterns
    for (const variation of namingVariations) {
        const testName = itemName + variation;
        const imageUrl = `${BASE_URL}${category}/${testName}_sm.webp`;
        const outputPath = path.join(outputDir, `${itemName}.webp`);
        
        console.log(`   Trying: ${testName}_sm.webp`);
        const success = await downloadImage(imageUrl, outputPath);
        
        if (success) {
            console.log(`✅ Found and downloaded: ${itemName}`);
            return true;
        }
        
        // Small delay between attempts
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    console.log(`❌ Could not find: ${itemName}`);
    return false;
}

async function downloadMissingImages() {
    console.log('🔍 Searching for missing item images with alternative naming patterns...\n');
    
    for (const [category, items] of Object.entries(missingItems)) {
        console.log(`📁 Processing ${category} items...`);
        
        for (const itemName of items) {
            await findAndDownloadImage(category, itemName);
        }
        
        console.log(`✅ Completed ${category} category\n`);
    }
    
    console.log('🎉 Search completed!');
}

// Run the search
downloadMissingImages().catch(console.error);