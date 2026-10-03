import { unzipSync, zipSync } from "fflate";

/*
 * "Back up all designs": every design of this browser as its own .lyl file,
 * together in one ZIP. The ZIP is opened again through the start page's
 * "open" tile and brings every design back - into this browser or another.
 * The .lyl files are already compressed, so the ZIP only stores them.
 */

export type BackupEntry = { name: string; bytes: Uint8Array };

export function backupFileName(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `layerling-backup-${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}.zip`;
}

/** File names for the designs: readable, safe on every system, never twice the same. */
export function backupEntryNames(projectNames: string[], fallback = "design") {
  const used = new Set<string>();
  return projectNames.map((projectName) => {
    const base = projectName
      .replace(/[\\/:*?"<>|\u0000-\u001f]/g, "-")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^\.+/, "")
      .slice(0, 120) || fallback;
    let name = `${base}.lyl`;
    for (let number = 2; used.has(name.toLowerCase()); number += 1) name = `${base} (${number}).lyl`;
    used.add(name.toLowerCase());
    return name;
  });
}

export function packBackup(entries: BackupEntry[], modified = new Date()): Uint8Array {
  const files: Record<string, [Uint8Array, { level: 0; mtime: Date }]> = {};
  for (const entry of entries) files[entry.name] = [entry.bytes, { level: 0, mtime: modified }];
  return zipSync(files);
}

/** The designs inside a backup, in the order they were packed. Other files are ignored. */
export function unpackBackup(bytes: Uint8Array): BackupEntry[] {
  const files = unzipSync(bytes, { filter: (file) => /\.(lyl|skf)$/i.test(file.name) });
  return Object.entries(files).map(([path, data]) => ({ name: path.split("/").pop() ?? path, bytes: data }));
}

export function isBackupFileName(fileName: string) {
  return /\.zip$/i.test(fileName);
}

/**
 * Ein ZIP ist nur dann eine Sicherung, wenn Entwuerfe darin liegen. Tinkercad
 * gibt seine OBJ ebenfalls als ZIP heraus (mit der .mtl), und die ist ein
 * Import. Gelesen werden dafuer nur die Namen, nichts wird entpackt.
 */
export function zipHoldsDesigns(bytes: Uint8Array) {
  let found = false;
  try {
    unzipSync(bytes, {
      filter: (file) => {
        if (/\.(lyl|skf)$/i.test(file.name)) found = true;
        return false;
      },
    });
  } catch {
    return false;
  }
  return found;
}
