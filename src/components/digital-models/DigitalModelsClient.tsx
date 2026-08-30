"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createDigitalModel,
  updateDigitalModel,
  deleteDigitalModel,
} from "@/app/actions/digital-models";
import type { DigitalModelInput } from "@/app/actions/digital-models";

// ── Types ─────────────────────────────────────────────────────────────────────

type ModelRow = {
  id: string;
  name: string;
  bio: string | null;
  parameters: unknown;
  createdAt: Date;
};

type Params = {
  subject: "FEMALE" | "MALE";
  ethnicity: string;
  skinTone: string;
  hairColor: string;
  hairType: string;
  age: string;
};

const DEFAULT_PARAMS: Params = {
  subject: "FEMALE",
  ethnicity: "auto",
  skinTone: "auto",
  hairColor: "auto",
  hairType: "auto",
  age: "auto",
};

// ── Option lists ──────────────────────────────────────────────────────────────

const ETHNICITY_OPTS: [string, string][] = [
  ["auto", "Auto"], ["white", "Caucasian"], ["black", "Black"],
  ["asian", "Asian"], ["latina", "Latina"], ["south_asian", "South Asian"],
  ["middle_eastern", "Middle Eastern"], ["mixed", "Mixed"],
];

const SKIN_OPTS: [string, string][] = [
  ["auto", "Auto"], ["fair", "Fair"], ["light", "Light"],
  ["medium", "Medium"], ["olive", "Olive"], ["tan", "Tan"],
  ["brown", "Brown"], ["dark", "Dark"],
];

const HAIR_COLOR_OPTS: [string, string][] = [
  ["auto", "Auto"], ["blonde", "Blonde"], ["brunette", "Brunette"],
  ["black", "Black"], ["red", "Red"], ["auburn", "Auburn"],
  ["silver", "Silver"], ["platinum", "Platinum"],
];

const HAIR_TYPE_OPTS: [string, string][] = [
  ["auto", "Auto"], ["straight", "Straight"], ["wavy", "Wavy"],
  ["curly", "Curly"], ["coily", "Coily"], ["long", "Long"],
  ["short", "Short"],
];

const AGE_OPTS: [string, string][] = [
  ["auto", "Auto"], ["20s", "20s"], ["30s", "30s"],
  ["40s", "40s"], ["50s", "50s"],
];

