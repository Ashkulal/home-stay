import { useEffect } from "react";

const SEO = ({ title, description }) => {
  useEffect(() => {
    document.title = title
      ? `${title} | Silent Peak Kudremukh Homestay`
      : "Silent Peak Kudremukh Homestay — Premium Mountain Retreat in Western Ghats";

    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) {
      meta.setAttribute("content", description);
    }
  }, [title, description]);

  return null;
};

export default SEO;
