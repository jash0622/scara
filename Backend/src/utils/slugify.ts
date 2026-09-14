/**
 * Converts a string to a URL-safe slug.
 * e.g. "eFootball Holi '25" → "efootball-holi-25"
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")          // remove quotes
    .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric (except spaces and hyphens)
    .replace(/\s+/g, "-")          // spaces to hyphens
    .replace(/-+/g, "-")           // collapse multiple hyphens
    .replace(/^-|-$/g, "");        // strip leading/trailing hyphens
}

/**
 * Generates a unique slug by checking the DB for collisions.
 * Appends -2, -3, etc. until a unique slug is found.
 */
export async function uniqueSlug(
  base: string,
  existsCheck: (slug: string) => Promise<boolean>
): Promise<string> {
  let candidate = slugify(base);
  let counter = 2;

  while (await existsCheck(candidate)) {
    candidate = `${slugify(base)}-${counter}`;
    counter++;
  }

  return candidate;
}
