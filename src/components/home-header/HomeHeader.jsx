import './HomeHeader.css';
import HeaderWhiteButton from '../ui/header-white-button/HeaderWhiteButton';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

import riskCatchLogoWhite from '../../assets/riskCatchLogoWhite.png';

export default function HomeHeader() {

    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const goToSign = () => {
        navigate('/sign');
    }

    const goToHome = () => {
        navigate('/');
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

    const goToSolution = () => {
        navigate('/solution');
    }

    // 현재 페이지 확인
    const isCurrentPage = (path) => {
        return location.pathname === path;
    }

    // 로그인 상태에 따라서 버튼 처리 다르게
    const handleSignButtonClick = () => {
        if (isLoggedIn) {
            goToMypage();
        } else {
            goToSign();
        }
    }

    return (
        <div>
            <header className='header-white'>
                <img className='risk-catch-logo-header-main' src={riskCatchLogoWhite} alt='RiskCatch 로고' onClick={goToHome}></img>
                {/* header-nav 구분선 */}
                <div className='white-header-line'></div>

                <div className='nav-wrapper'>
                {/* nav 왼쪽 */}
                    <div className='nav-left-wrapper'>
                        <HeaderWhiteButton label='SOLUTION' onClick={goToSolution} className={isCurrentPage('/solution') ? 'active' : ''}/>
                        <HeaderWhiteButton label='ABOUT US' onClick={goToAboutUs} className={isCurrentPage('/about-us') ? 'active' : ''}/>
                        <HeaderWhiteButton label='CONTACT US' onClick={goToContactUs} className={isCurrentPage('/contact-us') ? 'active' : ''}/>
                    </div>
                    {/* nav 오른쪽 */}
                    <div className='nav-right-wrapper'>
                        <HeaderWhiteButton label='문의하기' onClick={goToInquiry} className={isCurrentPage('/inquiry') ? 'active' : ''} id='header-inquiry-button'/>
                        <HeaderWhiteButton 
                            label={isLoggedIn ? 'MY PAGE' : 'SIGN IN / UP'}
                            onClick={handleSignButtonClick} className={`header-sign-in-up-button ${
                                isCurrentPage('/sign') || isCurrentPage('/sign-in') || isCurrentPage('/sign-up') || isCurrentPage('/mypage')
                                ? 'active' 
                                : ''
                        }`}/>
                    </div>
                </div>
            </header>
        </div>
    )
}