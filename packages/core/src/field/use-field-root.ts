import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  FieldContextValue,
  FieldRootHandlerProps,
  OnBlurCaptureHandler,
  OnChangeCaptureHandler,
  OnInvalidCaptureHandler,
  UseFieldRootOptions,
} from "./types";

const hasValidity = (
  target: EventTarget,
): target is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement =>
  "validity" in target;

const snapshotValidity = (v: ValidityState): ValidityState => ({
  badInput: v.badInput,
  customError: v.customError,
  patternMismatch: v.patternMismatch,
  rangeOverflow: v.rangeOverflow,
  rangeUnderflow: v.rangeUnderflow,
  stepMismatch: v.stepMismatch,
  tooLong: v.tooLong,
  tooShort: v.tooShort,
  typeMismatch: v.typeMismatch,
  valid: v.valid,
  valueMissing: v.valueMissing,
});

const sameValidity = (a: ValidityState, b: ValidityState) =>
  (Object.keys(b) as (keyof ValidityState)[]).every((key) => a[key] === b[key]);

const radioGroupOf = (control: Element) => {
  if (
    !(control instanceof HTMLInputElement) ||
    control.type !== "radio" ||
    !control.name
  ) {
    return null;
  }

  const named = control.ownerDocument.getElementsByName(control.name);

  return Array.from(named).filter(
    (el): el is HTMLInputElement =>
      el instanceof HTMLInputElement &&
      el.type === "radio" &&
      el.form === control.form,
  );
};

const checkboxGroupOf = (control: Element) => {
  const root = control.hasAttribute("data-bk-checkbox-group-item")
    ? control.closest("[data-bk-checkbox-group]")
    : null;

  if (!root) return null;

  return Array.from(
    root.querySelectorAll("[data-bk-checkbox-group-item]"),
  ).filter(
    (el): el is HTMLInputElement =>
      el instanceof HTMLInputElement &&
      el.closest("[data-bk-checkbox-group]") === root,
  );
};

const submittedValue = (
  control: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  radios: HTMLInputElement[] | null,
  boxes: HTMLInputElement[] | null,
) => {
  if (radios) return radios.find((radio) => radio.checked)?.value ?? "";

  if (boxes) {
    return boxes
      .filter((box) => box.checked && !box.matches(":disabled"))
      .map((box) => box.value)
      .join(",");
  }

  if (
    control instanceof HTMLInputElement &&
    control.type === "checkbox" &&
    !control.checked
  ) {
    return "";
  }

  return control.value;
};

