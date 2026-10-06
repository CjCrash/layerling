import { afterEach, describe, expect, it } from "vitest";
import { setLanguage } from "@/lib/i18n";
import { ERROR_RULES, localizedError } from "@/lib/userErrors";
import { MESSAGES_DE } from "@/lib/messages.de";
import { MESSAGES_EN } from "@/lib/messages.en";

describe("error messages for people", () => {
  afterEach(() => setLanguage("en"));

  it("shows known English error texts in German", () => {
    setLanguage("de");
    expect(localizedError("The stored CAD feature could not be restored as a valid solid")).toBe(MESSAGES_DE["error.storedBodyRestore"]);
    expect(localizedError("The chosen size does not leave a closed solid")).toBe(MESSAGES_DE["edge.errorNoSolidResult"]);
    expect(localizedError("SVG is too large. The maximum supported size is 5 MB")).toContain("5 MB");
    expect(localizedError("OBJ contains a degenerate face")).toBe(MESSAGES_DE["error.objBroken"]);
  });

  it("puts a German sentence around an unknown English text, and leaves German alone", () => {
    setLanguage("de");
    expect(localizedError("Something unexpected could not be written")).toContain("Technische Angabe");
    expect(localizedError("Der Entwurf ließ sich nicht speichern.")).toBe("Der Entwurf ließ sich nicht speichern.");
  });

  it("shows English texts in English", () => {
    setLanguage("en");
    expect(localizedError("The stored CAD feature could not be restored as a valid solid")).toBe(MESSAGES_EN["error.storedBodyRestore"]);
    expect(localizedError("Something unexpected could not be written")).toBe("Something unexpected could not be written");
  });

  it("has a German and an English text for every rule", () => {
    for (const rule of ERROR_RULES) {
      expect(MESSAGES_DE[rule.key], rule.key).toBeTruthy();
      expect(MESSAGES_EN[rule.key], rule.key).toBeTruthy();
    }
  });
});
