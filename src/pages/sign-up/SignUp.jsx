import './SignUp.css';

import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import ModalOverlay from '../../components/ui/modal-overlay/ModalOverlay';
import AuthNavyLine from '../../components/ui/auth-navy-line/AuthNavyLine';

import SignInput from '../../components/ui/sign-input/SignInput';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/');
    }

    const goToSignIn = () => {
        navigate('/sign-in');
    }

    // 사업명
    const [companyName, setCompanyName] = useState('');
    const [isValidCompanyName, setIsValidCompanyName] = useState(null);

    const handleCompanyNameChange = (e) => {
        const value = e.target.value;
        setCompanyName(value);

        if (value === '') {
            setIsValidCompanyName(null);
        } else if (value.length < 1 || value.length > 20) {
            setIsValidCompanyName(false);
        } else {
            setIsValidCompanyName(true);
        }
    }

    // 사업자명 유효성 검사
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(null);

    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);

        // 실시간 유효성 검사
        if (value === '') {
            setIsValidName(null);
        } else if (value.length < 1 || value.length > 10) {
            setIsValidName(false);
        } else {
            const regex = /^[가-힣a-zA-Z0-9]+$/;
            setIsValidName(regex.test(value));
        }
    }

    // 사업자 이메일 중복 검사
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(null);
    const [emailFormatValid, setEmailFormatValid] = useState(null);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        // 이메일이 변경되면 중복 확인 상태 초기화
        setIsValidEmail(null);

        // 실시간 이메일 형식 검사
        if (value === '') {
            setEmailFormatValid(null);
            setIsValidEmail(null);
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isValid = emailRegex.test(value);
            setEmailFormatValid(isValid);

            if (!isValid) {
                setIsValidEmail(null);
            }
        }
    }

    const handleCheckEmail = async () => {
        if (!email) {
            alert('이메일을 입력해주세요.');
            return;
        }
        
        setIsCheckingEmail(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/accounts/duplicate/email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email
                })
            });

            if (response.ok) {
                const data = await response.json();
                setIsValidEmail(!data.duplicate); // duplicate가 false면 사용 가능
            } else {
                alert('이메일 중복 확인에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('이메일 중복 확인 에러:', error);
            alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsCheckingEmail(false);
        }
    }

    // 전화번호 중복 검사
    const [number, setNumber] = useState('');
    const [isValidNumber, setIsValidNumber] = useState(null);
    const [numberFormatValid, setNumberFormatValid] = useState(null);
    const [isCheckingNumber, setIsCheckingNumber] = useState(false);

    const handleNumberChange = (e) => {
        const value = e.target.value;
        setNumber(value);

        // 전화번호가 변경되면 중복 확인 상태 초기화
        setIsValidNumber(null);

        // 실시간 전화번호 형식 검사
        if (value === '') {
            setNumberFormatValid(null);
            setIsValidNumber(null);
        } else {
            const numberRegex = /^010-\d{4}-\d{4}$/;
            const isValid = numberRegex.test(value);
            setNumberFormatValid(isValid);

            // 형식에 맞지 않으면 중복 상태 초기화
            if (!isValid) {
                setIsValidNumber(null);
            }
        }
    }

    const handleCheckNumber = async () => {
        if (!numberFormatValid || !number) return;
        
        setIsCheckingNumber(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/accounts/duplicate/phone`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: number
                })
            });

            if (response.ok) {
                const data = await response.json();
                setIsValidNumber(!data.duplicate); // duplicate가 false면 사용 가능
            } else {
                alert('전화번호 중복 확인에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('전화번호 중복 확인 에러:', error);
            alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsCheckingNumber(false);
        }
    }

    // sign up 성공 시 모달
    const [showModal, setShowModal] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // API 호출 함수
    const handleSignUp = async () => {
        setIsLoading(true);
        
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/accounts/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: companyName,        // 상호명을 name으로 전송
                    manager: name,            // 사업자 이름을 manager로 전송
                    email: email,
                    phone: number
                })
            });

            if (response.ok) {
                const data = await response.json();
                setGeneratedCode(data.code);  // 백엔드에서 받은 코드 저장
                setShowModal(true);
            } else {
                alert('등록에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('API 호출 에러:', error);
            alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    }

    // 코드 복사 기능
    const handleCopyCode = () => {
        navigator.clipboard.writeText(generatedCode)
            .then(() => {
                alert('코드가 복사되었습니다!');
            })
            .catch(() => {
                alert('복사에 실패했습니다.');
            });
    }

    return (
        <div>
            <div className='page-wrapper'>
                <Header />
                <main className='auth-main-content'>
                    <div className='auth-title-section'>
                        <h1 className='auth-title'>업체 등록</h1>
                        <h2 className='auth-subtitle'>SIGN UP</h2>
                        <AuthNavyLine />
                    </div>

                    <div className='auth-sign-up-form-section'>
                        <div className='sign-up-form'>
                            <label htmlFor='companyName' className='code'>상호명</label>
                            <div className='code-box'>
                                <SignInput 
                                    type='text'    
                                    id='companyName' 
                                    placeholder='상호명을 입력해주세요. (20자 이내)'
                                    value={companyName}
                                    onChange={handleCompanyNameChange}
                                ></SignInput> 
                                <div className='valid-message-box'>
                                    {isValidCompanyName === true && (
                                        <p className='sign-valid-message success'>✓ 올바른 형식입니다.</p>
                                    )}
                                    {isValidCompanyName === false && (
                                        <p className='sign-valid-message error'>✓ 1~20자 이내로 입력해주세요.</p>
                                    )}
                                </div> 
                            </div>
                        </div>
                        <div className='sign-up-form'>
                            <label htmlFor='name' className='code'>사업자 이름</label>
                            <div className='code-box'>
                                <SignInput 
                                    type='text' 
                                    id='name' 
                                    placeholder='사업자 이름을 입력해주세요. (한글, 영문, 숫자 10자 이내)'
                                    value={name}
                                    onChange={handleNameChange}
                                ></SignInput>
                                {/* 사업자명 입력 결과 실시간 */}
                                <div className='valid-message-box'>
                                    {isValidName === true && (
                                        <p className='sign-valid-message success'>✓ 올바른 형식입니다.</p>
                                    )}
                                    {isValidName === false && name.length > 0 && (name.length < 1 || name.length > 10) && (
                                        <p className='sign-valid-message error'>✓ 1~10자 이내로 입력해주세요.</p>
                                    )}
                                    {isValidName === false && name.length >= 1 && name.length <= 10 && (
                                        <p className='sign-valid-message error'>✓ 한글, 영문, 숫자만 입력 가능합니다.</p>
                                    )}
                                </div>
                            </div>
                        
                        </div>
                        <div className='sign-up-form'>
                            <label htmlFor='email' className='code'>사업자 이메일</label>
                            <div className='code-box'>
                                <SignInput 
                                    type='email' 
                                    id='email' 
                                    placeholder='예 : riskCatch@example.com'
                                    value={email}
                                    onChange={handleEmailChange}
                                ></SignInput>
                                {/* 사업자 이메일 입력 결과 */}
                                <div className='valid-message-box'>
                                    {emailFormatValid === false && isValidEmail === null && (
                                        <p className='sign-valid-message error'>✓ 올바른 이메일 형식이 아닙니다.</p>
                                    )}
                                    {emailFormatValid === true && isValidEmail === null && (
                                        <p className='sign-valid-message info'>✓ 올바른 형식입니다. 중복 확인을 해주세요.</p>
                                    )}
                                    {isValidEmail === true && (
                                        <p className='sign-valid-message success'>✓ 사용 가능한 이메일입니다.</p>
                                    )}
                                    {isValidEmail === false && (
                                        <p className='sign-valid-message error'>✓ 중복된 이메일입니다. 다시 확인해주세요.</p>
                                    )}
                                </div>
                            </div>
                            <button 
                                disabled={!emailFormatValid || !email || isCheckingEmail} 
                                className={`check-button ${isValidEmail === true ? 'confirmed' : 'disabled'}`}
                                onClick={handleCheckEmail}>
                                {isCheckingEmail ? '확인 중...' : '중복확인'}
                            </button>
                        </div>
                        <div className='sign-up-form'>
                            <label htmlFor='number' className='code'>전화번호</label>
                            <div className='code-box'>
                                <SignInput 
                                    type='text' 
                                    id='number' 
                                    placeholder='예 : 010-1234-5678'
                                    value={number}
                                    onChange={handleNumberChange}
                                ></SignInput>

                                {/* 전화번호 입력 결과 실시간*/}
                                <div className='valid-message-box'>
                                    {numberFormatValid === false && isValidNumber === null && (
                                        <p className='sign-valid-message error'>✓ 올바른 전화번호 형식이 아닙니다.</p>
                                    )}
                                    {numberFormatValid === true && isValidNumber === null && (
                                        <p className='sign-valid-message info'>✓ 올바른 형식입니다. 중복 확인을 해주세요.</p>
                                    )}
                                    {isValidNumber === true && (
                                        <p className='sign-valid-message success'>✓ 사용 가능한 전화번호입니다.</p>
                                    )}
                                    {isValidNumber === false && (
                                        <p className='sign-valid-message error'>✓ 중복된 전화번호입니다. 다시 확인해주세요.</p>
                                    )}
                                </div>
                            </div>
                            <button 
                                disabled={!numberFormatValid || !number || isCheckingNumber} 
                                className={`check-button ${isValidNumber === true ? 'confirmed' : 'disabled'}`}
                                onClick={handleCheckNumber}>
                                {isCheckingNumber ? '확인 중...' : '중복확인'}
                            </button>
                        </div>
                    </div>

                    <button className={`auth-sign-button ${
                        isValidCompanyName === true && isValidName === true && isValidEmail === true && isValidNumber === true
                        ? 'active' : 'disabled'}`} 
                        onClick={handleSignUp}
                        disabled={!(isValidCompanyName === true && isValidName === true && isValidEmail === true && isValidNumber === true) || isLoading}
                        >
                        {isLoading ? '등록 중...' : 'SIGN UP'}
                    </button>
                </main>
            </div>
            <Footer />
            {/* sign up 성공 시 모달 */}
            {showModal && (
                <ModalOverlay>
                    <div className='sign-up-modal-container'>
                        <div className='sign-up-modal-navy-section'></div>

                        <h2 className='sign-modal-title'>업체 등록 완료 !</h2>
                        <div className='sign-up-modal-middle'>
                            <h3 className='sign-up-modal-subtitle'>업체 코드</h3>
                            <div className='sign-up-modal-company-code'>
                                <p className='auth-company-code'>{generatedCode}</p>
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