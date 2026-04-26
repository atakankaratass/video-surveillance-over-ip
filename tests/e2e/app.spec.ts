import { test, expect } from "@playwright/test";

test("renders the player shell landing page", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "CS 418 Video Surveillance over IP" }),
  ).toBeVisible();
  await expect(page.getByTestId("player-video")).toBeVisible();
  await expect(
    page.getByText("Player status: waiting-for-stream"),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Go Live" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Screenshot" })).toBeVisible();
});

test("updates status when pause and go live controls are used", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Pause" }).click();
  await expect(page.getByText("Player status: paused")).toBeVisible();
  await expect(page.getByRole("button", { name: "Resume" })).toBeVisible();

  await page.getByRole("button", { name: "Go Live" }).click();
  await expect(page.getByText("Player status: live")).toBeVisible();
  await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();
});
