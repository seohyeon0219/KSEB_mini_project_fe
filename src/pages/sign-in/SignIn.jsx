import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

// 컴포넌트 불러오기
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import SignInput from '../../components/ui/sign-input/SignInput';
import ModalOverlay from '../../components/ui/modal-overlay/ModalOverlay';
import AuthNavyLine from '../../components/ui/auth-navy-line/AuthNavyLine';
import { useAuth } from '../../contexts/AuthContext.jsx';

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

    const handleCheckCode = () => {
        if (companyCode === '리스캐치') {
            setIsValidCode(true);
        } else {
            setIsValidCode(false);
        }
    }

    // sign in 성공 시 모달
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
        login();
    }

    // const closeModal = () => {
    //     setShowModal(false);
    // }

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
                                    <p className='sign-valid-message success'>V 업체코드가 확인되었습니다.</p>
                                )} 
                                {isValidCode === false && (
                                    <p className='sign-valid-message error'>V 존재하지 않는 코드입니다. 다시 확인해주세요 !</p>
                                )}
                            </div>
                            <div className='sign-find-code-button' onClick={goToFindCode}>업체 코드 찾기 <span>&#10095;</span></div>
                        </div>
                        <button className={`check-button ${isValidCode === true ? 'confirmed' : 'disabled'}`} 
                            onClick={handleCheckCode}>확인</button>
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
                        <button className='auth-modal-home-button' onClick={goToHome}>홈으로 가기</button>
                    </div>
                </ModalOverlay>
            )}
        </div>
    )
}