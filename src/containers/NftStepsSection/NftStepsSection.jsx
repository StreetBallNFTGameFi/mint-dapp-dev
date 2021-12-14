import React from 'react';
import Countdown from 'react-countdown';
import ImageWithLoadBg from '../../components/ImageWithLoadBg/ImageWithLoadBg';
import SectionPadding from '../../components/SectionPadding/SectionPadding';
import TextBox from '../../components/TextBox/TextBox';
import TitleText from '../../components/TitleText/TitleText';
import './NftStepsSection.scss';
import NftImage from '../../assests/images/nft.gif';
import Logo from '../../assests/images/logo.png';

const Completionist = () => <span>Presale has started!</span>;

// Renderer callback with condition
const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <Completionist />;
  } else {
    // Render a countdown
    return <span>{days}:{hours}:{minutes}:{seconds}</span>;
  }
};

const NftStepsSection = props => {
    return (
        <div className="nft-steps-section">
            <SectionPadding>
                <div className='container'>
                    <div className="boxes-container">
                        <ImageWithLoadBg
                            src={Logo}
                            aspectRatio={4}
                            alt=""
                        />
                        <TitleText>Presale opens in:</TitleText>
                        <Countdown
                            date={Date.UTC(2021, 9, 14, 19, 0, 0, 0)}
                            renderer={renderer}
                        />
                        <TextBox
                            text=""
                        />

                    </div>
                    <div className="image-container">
                        <div className="image-inner">
                            <ImageWithLoadBg
                                src={NftImage}
                                aspectRatio={1.1}
                                alt=""
                            />
                        </div>
                    </div>
                </div>
            </SectionPadding>
        </div>
    )
}

export default NftStepsSection