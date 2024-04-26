import React from 'react';
import classes from './Navbar.module.css'
import NavbarItem from '../UI/NavbarItem/NavbarItem';
import homeSvg from '../../svg/home.svg'
import shareSvg from '../../svg/share.svg'

const Navbar = () => {
    return (
        <ul className={classes.navbar}>
            <NavbarItem img={homeSvg}>
                Главная
            </NavbarItem>
            <NavbarItem img={shareSvg}>
                Поделиться плейлистом
            </NavbarItem>
        </ul>
    );
}

export default Navbar;
