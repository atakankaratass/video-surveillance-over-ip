import { expect, test } from "@playwright/test";

const metadata = {
  imageUrl: "/dash/thumbnails/sprite.jpg",
  entries: [
    { timeSeconds: 0, x: 0, y: 0, width: 160, height: 90 },
    { timeSeconds: 15, x: 160, y: 0, width: 160, height: 90 },
    { timeSeconds: 30, x: 320, y: 0, width: 160, height: 90 },
  ],
};

test("shows a thumbnail preview when hovering over the seek slider", async ({
  page,
}) => {
  await page.route("**/dash/thumbnails/metadata.json", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(metadata),
    });
  });

  await page.route("**/dash/thumbnails/sprite.jpg", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "image/png",
      body: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9s0m6S8AAAAASUVORK5CYII=",
        "base64",
      ),
    });
  });

  await page.goto("/");
  await page.waitForTimeout(1000);

  await page.getByTestId("player-video").evaluate((video) => {
    Object.defineProperty(video, "seekable", {
      configurable: true,
      value: {
        length: 1,
        end: () => 30,
      },
    });
  });

  await page.getByTestId("seek-slider").hover();

  await expect(page.getByTestId("thumbnail-preview")).toBeVisible();
});
