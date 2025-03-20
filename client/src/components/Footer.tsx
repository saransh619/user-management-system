const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <p>© {currentYear} | Saransh Pachhai</p>
        </footer>
    );
};

export default Footer;