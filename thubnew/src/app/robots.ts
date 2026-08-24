import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tutorialsadda.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/author/", "/dashboard", "/profile", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
