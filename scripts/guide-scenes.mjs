// The pictures of the user guide. Each scene builds one situation in the
// running editor and takes its screenshots. `ctx` comes from
// guide-screenshots.mjs: ctx.t(key) is the interface's own wording in the
// current language, ctx.mcp(action, params) drives the editor, ctx.shot(name)
// writes docs/guide/images/<language>/<name>.webp.

const BLUE = "#3f8fd2";
const ORANGE = "#e0793a";
const GREEN = "#5aa469";

/** Opens the editor on an empty plate. */
async function freshEditor(ctx) {
  await ctx.goto("/?editor=1");
  await ctx.clearScene();
}

/** The status pill fades by itself; waiting keeps it out of the picture. */
async function quiet(ctx, ms = 4500) {
  await ctx.wait(ms);
}

async function create(ctx, params) {
  // Named the way the editor names a shape a person drops in, in the reader's language.
  const name = params.name ?? ctx.t(`shape.${params.kind}`);
  const created = await ctx.mcp("create_shape", { ...params, name });
  return created.object?.id ?? created.id;
}

async function select(ctx, ids) {
  await ctx.mcp("select_objects", { ids });
  await ctx.wait(500);
}

/** A small, good-looking starting point: a plate with a few bodies. */
async function sampleParts(ctx) {
  const box = await create(ctx, { kind: "box", x: -20, z: 0, width: 30, depth: 30, height: 20, color: BLUE });
  const cylinder = await create(ctx, { kind: "cylinder", x: 22, z: 4, width: 26, depth: 26, height: 30, color: ORANGE });
  return { box, cylinder };
}

