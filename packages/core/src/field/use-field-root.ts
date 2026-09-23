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

const submittedValue = (
  control: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  radios: HTMLInputElement[] | null,
) => {
  if (radios) return radios.find((radio) => radio.checked)?.value ?? "";

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
  const descriptionId = useId();
  const errorId = useId();

  const [hasLabel, setHasLabel] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasGroupControl, setHasGroupControl] = useState(false);

  const [validity, setValidity] = useState<ValidityState | null>(null);
  const [validationMessage, setValidationMessage] = useState("");
  const [revealed, setRevealed] = useState(false);

  const readValidity = (
    target: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  ) => {
    setValidity(snapshotValidity(target.validity));
    setValidationMessage(target.validationMessage);
  };

  const validateRef = useRef(validate);

  useEffect(() => {
    validateRef.current = validate;
  });

  const validateControl = useCallback((control: Element) => {
    if (!validateRef.current || !hasValidity(control)) return;

    const formData = control.form ? new FormData(control.form) : new FormData();
    const radios = radioGroupOf(control);
    const message =
      validateRef.current(submittedValue(control, radios), formData) ?? "";

    for (const target of radios ?? [control]) target.setCustomValidity(message);
  }, []);

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

  const registerDescription = useCallback(() => {
    setHasDescription(true);

    return () => setHasDescription(false);
  }, []);

  const registerError = useCallback(() => {
    setHasError(true);

    return () => setHasError(false);
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
      descriptionId,
      errorId,

      invalid: isInvalid,
      disabled,
      required,

      validity,
      validationMessage,

      hasLabel,
      hasDescription,
      hasError,
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
    }),
    [
      controlId,
      labelId,
      descriptionId,
      errorId,
      isInvalid,
      disabled,
      required,
      validity,
      validationMessage,
      hasLabel,
      hasDescription,
      hasError,
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
    ],
  );
};
