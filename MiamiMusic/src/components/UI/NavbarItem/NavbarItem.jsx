
import React from 'react';
import { NavLink } from 'react-router-dom';
import classes from './NavbarItem.module.css';

const NavbarItem = ({ link, img, children }) => {
    return (
        <li className={classes.navbarItem}>
            <NavLink 
                to={link} 
                className={({ isActive }) => 
                    `${classes.itemHref} ${isActive ? classes.active : ''}`}
            >
                <img src={img} alt="" className={classes.itemImg} />
                <span className={classes.itemspan}>{children}</span>
            </NavLink>
        </li>
    );
}

export default NavbarItem;
