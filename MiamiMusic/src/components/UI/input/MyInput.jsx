import React from 'react';
import searchSvg from '../../../svg/search.svg'
import classes from './MyInput.module.css'

const MyInput = () => {
    return (
        <div>
            <img className={classes.inputImg} src={searchSvg} alt="" />
        </div>
    );
}

export default MyInput;
