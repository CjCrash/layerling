import { describe, expect, it } from "vitest";
import { precachePaths, serviceWorkerSource } from "../../scripts/generate-service-worker.mjs";

describe("offline copy of layerling", () => {
  it("stores the program but not server scripts, crawler files or the duplicate kernel", () => {
    const paths = precachePaths([
      "index.html",
      "_next/static/chunks/app/page-abc.js",
      "_next/static/media/occt-wasm.6db3513f.wasm",
      "occt/5.3.5-layerling.1/occt-wasm.wasm",
      "manifold.wasm",
      "store.php",
      "kontakt.php",
      "robots.txt",
      "sitemap.xml",
      "index.txt",
      "404.html",
      "404/index.html",
      "sw.js",
      "_next/static/chunks/main.js.map",
    ]);
    expect(paths).toEqual([
      "/",
      "/_next/static/chunks/app/page-abc.js",
      "/manifold.wasm",
      "/occt/5.3.5-layerling.1/occt-wasm.wasm",
    ]);
  });

  it("writes a service worker that is valid JavaScript and carries its version", () => {
    const source = serviceWorkerSource("abc123", ["/", "/manifold.wasm"]);
    expect(() => new Function(source)).not.toThrow();
    expect(source).toContain('"abc123"');
    expect(source).toContain('["/","/manifold.wasm"]');
  });
});
