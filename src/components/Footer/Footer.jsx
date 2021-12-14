import React from 'react';
import SectionPadding from '../SectionPadding/SectionPadding';
import './Footer.scss'

const Footer = props => {
    return (
        <SectionPadding>
            <footer>
                <a href="https://discord.gg/XgPNKapzzx">Discord</a> | 
                <a href="https://twitter.com/dinogents"> Twitter</a> | 
                <a href="https://vm.tiktok.com/ZMRqnkKDX/"> TikTok</a> | 
                <a href="https://www.reddit.com/r/Dinogents/"> Reddit</a> | 
                <a href="https://link.medium.com/MPBQK7QPIjb"> Medium</a> | 
                <a href="mailto:hello@dinogents.com"> Email</a>
                <br /><br />
                © Copyright Dinosaur Gentlemen 2021. <br/> Built with ❤️ by <a target="_blank" rel="noreferrer" style={{color: 'rgb(0,128,255)', lineHeight: 1.9}} href="https://raincloud.me">raincloud.me</a>
            </footer>
        </SectionPadding>
    )
}

export default Footer;