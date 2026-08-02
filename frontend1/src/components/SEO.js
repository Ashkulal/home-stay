import { useEffect } from "react";

const SITE_URL = "https://www.silentpeakkudremukh.co.in";
const SITE_NAME = "Silent Peak Kudremukh Homestay";
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

const SEO = ({ title, description, path = "", image, type = "website" }) => {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — Premium Mountain Retreat in Kudremukh, Western Ghats`;
  const metaDesc = description || "Premium mountain retreat in Kudremukh, Karnataka. Luxury stays, trekking, campfire evenings & breathtaking mountain views in the Western Ghats.";
  const canonicalUrl = `${SITE_URL}${path}`;
  const ogImageUrl = image || DEFAULT_IMAGE;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name, content, attribute = "name") => {
      let el = document.querySelector(`meta[${attribute}="${name}"]`);
      if (el) {
        el.setAttribute("content", content);
      } else {
        el = document.createElement("meta");
        el.setAttribute(attribute, name);
        el.setAttribute("content", content);
        document.head.appendChild(el);
      }
    };

    setMeta("description", metaDesc);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", metaDesc, "property");
    setMeta("og:url", canonicalUrl, "property");
    setMeta("og:image", ogImageUrl, "property");
    setMeta("og:type", type, "property");
    setMeta("og:site_name", SITE_NAME, "property");
    setMeta("og:locale", "en_IN", "property");
    setMeta("twitter:title", fullTitle, "name");
    setMeta("twitter:description", metaDesc, "name");
    setMeta("twitter:image", ogImageUrl, "name");
    setMeta("twitter:card", "summary_large_image", "name");

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", canonicalUrl);
    } else {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      canonical.setAttribute("href", canonicalUrl);
      document.head.appendChild(canonical);
    }
  }, [fullTitle, metaDesc, canonicalUrl, ogImageUrl, type]);

  return null;
};

export default SEO;
