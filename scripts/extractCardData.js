import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// .envファイルを読み込む
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('エラー: GEMINI_API_KEY が .env に設定されていません。');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const CARDS_DIR = path.join(__dirname, '../public/images/cards');
const OUTPUT_FILE = path.join(__dirname, '../src/data/cards.json');

const SEASON_NAMES = {
  'Zutomayocard_1st': 'THE WORLD IS CHANGING',
  'Zutomayocard_2st': 'ALL ALONG THE WATCHTOWER',
  'Zutomayocard_3rd': 'Off Minor',
  'Zutomayocard_4st': 'Fantasy Is Reality'
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function extractData(imagePath) {
  const imageData = fs.readFileSync(imagePath);
  const imagePart = {
    inlineData: {
      data: imageData.toString("base64"),
      mimeType: "image/jpeg"
    },
  };

  const prompt = `
    You are a trading card data extractor. Look at this ZUTOMAYO card image and extract the following information.
    1. Attribute (Icon in the very top right corner. It is a symbol. You MUST map it to exactly one of the following 5 Japanese words based on its appearance:
       - 闇 (If it's a purple target-like icon)
       - 炎 (If it's a red fire/flame icon)
       - 電気 (If it's a yellow lightning/energy icon)
       - 風 (If it's a green leaf/wind icon)
       - カオス (If it's a black star/orb/chaos icon)
       Only output one of: "闇", "炎", "電気", "風", "カオス".
    ).
    2. Type (The english text in the bottom right corner, typically "Character", "Enchant", "Activity", "Field", etc. Just the exact word).
    3. Rarity (The 1-2 letters inside a rounded box in the bottom left corner, typically "UR", "SR", "R", "N", "SE").
    4. Name (The main large Japanese text near the middle of the card. Ignore english subtext. Just the Japanese name without parentheses).
    5. Song Title (The text inside the parentheses within the card's name. e.g. if the name is "にらちゃん (お勉強しといてよ)", the Song Title is "お勉強しといてよ". If there are no parentheses, return empty string).
    6. Send To Power (The number of stars on the right-middle edge of the card. If none, 0).
    7. Power Cost (The number of stars to the right of the "Power Cost" text. If hyphen, 0).
    8. Night (The numerical value to the right of the "Night" text).
    9. Day (The numerical value to the right of the "Day" text).
    10. Time Count (The numerical value inside the sun/moon icon in the very top-left corner of the card).
    
    Output exactly and ONLY a valid JSON object with the following keys, no markdown, no code blocks:
    {"attribute": "value", "type": "value", "rarity": "value", "name": "value", "songTitle": "value", "sendToPower": 0, "powerCost": 0, "night": 0, "day": 0, "timeCount": 0}
  `;

  let retries = 5;
  while (retries > 0) {
    try {
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      let text = response.text().trim();
      
      // Remove markdown code block if present
      if (text.startsWith('\`\`\`json')) {
        text = text.replace(/^\`\`\`json\n?/, '').replace(/\n?\`\`\`$/, '');
      } else if (text.startsWith('\`\`\`')) {
        text = text.replace(/^\`\`\`\n?/, '').replace(/\n?\`\`\`$/, '');
      }

      return JSON.parse(text);
    } catch (err) {
      console.error(`抽出エラー (${imagePath}):`, err.message);
      if (err.message.includes('429')) {
        const match = err.message.match(/retry in ([\d\.]+)s/);
        const waitTime = match ? Math.ceil(parseFloat(match[1])) * 1000 + 2000 : 60000;
        console.log(`API制限に達しました。${waitTime / 1000}秒待機してリトライします... (残りリトライ回数: ${retries - 1})`);
        await delay(waitTime);
        retries--;
      } else {
        return null; // 429以外の致命的なエラーはスキップ
      }
    }
  }
  console.log(`最大リトライ回数に達しました (${imagePath})`);
  return null;
}

async function main() {
  console.log('--- カード画像AI解析スクリプト開始 ---');
  
  // 既存のデータを読み込む（途中から再開できるようにするため）
  let existingCards = [];
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      existingCards = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
      console.log(`既存のデータベースを読み込みました (${existingCards.length}枚)`);
    } catch (e) {
      console.log('既存のデータベースが破損しているため、新規作成します');
    }
  }

  const newCards = [...existingCards];
  const folders = Object.keys(SEASON_NAMES);
  let processedCount = 0;

  for (const folder of folders) {
    const folderPath = path.join(CARDS_DIR, folder);
    if (!fs.existsSync(folderPath)) continue;

    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
    
    for (const file of files) {
      // id: e.g. "1st_1", "2st_10"
      const match = file.match(/zutomayocard_(.+?)\./);
      const id = match ? match[1] : file.split('.')[0];
      
      let seasonNo = 99;
      let cardNo = 999;
      let uid = '099999';

      const numMatch = id.match(/^(\d)[a-z]+_(.+)$/);
      if (numMatch) {
        seasonNo = parseInt(numMatch[1], 10);
        const extractedNum = numMatch[2].match(/\d+/);
        cardNo = extractedNum ? parseInt(extractedNum[0], 10) : 999;
        
        const formattedSeason = seasonNo.toString().padStart(3, '0');
        const formattedCardNo = cardNo.toString().padStart(3, '0');
        uid = `${formattedSeason}${formattedCardNo}`;
      }
      
      const imagePath = `/images/cards/${folder}/${file}`;
      
      // 既に解析済みかチェック (name が空でない、ダミーでない等)
      const existingIdx = newCards.findIndex(c => c.id === id);
      const isAlreadyProcessed = existingIdx !== -1 && newCards[existingIdx].sendToPower !== undefined;

      if (isAlreadyProcessed) {
        // console.log(`スキップ: ${file} (解析済み)`);
        continue;
      }

      console.log(`解析中: ${file} ...`);
      const absPath = path.join(folderPath, file);
      
      const aiData = await extractData(absPath);
      
      // 抽出に完全に失敗した場合は保存をスキップしてUnknownで上書きされるのを防ぐ
      if (!aiData) {
        console.log(`失敗のためスキップ: ${file}`);
        continue;
      }
      
      const cardData = {
        id: id,
        uid: uid,
        seasonNo: seasonNo,
        cardNo: cardNo,
        name: aiData?.name || `カード ${id}`,
        attribute: aiData?.attribute || 'Unknown',
        type: aiData?.type || 'Unknown',
        rarity: aiData?.rarity || 'Unknown',
        songTitle: aiData?.songTitle || '',
        sendToPower: aiData?.sendToPower || 0,
        powerCost: aiData?.powerCost || 0,
        night: aiData?.night || 0,
        day: aiData?.day || 0,
        timeCount: aiData?.timeCount || 0,
        season: SEASON_NAMES[folder],
        imagePath: imagePath
      };

      if (existingIdx !== -1) {
        newCards[existingIdx] = cardData;
      } else {
        newCards.push(cardData);
      }

      // 進捗を1件ごとに保存
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(newCards, null, 2));
      processedCount++;

      // 有料枠（Tier1）のため待機時間を大幅に短縮して高速化
      console.log(`完了: ${cardData.name} (${cardData.rarity}) - 次のカードまで待機...`);
      await delay(500);
    }
  }

  console.log(`\n--- 全処理完了 ---`);
  console.log(`新たに ${processedCount} 枚の画像を解析しました。`);
  console.log(`合計 ${newCards.length} 枚のカードデータが ${OUTPUT_FILE} に保存されました。`);
}

main().catch(console.error);
