"use client";

import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { cn } from "@/lib/cn";
import { SEARCH_GROUPS, type SearchEntry } from "@/lib/search-groups";

const noSubscribe = () => () => {};

/** Dispatched on window to open search from elsewhere, such as the phone menu. */
export const OPEN_SEARCH_EVENT = "assocads:open-search";

/** At most this many results, so the list stays readable. */
const LIMIT = 24;

/** Lower case, without accents, so "Resume" finds "Résumé". */
const fold = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

type Prepared = SearchEntry & { title: string; body: string };

/** Every word typed must appear somewhere. Matches in the title, and at the
    start of the title or of a word, rank higher. */
function rank(items: Prepared[], query: string): Prepared[] {
  const words = fold(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const scored: { item: Prepared; score: number }[] = [];
  for (const item of items) {
    let score = 0;
    let ok = true;
    for (const w of words) {
      if (item.title.startsWith(w)) score += 6;
      else if (item.title.includes(` ${w}`)) score += 4;
      else if (item.title.includes(w)) score += 3;
      else if (item.body.includes(w)) score += 1;
      else {
        ok = false;
        break;
      }
    }
    if (!ok) continue;
    // Shorter titles that match are usually the page someone wants.
    score -= item.title.length / 200;
    scored.push({ item, score });
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, LIMIT)
    .map((s) => s.item);
}

/**
 * Site search: a button in the header that opens a search dialog, also
 * opened with Ctrl+K, Cmd+K or "/". The index (/search-index.json) is
 * downloaded the first time the dialog opens. The dialog is a native
 * <dialog>, so focus stays inside it and Escape closes it; the input is an
 * ARIA combobox and the results a grouped listbox, moved with the arrow keys.
 */
export function SiteSearch() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Prepared[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(0);
  // "⌘K" on Apple devices, "Ctrl K" elsewhere (and in the server render).
  const isMac = useSyncExternalStore(
    noSubscribe,
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => false,
  );

  const show = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setOpen(true);
    dialog.showModal();
    inputRef.current?.select();
  }, []);

  const hide = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  // Download the index once, the first time search opens.
  useEffect(() => {
    if (!open || items || failed) return;
    let cancelled = false;
    fetch("/search-index.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: SearchEntry[]) => {
        if (cancelled) return;
        setItems(
          data.map((e) => ({
            ...e,
            title: fold(e.t),
            body: fold(`${e.d} ${e.k ?? ""} ${e.g}`),
          })),
        );
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [open, items, failed]);

  // The phone menu has its own Search item (the header button is hidden on
  // the narrowest screens); it asks for search with this event.
  useEffect(() => {
    window.addEventListener(OPEN_SEARCH_EVENT, show);
    return () => window.removeEventListener(OPEN_SEARCH_EVENT, show);
  }, [show]);

  // Keyboard shortcuts: Cmd+K or Ctrl+K anywhere, "/" outside text fields.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName ?? "");
      if (
        (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) ||
        (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey)
      ) {
        event.preventDefault();
        if (dialogRef.current?.open) inputRef.current?.focus();
        else show();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [show]);

  const results = useMemo(
    () => (items ? rank(items, query) : []),
    [items, query],
  );

  // Results in group order, keeping the ranking inside each group.
  const groups = useMemo(() => {
    const byGroup = new Map<string, Prepared[]>();
    for (const r of results) {
      const list = byGroup.get(r.g) ?? [];
      list.push(r);
      byGroup.set(r.g, list);
    }
    return SEARCH_GROUPS.filter((g) => byGroup.has(g)).reduce<
      { label: string; items: Prepared[]; start: number }[]
    >((acc, g) => {
      const previous = acc.at(-1);
      const start = previous ? previous.start + previous.items.length : 0;
      return [...acc, { label: g, items: byGroup.get(g)!, start }];
    }, []);
  }, [results]);
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const current = Math.min(active, Math.max(flat.length - 1, 0));
  const optionId = (i: number) => `${id}-option-${i}`;

  // Keep the active option in view.
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${current}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [current]);

  const go = (entry: SearchEntry) => {
    hide();
    router.push(entry.h);
  };

  const onInputKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // A search field's own Escape only clears the text; here it closes search.
    if (event.key === "Escape") {
      event.preventDefault();
      hide();
      return;
    }
    if (flat.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current + 1) % flat.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current - 1 + flat.length) % flat.length);
    } else if (event.key === "Home" && event.ctrlKey) {
      setActive(0);
    } else if (event.key === "End" && event.ctrlKey) {
      setActive(flat.length - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(flat[current]);
    }
  };

  const trimmed = query.trim();
  const status = failed
    ? "Search could not load. Please try again later."
    : !items
      ? trimmed
        ? "Loading…"
        : ""
      : !trimmed
        ? ""
        : flat.length === 0
          ? `No results for “${trimmed}”.`
          : `${flat.length} result${flat.length === 1 ? "" : "s"}.`;

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        className="inline-flex size-11 items-center justify-center gap-2 rounded-pill text-ink hover:bg-cloud max-[22.5rem]:hidden min-[90rem]:w-auto min-[90rem]:border min-[90rem]:border-line min-[90rem]:pr-2.5 min-[90rem]:pl-3.5 min-[90rem]:text-small min-[90rem]:text-slate-600"
      >
        <Search aria-hidden="true" size={20} strokeWidth={1.5} />
        <span className="sr-only min-[90rem]:not-sr-only">Search</span>
        <kbd
          aria-hidden="true"
          className="hidden rounded-s border border-line bg-cloud px-1.5 font-mono text-caption text-slate-600 min-[90rem]:inline"
        >
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Search the site"
        onClose={() => {
          setOpen(false);
          setQuery("");
          setActive(0);
        }}
        onClick={(event) => {
          // A click on the backdrop (the dialog itself, outside the panel) closes it.
          if (event.target === dialogRef.current) hide();
        }}
        className="site-search m-0 mx-auto mt-[8vh] max-h-[84vh] w-[min(40rem,calc(100%-2rem))] overflow-hidden rounded-l border border-line bg-paper p-0 text-ink shadow-[0_1px_2px_rgba(11,16,32,0.04),0_8px_24px_rgba(11,16,32,0.06)] backdrop:bg-ink/40"
      >
        <div className="flex max-h-[84vh] flex-col">
          <div className="flex items-center gap-3 border-b border-line px-4 sm:px-5">
            <Search
              aria-hidden="true"
              size={20}
              strokeWidth={1.5}
              className="shrink-0 text-slate-500"
            />
            <label htmlFor={`${id}-input`} className="sr-only">
              Search the site
            </label>
            <input
              ref={inputRef}
              id={`${id}-input`}
              type="search"
              role="combobox"
              aria-expanded={flat.length > 0}
              aria-controls={`${id}-list`}
              aria-autocomplete="list"
              aria-activedescendant={
                flat.length > 0 ? optionId(current) : undefined
              }
              autoComplete="off"
              spellCheck={false}
              placeholder="Search pages, programmes, guides, terms…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onInputKey}
              className="min-h-14 w-full min-w-0 bg-transparent text-body text-ink outline-none placeholder:text-slate-500 [&::-webkit-search-cancel-button]:hidden"
            />
            <button
              type="button"
              onClick={hide}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-pill text-ink hover:bg-cloud"
            >
              <X aria-hidden="true" size={20} strokeWidth={1.5} />
              <span className="sr-only">Close search</span>
            </button>
          </div>

          <p role="status" className="sr-only">
            {status}
          </p>

          <div
            ref={listRef}
            id={`${id}-list`}
            role="listbox"
            aria-label="Search results"
            className="overflow-y-auto overscroll-contain"
          >
            {groups.map((group) => (
              <div
                key={group.label}
                role="group"
                aria-label={group.label}
                className="border-b border-line px-2 py-2 last:border-b-0 sm:px-3"
              >
                <p
                  aria-hidden="true"
                  className="px-3 pt-1 pb-1.5 font-mono text-eyebrow font-medium text-slate-600 uppercase"
                >
                  {group.label}
                </p>
                {group.items.map((entry, j) => {
                  const i = group.start + j;
                  return (
                    <div
                      key={entry.h + entry.t}
                      id={optionId(i)}
                      role="option"
                      aria-selected={i === current}
                      data-index={i}
                      onClick={() => go(entry)}
                      onMouseMove={() => i !== current && setActive(i)}
                      className={cn(
                        "flex min-h-11 cursor-pointer flex-col justify-center rounded-s px-3 py-2",
                        i === current && "bg-indigo-tint",
                      )}
                    >
                      <span className="text-small font-semibold text-ink">
                        {entry.t}
                      </span>
                      {entry.d && (
                        <span className="line-clamp-1 text-caption text-slate-600">
                          {entry.d}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {(!trimmed || status.startsWith("No") || failed) && (
            <p className="px-5 py-6 text-small text-slate-600">
              {failed
                ? status
                : trimmed
                  ? `${status} Try a shorter word, or browse the menu.`
                  : "Type to search pages, programmes, events, guides, glossary terms and questions."}
            </p>
          )}

          <p
            aria-hidden="true"
            className="hidden border-t border-line px-5 py-2.5 text-caption text-slate-600 sm:block"
          >
            <kbd className="font-mono">↑</kbd>{" "}
            <kbd className="font-mono">↓</kbd> to move ·{" "}
            <kbd className="font-mono">Enter</kbd> to open ·{" "}
            <kbd className="font-mono">Esc</kbd> to close
          </p>
        </div>
      </dialog>
    </>
  );
}
