import { describe, expect, it } from "vitest";
import { trackOpenGroupParts } from "@/lib/openGroupParts";

const shapes = (...ids: string[]) => ids.map((id) => ({ id }));

describe("the parts of an open group", () => {
  it("takes in what replaces a part, where that part stood", () => {
    // Ungrouping part c lays its two children loose under new ids.
    const parts = trackOpenGroupParts(["a", "b", "c", "d"], shapes("a", "b", "c", "d", "x"), shapes("a", "b", "d", "x", "c1", "c2"));
    expect(parts).toEqual(["a", "b", "c", "c1", "c2", "d"]);
  });

  it("follows a part through several replacements", () => {
    const start = ["a", "b", "c"];
    const ungrouped = trackOpenGroupParts(start, shapes("a", "b", "c"), shapes("a", "b", "c1", "c2"));
    const regrouped = trackOpenGroupParts(ungrouped, shapes("a", "b", "c1", "c2"), shapes("a", "b", "g"));
    expect(regrouped).toEqual(["a", "b", "c", "c1", "g", "c2"]);
  });

  it("keeps the group alive when every part is replaced at once", () => {
    expect(trackOpenGroupParts(["a", "b"], shapes("a", "b", "x"), shapes("x", "g"))).toEqual(["a", "g", "b"]);
  });

  it("takes in the result of combining a part with an outside object", () => {
    expect(trackOpenGroupParts(["a", "b"], shapes("a", "b", "x"), shapes("b", "cut"))).toEqual(["a", "cut", "b"]);
  });

  it("leaves new shapes, pastes and duplicates outside", () => {
    const parts = ["a", "b"];
    expect(trackOpenGroupParts(parts, shapes("a", "b"), shapes("a", "b", "copy"))).toBe(parts);
  });

  it("changes nothing when a part is only deleted", () => {
    const parts = ["a", "b"];
    expect(trackOpenGroupParts(parts, shapes("a", "b", "x"), shapes("a", "x"))).toBe(parts);
  });

  it("ignores replacements of objects outside the group", () => {
    const parts = ["a", "b"];
    expect(trackOpenGroupParts(parts, shapes("a", "b", "x", "y"), shapes("a", "b", "xy"))).toBe(parts);
  });

  it("keeps the ids of replaced parts, so undo brings them back as parts", () => {
    const grouped = trackOpenGroupParts(["a", "b", "c"], shapes("a", "b", "c"), shapes("a", "bc"));
    expect(grouped).toEqual(["a", "b", "bc", "c"]);
    // Undo: b and c return, bc goes - nothing new to take in, and b and c are still parts.
    expect(trackOpenGroupParts(grouped, shapes("a", "bc"), shapes("a", "b", "c"))).toBe(grouped);
  });
});