export const scenes = {
  async "start-page"(ctx) {
    await ctx.goto("/", 5000);
    await ctx.shot("start-page");
  },

  async "editor-overview"(ctx) {
    await freshEditor(ctx);
    const { box } = await sampleParts(ctx);
    await select(ctx, [box]);
    await quiet(ctx);
    await ctx.shot("editor-overview");
  },

  async "shape-menu"(ctx) {
    await freshEditor(ctx);
    await sampleParts(ctx);
    await select(ctx, []);
    await ctx.clickSelector(".shape-menu-trigger");
    await ctx.wait(800);
    await ctx.shot("shape-menu");
  },

  async "hole-before"(ctx) {
    await freshEditor(ctx);
    const box = await create(ctx, { kind: "box", x: 0, z: 0, width: 40, depth: 40, height: 20, color: BLUE });
    const hole = await create(ctx, { kind: "cylinder", x: 0, z: 0, width: 16, depth: 16, height: 30, color: ORANGE });
    await ctx.mcp("update_object", { id: hole, hole: true });
    await select(ctx, [hole]);
    await quiet(ctx);
    await ctx.shot("hole-before");
    await ctx.mcp("group_objects", { ids: [box, hole] });
    await ctx.wait(2500);
    await select(ctx, []);
    await ctx.shot("hole-after");
  },

  async "fillet-tool"(ctx) {
    await freshEditor(ctx);
    const box = await create(ctx, { kind: "box", x: 0, z: 0, width: 40, depth: 40, height: 25, color: BLUE });
    await select(ctx, [box]);
    await ctx.click(ctx.t("editor.tool.fillet"));
    await ctx.wait(4500);
    await ctx.shot("fillet-tool");
    await ctx.click(ctx.t("edge.allSharpEdges"));
    await ctx.setField(ctx.t("edge.radius"), 4);
    await ctx.wait(3500);
    await ctx.shot("fillet-preview");
  },

  async "hollow-tool"(ctx) {
    await freshEditor(ctx);
    const box = await create(ctx, { kind: "box", x: 0, z: 0, width: 44, depth: 44, height: 30, color: GREEN });
    await select(ctx, [box]);
    await ctx.click(ctx.t("editor.tool.hollow"));
    await ctx.wait(1200);
    await ctx.shot("hollow-panel");
  },

  async "hollow-result"(ctx) {
    await freshEditor(ctx);
    const box = await create(ctx, { kind: "box", x: 0, z: 0, width: 44, depth: 44, height: 30, color: GREEN });
    await ctx.mcp("hollow_object", { id: box, thickness: 3, openings: "top", edges: "round" });
    await ctx.wait(5000);
    await select(ctx, []);
    await ctx.shot("hollow-result");
  },

  async "pattern-tool"(ctx) {
    await freshEditor(ctx);
    const plate = await create(ctx, { kind: "cylinder", x: 0, z: 0, width: 60, depth: 60, height: 6, color: BLUE });
    const hole = await create(ctx, { kind: "cylinder", x: 20, z: 0, width: 6, depth: 6, height: 10, color: ORANGE });
    await ctx.mcp("update_object", { id: hole, hole: true });
    await select(ctx, [hole]);
    await ctx.click(ctx.t("editor.tool.array"));
    await ctx.wait(800);
    await ctx.click(ctx.t("array.mode.circle"));
    await ctx.wait(1500);
    await ctx.shot("pattern-tool");
  },

  async "object-list"(ctx) {
    await freshEditor(ctx);
    const box = await create(ctx, { kind: "box", x: 0, z: 0, width: 40, depth: 40, height: 20, name: ctx.language === "de" ? "Grundplatte" : "Base plate", color: BLUE });
    const hole = await create(ctx, { kind: "cylinder", x: 0, z: 0, width: 14, depth: 14, height: 30, name: ctx.language === "de" ? "Bohrung" : "Bore", color: ORANGE });
    await ctx.mcp("update_object", { id: hole, hole: true });
    await create(ctx, { kind: "sphere", x: 45, z: 5, width: 20, depth: 20, height: 20, name: "Kugel", color: GREEN });
    await ctx.mcp("group_objects", { ids: [box, hole] });
    await ctx.wait(2500);
    await ctx.click(ctx.t("editor.tool.showOutliner"));
    await ctx.wait(1000);
    await ctx.shot("object-list");
  },

  async "settings-printer"(ctx) {
    await freshEditor(ctx);
    await sampleParts(ctx);
    await ctx.evaluate(`window.dispatchEvent(new Event("layerling:open-workspace-settings")); true`);
    await ctx.wait(1000);
    await ctx.click(ctx.t("workspace.workplane"), "button, [role=tab]");
    await ctx.wait(800);
    await ctx.chooseOption("Bambu Lab A1");
    await ctx.shot("settings-workplane");
  },

  async "export-panel"(ctx) {
    await freshEditor(ctx);
    const { box } = await sampleParts(ctx);
    await select(ctx, [box]);
    await ctx.click(ctx.t("editor.export"));
    await ctx.wait(1200);
    await ctx.shot("export-panel");
  },

  async "import-panel"(ctx) {
    await freshEditor(ctx);
    await ctx.click(ctx.t("editor.import"));
    await ctx.wait(1200);
    await ctx.shot("import-panel");
  },

  async "shortcuts"(ctx) {
    await freshEditor(ctx);
    await sampleParts(ctx);
    await ctx.click(ctx.t("editor.keyboardShortcuts"));
    await ctx.wait(1000);
    await ctx.shot("shortcuts");
  },

  async "curved-text"(ctx) {
    await freshEditor(ctx);
    await create(ctx, { kind: "cylinder", x: 0, z: 0, width: 64, depth: 64, height: 4, color: BLUE });
    const text = await create(ctx, { kind: "text", x: 0, z: 0, elevation: 4, height: 3, text: "layerling", color: ORANGE });
    await ctx.mcp("update_object", { id: text, textCurved: true, textRadius: 20, textSize: 8 });
    await select(ctx, [text]);
    await ctx.click(ctx.t("view.top"));
    await ctx.wait(1500);
    await ctx.reveal(ctx.t("prop.textFlipped"));
    await ctx.shot("curved-text");
  },

  async "thread-screw"(ctx) {
    await freshEditor(ctx);
    const screw = await create(ctx, { kind: "thread", threadRole: "screw", threadDiameter: 8, height: 30, color: ORANGE });
    await select(ctx, [screw]);
    await quiet(ctx, 1500);
    await ctx.shot("thread-screw");
  },
};


/** Opens the sketch editor for an extruded sketch and draws an L-shaped outline. */
async function drawOutline(ctx) {
  await ctx.goto("/?editor=1");
  await ctx.click(ctx.t("editor.modeSketch"));
  await ctx.wait(1500);
  await ctx.click(ctx.t("sketch.to3d"));
  await ctx.wait(800);
  await ctx.click(ctx.t("sketch.extrude"), undefined, true);
  await ctx.wait(2500);
  const points = [[430, 250], [640, 250], [640, 400], [540, 400], [540, 560], [430, 560], [430, 250]];
  for (const [x, y] of points) await ctx.mouse(x, y);
}

