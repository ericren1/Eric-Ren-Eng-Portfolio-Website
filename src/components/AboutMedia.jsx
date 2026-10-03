import { useState } from "react";

export default function AboutMedia({
  src,
  alt,
  label,
  caption,
  className = "",
}) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className={`media-item ${className}`.trim()}>
      <div className="about-media">
        {!failed ? (
          <img
            src={src}
            alt={alt}
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="media-placeholder">
            <span>{label}</span>
            <small>{src.replace("/images/", "public/images/")}</small>
          </div>
        )}
      </div>

      {caption && (
        <figcaption className="media-caption">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}