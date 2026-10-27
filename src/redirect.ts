// tradetrust.io and its subdomains, the TradeTrust Netlify site, and its branch deploys (<branch>--tradetrust-website).
const ALLOWED_HOST = /^(?:(?:[a-z0-9-]+\.)*tradetrust\.io|(?:[a-z0-9-]+--)?tradetrust-website\.netlify\.app)$/;

export const isAllowedRedirect = (redirect: unknown): boolean => {
  if (typeof redirect !== "string") return false;
  let url: URL;
  try {
    url = new URL(redirect);
  } catch {
    return false;
  }
  // https only: a javascript: or data: URL with an allowed "hostname" would otherwise run script on this page.
  return url.protocol === "https:" && !url.username && !url.password && ALLOWED_HOST.test(url.hostname);
};
