export const serialize = (data: FormData) => {
  const result: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {};

  for (const key of new Set(data.keys())) {
    const values = data.getAll(key);

    result[key] = values.length > 1 ? values : (values[0] ?? "");
  }

  return result;
};
