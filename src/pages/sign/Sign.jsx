import './Sign.css';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// 컴포넌트 불러오기
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import NavySection from '../../components/ui/navy-section/NavySection';

export default function SignInUp() {

    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const goToSignIn = () => {
        navigate('/sign-in');
    }

    const goToSignUp = () => {
        navigate('/sign-up')
    }

    const goToMyPage = () => {
        navigate('/my-page');
    }

    return (
        <div>
            <div className='page-wrapper'>
                <Header />
                <NavySection />
                <div className='auth-container'>
                    <div className='auth-wrapper'>
                        {/* sign in 영역 (왼쪽) */}
                        <div className='left-sign-in-section'>
                            <button className='left-sign-in-button' onClick={goToSignIn}>SIGN IN</button>
                            <div className='left-sign-in-text'>
                                <p>로그인하고</p>
                                <p>리스캐치만의 수요 예측 결과를</p>
                                <p>확인해보세요 !</p>
                            </div>
                        </div>

                        {/* sign up 영역 (오른쪽) */}
                        <div className='right-sign-up-section'>
                            <button className='right-sign-up-button' onClick={goToSignUp}>SIGN UP</button>
                            <div className='right-sign-up-text'>
                                <p>간편한 가입 한 번으로</p>
                                <p>스마트한 수요 예측까지 !</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}