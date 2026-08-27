function normalizePath(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) throw new Error("source_path is required");
  const path = value.trim().split(/[?#]/)[0].split("//").join("/").replace(/\/$/, "") || "/";
  if (!path.startsWith("/")) throw new Error("source_path must be an absolute path starting with /");
  return path;
}

function validateDestination(source: string, value: unknown): string {
  if (typeof value !== "string" || !value.trim()) throw new Error("destination_path is required");
  const destination = value.trim();
  try {
    const parsed = new URL(destination, "https://redirect.invalid");
    if (parsed.origin === "https://redirect.invalid") {
      const path = `${parsed.pathname}${parsed.search}`.split("//").join("/").replace(/\/$/, "") || "/";
      if (!path.startsWith("/")) throw new Error("destination_path must be an absolute path or a valid URL");
      if (path === source) throw new Error("A redirect cannot point to itself");
      return path;
    }
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("destination_path must use http or https");
    return destination;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("A redirect")) throw error;
    throw new Error("destination_path must be an absolute path or a valid http(s) URL");
  }
}

function validate(event: { params: { data: Record<string, unknown> } }) {
  const data = event.params.data;
  const source = normalizePath(data.source_path);
  data.source_path = source;
  data.destination_path = validateDestination(source, data.destination_path);
}

export default { beforeCreate: validate, beforeUpdate: validate };
