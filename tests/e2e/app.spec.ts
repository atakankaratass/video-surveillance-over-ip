import { test, expect } from "@playwright/test";

test("renders the player shell landing page", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "CS 418 Video Surveillance over IP" }),
  ).toBeVisible();
  await expect(page.getByTestId("player-video")).toBeVisible();
  await expect(page.getByText("Status: waiting-for-stream")).toBeVisible();
  await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Go Live" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Screenshot" })).toBeVisible();
});

test("updates status when pause and go live controls are used", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForTimeout(3000);

  await page.getByRole("button", { name: "Pause" }).click();
  await expect(page.getByText("Status: paused")).toBeVisible();
  await expect(page.getByRole("button", { name: "Resume" })).toBeVisible();
  await expect(
    page
      .getByTestId("player-video")
      .evaluate((video) => (video as HTMLVideoElement).paused),
  ).resolves.toBe(true);

  await page.getByRole("button", { name: "Resume" }).click();
  await expect(page.getByText("Status: live")).toBeVisible();
  await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();
  await expect(
    page
      .getByTestId("player-video")
      .evaluate((video) => !(video as HTMLVideoElement).paused),
  ).resolves.toBe(true);
});

test("renders time-shift controls for the live stream", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("seek-slider")).toBeVisible();
  await expect(page.getByTestId("current-time")).toBeVisible();
  await expect(page.getByTestId("live-edge-time")).toBeVisible();
  await expect(page.getByTestId("seek-input")).toBeVisible();
  await expect(page.getByTestId("seek-button")).toBeVisible();
});

test("supports explicit seek time entry", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(3000);

  await page.getByTestId("seek-input").fill("1");
  await page.getByTestId("seek-button").click();

  await expect(
    page
      .getByTestId("player-video")
      .evaluate((video) => (video as HTMLVideoElement).currentTime >= 1),
  ).resolves.toBe(true);
});
