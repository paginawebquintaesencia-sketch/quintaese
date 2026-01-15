export function cn(
  ...inputs: Array<string | number | boolean | null | undefined>
) {
  return inputs
    .filter((value) => typeof value === "string" && value.trim().length > 0)
    .join(" ");
}

