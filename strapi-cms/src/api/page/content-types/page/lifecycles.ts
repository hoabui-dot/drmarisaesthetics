/**
 * Page Lifecycle Hooks
 *
 * Automatically triggers Next.js revalidation when page content changes.
 */

export default {
  async afterUpdate(event: any) {
    const { result } = event;

    console.log("[Page Lifecycle] afterUpdate triggered", {
      id: result?.id,
      slug: result?.slug,
      publishedAt: result?.publishedAt,
    });

    await triggerRevalidation("page", "entry.update", result);
  },

  async afterCreate(event: any) {
    const { result } = event;

    console.log("[Page Lifecycle] afterCreate triggered", {
      id: result?.id,
      slug: result?.slug,
    });

    await triggerRevalidation("page", "entry.create", result);
  },

  async afterDelete(event: any) {
    const { result } = event;

    console.log("[Page Lifecycle] afterDelete triggered", {
      id: result?.id,
      slug: result?.slug,
    });

    await triggerRevalidation("page", "entry.delete", result);
  },
};

async function triggerRevalidation(model: string, event: string, entry: any) {
  const NEXTJS_URL = process.env.NEXTJS_URL || "http://localhost:3001";
  const WEBHOOK_SECRET = process.env.STRAPI_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("[Page Lifecycle] STRAPI_WEBHOOK_SECRET not configured");
    return;
  }

  const revalidateUrl = `${NEXTJS_URL}/api/revalidate`;

  const payload = {
    event,
    model,
    entry: {
      id: entry?.id,
      documentId: entry?.documentId,
      slug: entry?.slug,
      publishedAt: entry?.publishedAt,
    },
  };

  try {
    console.log("[Page Lifecycle] Triggering revalidation:", {
      url: revalidateUrl,
      model,
      event,
      slug: entry?.slug,
    });

    const response = await fetch(revalidateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-strapi-secret": WEBHOOK_SECRET,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[Page Lifecycle] Revalidation failed:", {
        status: response.status,
        error,
      });
      return;
    }

    const result = await response.json();
    console.log("[Page Lifecycle] Revalidation successful:", result);
  } catch (error) {
    console.error("[Page Lifecycle] Error triggering revalidation:", error);
  }
}
