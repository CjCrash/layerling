import { isNewerVersion } from "@/lib/appUpdate";

/**
 * layerling tabs in one browser tell each other which version they run and
 * which design they have open, over a BroadcastChannel. Two tabs on one
 * design both autosave and overwrite each other, and a tab left open from
 * before an update keeps running the old code - both happened to users
 * without any sign on screen (#90).
 */
export const TAB_PRESENCE_CHANNEL = "layerling-tabs";

export type TabPresenceMessage =
  | { kind: "hello" | "here"; tabId: string; version: string; projectId: string | null }
  | { kind: "bye"; tabId: string };

export type TabPeer = { version: string; projectId: string | null };

export type TabPresenceState = {
  /** The newest version another tab runs, when it is newer than this one. */
  newerVersion: string | null;
  /** Another tab has the design open that this tab is editing. */
  sameProjectElsewhere: boolean;
};

export function isTabPresenceMessage(value: unknown): value is TabPresenceMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Record<string, unknown>;
  if (typeof message.tabId !== "string") return false;
  if (message.kind === "bye") return true;
  return (message.kind === "hello" || message.kind === "here")
    && typeof message.version === "string"
    && (message.projectId === null || typeof message.projectId === "string");
}

/** What the other tabs mean for this one. */
export function tabPresenceState(peers: ReadonlyMap<string, TabPeer>, version: string, projectId: string | null): TabPresenceState {
  let newerVersion: string | null = null;
  let sameProjectElsewhere = false;
  peers.forEach((peer) => {
    if (isNewerVersion(peer.version, newerVersion ?? version)) newerVersion = peer.version;
    if (projectId && peer.projectId === projectId) sameProjectElsewhere = true;
  });
  return { newerVersion, sameProjectElsewhere };
}
