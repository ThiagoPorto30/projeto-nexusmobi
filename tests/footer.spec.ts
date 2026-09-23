import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [390, 1440]) {
  test(`footer and privacy navigation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    const whatsapp = footer.getByRole("link", { name: /WhatsApp/ });
    const instagram = footer.getByRole("link", { name: /Instagram/ });
    await expect(whatsapp).toHaveAttribute(
      "href",
      "https://wa.me/message/2RQSKLOYV4QYN1",
    );
    await expect(instagram).toHaveAttribute(
      "href",
      "https://www.instagram.com/nexus.mobi/",
    );
    await expect(whatsapp.locator("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    await expect(instagram.locator("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    await footer.scrollIntoViewIfNeeded();
    await footer.screenshot({ path: `artifacts/footer-${width}.png` });
    await footer.getByRole("link", { name: "Privacidade" }).click();
    await expect(page).toHaveURL(/\/privacidade$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Sua privacidade, com clareza.",
    );
    await expect(
      page.getByText("O formulário não envia nem armazena seus dados."),
    ).toBeVisible();
    await page.reload();
    await expect(page.getByRole("main")).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
    await page.screenshot({
      path: `artifacts/privacy-${width}.png`,
      fullPage: true,
    });
    await page
      .getByRole("navigation", { name: "Links do rodapé" })
      .getByRole("link", { name: "Nossas bikes" })
      .click();
    await expect(page).toHaveURL(/\/#modelos$/);
    await expect(
      page.getByRole("heading", { name: "Três jeitos de seguir em frente." }),
    ).toBeVisible();
  });
}
