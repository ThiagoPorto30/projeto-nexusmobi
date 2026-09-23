import { expect, test } from "@playwright/test";

test("3D studio loads, exposes keyboard views and identifies the demonstration", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".bike-studio")).toHaveAttribute(
    "data-state",
    "ready",
    { timeout: 30000 },
  );
  await expect(
    page.getByText("INOW V20 Brake Pro · modelo demonstrativo"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Vista frontal" }).click();
  await expect(page.locator(".bike-studio")).toHaveAttribute(
    "data-view",
    "front",
  );
  await page.getByRole("button", { name: "Vista lateral" }).click();
  await expect(page.locator(".bike-studio")).toHaveAttribute(
    "data-view",
    "side",
  );
  expect(errors).toEqual([]);
});

test("reduced motion defers the model and failed loading keeps the catalog usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  let downloads = 0;
  await page.route("**/models/*.bin", (route) => {
    downloads++;
    return route.abort();
  });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Explorar em 3D" }),
  ).toBeVisible();
  expect(downloads).toBe(0);
  await page.getByRole("button", { name: "Explorar em 3D" }).click();
  await expect(page.locator(".bike-studio")).toHaveAttribute(
    "data-state",
    "error",
  );
  await expect(
    page.getByRole("button", { name: "Tentar 3D novamente" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Ver modelos", exact: true }).click();
  await expect(page).toHaveURL(/#modelos$/);
  await expect(page.locator(".bike-card")).toHaveCount(3);
  await page.unroute("**/models/*.bin");
  await page.getByRole("button", { name: "Tentar 3D novamente" }).click();
  await expect(page.locator(".bike-studio")).toHaveAttribute(
    "data-state",
    "ready",
    { timeout: 30_000 },
  );
});

test("mobile loads 3D on request and recovers from a lost graphics context", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".bike-studio")).toHaveAttribute(
    "data-state",
    "idle",
  );
  await page.getByRole("button", { name: "Explorar em 3D" }).click();
  await expect(page.locator(".bike-studio")).toHaveAttribute(
    "data-state",
    "ready",
    { timeout: 30_000 },
  );
  await page.getByRole("button", { name: "Vista lateral" }).click();
  await expect(
    page.getByRole("button", { name: "Vista lateral" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.screenshot({ path: "artifacts/mobile-3d.png" });
  await page.locator(".studio-canvas canvas").evaluate((canvas) => {
    (canvas as HTMLCanvasElement)
      .getContext("webgl2")
      ?.getExtension("WEBGL_lose_context")
      ?.loseContext();
  });
  await expect(page.locator(".bike-studio")).toHaveAttribute(
    "data-state",
    "error",
  );
  await page.getByRole("button", { name: "Tentar 3D novamente" }).click();
  await expect(page.locator(".bike-studio")).toHaveAttribute(
    "data-state",
    "ready",
    { timeout: 30_000 },
  );
});
