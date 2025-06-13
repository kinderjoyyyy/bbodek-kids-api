const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const auth = new google.auth.JWT(
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  ["https://www.googleapis.com/auth/spreadsheets"]
);

const sheets = google.sheets({ version: "v4", auth });

app.post("/open-request", async (req, res) => {
  const { 기관명, 주소 } = req.body;
  const now = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "오픈요청!A:C", // A: 기관명, B: 주소, C: 시간
      valueInputOption: "RAW",
      requestBody: {
        values: [[기관명, 주소, now]],
      },
    });
    res.json({ success: true });
  } catch (error) {
    console.error("스프레드시트 기록 실패:", error);
    res.status(500).json({ success: false });
  }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API 서버 실행 중: http://localhost:${PORT}`));
