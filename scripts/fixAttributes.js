import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const FILE_PATH = path.join(__dirname, '../src/data/cards.json');
const CARDS_DIR = path.join(__dirname, '../public');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function reExtractAttribute(imagePath) {
  const imageData = fs.readFileSync(imagePath);
  const imagePart = {
    inlineData: {
      data: imageData.toString("base64"),
      mimeType: "image/jpeg"
    },
  };

  const prompt = `
    Look at the attribute icon in the very top right corner of this ZUTOMAYO card.
    You MUST map it to exactly one of the following 5 Japanese words based on its appearance:
    - 闇 (If it's a purple target-like icon)
    - 炎 (If it's a red fire/flame icon)
    - 電気 (If it's a yellow lightning/energy icon)
    - 風 (If it's a green leaf/swirl/wind icon)
    - カオス (If it's a black star/chaos icon)
    
    Output ONLY the Japanese word. No markdown, no punctuation. Just one of: "闇", "炎", "電気", "風", "カオス".
  `;

  try {
    const result = await model.generateContent([prompt, imagePart]);
    const text = (await result.response).text().trim();
    if (['闇', '炎', '電気', '風', 'カオス'].includes(text)) {
      return text;
    }
    return null;
  } catch (err) {
    console.error(`Error on ${imagePath}:`, err.message);
    return null;
  }
}

async function main() {
  const cards = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
  
  // We re-check cards that are currently Wind or Chaos, since they might be mixed up
  const targetCards = cards.filter(c => c.attribute === 'カオス' || c.attribute === '風' || c.attribute === 'Unknown');
  console.log(`Re-evaluating ${targetCards.length} cards...`);

  let fixedCount = 0;

  for (const card of targetCards) {
    const absPath = path.join(CARDS_DIR, card.imagePath);
    if (!fs.existsSync(absPath)) continue;

    console.log(`Checking ${card.name} (${card.id}) ...`);
    const newAttr = await reExtractAttribute(absPath);
    
    if (newAttr && newAttr !== card.attribute) {
      console.log(`  -> Changed from ${card.attribute} to ${newAttr}`);
      card.attribute = newAttr;
      fixedCount++;
      // Save incrementally
      fs.writeFileSync(FILE_PATH, JSON.stringify(cards, null, 2));
    }
    await delay(500); // Prevent hitting rate limits
  }

  console.log(`Finished. Fixed ${fixedCount} attributes.`);
}

main().catch(console.error);