// ── Small helpers ─────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] uppercase tracking-[0.14em] text-neutral-500">{label}</p>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  opts,
}: {
  value: string;
  onChange: (v: string) => void;
  opts: [string, string][];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded border border-neutral-700 bg-neutral-800 px-2.5 py-1.5 text-xs text-neutral-100 focus:outline-none focus:ring-1 focus:ring-[#750851]"
    >
      {opts.map(([v, l]) => (
        <option key={v} value={v}>{l}</option>
      ))}
    </select>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="rounded bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-400">
      {label}
    </span>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function DigitalModelsClient({ initialModels }: { initialModels: ModelRow[] }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  // Panel state
  const [panelOpen, setPanelOpen]   = useState(false);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [deleteId,  setDeleteId]    = useState<string | null>(null);
  const [formError, setFormError]   = useState<string | null>(null);

  // Form state
  const [name,   setName]   = useState("");
  const [bio,    setBio]    = useState("");
  const [params, setParams] = useState<Params>(DEFAULT_PARAMS);

  function openCreate() {
    setEditingId(null);
    setName("");
    setBio("");
    setParams(DEFAULT_PARAMS);
    setFormError(null);
    setPanelOpen(true);
  }

  function openEdit(m: ModelRow) {
    setEditingId(m.id);
    setName(m.name);
    setBio(m.bio ?? "");
    const p = (m.parameters && typeof m.parameters === "object")
      ? m.parameters as Partial<Params>
      : {};
    setParams({ ...DEFAULT_PARAMS, ...p });
    setFormError(null);
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    setEditingId(null);
    setFormError(null);
  }

  function setParam<K extends keyof Params>(key: K, val: Params[K]) {
    setParams((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSave() {
    if (!name.trim()) { setFormError("Name is required."); return; }
    const input: DigitalModelInput = {
      name: name.trim(),
      bio: bio.trim() || undefined,
      parameters: params,
    };
    setPending(true);
    try {
      const result = editingId
        ? await updateDigitalModel(editingId, input)
        : await createDigitalModel(input);
      if ("error" in result) {
        setFormError(result.error ?? "An error occurred.");
      } else {
        closePanel();
        router.refresh();
      }
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(id: string) {
    setPending(true);
    try {
      await deleteDigitalModel(id);
      setDeleteId(null);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  const deleteTarget = initialModels.find((m) => m.id === deleteId);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Header ── */}
      <div className="mx-auto max-w-4xl px-8 py-12">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">AI Pipeline</p>
            <h1 className="mt-1.5 text-2xl font-light tracking-wide text-neutral-100">Digital Models</h1>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="rounded border border-[#750851] bg-[#750851] px-5 py-2 text-xs uppercase tracking-[0.14em] text-neutral-100 transition hover:bg-[#8a0960] disabled:opacity-50"
          >
            New Model
          </button>
        </div>

        {/* ── Model list ── */}
        {initialModels.length === 0 ? (
          <div className="rounded-lg border border-neutral-800 p-10 text-center">
            <p className="text-sm text-neutral-500">No digital models yet — create your first one.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {initialModels.map((m) => {
              const p = (m.parameters && typeof m.parameters === "object")
                ? m.parameters as Partial<Params>
                : {};
              const tags: string[] = [];
              if (p.subject) tags.push(p.subject === "MALE" ? "Male" : "Female");
              if (p.ethnicity && p.ethnicity !== "auto") tags.push(p.ethnicity.replace("_", " "));
              if (p.skinTone && p.skinTone !== "auto") tags.push(`${p.skinTone} skin`);
              if (p.hairColor && p.hairColor !== "auto") tags.push(`${p.hairColor} hair`);
              if (p.hairType && p.hairType !== "auto") tags.push(p.hairType);
              if (p.age && p.age !== "auto") tags.push(p.age);

              return (
                <div
                  key={m.id}
                  className="flex items-start justify-between gap-6 rounded-lg border border-neutral-800 bg-neutral-900 px-6 py-5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-light text-neutral-100">{m.name}</p>
                    {m.bio && (
                      <p className="mt-1 truncate text-xs text-neutral-500">{m.bio}</p>
                    )}
                    {tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {tags.map((t) => <Tag key={t} label={t} />)}
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(m)}
                      className="rounded border border-neutral-700 px-4 py-1.5 text-xs text-neutral-300 transition hover:border-neutral-500 hover:text-neutral-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(m.id)}
                      className="rounded border border-neutral-700 px-4 py-1.5 text-xs text-neutral-500 transition hover:border-red-800 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Side panel overlay ── */}
      {panelOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/70"
            onClick={closePanel}
          />
          {/* Panel */}
          <div className="flex w-full max-w-md flex-col overflow-y-auto border-l border-neutral-800 bg-neutral-950">
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-5">
              <p className="text-sm font-light tracking-wide text-neutral-100">
                {editingId ? "Edit Model" : "New Model"}
              </p>
              <button
                type="button"
                onClick={closePanel}
                className="text-lg leading-none text-neutral-500 transition hover:text-neutral-200"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Form body */}
            <div className="flex flex-1 flex-col gap-6 px-6 py-6">
              {/* Name */}
              <Field label="Model Name">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Valentina"
                  className="w-full rounded border border-neutral-700 bg-neutral-800 px-2.5 py-1.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-[#750851]"
                />
              </Field>

              {/* Bio */}
              <Field label="Bio (optional)">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Short description shown to subscribers…"
                  rows={3}
                  className="w-full resize-none rounded border border-neutral-700 bg-neutral-800 px-2.5 py-1.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-[#750851]"
                />
              </Field>

              {/* Divider */}
              <div className="border-t border-neutral-800" />
              <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">Appearance</p>

              {/* Subject */}
              <Field label="Subject">
                <div className="flex gap-2">
                  {(["FEMALE", "MALE"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setParam("subject", s)}
                      className={`rounded border px-4 py-1.5 text-xs transition ${
                        params.subject === s
                          ? "border-[#750851] bg-[#750851] text-neutral-100"
                          : "border-neutral-700 text-neutral-400 hover:border-neutral-500"
                      }`}
                    >
                      {s === "FEMALE" ? "Female" : "Male"}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Ethnicity">
                <Select value={params.ethnicity} onChange={(v) => setParam("ethnicity", v)} opts={ETHNICITY_OPTS} />
              </Field>

              <Field label="Skin Tone">
                <Select value={params.skinTone} onChange={(v) => setParam("skinTone", v)} opts={SKIN_OPTS} />
              </Field>

              <Field label="Hair Color">
                <Select value={params.hairColor} onChange={(v) => setParam("hairColor", v)} opts={HAIR_COLOR_OPTS} />
              </Field>

              <Field label="Hair Type">
                <Select value={params.hairType} onChange={(v) => setParam("hairType", v)} opts={HAIR_TYPE_OPTS} />
              </Field>

              <Field label="Age Range">
                <Select value={params.age} onChange={(v) => setParam("age", v)} opts={AGE_OPTS} />
              </Field>

              {formError && (
                <p className="text-xs text-red-400">{formError}</p>
              )}
            </div>

            {/* Panel footer */}
            <div className="flex gap-3 border-t border-neutral-800 px-6 py-5">
              <button
                type="button"
                onClick={handleSave}
                disabled={pending}
                className="flex-1 rounded bg-[#750851] py-2 text-xs uppercase tracking-[0.14em] text-neutral-100 transition hover:bg-[#8a0960] disabled:opacity-50"
              >
                {pending ? "Saving…" : editingId ? "Save Changes" : "Create Model"}
              </button>
              <button
                type="button"
                onClick={closePanel}
                disabled={pending}
                className="rounded border border-neutral-700 px-4 py-2 text-xs text-neutral-400 transition hover:text-neutral-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-sm rounded-lg border border-neutral-800 bg-neutral-950 p-6">
            <p className="text-sm font-light text-neutral-100">
              Delete <span className="font-normal text-neutral-200">{deleteTarget?.name}</span>?
            </p>
            <p className="mt-1.5 text-xs text-neutral-500">
              This cannot be undone. Any generations using this model will retain their settings.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => handleDelete(deleteId)}
                disabled={pending}
                className="flex-1 rounded bg-red-800 py-2 text-xs uppercase tracking-[0.10em] text-neutral-100 transition hover:bg-red-700 disabled:opacity-50"
              >
                {pending ? "Deleting…" : "Delete"}
              </button>
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={pending}
                className="rounded border border-neutral-700 px-4 py-2 text-xs text-neutral-400 transition hover:text-neutral-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