scenes["sketch"] = async (ctx) => {
  await drawOutline(ctx);
  await ctx.shot("sketch-outline");
  await ctx.click(ctx.t("sketch.filletCorner"));
  await ctx.setField(ctx.t("sketch.filletRadius"), 12);
  await ctx.shot("sketch-fillet");
  await ctx.clickSelector("button[aria-label='" + ctx.t("sketch.apply") + "']").catch(() => ctx.click(ctx.t("sketch.apply")));
  await ctx.wait(800);
  await ctx.click(ctx.t("sketch.finishSketch"));
  await ctx.wait(3500);
  await ctx.shot("sketch-result");
};

scenes["tape-measure"] = async (ctx) => {
  await freshEditor(ctx);
  const { box } = await sampleParts(ctx);
  await select(ctx, []);
  await ctx.clickSelector(".tape-trigger");
  await ctx.wait(800);
  await ctx.shot("tape-menu");
};

scenes["open-group"] = async (ctx) => {
  await freshEditor(ctx);
  const box = await create(ctx, { kind: "box", x: 0, z: 0, width: 40, depth: 40, height: 20, name: ctx.language === "de" ? "Grundplatte" : "Base plate", color: BLUE });
  const hole = await create(ctx, { kind: "cylinder", x: 0, z: 0, width: 14, depth: 14, height: 30, name: ctx.language === "de" ? "Bohrung" : "Bore", color: ORANGE });
  await ctx.mcp("update_object", { id: hole, hole: true });
  await ctx.mcp("group_objects", { ids: [box, hole] });
  await ctx.wait(2500);
  await ctx.click(ctx.t("editor.tool.showOutliner"));
  await ctx.click(ctx.t("group.open"));
  await ctx.wait(2500);
  await ctx.shot("open-group");
};

scenes["align"] = async (ctx) => {
  await freshEditor(ctx);
  const a = await create(ctx, { kind: "box", x: -20, z: -10, width: 30, depth: 20, height: 15, color: BLUE });
  const b = await create(ctx, { kind: "cylinder", x: 25, z: 15, width: 24, depth: 24, height: 25, color: ORANGE });
  await select(ctx, [a, b]);
  await ctx.click(ctx.t("editor.tool.align"));
  await ctx.wait(1200);
  await ctx.shot("align");
};

scenes["printer-overhang"] = async (ctx) => {
  await freshEditor(ctx);
  await create(ctx, { kind: "box", x: 0, z: 0, width: 210, depth: 50, height: 30, color: BLUE });
  await ctx.evaluate(`window.dispatchEvent(new Event("layerling:open-workspace-settings")); true`);
  await ctx.wait(1000);
  await ctx.click(ctx.t("workspace.workplane"), "button, [role=tab]");
  await ctx.chooseOption("Bambu Lab A1");
  await ctx.click(ctx.t("workspace.close"));
  await ctx.wait(1500);
  await ctx.click(ctx.t("view.top"));
  await ctx.wait(1500);
  await ctx.click(ctx.t("camera.home"));
  await ctx.wait(1500);
  await ctx.click(ctx.t("camera.zoomOut"));
  await ctx.click(ctx.t("camera.zoomOut"));
  await ctx.wait(1500);
  await ctx.mcp("select_objects", { ids: [] });
  await ctx.shot("printer-overhang");
};

scenes["editor-dark"] = async (ctx) => {
  await freshEditor(ctx);
  await sampleParts(ctx);
  await ctx.evaluate(`localStorage.setItem("layerling.theme", "dark"); true`);
  await ctx.goto("/?editor=1", 6000);
  await ctx.clearScene();
  await sampleParts(ctx);
  await select(ctx, []);
  await ctx.shot("editor-dark");
  await ctx.evaluate(`localStorage.setItem("layerling.theme", "light"); true`);
};

scenes["quick-guide"] = async (ctx) => {
  await freshEditor(ctx);
  await sampleParts(ctx);
  await ctx.click(ctx.t("editor.guide"));
  await ctx.wait(1200);
  await ctx.shot("quick-guide");
};
