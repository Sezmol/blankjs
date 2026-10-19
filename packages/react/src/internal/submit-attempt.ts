const attempts = new Map<HTMLFormElement, { focused: boolean }>();

const listeners = new Map<HTMLFormElement, Set<() => void>>();

let watchers = 0;

const begin = (form: HTMLFormElement | null) => {
  if (!form || attempts.has(form)) return;

  attempts.set(form, { focused: false });

  setTimeout(() => attempts.delete(form));

  listeners.get(form)?.forEach((listener) => listener());
};

export const submitForm = (
  form: HTMLFormElement,
  submitter?: HTMLElement | null,
) => {
  const owned = !attempts.has(form);

  attempts.set(form, { focused: false });

  try {
    listeners.get(form)?.forEach((listener) => listener());
    form.requestSubmit(submitter);
  } finally {
    if (owned) attempts.delete(form);
  }
};

export const onSubmitAttempt = (
  form: HTMLFormElement,
  listener: () => void,
) => {
  const set = listeners.get(form) ?? new Set();

  set.add(listener);
  listeners.set(form, set);

  return () => {
    set.delete(listener);

    if (set.size === 0) listeners.delete(form);
  };
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
