import AboutMedia from "../components/AboutMedia";

const sections = [
  {
    label: "MUSIC",
    title: "Audio Engineer / Music Producer.",
    body:
      "One of my favourite hobbies is music production and audio engineering. I have worked with Gold and Platinum-selling artists, built an online business from scratch, and generated over 100,000 hits on my website.",
    layout: "mosaic",
    images: [
      {
        src: "/images/asfasf.jpg",
        alt: "Music production studio",
        label: "Music studio",
      },
      {
        src: "/images/ba1.png",
        alt: "Music production statistics",
        label: "Music stats",
      },
      {
        src: "/images/fasaf.png",
        alt: "Music production statistics",
        label: "Music stats",
      },
    ],
  },

  {
    label: "TRAVEL",
    title: "I love to explore new places and cultures.",
    body:
      "Travel has opened my eyes to different ways of living, thinking, and communicating. Being in unfamiliar places pushes me outside my comfort zone and gives me perspectives I would never get by staying in one environment.",
    layout: "quad",
    images: [
      {
        src: "/images/mexico.jpg",
        alt: "Landscape in Tulum, Mexico",
        label: "Travel photo",
        caption: "Tulum, Quintana Roo, Mexico",
      },
      {
        src: "/images/Miami.jpg",
        alt: "Formula 1 in Miami, Florida",
        label: "Travel photo",
        caption: "F1 Miami, Florida",
      },
      {
        src: "/images/shanghai.jpg",
        alt: "Shanghai skyline at night",
        label: "Travel photo",
        caption: "Shanghai, China",
      },
      {
        src: "/images/Yodaguy museum.jpg",
        alt: "Yoda Guy Movie Exhibit",
        label: "Travel photo",
        caption: "Yoda Guy Movie Exhibit — Philipsburg, Sint Maarten",
      },
    ],
  },

  {
    label: "FITNESS",
    title: "I Enjoy Being Active.",
    body:
      "Training is a big part of my routine. I lift consistently and play basketball, and I believe taking care of your body helps you perform at your best mentally as well. Sports and the gym have taught me important lessons about teamwork, discipline, consistency, and hard work.",
    layout: "two",
    images: [
      {
        src: "/images/hoops.jpg",
        alt: "Playing basketball",
        label: "Basketball photo",
      },
      {
        src: "/images/gym.jpg",
        alt: "Training in the gym",
        label: "Gym photo",
      },
    ],
  },
];

export default function About() {
  return (
    <section className="about-page">
      <div className="container about-hero">
        <p className="eyebrow">ABOUT ME</p>

        <h1>Fun Facts</h1>

        <div className="about-intro-grid">
          <p className="about-lead">
            Hobbies and things I am interested in outside of engineering.
          </p>
        </div>
      </div>

      <div className="story-sections">
        {sections.map((section, index) => (
          <section className="story-section" key={section.label}>
            <div className="container story-layout">
              <div className="story-copy">
                <p className="story-index">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <p className="eyebrow">{section.label}</p>

                <h2>{section.title}</h2>

                <p className="story-body">{section.body}</p>
              </div>

              {section.images.length > 0 && (
                <div
                  className={`story-media-grid story-media-${section.layout}`}
                >
                  {section.images.map((image) => (
                    <AboutMedia
                      key={image.src}
                      src={image.src}
                      alt={image.alt}
                      label={image.label}
                      caption={image.caption}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}