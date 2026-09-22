import { chromium } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir } from "node:fs/promises";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const folder = path.join(root, "apresentacao");
await mkdir(folder, { recursive: true });
const browser = await chromium.launch({ channel: "msedge" });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1080 },
    reducedMotion: "reduce",
  });
  await page.goto("http://127.0.0.1:3000");
  await page.evaluate(() => document.fonts.ready);
  for (const photo of await page.locator("main img").all()) {
    await photo.scrollIntoViewIfNeeded();
    await photo.evaluate((image) => image.decode());
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: path.join(folder, "01-desktop.png") });
  await page.screenshot({
    path: path.join(folder, "06-desktop-completo.png"),
    fullPage: true,
  });
  // Section crops omit sticky navigation, which otherwise lands in the middle
  // of a tall screenshot when Playwright temporarily enlarges the viewport.
  const sectionStyle =
    ".site-header, .skip-link { visibility: hidden !important; }";
  await page.locator("#modelos").screenshot({
    path: path.join(folder, "02-catalogo.png"),
    style: sectionStyle,
  });
  await page.locator("#contato").screenshot({
    path: path.join(folder, "03-contato.png"),
    style: sectionStyle,
  });
  await page.setViewportSize({ width: 390, height: 900 });
  await page.evaluate(() => window.scrollTo(0, 0));
  for (const photo of await page.locator("main img").all())
    await photo.evaluate((image) => image.decode());
  await page.screenshot({ path: path.join(folder, "04-celular.png") });
  await page.screenshot({
    path: path.join(folder, "05-celular-completo.png"),
    fullPage: true,
  });
  console.log("6 capturas salvas em apresentacao.");
} finally {
  await browser.close();
}
