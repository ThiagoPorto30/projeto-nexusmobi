import { expect, test } from "@playwright/test";

test("hero presents a real bike photo without downloading a 3D scene", async ({
  page,
}) => {
  const models: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/models/")) models.push(request.url());
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const photo = page.locator(".hero img");
  await expect(photo).toBeVisible();
  await expect(photo).toHaveJSProperty("complete", true);
  await expect(photo).not.toHaveJSProperty("naturalWidth", 0);
  await page.getByRole("link", { name: "Ver modelos", exact: true }).click();
  await expect(page).toHaveURL(/#modelos$/);
  expect(models).toEqual([]);
});
