import './Header.css';

import HeaderButton from '../ui/header-button/HeaderButton';
import { useAuth } from '../../contexts/AuthContext.jsx';

import { useNavigate } from 'react-router-dom';

import riskCatchLogoNavy from '../../assets/riskCatchLogoNavy.png';

export default function Header() {

    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const goToSign = () => {
        navigate('/sign');
    }

    const goToMyPage = () => { 
        navigate('/my-page');
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
            goToMyPage();
        } else {
            goToSign();
        }
    }

    return (
        <div>
            <header>
                <img className='risk-catch-logo-header' src={riskCatchLogoNavy} alt='RiskCatch 로고' onClick={goToHome}></img>
                {/* header-nav 구분선 */}
                <div className='nav-header-line'></div>

                <div className='nav-wrapper'>
                {/* nav 왼쪽 */}
                    <div className='nav-left-wrapper'>
                        <HeaderButton label='SOLUTION' onClick={goToSolution} className={isCurrentPage('/solution') ? 'active' : ''}/>
                        <HeaderButton label='ABOUT US' onClick={goToAboutUs} className={isCurrentPage('/about-us') ? 'active' : ''}/>
                        <HeaderButton label='CONTACT US' onClick={goToContactUs} className={isCurrentPage('/contact-us') ? 'active' : ''}/>
                    </div>
                    {/* nav 오른쪽 */}
                    <div className='nav-right-wrapper'>
                        <HeaderButton label='문의하기' onClick={goToInquiry} className={isCurrentPage('/inquiry') ? 'active' : ''} id='header-inquiry-button'/>
                        <HeaderButton 
                            label={isLoggedIn ? 'MY PAGE' : 'SIGN IN / UP'}
                            onClick={handleSignButtonClick} 
                            className={`header-sign-in-up-button ${
                                isCurrentPage('/sign') || isCurrentPage('/sign-in') || isCurrentPage('/sign-up') || isCurrentPage('/my-page')
                                ? 'active' 
                                : ''
                            }`}
                        />
                    </div>
                </div>
            </header>
        </div>
    )
}