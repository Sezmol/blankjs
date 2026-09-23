const attempts = new Map<HTMLFormElement, { focused: boolean }>();

let watchers = 0;

const begin = (form: HTMLFormElement | null) => {
  if (!form || attempts.has(form)) return;

  attempts.set(form, { focused: false });

  setTimeout(() => attempts.delete(form));
};

const onClick = (event: MouseEvent) => {
  if (!(event.target instanceof Element)) return;

  const submitter = event.target.closest("button, input");

  if (
    (submitter instanceof HTMLButtonElement ||
      submitter instanceof HTMLInputElement) &&
    (submitter.type === "submit" || submitter.type === "image")
  ) {
    begin(submitter.form);
  }
};

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
    begin(event.target.form);
  }
};

export const watchSubmitAttempts = () => {
  if (watchers++ === 0) {
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKeyDown, true);
  }

  return () => {
    if (--watchers > 0) return;

    document.removeEventListener("click", onClick, true);
    document.removeEventListener("keydown", onKeyDown, true);
  };
};

export const focusOnSubmitAttempt = (target: EventTarget) => {
  if (!(target instanceof HTMLElement) || !("form" in target)) return;

  const form = target.form as HTMLFormElement | null;
  const attempt = form ? attempts.get(form) : undefined;

  if (!attempt || attempt.focused) return;

  attempt.focused = true;
  target.focus();
};
