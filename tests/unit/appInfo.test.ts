import { describe, expect, it } from "vitest";

import { formatStatusMessage } from "../../src/shared/appInfo";

describe("formatStatusMessage", () => {
  it("returns a readable bootstrap status label", () => {
    expect(formatStatusMessage("bootstrap")).toBe("Project status: bootstrap");
  });
});
