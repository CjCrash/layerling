import { afterEach, describe, expect, it } from "vitest";
import { setLanguage } from "@/lib/i18n";
import { displayShapeName } from "@/lib/shapeCatalog";

describe("displayShapeName", () => {
  afterEach(() => setLanguage("en", false));

  it("shows the editor's own English names in the interface language", () => {
    setLanguage("de", false);
    expect(displayShapeName({ name: "Sketch extrusion", kind: "mesh" })).toBe("Skizzenkörper");
    expect(displayShapeName({ name: "Sketch revolve", kind: "mesh" })).toBe("Drehkörper");
    expect(displayShapeName({ name: "Group", kind: "mesh" })).toBe("Gruppe");
    expect(displayShapeName({ name: "Box", kind: "box" })).toBe("Quader");
    expect(displayShapeName({ name: "Cylinder", kind: "cylinder" })).toBe("Zylinder");
  });

  it("leaves a name somebody typed alone", () => {
    setLanguage("de", false);
    expect(displayShapeName({ name: "Deckel", kind: "box" })).toBe("Deckel");
    // "Box" on a cylinder is not the catalogue name for it, so it was chosen.
    expect(displayShapeName({ name: "Box", kind: "cylinder" })).toBe("Box");
  });

  it("switches back with the language", () => {
    setLanguage("en", false);
    expect(displayShapeName({ name: "Sketch extrusion", kind: "mesh" })).toBe("Sketch body");
    expect(displayShapeName({ name: "Box", kind: "box" })).toBe("Box");
  });
});
