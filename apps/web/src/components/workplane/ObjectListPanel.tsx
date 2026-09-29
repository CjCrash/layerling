"use client";

import { useMemo, useState, useRef, useEffect, type KeyboardEvent, type MouseEvent } from "react";
import { ChevronDown, ChevronRight, Eye, EyeOff, Layers, ListTree, Lock, Pencil, Search, Unlock, X } from "lucide-react";
import { useLanguage } from "@/lib/useLanguage";
import { t, type MessageKey } from "@/lib/i18n";
import type { WorkplaneShape } from "@/types/layerling";

export interface ObjectListPanelProps {
  shapes: WorkplaneShape[];
  selectedIds: string[];
  onSelectShape: (id: string | string[], mode?: "replace" | "toggle") => void;
  onToggleLock: (id: string) => void;
  onToggleHidden: (id: string) => void;
  onRenameShape?: (id: string, name: string) => void;
  onClose: () => void;
}

export function ObjectListPanel({
  shapes,
  selectedIds,
  onSelectShape,
  onToggleLock,
  onToggleHidden,
  onRenameShape,
  onClose,
}: ObjectListPanelProps) {
  useLanguage();
  const [filterText, setFilterText] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const toggleGroupExpand = (groupId: string, e: MouseEvent) => {
    e.stopPropagation();
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const getShapeDisplayName = (shape: WorkplaneShape): string => {
    if (shape.name?.trim()) return shape.name.trim();
    if (shape.groupedShapes?.length) return t("shape.group");
    if (shape.importedMesh) return t("shape.importedMesh");
    const key = `shape.${shape.kind}` as MessageKey;
    const translated = t(key);
    return translated || shape.kind;
  };

  const getShapeKindSubtitle = (shape: WorkplaneShape): string => {
    if (shape.groupedShapes?.length) {
      return t("outliner.children", { count: shape.groupedShapes.length });
    }
    const key = `shape.${shape.kind}` as MessageKey;
    const translated = t(key);
    return translated || shape.kind;
  };

  const startRename = (shape: WorkplaneShape, e: MouseEvent) => {
    e.stopPropagation();
    setEditingId(shape.id);
    setEditingDraft(shape.name ?? getShapeDisplayName(shape));
  };

  const commitRename = () => {
    if (editingId && onRenameShape) {
      const trimmed = editingDraft.trim();
      onRenameShape(editingId, trimmed);
    }
    setEditingId(null);
  };

  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitRename();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setEditingId(null);
    }
  };

  const handleRowClick = (shapeId: string, e: MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      onSelectShape(shapeId, "toggle");
    } else {
      onSelectShape(shapeId, "replace");
    }
  };

  const filteredShapes = useMemo(() => {
    const query = filterText.trim().toLowerCase();
    if (!query) return shapes;
    return shapes.filter((shape) => {
      const name = getShapeDisplayName(shape).toLowerCase();
      const kind = shape.kind.toLowerCase();
      return name.includes(query) || kind.includes(query);
    });
  }, [shapes, filterText]);

  return (
    <div className="outliner-panel" role="region" aria-label={t("outliner.title")}>
      <header className="outliner-header">
        <div className="outliner-title-wrap">
          <ListTree size={16} aria-hidden="true" className="outliner-header-icon" />
          <strong>{t("outliner.title")}</strong>
          <span className="outliner-count-badge">{shapes.length}</span>
        </div>
        <button
          className="outliner-close-button"
          type="button"
          aria-label={t("panel.close", { title: t("outliner.title") })}
          onClick={onClose}
        >
          <X size={16} />
        </button>
      </header>

      {shapes.length > 4 ? (
        <div className="outliner-search-wrap">
          <Search size={14} className="outliner-search-icon" aria-hidden="true" />
          <input
            className="outliner-search-input"
            type="text"
            placeholder={t("outliner.search")}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          {filterText ? (
            <button
              className="outliner-search-clear"
              type="button"
              onClick={() => setFilterText("")}
              aria-label="Filter leeren"
            >
              <X size={12} />
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="outliner-list-wrap">
        {filteredShapes.length === 0 ? (
          <div className="outliner-empty-state">
            <span>{filterText ? t("outliner.noMatches") : t("outliner.empty")}</span>
          </div>
        ) : (
          <ul className="outliner-list" role="listbox" aria-multiselectable="true">
            {filteredShapes.map((shape) => {
              const isSelected = selectedSet.has(shape.id);
              const isGroup = Boolean(shape.groupedShapes && shape.groupedShapes.length > 0);
              const isExpanded = Boolean(expandedGroups[shape.id]);
              const displayName = getShapeDisplayName(shape);
              const subtitle = getShapeKindSubtitle(shape);

              return (
                <li
                  key={shape.id}
                  className={`outliner-item ${isSelected ? "selected" : ""} ${shape.hidden ? "hidden-shape" : ""} ${shape.locked ? "locked-shape" : ""}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={(e) => handleRowClick(shape.id, e)}
                >
                  <div className="outliner-row-main">
                    {isGroup ? (
                      <button
                        type="button"
                        className="outliner-expand-toggle"
                        onClick={(e) => toggleGroupExpand(shape.id, e)}
                        aria-label={isExpanded ? "Gruppe einklappen" : "Gruppe aufklappen"}
                      >
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>
                    ) : (
                      <span className="outliner-expand-spacer" />
                    )}

                    <span
                      className={`outliner-swatch ${shape.hole ? "swatch-hole" : ""}`}
                      style={{ backgroundColor: shape.hole ? undefined : shape.color }}
                      title={shape.hole ? t("outliner.hole") : t("outliner.solid")}
                    />

                    <div className="outliner-info">
                      {editingId === shape.id ? (
                        <input
                          ref={editInputRef}
                          className="outliner-rename-input"
                          value={editingDraft}
                          onChange={(e) => setEditingDraft(e.target.value)}
                          onBlur={commitRename}
                          onKeyDown={handleEditKeyDown}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div className="outliner-label-group" onDoubleClick={(e) => startRename(shape, e)}>
                          <span className="outliner-shape-name" title={displayName}>
                            {displayName}
                          </span>
                          <span className="outliner-shape-kind">{subtitle}</span>
                        </div>
                      )}
                    </div>

                    <div className="outliner-badges">
                      <span className={`outliner-badge ${shape.hole ? "badge-hole" : "badge-solid"}`}>
                        {shape.hole ? t("outliner.hole") : t("outliner.solid")}
                      </span>
                    </div>

                    <div className="outliner-row-actions">
                      {onRenameShape && editingId !== shape.id ? (
                        <button
                          type="button"
                          className="outliner-action-btn rename-btn"
                          title="Umbenennen"
                          aria-label="Umbenennen"
                          onClick={(e) => startRename(shape, e)}
                        >
                          <Pencil size={13} />
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className={`outliner-action-btn ${shape.locked ? "active-locked" : ""}`}
                        title={shape.locked ? t("outliner.unlock") : t("outliner.lock")}
                        aria-label={shape.locked ? t("outliner.unlock") : t("outliner.lock")}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleLock(shape.id);
                        }}
                      >
                        {shape.locked ? <Lock size={14} /> : <Unlock size={14} />}
                      </button>
                      <button
                        type="button"
                        className={`outliner-action-btn ${shape.hidden ? "active-hidden" : ""}`}
                        title={shape.hidden ? t("outliner.show") : t("outliner.hide")}
                        aria-label={shape.hidden ? t("outliner.show") : t("outliner.hide")}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleHidden(shape.id);
                        }}
                      >
                        {shape.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  {isGroup && isExpanded && shape.groupedShapes ? (
                    <ul className="outliner-children-list">
                      {shape.groupedShapes.map((child, index) => {
                        const childDisplayName = getShapeDisplayName(child);
                        return (
                          <li key={child.id || index} className="outliner-child-item">
                            <span
                              className={`outliner-swatch small ${child.hole ? "swatch-hole" : ""}`}
                              style={{ backgroundColor: child.hole ? undefined : child.color }}
                            />
                            <span className="outliner-child-name" title={childDisplayName}>
                              {childDisplayName}
                            </span>
                            <span className={`outliner-badge small ${child.hole ? "badge-hole" : "badge-solid"}`}>
                              {child.hole ? t("outliner.hole") : t("outliner.solid")}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
