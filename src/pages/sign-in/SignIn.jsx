import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import './SignIn.css';

// 컴포넌트 불러오기
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import SignInput from '../../components/ui/sign-input/SignInput';
import ModalOverlay from '../../components/ui/modal-overlay/ModalOverlay';
import AuthNavyLine from '../../components/ui/auth-navy-line/AuthNavyLine';

export default function SignIn() {

    const navigate = useNavigate();
    const { login } = useAuth();
    
    const goToHome = () => {
        navigate('/');
    }

    const goToFindCode = () => {
        navigate('/find-code');
    }

    const [companyCode, setCompanyCode] = useState('');
    const [isValidCode, setIsValidCode] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSuccessfulLogin = () => {
        login();
        goToHome();
    }

    // API를 통한 업체 코드 확인
    const handleCheckCode = async () => {
        if (!companyCode.trim()) {
            setIsValidCode(false);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('http://165.246.80.74:8000/api/accounts/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: companyCode
                })
            });

            if (response.ok) {
                const data = await response.json();
                // 토큰을 로컬 스토리지에 저장
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('code', data.code);
                
                setIsValidCode(true);
            } else {
                const errorData = await response.json();
                setIsValidCode(false);
                if (response.status === 404) {
                    // 업체가 존재하지 않는 경우
                    console.log('업체 코드를 찾을 수 없습니다.');
                }
            }
        } catch (error) {
            console.error('API 호출 에러:', error);
            setIsValidCode(false);
            alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    }

    // sign in 성공 시 모달
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    }

    return (
        <div>
            <div className='page-wrapper'>
                <Header />
                <main className='auth-main-content'>
                    <div className='auth-title-section'>
                        <h1 className='auth-title'>업체 인증</h1>
                        <h2 className='auth-subtitle'>SIGN IN</h2>
                        <AuthNavyLine />
                    </div>

                    <div className='auth-sign-in-form-section'>
                        <label htmlFor='companyCode' className='code'>업체코드</label>
                        <div className='code-box'>
                            <SignInput 
                                type='text' 
                                id='companyCode' 
                                placeholder='업체 코드를 입력해주세요'
                                value={companyCode}
                                onChange={(e) => setCompanyCode(e.target.value)}
                            ></SignInput>
                            <div className='valid-message-box'>
                                {isValidCode === true && (
                                    <p className='sign-valid-message success'>✓ 업체코드가 확인되었습니다.</p>
                                )} 
                                {isValidCode === false && (
                                    <p className='sign-valid-message error'>✓ 존재하지 않는 코드입니다. 다시 확인해주세요 !</p>
                                )}
                            </div>
                            <div className='sign-find-code-button' onClick={goToFindCode}>업체 코드 찾기 <span>&#10095;</span></div>
                        </div>
                        <button 
                            className={`check-button ${isValidCode === true ? 'confirmed' : 'disabled'}`} 
                            onClick={handleCheckCode}
                            disabled={isLoading}
                        >
                            {isLoading ? '확인 중...' : '확인'}
                        </button>
                    </div>
                    <button 
                        className={`auth-sign-button ${isValidCode === true ? 'active' : 'disabled'}`}
                        onClick={isValidCode === true ? openModal : undefined}
                        disabled={isValidCode !== true}>SIGN IN</button>
                </main>
            </div>
            <Footer />
            {/* sign in 성공 시 모달 */}
            {showModal && (
                <ModalOverlay>
                    <div className='sign-in-modal-container'>
                        <div className='sign-in-modal-navy-section' />
                        <span className="material-symbols-outlined check-icon">task_alt</span>
                        <h2 className='sign-modal-title'>업체 인증 완료 !</h2>
                        <div className='sign-in-modal-text'>
                            <p>지금 바로 다양한 수요 예측 서비스를</p>
                            <p>무제한으로 이용하세요 !</p>
                        </div>
                        <button className='auth-modal-home-button' onClick={handleSuccessfulLogin}>홈으로 가기</button>
                    </div>
                </ModalOverlay>
            )}
        </div>
    )
}