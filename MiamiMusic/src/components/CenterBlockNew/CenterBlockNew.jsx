import React from 'react';
import classes from './CenterBlockNew.module.css'
import Header from '../UI/header/header';
import playSvg from '../../svg/play.svg'
import PageLineNew from '../PageLineNew/PageLineNew';
import Footer from '../UI//footer/footer';

const CenterBlockNew = ({ playSong}) => {
    return (
        <div className={classes.centerBlock}>
            <Header />
            <div className={classes.contentSpasing}>
                <PageLineNew 
                    playSong={playSong}
                    subtitle='Новинки'
                    discriptionText='Новые треки, альбомы и сборники'>
                </PageLineNew>
            </div>
            <Footer />
        </div>
    );
}

export default CenterBlockNew ;
