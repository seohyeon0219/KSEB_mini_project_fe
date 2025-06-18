import './Footer.css';

import riskCatchLogoGray from '../../assets/riskCatchLogoGray.png';

import { useNavigate, useLocation } from 'react-router-dom';

import { Link } from 'react-router-dom';

export default function Footer() {

    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/');
    }
    
    const goToSign = () => {
        navigate('/sign');
    }

    const goToSolution = () => {
        navigate('/solution');
    }

    const goToInquiry = () => {
        navigate('/inquiry');
    }

    const goToAboutUs = () => {
        navigate('/about-us');
    }

    const goToContactUs = () => {
        navigate('/contact-us');
    }

    return (
        <div>
            <footer>
                <img className='risk-catch-logo-footer' src={riskCatchLogoGray} alt='RiskCatch 로고' onClick={goToHome}></img>
                <div className='footer-left'>
                    <p className='footer-text'>© 2025 RiskCatch Inc. All rights reserved.</p>
                    <p className='footer-text'>Contact: riskcatch@gmail.com</p>
                </div>
                <div className='footer-line'></div>
                <div className='footer-right'>
                    <div className='footer-right-top'>
                        <Link to='/solution' className='footer-button' onClick={goToSolution}>SOLUTION</Link>
                        <Link to='/about-us' className='footer-button' onClick={goToAboutUs}>ABOUT US</Link>
                        <Link to='/contact-us' className='footer-button' onClick={goToContactUs}>CONTACT US</Link>
                        <Link to='/inquiry' className='footer-button' onClick={goToInquiry}>문의하기</Link>
                        <Link to='/sign' className='footer-button' onClick={goToSign}>SIGN IN / UP</Link>
                    </div>
                    <div className='footer-right-bottom'>
                        <a href='https://github.com/' target='_blank' rel="noopener noreferrer" className='github-link' title='GitHub로 이동'>GitHub</a>
                        <p className='footer-text'>이용약관&nbsp;&nbsp;개인정보 처리방침</p>
                    </div>
                    
                </div>
            </footer>
        </div> 
    )
}