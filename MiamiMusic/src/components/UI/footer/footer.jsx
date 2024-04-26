import React from 'react';
import classes from './footer.module.css'

const Footer = () => {
    return (
        <div className={classes.footer}>
            <div className={classes.footerLeft}>
                <a href="#">О нас</a>
                <a href="#">Реклама</a>
                <a href="#">Пользовательское соглашение</a>
            </div>
            <span>© 2024 MiamiMusic</span>
        </div>
    );
}

export default Footer;
