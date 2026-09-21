const SITEMAP_XSL = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>XML Sitemap</title>
      <style>
        :root{color-scheme:light;--ink:#202822;--muted:#68736b;--line:#e3e8e3;--accent:#9b794c;--paper:#fff;--wash:#f5f7f4}
        *{box-sizing:border-box}body{margin:0;background:var(--wash);color:var(--ink);font:15px/1.55 Arial,sans-serif}main{max-width:1080px;margin:48px auto;padding:0 24px}
        header{padding:30px 34px;background:var(--paper);border:1px solid var(--line);border-radius:8px;margin-bottom:22px}h1{font-size:26px;margin:0 0 8px;font-weight:600}p{color:var(--muted);margin:0}.count{color:var(--accent);font-weight:600}
        .table-wrap{overflow:auto;background:var(--paper);border:1px solid var(--line);border-radius:8px}table{width:100%;border-collapse:collapse;text-align:left}th,td{padding:15px 20px;border-bottom:1px solid var(--line);vertical-align:top}th{background:#fafbf9;color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:.06em}tr:last-child td{border-bottom:0}a{color:#49634f;text-decoration:none;overflow-wrap:anywhere}a:hover{text-decoration:underline}code{font:13px ui-monospace,monospace;color:var(--muted)}
        @media(max-width:600px){main{margin:20px auto;padding:0 12px}header{padding:22px 20px}th,td{padding:12px}.date{white-space:nowrap}}
      </style>
    </head><body><main>
      <xsl:choose>
        <xsl:when test="/*[local-name()='sitemapindex']">
          <header><h1>XML Sitemap Index</h1><p>This sitemap index contains <span class="count"><xsl:value-of select="count(/*[local-name()='sitemapindex']/*[local-name()='sitemap'])"/></span> sitemaps.</p></header>
          <div class="table-wrap"><table><thead><tr><th>Sitemap</th><th>Last modified</th></tr></thead><tbody>
            <xsl:for-each select="/*[local-name()='sitemapindex']/*[local-name()='sitemap']"><tr><td><a><xsl:attribute name="href"><xsl:value-of select="*[local-name()='loc']"/></xsl:attribute><xsl:value-of select="*[local-name()='loc']"/></a></td><td class="date"><xsl:call-template name="format-lastmod"><xsl:with-param name="value" select="*[local-name()='lastmod']"/></xsl:call-template></td></tr></xsl:for-each>
          </tbody></table></div>
        </xsl:when>
        <xsl:otherwise>
          <header><h1>XML Sitemap</h1><p>This sitemap contains <span class="count"><xsl:value-of select="count(/*[local-name()='urlset']/*[local-name()='url'])"/></span> URLs.</p></header>
          <div class="table-wrap"><table><thead><tr><th>URL</th><th>Last modified</th></tr></thead><tbody>
            <xsl:for-each select="/*[local-name()='urlset']/*[local-name()='url']"><tr><td><a><xsl:attribute name="href"><xsl:value-of select="*[local-name()='loc']"/></xsl:attribute><xsl:value-of select="*[local-name()='loc']"/></a></td><td class="date"><xsl:call-template name="format-lastmod"><xsl:with-param name="value" select="*[local-name()='lastmod']"/></xsl:call-template></td></tr></xsl:for-each>
          </tbody></table></div>
        </xsl:otherwise>
      </xsl:choose>
    </main></body></html>
  </xsl:template>
  <xsl:template name="format-lastmod">
    <xsl:param name="value"/>
    <xsl:if test="string-length($value) &gt;= 16"><xsl:value-of select="concat(substring($value,12,5),' ',substring($value,9,2),'/',substring($value,6,2),'/',substring($value,1,4))"/></xsl:if>
  </xsl:template>
</xsl:stylesheet>`;

export async function GET() {
  return new Response(SITEMAP_XSL, {
    headers: { "Content-Type": "text/xsl; charset=utf-8", "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" },
  });
}

export const revalidate = 3600;
