"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

/**
 * Eigenes Auswahlfeld im Stil der Marke.
 *
 * Native `<select>` sehen auf jedem Betriebssystem anders aus und lassen
 * sich nicht gestalten. Diese Komponente zeichnet die Liste selbst – und
 * behaelt trotzdem ein echtes Formularfeld: solange kein JavaScript
 * geladen ist, steht hier das native `<select>`, das mit `method="get"`
 * ganz normal abgeschickt wird. Erst nach dem Mount uebernimmt die eigene
 * Darstellung, der Wert wandert in ein `<input type="hidden">`.
 *
 * Bedienung wie bei einem nativen Feld: Pfeiltasten bewegen die Auswahl,
 * Enter und Leertaste oeffnen und bestaetigen, Escape schliesst, Tippen
 * springt zum passenden Eintrag.
 */
export interface SelectOption {
  value: string;
  label: string;
}

export function SelectField({
  id,
  name,
  options,
  defaultValue = "",
  className,
  buttonClassName,
  onValueChange,
}: {
  id: string;
  name: string;
  options: SelectOption[];
  defaultValue?: string;
  className?: string;
  buttonClassName?: string;
  onValueChange?: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  // Tippen springt zum Eintrag; der Puffer verfaellt nach kurzer Pause.
  const typed = useRef({ text: "", at: 0 });

  // Serverseitig false, im Browser true – ohne Zustandswechsel im Effekt.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Wert von aussen nachziehen (Browser-Zurueck, geteilter Link) – waehrend
  // des Renderns statt im Effekt, sonst rendert React zweimal.
  const [letzterDefault, setLetzterDefault] = useState(defaultValue);
  if (letzterDefault !== defaultValue) {
    setLetzterDefault(defaultValue);
    setValue(defaultValue);
  }

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    // Der aktive Eintrag muss sichtbar sein, sonst laeuft die Tastatur ins Leere.
    listRef.current?.querySelectorAll("li")[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const selected = options.find((o) => o.value === value) ?? options[0];

  function choose(next: string) {
    setValue(next);
    setOpen(false);
    buttonRef.current?.focus();
    onValueChange?.(next);
  }

  function openAt(index: number) {
    setActive(index);
    setOpen(true);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const current = options.findIndex((o) => o.value === value);
    const idx = current < 0 ? 0 : current;

    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        openAt(idx);
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(options[active].value);
        break;
      case "ArrowDown":
        e.preventDefault();
        setActive((a) => Math.min(a + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(options.length - 1);
        break;
      default: {
        if (e.key.length !== 1) return;
        const now = Date.now();
        typed.current.text = now - typed.current.at > 800 ? e.key : typed.current.text + e.key;
        typed.current.at = now;
        const hit = options.findIndex((o) =>
          o.label.toLowerCase().startsWith(typed.current.text.toLowerCase()),
        );
        if (hit >= 0) setActive(hit);
      }
    }
  }

  // Ohne JavaScript bleibt das native Feld stehen – die Suche muss ohne
  // JavaScript bedienbar sein (CLAUDE.md §6).
  if (!mounted) {
    return (
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        className={cn("select-field", className)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div ref={wrapRef} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-haspopup="listbox"
        onClick={() => (open ? setOpen(false) : openAt(Math.max(options.findIndex((o) => o.value === value), 0)))}
        onKeyDown={onKeyDown}
        className={cn(
          "flex w-full items-center justify-between gap-2 text-left",
          className,
          buttonClassName,
        )}
      >
        <span className="truncate">{selected?.label}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={cn(
            "shrink-0 text-ink-subtle transition-transform duration-200",
            open && "rotate-180",
          )}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-activedescendant={`${listId}-${active}`}
          tabIndex={-1}
          onKeyDown={onKeyDown}
          className="absolute left-0 top-[calc(100%+2px)] z-50 max-h-64 min-w-full overflow-y-auto border border-primary-800 bg-surface py-1 shadow-[var(--shadow-lift)]"
        >
          {options.map((o, i) => {
            const isSelected = o.value === value;
            return (
              <li
                key={o.value}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(o.value)}
                className={cn(
                  "cursor-pointer whitespace-nowrap px-3 py-2 text-[0.8125rem] transition-colors",
                  i === active ? "bg-primary-800 text-white" : "text-ink",
                  isSelected && i !== active && "font-semibold text-primary-800",
                )}
              >
                {o.label}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
