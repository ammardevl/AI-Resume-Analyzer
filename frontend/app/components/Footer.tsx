const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="reality-footer">
      <div className="reality-footer__inner">
        <p>
          © {year} <span className="reality-footer__brand">Resumind v2.0</span> —
          a free ATS resume checker.
        </p>
        <p>
          Built by{" "}
          <a
            href="https://reality-codes.netlify.app/"
            target="_blank"
            rel="noreferrer"
          >
            Muhammad Ammar
          </a>
          , who runs{" "}
          <a
            href="https://reality-codes.netlify.app/"
            target="_blank"
            rel="noreferrer"
          >
            Reality Codes
          </a>{" "}
          — AI solutions &amp; websites.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
