import React from 'react';
import classes from './NavbarItem.module.css'

const NavbarItem = ({children, ...props}) => {
    return (
        <li className={classes.navbarItem}>
            <a className={classes.itemHref} href="#">
                <img className={classes.itemImg} src={props.img} alt="" />
                <span className={classes.itemspan}>
                    {children}
                </span>
            </a>
        </li>
    );
}

export default NavbarItem;
