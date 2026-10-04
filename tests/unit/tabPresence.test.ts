import { describe, expect, it } from "vitest";
import { isTabPresenceMessage, tabPresenceState, type TabPeer } from "@/lib/tabPresence";

const peers = (...entries: Array<[string, TabPeer]>) => new Map(entries);

describe("tab presence", () => {
  it("stays quiet when no other tab is open, or others run the same version on other designs", () => {
    expect(tabPresenceState(peers(), "1.34.0", "a")).toEqual({ newerVersion: null, sameProjectElsewhere: false });
    expect(tabPresenceState(peers(["t1", { version: "1.34.0", projectId: "b" }]), "1.34.0", "a"))
      .toEqual({ newerVersion: null, sameProjectElsewhere: false });
  });

  it("names the newest version another tab runs, only when it is newer than this one", () => {
    const others = peers(["t1", { version: "1.35.0", projectId: null }], ["t2", { version: "1.36.1", projectId: null }], ["t3", { version: "1.33.0", projectId: null }]);
    expect(tabPresenceState(others, "1.34.0", null).newerVersion).toBe("1.36.1");
    expect(tabPresenceState(others, "1.37.0", null).newerVersion).toBeNull();
  });

  it("warns when another tab has the design open that this tab edits, not on the start page", () => {
    const others = peers(["t1", { version: "1.34.0", projectId: "a" }]);
    expect(tabPresenceState(others, "1.34.0", "a").sameProjectElsewhere).toBe(true);
    expect(tabPresenceState(others, "1.34.0", null).sameProjectElsewhere).toBe(false);
    expect(tabPresenceState(peers(["t1", { version: "1.34.0", projectId: null }]), "1.34.0", null).sameProjectElsewhere).toBe(false);
  });

  it("takes only well-formed messages from the channel", () => {
    expect(isTabPresenceMessage({ kind: "hello", tabId: "x", version: "1.34.0", projectId: null })).toBe(true);
    expect(isTabPresenceMessage({ kind: "here", tabId: "x", version: "1.34.0", projectId: "a" })).toBe(true);
    expect(isTabPresenceMessage({ kind: "bye", tabId: "x" })).toBe(true);
    expect(isTabPresenceMessage({ kind: "hello", tabId: "x", version: 1, projectId: null })).toBe(false);
    expect(isTabPresenceMessage({ kind: "other", tabId: "x" })).toBe(false);
    expect(isTabPresenceMessage(null)).toBe(false);
    expect(isTabPresenceMessage("hello")).toBe(false);
  });
});
