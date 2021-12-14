import React from 'react';
import BodyText from '../BodyText/BodyText';
import './TextBox.scss';

const TextBox = props =>{
    const {text} = props;
    return(
        <div className = 'text-box' style={{textAlign: 'justify'}}>
            <BodyText><p style={{ fontWeight: '900', color: '#fff', lineHeight: '2'}}>Presale Minting for Early Birds!</p>
                            50 Ravenous Dino Arts are provided for presale from the rarities.<br/><br/>
                        
                            We only focus on early believers of our project and giving them the opportunity to enjoy our presale.<br/><br/>
                            
                            The Mint cost for presale will cost 1 SOL only (excluding the transaction fee).<br/><br/>
                            
                            Early Birds are closed group of people in our community that has showed interest in the presale and it will only be made public if there’s no sold out. Grab as much Dinogents as Possible!</BodyText>
        </div>
    )
}

export default TextBox;