import { test, expect } from "@playwright/test";

test("cold presentation works with external internet blocked and leaves no submitted data", async ({
  context,
  page,
}) => {
  const external: string[] = [];
  const posts: string[] = [];
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (request.method() === "POST") posts.push(request.url());
  });
  await context.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === "127.0.0.1") return route.continue();
    external.push(url.origin);
    return route.abort("internetdisconnected");
  });
  await page.goto("/");
  await expect(page.locator(".bike-studio")).toHaveAttribute(
    "data-state",
    "ready",
    {
      timeout: 30_000,
    },
  );
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(() =>
      [...document.fonts].some((font) => font.status === "loaded"),
    ),
  ).toBe(true);
  for (const image of await page.locator(".bike-photo img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveJSProperty("complete", true);
    await expect(image).not.toHaveJSProperty("naturalWidth", 0);
  }
  await page.getByRole("link", { name: "Consultar test ride" }).first().click();
  await expect(
    page.getByRole("radio", { name: "Consultar test ride" }),
  ).toBeChecked();
  await page.getByLabel("Nome completo").fill("Pessoa Exemplo");
  await page.getByLabel("E-mail").fill("demo@example.com");
  await page.getByLabel("WhatsApp").fill("21900000000");
  await page.getByRole("textbox", { name: "Cidade" }).fill("Rio de Janeiro");
  await page
    .getByRole("button", { name: "Consultar test ride", exact: true })
    .click();
  await expect(page.getByRole("status")).toBeFocused();
  await page.reload();
  await expect(page.getByLabel("Nome completo")).toHaveValue("");
  await expect(page.locator("#lead-bike")).toHaveValue("");
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
      cookie: document.cookie,
    })),
  ).toEqual({ local: 0, session: 0, cookie: "" });
  expect(external).toEqual([]);
  expect(posts).toEqual([]);
  expect(errors).toEqual([]);
});
