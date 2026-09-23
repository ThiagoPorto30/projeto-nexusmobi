import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("desktop: editorial hero, catalog, real images and accessibility", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Mova o seu mundo",
  );
  await expect(page.locator(".bike-studio")).toHaveAttribute(
    "data-state",
    "ready",
    { timeout: 30_000 },
  );
  await page.screenshot({ path: "artifacts/desktop-hero.png" });
  await expect(page.locator(".bike-card")).toHaveCount(3);
  for (const image of await page.locator(".bike-photo img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveJSProperty("complete", true);
    await expect(image).not.toHaveJSProperty("naturalWidth", 0);
  }
  await page.locator("#contato").scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path: "artifacts/desktop-full.png", fullPage: true });
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  expect(errors).toEqual([]);
});

test("lead: model selection, invalid fields, send state, success and repetition", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator(".bike-card")
    .nth(1)
    .getByRole("link", { name: "Consultar preços" })
    .click();
  await expect(page.locator("#lead-bike")).toHaveValue("v20-mini");
  await expect(
    page.getByRole("radio", { name: "Consultar preços" }),
  ).toBeChecked();
  await page.getByRole("button", { name: "Consultar preços" }).click();
  await expect(page.locator(".field-error")).toHaveCount(4);
  await expect(page.getByLabel("Nome completo")).toBeFocused();
  await page.getByLabel("Nome completo").fill("Cliente Teste");
  await page.getByLabel("E-mail", { exact: false }).fill("teste@example.com");
  await page.getByLabel("WhatsApp", { exact: false }).fill("21999999999");
  await page.getByRole("textbox", { name: "Cidade" }).fill("Rio de Janeiro");
  const submissions: string[] = [];
  page.on("request", (request) => {
    if (request.method() === "POST") submissions.push(request.url());
  });
  await page.getByRole("button", { name: "Consultar preços" }).click();
  await expect(
    page.getByRole("button", { name: "Enviando..." }),
  ).toBeDisabled();
  await expect(page.getByRole("status")).toContainText("Pronto para um");
  await expect(page.getByRole("status")).toBeFocused();
  expect(submissions).toEqual([]);
  await page.getByRole("button", { name: "Fazer outra solicitação" }).click();
  await expect(page.getByLabel("Nome completo")).toHaveValue("");
  await expect(page.getByLabel("Nome completo")).toBeFocused();
});

for (const width of [360, 390, 768, 1024, 1440]) {
  test(`responsive ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);

    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    if (width < 900) {
      await page.getByRole("button", { name: "Abrir menu" }).click();
      await expect(page.locator("#mobile-menu")).not.toHaveAttribute(
        "inert",
        "",
      );
      await page.keyboard.press("Escape");
      await expect(
        page.getByRole("button", { name: "Abrir menu" }),
      ).toBeFocused();
      await page.getByRole("button", { name: "Abrir menu" }).click();
      await page
        .locator("#mobile-menu")
        .getByRole("link", { name: "Nossas bikes" })
        .click();
      await expect(page).toHaveURL(/#modelos$/);
      await expect(page.locator("#mobile-menu")).toHaveAttribute("inert", "");
    }
    await page.locator("#contato").scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({
      path: `artifacts/responsive-${width}.png`,
      fullPage: true,
    });
    await page.screenshot({ path: `artifacts/hero-${width}.png` });
    if (width >= 390) {
      await page
        .locator("#modelos")
        .screenshot({ path: `artifacts/catalog-${width}.png` });
      await page
        .locator("#contato")
        .screenshot({ path: `artifacts/contact-${width}.png` });
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
  });
}

test("reduced motion and keyboard skip link", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Pular para o conteúdo" }),
  ).toBeFocused();
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
});

test("mobile: accessible catalog survives viewport changes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/");
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  for (const width of [1024, 390, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await page
      .locator(".bike-card")
      .last()
      .getByRole("link", { name: "Consultar preços" })
      .click();
    await expect(page.locator("#lead-bike")).toHaveValue("laf-comfort");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
  }
});
