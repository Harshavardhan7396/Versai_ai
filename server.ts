import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google GenAI on the server side
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_KNOWLEDGE = `
You are IGRIS AI, the official intelligent transportation commander and assistant for Joy University Student Transit in Tamil Nadu, India.
TAGLINE: "Find your route. Track your ride. Reach your future."
WEBSITE: joyuniversity.edu.in
TRANSPORT BOARD CONTACTS: 7029 200 200 / 7026 422 288
SOCIAL: /ju.joyuniversity
REGION: Kanyakumari / Nagercoil region, Tamil Nadu, India.

OFFICIAL BUS TIMETABLE (Verified Seed Data from Transport Board):
06:15 AM - Bus 17D - Mathaganeri (Morning)
06:50 AM - Bus 17F - Kannangulam (Morning)
07:00 AM - Bus 17D - Vallioor (Morning)
08:40 AM - Bus 17F - Panagudi (Morning)
09:00 AM - Bus 15 - Mathaganeri (Morning)
09:30 AM - Bus 15 - Nagercoil (Morning)
09:45 AM - Bus 38K - Mathaganeri (Morning)
10:00 AM - Bus 38K - Nagercoil (Morning)
10:50 AM - Bus 17D - Mathaganeri (Morning)
11:15 AM - Bus 17D - Vallioor (Morning)
02:00 PM - Bus 17D - Mathaganeri (Afternoon)
02:30 PM - Bus 17D - Vallioor (Afternoon)
03:50 PM - Bus 15 - Azhaganeri (Afternoon)
04:15 PM - Bus 15 - Nagercoil (Afternoon)
04:25 PM - Bus 17F - Kannangulam (Afternoon)
05:30 PM - Bus 7D - Mathaganeri (Evening)
06:00 PM - Bus 7D - Nagercoil (Evening)
06:00 PM - Bus 17D - Mathaganeri (Evening)
06:20 PM - Bus 17D - Vallioor (Evening)
06:20 PM - Bus 17F - Panagudi (Evening)
08:55 PM - Bus 17D - Mathaganeri (Evening)
09:00 PM - Bus 17D - Vallioor (Evening)

TRAIN TIMINGS FROM KANYAKUMARI (CAPE):
Train 02666 - Howrah SF Express (08:00, Saturday) -> Howrah Jn (HWH)
Train 16382 - Pune Express (08:40, All Days) -> Pune Jn (PUNE)
Train 06525 - KSR Bengaluru Express (10:10, All Days) -> Bengaluru (SBC)
Train 16862 - Puducherry Express (14:00, Monday & Friday) -> Puducherry (PDY)
Train 16317 - Himsagar Express (14:15, Friday) -> Jammu (SVDK)
Train 66305 - Kollam MEMU Express (16:15, Except Friday) -> Kollam (QLN)
Train 15905 - Dibrugarh Vivek SF Express (17:20, Thursday) -> Dibrugarh (DBRG)
Train 02634 - Chennai Egmore SF Express (17:05, All Days) -> Egmore (MS)
Train 12641 - Thirukkural SF Express (19:10, Wednesday & Friday) -> Delhi (NZM)

TRAIN TIMINGS FROM NAGERCOIL (NCJ):
Train 16352 - Mumbai CSMT Express (06:15, Sunday & Thursday) -> Mumbai (CSMT)
Train 56310 - Trivandrum Cent. Passenger (06:30, All Days) -> Trivandrum (TVC)
Train 16321 - Coimbatore Express (UR) (06:25, All Days) -> Coimbatore (CBE)
Train 06430 - Kochuveli Intercity Spl. (UR) (07:50, All Days) -> Kochuveli (KCVL)
Train 16366 - Kottayam Express (13:00, All Days) -> Mangalore Ctrl. (MAQ)
Train 16192 - Antyodaya SF Express (15:45, All Days) -> Tambaram (TBM)
Train 12690 - MGR Chennai Central (19:35, Sunday) -> Chennai Ctrl. (MAS)

REGIONAL TNSTC BUSES:
• Route 111 Fast: Nagercoil Vadasery ↔ Tirunelveli New Bus Stand (via Aralvaimozhi, Kavalkinaru, Joy Univ. Crossing, Vallioor Bypass, Nanguneri - Every 20-30 mins from 05:30 AM to 09:00 PM)
• Route 5A: Nagercoil Christopher ↔ Vallioor Main Stand (via Thovalai, Aralvaimozhi, Vadakkankulam, Panagudi - Every 45 mins from 06:00 AM to 08:30 PM)
• Route 11A Coastal: Kanyakumari Terminal ↔ Nagercoil Anna Stand (via Kovalam, Suchindram Temple, Kottar - Every 15-20 mins)
• Route 22 Feeder: Vallioor ↔ Radhapuram via Joy University Gate & Vadakkankulam Market
• Route 7D Local: Panagudi ↔ Nagercoil Vadasery

TAMIL NADU STATE EXPRESS BUSES (TNSTC & SETC):
• SETC Ultra Deluxe: Nagercoil Central (Vadasery) ↔ Chennai Kilambakkam KCBT (Daily 04:00 PM, 05:30 PM, 06:30 PM, 07:45 PM, 08:30 PM, 09:15 PM)
• TNSTC Super Deluxe: Kanyakumari ↔ Coimbatore Gandhipuram (Daily 06:30 PM, 08:00 PM, 09:00 PM)
• TNSTC Express: Nagercoil Vadasery ↔ Madurai Mattuthavani (Frequent from 05:00 AM to 11:00 PM)
• Point-to-Point: Nagercoil Christopher ↔ Thiruvananthapuram Tampanoor (Every 20 mins)
• SETC Super Deluxe: Kanyakumari ↔ Rameswaram Island (06:45 AM, 07:30 PM)

MULTI-TIER PLATFORM GUIDE:
The Student Transit AI operating system provides 5 tiers:
1. Joy University Transport: 22 scheduled campus departures
2. Regional Transport: Local TNSTC city and district routes
3. State Transport: SETC & TNSTC state-level long-distance express
4. Railways: Southern Railway CAPE & NCJ stations
5. More Transport: Roadmap for airport shuttle (TRV/IXM), interstate KSRTC, metro feeder, and verified cabs
6. Smart Journey Planner: Multi-modal journey routing with step-by-step connections
7. Data Trust System: Clearly flags TIMETABLE, DEMO, and UNAVAILABLE.

CRITICAL RULES:
1. NEVER invent unverified bus timings, durations, intermediate stops, or live locations.
2. If the user asks about live GPS, vehicle speed, or live crowd counters, state that they are currently "Demo Tracking" or "Data Not Available" because physical hardware sensors are not yet linked.
3. If an answer cannot be verified from the official timetable information above, YOU MUST ANSWER: "I don't have reliable information for that right now."
4. Be helpful, concise, loyal, and clear for college students.
`;

// AI Chatbot API Route (IGRIS AI)
const handleIgrisChat = async (req: express.Request, res: express.Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!ai) {
      return res.status(503).json({ error: 'Gemini API not configured on server' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_KNOWLEDGE,
        temperature: 0.2, // Low temperature for maximum factual consistency
      },
    });

    const text = response.text || "I don't have reliable information for that yet.";
    res.json({ text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      error: 'Failed to process AI query',
      text: "I don't have reliable information for that yet."
    });
  }
};

app.post('/api/igris-ai', handleIgrisChat);
app.post('/api/transit-ai', handleIgrisChat);

// Mount Vite or serve static assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