export const useFieldRoot = (
  options?: UseFieldRootOptions,
): FieldContextValue & FieldRootHandlerProps => {
  const {
    invalid,
    disabled = false,
    required = false,
    validationMode,
    validate,
    errorMessages,
  } = options ?? {};

  const controlId = useId();
  const labelId = useId();

  const [hasLabel, setHasLabel] = useState(false);
  const [descriptionIds, setDescriptionIds] = useState<string[]>([]);
  const [errorIds, setErrorIds] = useState<string[]>([]);
  const [hasGroupControl, setHasGroupControl] = useState(false);

  const [validity, setValidity] = useState<ValidityState | null>(null);
  const [validationMessage, setValidationMessage] = useState("");
  const [revealed, setRevealed] = useState(false);

  const readValidity = (
    target: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  ) => {
    const next = snapshotValidity(target.validity);

    setValidity((prev) => (prev && sameValidity(prev, next) ? prev : next));
    setValidationMessage(target.validationMessage);
  };

  const validateRef = useRef(validate);

  useEffect(() => {
    validateRef.current = validate;
  });

  const ownsMessageRef = useRef(false);

  const validateControl = useCallback((control: Element) => {
    if (!hasValidity(control)) return;

    const rule = validateRef.current;

    if (!rule && !ownsMessageRef.current) return;

    const radios = radioGroupOf(control);
    const boxes = radios ? null : checkboxGroupOf(control);
    let message = "";

    if (rule) {
      const formData = control.form
        ? new FormData(control.form)
        : new FormData();

      message = rule(submittedValue(control, radios, boxes), formData) ?? "";
    }

    ownsMessageRef.current = message !== "";

    for (const target of radios ?? boxes ?? [control]) {
      target.setCustomValidity(message);
    }
  }, []);

  const refreshControl = useCallback(
    (control: Element) => {
      validateControl(control);

      if (!revealed) return;

      if (hasValidity(control)) {
        readValidity(control);
      } else if (control.hasAttribute("data-bk-checkbox-group")) {
        setValidity(null);
        setValidationMessage("");
      }
    },
    [revealed, validateControl],
  );

  const onInvalidCapture = useCallback<OnInvalidCaptureHandler>((e) => {
    e.preventDefault();

    if (hasValidity(e.target)) {
      readValidity(e.target);
      setRevealed(true);
    }
  }, []);

  const onChangeCapture = useCallback<OnChangeCaptureHandler>(
    (e) => {
      if (!hasValidity(e.target)) return;

      validateControl(e.target);

      if (revealed || validationMode === "change") {
        readValidity(e.target);
        setRevealed(true);
      }
    },
    [revealed, validateControl, validationMode],
  );

  const onBlurCapture = useCallback<OnBlurCaptureHandler>(
    (e) => {
      if (!hasValidity(e.target)) return;

      validateControl(e.target);

      if (!e.target.validity.valid && validationMode === "blur") {
        readValidity(e.target);
        setRevealed(true);
      }
    },
    [validateControl, validationMode],
  );

  const resetValidation = useCallback(() => {
    setRevealed(false);
    setValidity(null);
    setValidationMessage("");
  }, []);

  const registerLabel = useCallback(() => {
    setHasLabel(true);

    return () => setHasLabel(false);
  }, []);

  const registerGroupControl = useCallback(() => {
    setHasGroupControl(true);

    return () => setHasGroupControl(false);
  }, []);

  const registerDescription = useCallback((id: string) => {
    setDescriptionIds((ids) => [...ids, id]);

    return () =>
      setDescriptionIds((ids) => ids.filter((other) => other !== id));
  }, []);

  const registerError = useCallback((id: string) => {
    setErrorIds((ids) => [...ids, id]);

    return () => setErrorIds((ids) => ids.filter((other) => other !== id));
  }, []);

  const isInvalid = invalid ?? (revealed && validity ? !validity.valid : false);

  let resolvedErrorMessage: FieldContextValue["resolvedErrorMessage"];

  if (errorMessages && validity && !validity.valid) {
    for (const key of Object.keys(errorMessages) as (keyof ValidityState)[]) {
      if (validity[key] && errorMessages[key] !== undefined) {
        resolvedErrorMessage = errorMessages[key];
        break;
      }
    }
  }

  return useMemo(
    () => ({
      controlId,
      labelId,

      invalid: isInvalid,
      disabled,
      required,

      validity,
      validationMessage,

      hasLabel,
      descriptionIds,
      errorIds,
      resolvedErrorMessage,
      hasGroupControl,
      registerLabel,
      registerDescription,
      registerError,
      registerGroupControl,

      onBlurCapture,
      onChangeCapture,
      onInvalidCapture,

      resetValidation,

      validateControl,
      refreshControl,
    }),
    [
      controlId,
      labelId,
      isInvalid,
      disabled,
      required,
      validity,
      validationMessage,
      hasLabel,
      descriptionIds,
      errorIds,
      resolvedErrorMessage,
      hasGroupControl,
      registerLabel,
      registerDescription,
      registerError,
      registerGroupControl,
      onBlurCapture,
      onChangeCapture,
      onInvalidCapture,
      resetValidation,
      validateControl,
      refreshControl,
    ],
  );
};
