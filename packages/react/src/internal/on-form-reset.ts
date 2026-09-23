export const onFormReset = (form: HTMLFormElement, reset: () => void) => {
  let timer: ReturnType<typeof setTimeout>;

  const handleReset = (event: Event) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      if (!event.defaultPrevented) reset();
    });
  };

  form.addEventListener("reset", handleReset);

  return () => {
    clearTimeout(timer);
    form.removeEventListener("reset", handleReset);
  };
};
