export const isRecaptchaEnabled = (): boolean =>
  process.env.RECAPTCHA_ENABLED === "true";

export const shouldVerifyRecaptcha = (): boolean =>
  process.env.NODE_ENV === "production" && isRecaptchaEnabled();

export async function verifyRecaptchaToken(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey || !token) return false;
  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: secretKey, response: token }).toString(),
    });
    const data = await response.json();
    return data.success === true && (typeof data.score !== "number" || data.score >= 0.5);
  } catch {
    return false;
  }
}
