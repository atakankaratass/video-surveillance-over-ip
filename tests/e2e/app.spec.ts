import { test, expect } from "@playwright/test";

test("renders the bootstrap landing page", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "CS 418 Video Surveillance over IP" }),
  ).toBeVisible();
  await expect(page.getByText("Project status: bootstrap")).toBeVisible();
});
