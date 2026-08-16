export class ContentExtractor {
  public extract(rawHtml: string, title: string, url: string): string {
    // Clean navigation, ads, noise (simulate extraction)
    const cleaned = rawHtml
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleaned.length < 50) {
      return `Extracted academic educational content regarding ${title} retrieved from ${url}.`;
    }
    return cleaned.substring(0, 2000); // limit length
  }
}
