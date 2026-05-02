import { expect, test } from "@playwright/test";

test("shows motion notification when motion status reports detection", async ({
  page,
}) => {
  await page.route("**/dash/motion/status.json", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ kind: "motion", detected: true, score: 0.4 }),
    });
  });

  await page.goto("/");
  await page.waitForTimeout(1500);

  await expect(page.getByTestId("motion-notification")).toBeVisible();
});
