const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, '../src/assets/fonts');
const androidFontResDir = path.join(__dirname, '../android/app/src/main/res/font');

// Create android font res dir if it doesn't exist
if (!fs.existsSync(androidFontResDir)) {
    fs.mkdirSync(androidFontResDir, { recursive: true });
}

const fontWeights = {
    'Thin': 100,
    'ExtraLight': 200,
    'Light': 300,
    'Regular': 400,
    'Medium': 500,
    'SemiBold': 600,
    'Bold': 700,
    'ExtraBold': 800,
    'Black': 900,
};

const fontFiles = fs.readdirSync(fontsDir).filter(f => f.endsWith('.ttf'));

const familyGroups = {};

fontFiles.forEach(file => {
    // e.g., Montserrat-Bold.ttf
    const nameParts = file.replace('.ttf', '').split('-');
    const family = nameParts[0].toLowerCase();

    let weightName = nameParts[1] || 'Regular';
    let isItalic = false;
    if (weightName.endsWith('Italic') && weightName !== 'Italic') {
        isItalic = true;
        weightName = weightName.replace('Italic', '');
    } else if (weightName === 'Italic') {
        isItalic = true;
        weightName = 'Regular';
    }

    const weightVal = fontWeights[weightName] || 400;

    if (!familyGroups[family]) {
        familyGroups[family] = [];
    }

    // Resource name must be a-z0-9_
    const resFileName = file.toLowerCase().replace('-', '_');

    if (!fs.existsSync(path.join(androidFontResDir, resFileName))) {
        fs.copyFileSync(path.join(fontsDir, file), path.join(androidFontResDir, resFileName));
    }

    familyGroups[family].push({
        resFileName: resFileName.replace('.ttf', ''),
        weightVal,
        isItalic,
    });
});

Object.keys(familyGroups).forEach(family => {
    const xmlPath = path.join(androidFontResDir, `${family}.xml`);
    let xmlContent = `<?xml version="1.0" encoding="utf-8"?>\n<font-family xmlns:android="http://schemas.android.com/apk/res/android" xmlns:app="http://schemas.android.com/apk/res-auto">\n`;

    familyGroups[family].forEach(font => {
        const style = font.isItalic ? 'italic' : 'normal';
        xmlContent += `    <font android:fontStyle="${style}" android:fontWeight="${font.weightVal}" android:font="@font/${font.resFileName}" app:fontStyle="${style}" app:fontWeight="${font.weightVal}" app:font="@font/${font.resFileName}" />\n`;
    });

    xmlContent += `</font-family>`;

    fs.writeFileSync(xmlPath, xmlContent);
    console.log(`Created ${xmlPath}`);
});

const androidAssetsFontsDir = path.join(__dirname, '../android/app/src/main/assets/fonts');
if (fs.existsSync(androidAssetsFontsDir)) {
    fs.rmSync(androidAssetsFontsDir, { recursive: true, force: true });
    console.log('Removed conflicting fonts from android/app/src/main/assets/fonts');
}

console.log('Android font resources setup successfully.');
