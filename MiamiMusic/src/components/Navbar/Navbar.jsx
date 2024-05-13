import React from 'react';
import classes from './Navbar.module.css'
import NavbarItem from '../UI/NavbarItem/NavbarItem';
import homeSvg from '../../svg/home.svg'
import shareSvg from '../../svg/share.svg'
import newSvg from '../../svg/new.svg';

const Navbar = () => {
    return (    
        <ul className={classes.navbar}>
            <NavbarItem link="/*" img={homeSvg}>
                Главная
            </NavbarItem>
            <NavbarItem link="/new" img={newSvg}>
                Новинки
            </NavbarItem>
            <NavbarItem link="/login" img={shareSvg}>
                Поделиться плейлистом
            </NavbarItem>
        </ul>
    );
}

export default Navbar;
