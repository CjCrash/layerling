import type { Language } from "@/lib/i18n";
import type { ShapeKind } from "@/types/layerling";

/**
 * The chapters of the user guide (docs/guide) by what they are about, with the
 * file name each language gave them. The pages are static files next to the
 * program, so a link is a plain path. A test compares this table with the
 * chapters on disk - a chapter renamed there without a change here would leave
 * every question mark pointing nowhere.
 */
export const GUIDE_CHAPTERS = {
  start: { de: "erste-schritte", en: "getting-started" },
  view: { de: "ansicht-und-arbeitsebene", en: "view-and-workplane" },
  shapes: { de: "formen", en: "shapes" },
  select: { de: "auswaehlen-und-anordnen", en: "select-and-arrange" },
  solids: { de: "koerper-und-aussparungen", en: "solids-and-holes" },
  edges: { de: "kanten-und-aushoehlen", en: "edges-and-hollowing" },
  sketches: { de: "skizzen", en: "sketches" },
  text: { de: "text", en: "text" },
  threads: { de: "gewinde-und-mechanik", en: "threads-and-mechanics" },
  measuring: { de: "messen-und-notizen", en: "measuring-and-notes" },
  printing: { de: "drucken", en: "printing" },
  files: { de: "dateien-und-speichern", en: "files-and-saving" },
  shortcuts: { de: "tastenkuerzel", en: "shortcuts" },
  ai: { de: "ki-mit-mcp", en: "ai-with-mcp" },
  offline: { de: "offline-und-installieren", en: "offline-and-install" },
} as const satisfies Record<string, Record<Language, string>>;

export type GuideChapter = keyof typeof GUIDE_CHAPTERS;

/** The address of a chapter, or of the guide's overview when none is named. */
export function guideHref(language: Language, chapter?: GuideChapter): string {
  const directory = language === "de" ? "anleitung" : "guide";
  return chapter ? `/${directory}/${GUIDE_CHAPTERS[chapter][language]}.html` : `/${directory}/index.html`;
}

/** Which chapter explains a shape - the one its question mark opens. */
export function guideChapterForShape(shape: { kind: ShapeKind; groupedShapes?: readonly unknown[] }): GuideChapter {
  if (shape.groupedShapes?.length) return "solids";
  switch (shape.kind) {
    case "text":
      return "text";
    case "thread":
    case "spring":
    case "gear":
    case "bentTube":
    case "honeycomb":
    case "dovetail":
      return "threads";
    case "ruler":
      return "measuring";
    case "sketch":
    case "scribble":
      return "sketches";
    default:
      return "shapes";
  }
}
