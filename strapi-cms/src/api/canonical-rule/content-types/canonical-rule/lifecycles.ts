function normalizeSource(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) throw new Error("source_path is required");
  const path = value.trim().split(/[?#]/)[0].split("//").join("/").replace(/\/$/, "") || "/";
  if (!path.startsWith("/")) throw new Error("source_path must be an absolute path starting with /");
  return path;
}

function validate(event: { params: { data: Record<string, unknown> } }) {
  const data = event.params.data;
  data.source_path = normalizeSource(data.source_path);
  if (typeof data.canonical_url !== "string" || !/^https:\/\//i.test(data.canonical_url.trim())) {
    throw new Error("canonical_url must be an absolute HTTPS URL");
  }
  data.canonical_url = data.canonical_url.trim();
}

export default { beforeCreate: validate, beforeUpdate: validate };
