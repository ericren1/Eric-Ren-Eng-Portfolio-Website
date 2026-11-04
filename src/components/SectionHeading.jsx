export default function SectionHeading({ id, children, centered = false }) {
  const words = String(children).split(' ');
  const last = words.pop();
  return <header className={'section-heading '+(centered?'section-heading--archive':'section-heading--editorial')}>
    <h2 id={id}>{centered ? children : <>{words.length > 0 && words.join(' ')+' '}<em>{last}</em></>}</h2>
    <svg className="heading-rule" viewBox="0 0 200 18" fill="none" aria-hidden="true"><path d="M4 10 C38 6 69 8 102 6 S164 4 195 7"/><path d="M14 14 C60 10 115 13 179 10"/></svg>
  </header>;
}
