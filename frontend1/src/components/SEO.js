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
    setMeta("og:title", "property");
    setMeta("og:description", "property");
    setMeta("og:url", "property");
    setMeta("og:image", "property");
    setMeta("og:type", "property");
    setMeta("og:site_name", "property");
    setMeta("twitter:title", "name");
    setMeta("twitter:description", "name");
    setMeta("twitter:image", "name");

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", fullTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", metaDesc);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", canonicalUrl);

    const ogImgEl = document.querySelector('meta[property="og:image"]');
    if (ogImgEl) ogImgEl.setAttribute("content", ogImageUrl);

    const ogType = document.querySelector('meta[property="og:type"]');
    if (ogType) ogType.setAttribute("content", type);

    const ogSiteName = document.querySelector('meta[property="og:site_name"]');
    if (ogSiteName) ogSiteName.setAttribute("content", SITE_NAME);

    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute("content", fullTitle);

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute("content", metaDesc);

    const twImg = document.querySelector('meta[name="twitter:image"]');
    if (twImg) twImg.setAttribute("content", ogImageUrl);

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
