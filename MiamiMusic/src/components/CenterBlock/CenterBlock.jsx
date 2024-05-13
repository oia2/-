import React from 'react';
import classes from './CenterBlock.module.css'
import Header from '../UI/header/header';
import playSvg from '../../svg/play.svg'
import PageLine from '../PageLine/PageLine';
import Footer from '../UI//footer/footer';

const CenterBlock = ({ playSong}) => {
    return (
        <div className={classes.centerBlock}>
            <Header playSong={playSong}/>
            <div className={classes.contentSpasing}>
                <div className={classes.centerBlock__content}>
                    <button className={classes.content__button}>
                        <img src={playSvg} alt="" />
                        <span>Поток</span>
                    </button>
                </div>
                <PageLine 
                    playSong={playSong}
                    subtitle='Новинки'
                    discriptionText='Новые треки, альбомы и сборники'>
                </PageLine>
                <PageLine
                    playSong={playSong}
                    subtitle='Популярные плейлисты'
                    discriptionText='Собрано с душой'>
                </PageLine>
            </div>
            <Footer />
        </div>
    );
}

export default CenterBlock;
