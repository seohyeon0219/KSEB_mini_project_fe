import './FindCode.css';

import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import ModalOverlay from '../../components/ui/modal-overlay/ModalOverlay';
import AuthNavyLine from '../../components/ui/auth-navy-line/AuthNavyLine';

import SignInput from '../../components/ui/sign-input/SignInput';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FindCode() {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/');
    }

    const goToSignIn = () => {
        navigate('/sign-in');
    }

    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [foundCode, setFoundCode] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setErrorMessage(''); // 입력 시 에러 메시지 초기화
    }

    const handleNumberChange = (e) => {
        setNumber(e.target.value);
        setErrorMessage(''); // 입력 시 에러 메시지 초기화
    }

    // API 호출 함수
    const handleFindCode = async () => {
        setErrorMessage('');
        setIsLoading(true);

        try {
            // GET 요청에서는 URL 파라미터로 데이터 전송
            const params = new URLSearchParams({
                email: email,
                phone: number
            });
            
            const response = await fetch(`http://165.246.80.74:8000/api/accounts/get-code/?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const data = await response.json();
                setFoundCode(data.code); // 백엔드에서 받은 코드 저장
                setShowModal(true);
            } else if (response.status === 404) {
                setErrorMessage('✓ 존재하지 않는 업체 정보입니다. 다시 확인해주세요 !');
            } else {
                setErrorMessage('✓ 코드 찾기에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('API 호출 에러:', error);
            setErrorMessage('✓ 네트워크 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    }

    // 코드 복사 기능
    const handleCopyCode = () => {
        navigator.clipboard.writeText(foundCode)
            .then(() => {
                alert('코드가 복사되었습니다!');
            })
            .catch(() => {
                alert('복사에 실패했습니다.');
            });
    }

    // 업체 코드 성공 시 모달
    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            <div className='page-wrapper'>
                <Header />
                <main className='auth-main-content'>
                    <div className='auth-title-section'>
                        <h1 className='auth-title'>업체 코드 찾기</h1>
                        <h2 className='auth-subtitle'>COMPANY CODE</h2>
                        <AuthNavyLine />
                    </div>

                    <div className='auth-find-code-form-section'>
                        <div className='find-code-form'>
                            <label htmlFor='email' className='code'>사업자 이메일</label>
                            <div className='code-box'>
                                <SignInput 
                                    type='email' 
                                    id='email' 
                                    placeholder='예 : riskCatch@example.com'
                                    value={email}
                                    onChange={handleEmailChange}
                                ></SignInput>
                            </div>
                        </div>
                        <div className='find-code-form'>
                            <label htmlFor='number' className='code'>전화번호</label>
                            <div className='code-box'>
                                <SignInput 
                                    type='text' 
                                    id='number' 
                                    placeholder='예 : 010-1234-5678'
                                    value={number}
                                    onChange={handleNumberChange}
                                ></SignInput>
                            </div>
                        </div>
                    </div>
                    <button 
                        className={`auth-find-code-button ${email && number && !isLoading ? 'active' : 'disabled'}`}
                        onClick={handleFindCode} 
                        disabled={!email || !number || isLoading}
                    >
                        {isLoading ? '찾는 중...' : '업체 코드 찾기'}
                    </button>
                    <div className='valid-message-box'>
                        {errorMessage && (
                            <p className='auth-find-valid-message error'>{errorMessage}</p>
                        )}
                    </div>
                </main>
            </div>
            <Footer />
            {/* 업체 코드 찾기 성공 시 모달 */}
            {showModal && (
                <ModalOverlay>
                    <div className='sign-up-modal-container'>
                        <div className='sign-up-modal-navy-section'></div>

                        <h2 className='sign-modal-title'>업체 코드 찾기 완료 !</h2>
                        <div className='sign-up-modal-middle'>
                            <h3 className='sign-up-modal-subtitle'>업체 코드</h3>
                            <div className='sign-up-modal-company-code'>
                                <p className='auth-company-code'>{foundCode}</p>
                                <button className='copy-button' onClick={handleCopyCode}>복사</button>
                            </div>
                        </div>
                        <div className='sign-up-modal-bottom'>
                            <button className='auth-modal-login-button' onClick={goToSignIn}>
                                확인
                            </button>
                            <button className='auth-modal-home-button' onClick={goToHome}>
                                홈으로 가기 
                            </button>
                        </div>
                    </div>
                </ModalOverlay>
            )}
        </div>
    )
}