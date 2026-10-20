interface Attempt {
  form: HTMLFormElement;
  events: Event[];
  candidates: Set<Element>;
  submitted: boolean;
}

const attempts = new Map<HTMLFormElement, Attempt>();

const listeners = new Map<HTMLFormElement, Set<() => void>>();

let watchers = 0;

const isStillInvalid = (element: Element): element is HTMLInputElement =>
  element.isConnected &&
  "willValidate" in element &&
  (element as HTMLInputElement).willValidate &&
  !(element as HTMLInputElement).validity.valid;

const isDispatching = (attempt: Attempt) =>
  attempt.events.some((event) => event.eventPhase !== Event.NONE);

const settle = (attempt: Attempt) => {
  if (attempts.get(attempt.form) !== attempt) return;

  attempts.delete(attempt.form);

  const clicks = attempt.events.filter((e) => e.type === "click");
  const triggers = clicks.length > 0 ? clicks : attempt.events;

  if (
    attempt.submitted ||
    (triggers.length > 0 && triggers.every((e) => e.defaultPrevented))
  ) {
    return;
  }

  Array.from(attempt.form.elements)
    .find(
      (element): element is HTMLInputElement =>
        attempt.candidates.has(element) && isStillInvalid(element),
    )
    ?.focus();
};

const start = (form: HTMLFormElement, events: Event[]) => {
  const previous = attempts.get(form);

  if (previous) settle(previous);

  const attempt: Attempt = {
    form,
    events,
    candidates: new Set(),
    submitted: false,
  };

  attempts.set(form, attempt);

  return attempt;
};

const recheck = (form: HTMLFormElement) =>
  listeners.get(form)?.forEach((listener) => listener());

const begin = (form: HTMLFormElement | null, event: Event) => {
  if (!form) return;

  const current = attempts.get(form);
  const last = current?.events[current.events.length - 1];

  if (current && (isDispatching(current) || last?.type === "keydown")) {
    current.events.push(event);

    return;
  }

  const attempt = start(form, [event]);

  setTimeout(() => settle(attempt));

  recheck(form);
};

export const submitForm = (
  form: HTMLFormElement,
  submitter?: HTMLElement | null,
) => {
  attempts.delete(form);

  const attempt = start(form, []);

  try {
    recheck(form);
    form.requestSubmit(submitter);
  } finally {
    settle(attempt);
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
    begin(submitter.form, event);
  }
};

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
    begin(event.target.form, event);
  }
};

const onSubmit = (event: Event) => {
  if (!(event.target instanceof HTMLFormElement)) return;

  const attempt = attempts.get(event.target);

  if (attempt) attempt.submitted = true;
};

export const watchSubmitAttempts = () => {
  if (watchers++ === 0) {
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("submit", onSubmit, true);
  }

  return () => {
    if (--watchers > 0) return;

    document.removeEventListener("click", onClick, true);
    document.removeEventListener("keydown", onKeyDown, true);
    document.removeEventListener("submit", onSubmit, true);
  };
};

export const focusOnSubmitAttempt = (target: EventTarget) => {
  if (!(target instanceof HTMLElement) || !("form" in target)) return;

  const form = target.form as HTMLFormElement | null;

  if (form) attempts.get(form)?.candidates.add(target);
};
