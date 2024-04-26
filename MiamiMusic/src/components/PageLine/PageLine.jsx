import React from 'react';
import classes from './PageLine.module.css'
import img from '../../img/luchick.jfif'
import PageLineItem from '../UI/PageLineItem/PageLineItem';

const PageLine = (props) => {
    return (
        <div className={classes.pageLine}>
            <div className={classes.pageLine__subtitleWrapper}>
                <span className={classes.pageLine__subtitle}>{props.subtitle}</span>
                <div className={classes.pageLine__discription}>
                    <span className={classes.pageLine__discriptionText}>{props.discriptionText}</span>
                    <span className={classes.pageLine__showAll}>Показать все</span>
                </div>
            </div>
            <div className={classes.pageLine__albums}>
                <PageLineItem />
                <PageLineItem />
                <PageLineItem />
                <PageLineItem />
            </div>
        </div>
    );
}

export default PageLine;
