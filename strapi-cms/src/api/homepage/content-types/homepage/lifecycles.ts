/**
 * Homepage Lifecycle Hooks
 *
 * Automatically triggers Next.js revalidation when homepage content changes.
 * This ensures the frontend updates immediately when content is published.
 */

export default {
  /**
   * After Update Hook
   * Triggers when homepage is updated (including publish/unpublish)
   */
  async afterUpdate(event: any) {
    const { result } = event;

    console.log("[Homepage Lifecycle] afterUpdate triggered", {
      id: result?.id,
      publishedAt: result?.publishedAt,
      timestamp: new Date().toISOString(),
    });

    // Trigger revalidation
    await triggerRevalidation("homepage", "entry.update", result);
  },

  /**
   * After Create Hook
   * Triggers when homepage is created
   */
  async afterCreate(event: any) {
    const { result } = event;

    console.log("[Homepage Lifecycle] afterCreate triggered", {
      id: result?.id,
      timestamp: new Date().toISOString(),
    });

    // Trigger revalidation
    await triggerRevalidation("homepage", "entry.create", result);
  },

  /**
   * After Delete Hook
   * Triggers when homepage is deleted
   */
  async afterDelete(event: any) {
    const { result } = event;

    console.log("[Homepage Lifecycle] afterDelete triggered", {
      id: result?.id,
      timestamp: new Date().toISOString(),
    });

    // Trigger revalidation
    await triggerRevalidation("homepage", "entry.delete", result);
  },
};

/**
 * Trigger Next.js Revalidation
 * Sends a request to the Next.js revalidation endpoint
 */
async function triggerRevalidation(model: string, event: string, entry: any) {
  const NEXTJS_URL = process.env.NEXTJS_URL || "http://localhost:3001";
  const WEBHOOK_SECRET = process.env.STRAPI_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("[Homepage Lifecycle] STRAPI_WEBHOOK_SECRET not configured");
    return;
  }

  const revalidateUrl = `${NEXTJS_URL}/api/revalidate`;

  const payload = {
    event,
    model,
    entry: {
      id: entry?.id,
      documentId: entry?.documentId,
      publishedAt: entry?.publishedAt,
    },
  };

  try {
    console.log("[Homepage Lifecycle] Triggering revalidation:", {
      url: revalidateUrl,
      model,
      event,
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
      console.error("[Homepage Lifecycle] Revalidation failed:", {
        status: response.status,
        error,
      });
      return;
    }

    const result = await response.json();
    console.log("[Homepage Lifecycle] Revalidation successful:", result);
  } catch (error) {
    console.error("[Homepage Lifecycle] Error triggering revalidation:", error);
  }
}
