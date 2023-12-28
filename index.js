const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const { PuppeteerScreenRecorder } = require("puppeteer-screen-recorder");
const puppeteer = require("puppeteer");
const { PassThrough } = require("stream");
const app = express();
require("dotenv").config();

app.use(express.static("public"));

const PORT = process.env.PORT || 4000;

app.get("/scrape", (req, res) => {
  scrapeLogic(res);
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.get("/record", async (req, res) => {
  // Create a Puppeteer browser instance
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    headless: "new",
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  const page = await browser.newPage();
  await page.waitForFunction(() => document.readyState === "complete");
  await page.waitForNetworkIdle({ idleTime: 1000, timeout: 10000 });
  await page.setViewport({ width: 900, height: 900 });
  // Start screen recording
  const recorder = new PuppeteerScreenRecorder(page, {
    fps: 60,
    videoCrf: 28,
    videoCodec: "libx264",
    videoPreset: "ultrafast",
    videoBitrate: 1000,
    recordDurationLimit: 5,
    videoFrame: {
      width: 900,
      height: 900,
    },
  });

  const pipeStream = new PassThrough();
  await recorder.startStream(pipeStream);

  await page.goto("file://" + __dirname + "/public/index.html");
  console.log("got page html");
  console.log("finished sequence");

  setTimeout(async () => {
    await recorder.stop();
    await browser.close();
  }, 1000);
  await res.setHeader("Content-Type", "video/mp4");
  await res.setHeader("Content-Disposition", "inline; filename=recording.mp4");

  await pipeStream.pipe(res);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
