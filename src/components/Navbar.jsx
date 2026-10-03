import { Link, NavLink } from "react-router-dom";

const navigation = [
  { to: "/experience", label: "Experience" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About Me" },
];

export default function Navbar() {
  return (
    <header className="nav-wrap">
      <nav className="navbar container">
        <Link to="/" className="brand-text">
          <span className="brand-name">Eric Ren</span>
          <span className="brand-title">Computer Engineer</span>
          
        </Link>

        <div className="nav-links">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
