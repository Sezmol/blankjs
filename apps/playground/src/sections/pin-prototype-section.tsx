import { useEffect, useRef, useState } from "react";
import { Section } from "./section";

const LENGTH = 6;

export const PinPrototypeSection = () => {
  const ref = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");
  const [[start, end], setRange] = useState<[number, number]>([0, 0]);
  const [focused, setFocused] = useState(false);

  const sync = () => {
    const el = ref.current;

    if (!el) return;

    const max = el.value.length;
    const next: [number, number] = [
      Math.min(el.selectionStart ?? 0, max),
      Math.min(el.selectionEnd ?? 0, max),
    ];

    if (next[0] !== el.selectionStart || next[1] !== el.selectionEnd) {
      el.setSelectionRange(next[0], next[1]);
    }

    setRange(next);
  };

  useEffect(() => {
    if (!focused) return;

    document.addEventListener("selectionchange", sync);

    return () => document.removeEventListener("selectionchange", sync);
  }, [focused]);

  // the text paints ~52px wide inside a 280px input, so the native caret has no
  // relation to the cell the pointer landed on. Map it back by geometry.
  const onPointerUp = (e: React.PointerEvent) => {
    const el = ref.current;
    const box = boxRef.current;

    if (!el || !box || el.selectionStart !== el.selectionEnd) return;

    const cells = [...box.querySelectorAll<HTMLElement>("[data-cell]")];
    const hit = cells.findIndex((cell) => {
      const { left, right } = cell.getBoundingClientRect();

      return e.clientX >= left && e.clientX <= right;
    });

    const index = Math.min(hit === -1 ? el.value.length : hit, el.value.length);

    el.setSelectionRange(index, index);
    sync();
  };

  const caret = Math.min(start, LENGTH - 1);

  return (
    <Section title="PinInput prototype" className="pg-card-wide">
      <p className="text-sm text-[var(--bk-color-text-muted)]">
        One real input stretched over six divs. Try typing, paste, Backspace,
        arrows, Ctrl+A, clicking a cell in the middle, dragging across cells.
      </p>

      <div ref={boxRef} className="relative flex w-fit gap-2">
        <input
          ref={ref}
          value={value}
          onChange={(e) =>
            setValue(e.target.value.replace(/\D/g, "").slice(0, LENGTH))
          }
          onSelect={sync}
          onPointerUp={onPointerUp}
          onFocus={() => {
            setFocused(true);
            sync();
          }}
          onBlur={() => setFocused(false)}
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-label="Verification code"
          className="absolute inset-0 z-10 w-full bg-transparent text-transparent caret-transparent outline-none selection:bg-transparent"
        />

        {Array.from({ length: LENGTH }, (_, i) => {
          const selected = focused && start !== end && i >= start && i < end;
          const active = focused && start === end && i === caret;

          return (
            <div
              key={i}
              aria-hidden
              data-cell
              data-active={active ? "" : undefined}
              className={[
                "flex h-12 w-10 items-center justify-center rounded-md border text-lg tabular-nums",
                "border-[var(--bk-color-border)]",
                active && "border-[var(--bk-color-accent)] ring-1",
                selected && "bg-[var(--bk-color-accent)]/20",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {value[i] ?? ""}
              {active && !value[i] && (
                <span className="h-6 w-px animate-pulse bg-[var(--bk-color-text)]" />
              )}
            </div>
          );
        })}
      </div>

      <pre className="pg-output">
        {JSON.stringify({ value, start, end, focused }, null, 2)}
      </pre>
    </Section>
  );
};
