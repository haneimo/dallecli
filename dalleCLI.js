const OpenAI = require('openai');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { log } = require('console');

// コマンド実行時にimagesディレクトリ、logディレクトリがなければ作成する
const imagesDirPath = path.join(__dirname, 'images');
const logDirPath = path.join(__dirname, 'log');
if (!fs.existsSync(imagesDirPath)) {
    fs.mkdirSync(imagesDirPath);
}
if (!fs.existsSync(logDirPath)) {
    fs.mkdirSync(logDirPath);
}

// 従量課金のため、APIを呼び出すたびにログを取る
// またbillingページへの案内を表示する
// https://platform.openai.com/settings/organization/billing/overview
const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'] || 'sk-xxxxx',
});

const logCall = (prompt, imagename) => {
    const date = new Date();
    const yearMonth = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    const logFilePath = path.join(__dirname, `log/${yearMonth}.log`);

    const logMessage = `${date.toISOString()} - "Prompt: ${prompt}" "Image Name: ${imagename}"\n`;

    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Failed to write to log file:', err);
        }
    });
};

const callDalli2 = async (prompt, image_count = 1) => {
    let response;
    try {
        response = await openai.images.generate({
            model: 'dall-e-3',
            prompt: prompt,
            n: image_count,
            size: "1024x1024",
        });
        console.log(response.data);
    } catch (error) {
        console.error('Error:', error.message);
    }

    if (!response || !response.data) {
        return;
    }

    try {
        response.data.forEach(async (image, index) => {
            const imageUrl = image.url;
            // ミリ秒までのタイムスタンプを取得して
            // ファイル名にする
            const timestamp = Date.now();
            const imageName = `dalle_${timestamp}_${index}.png`;
            const imagePath = path.join(__dirname, `images/${imageName}`);

            const imageResponse = await fetch(imageUrl);
            const imageBuffer = await imageResponse.buffer();
            fs.writeFileSync(imagePath, imageBuffer);

            logCall(prompt, imageName);
        });
    } catch (error) {
        console.error('ImageDownloadError:', error.message);
    }
}

// コマンドライン引数をチェック。ジャスト3つでないとエラーを出す
if (process.argv.length !== 3) {
    console.error('Usage: node dalleCLI.js "Prompt"');
    process.exit(1);
}

// sys.argv[2]にはpromptが入る
const prompt = process.argv[2];
callDalli2(prompt);
