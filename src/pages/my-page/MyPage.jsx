import './MyPage.css';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import ModalOverlay from '../../components/ui/modal-overlay/ModalOverlay';
import AuthNavyLine from '../../components/ui/auth-navy-line/AuthNavyLine';
import SignInput from '../../components/ui/sign-input/SignInput';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx'; // AuthContext import 추가

export default function MyPage() {
    const navigate = useNavigate();
    const { logout } = useAuth(); // logout 함수 가져오기
    const API_BASE_URL = 'http://165.246.80.74:8000';
    const code = localStorage.getItem('code');

    const getCode = () => localStorage.getItem('code');
    const getToken = () => localStorage.getItem('access_token');

    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    });

    const [companyName, setCompanyName] = useState('');
    const [isValidCompanyName, setIsValidCompanyName] = useState(null);

    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(null);

    const [email, setEmail] = useState('');
    const [originalEmail, setOriginalEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(null);
    const [emailFormatValid, setEmailFormatValid] = useState(null);
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);

    const [number, setNumber] = useState('');
    const [originalNumber, setOriginalNumber] = useState('');
    const [isValidNumber, setIsValidNumber] = useState(null);
    const [numberFormatValid, setNumberFormatValid] = useState(null);
    const [isCheckingNumber, setIsCheckingNumber] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCompanyNameChange = (e) => {
        const value = e.target.value;
        setCompanyName(value);
        setIsValidCompanyName(value.length >= 1 && value.length <= 20);
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        const regex = /^[가-힣a-zA-Z0-9]+$/;
        setIsValidName(value.length >= 1 && value.length <= 10 && regex.test(value));
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setIsValidEmail(null);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const valid = emailRegex.test(value);
        setEmailFormatValid(value ? valid : null);
    };

    const handleCheckEmail = async () => {
        if (!emailFormatValid || !email) return;
        if (email === originalEmail) {
            setIsValidEmail(true);
            return;
        }

        setIsCheckingEmail(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/accounts/duplicate/email`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            setIsValidEmail(!data.duplicate);
        } catch {
            setIsValidEmail(false);
        } finally {
            setIsCheckingEmail(false);
        }
    };

    const handleNumberChange = (e) => {
        const value = e.target.value;
        setNumber(value);
        setIsValidNumber(null);
        const regex = /^010-\d{4}-\d{4}$/;
        const valid = regex.test(value);
        setNumberFormatValid(value ? valid : null);
    };

    const handleCheckNumber = async () => {
        if (!numberFormatValid || !number) return;
        if (number === originalNumber) {
            setIsValidNumber(true);
            return;
        }

        setIsCheckingNumber(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/accounts/duplicate/phone`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ phone: number })
            });
            const data = await res.json();
            setIsValidNumber(!data.duplicate);
        } catch {
            setIsValidNumber(false);
        } finally {
            setIsCheckingNumber(false);
        }
    };

    const handleSave = async () => {
        const payload = {
            name: companyName,
            ceo_name: name,
            email,
            phone: number
        };

        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/accounts/update/`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) setShowModal(true);
            else alert(data.error || '수정 실패');
        } catch {
            alert('서버 오류');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 로그아웃 처리 함수
    const handleSignOut = () => {
        const confirmLogout = window.confirm('정말 로그아웃 하시겠습니까?');
        if (confirmLogout) {
            // AuthContext의 logout 함수 호출
            logout();
            
            // 로컬스토리지에서 토큰 제거
            localStorage.removeItem('access_token');
            localStorage.removeItem('code');
            localStorage.removeItem('authToken');
            localStorage.removeItem('isLoggedIn');
            
            // 홈으로 이동
            navigate('/');
        }
    };

    const loadDataByCode = async () => {
        const code = getCode();
        if (!code) {
            alert('업체 코드가 없습니다. 다시 로그인해주세요.');
            navigate('/sign-in');
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/accounts/find-by-code/`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ code })
            });

            if (!res.ok) {
                alert('업체 정보를 불러올 수 없습니다.');
                return;
            }

            const data = await res.json();

            setCompanyName(data.name || '');
            setName(data.ceo_name || '');
            setEmail(data.email || '');
            setOriginalEmail(data.email || '');
            setNumber(data.phone || '');
            setOriginalNumber(data.phone || '');

            setIsValidCompanyName(!!data.name);
            setIsValidName(!!data.ceo_name);
            if (data.email) {
                setEmailFormatValid(true);
                setIsValidEmail(true);
            }
            if (data.phone) {
                setNumberFormatValid(true);
                setIsValidNumber(true);
            }

        } catch (e) {
            console.error('불러오기 실패:', e);
        }
    };

    useEffect(() => {
        console.log('access_token:', getToken());
        console.log('code:', getCode());

        if (!getToken()) {
            alert('로그인이 필요합니다.');
            navigate('/sign-in');
            return;
        }

        loadDataByCode();
    }, [navigate]);

    return (
        <div>
            <div className='page-wrapper'>
                <Header />
                <main className='auth-main-content'>
                    <div className='auth-title-section'>
                        <h1 className='auth-title'>마이페이지</h1>
                        <h2 className='auth-subtitle'>MY PAGE</h2>
                        <AuthNavyLine />
                    </div>

                    <div className='auth-sign-up-form-section'>
                        <div className='sign-up-form'>
                            <label className='code'>상호명</label>
                            <div className='code-box'>
                                <SignInput value={companyName} onChange={handleCompanyNameChange} placeholder='상호명을 입력해주세요. (20자 이내)' />
                                <div className='valid-message-box'>
                                    {isValidCompanyName && <p className='sign-valid-message success'>✓ 올바른 형식입니다.</p>}
                                    {isValidCompanyName === false && <p className='sign-valid-message error'>✓ 1~20자 이내로 입력해주세요.</p>}
                                </div>
                            </div>
                        </div>

                        <div className='sign-up-form'>
                            <label className='code'>사업자 이름</label>
                            <div className='code-box'>
                                <SignInput value={name} onChange={handleNameChange} placeholder='사업자 이름을 입력해주세요.' />
                                <div className='valid-message-box'>
                                    {isValidName && <p className='sign-valid-message success'>✓ 올바른 형식입니다.</p>}
                                    {isValidName === false && <p className='sign-valid-message error'>✓ 한글, 영문, 숫자 10자 이내로 입력해주세요.</p>}
                                </div>
                            </div>
                        </div>

                        <div className='sign-up-form'>
                            <label className='code'>사업자 이메일</label>
                            <div className='code-box'>
                                <SignInput value={email} onChange={handleEmailChange} placeholder='예: riskCatch@example.com' />
                                <div className='valid-message-box'>
                                    {emailFormatValid === false && <p className='sign-valid-message error'>✓ 이메일 형식이 올바르지 않습니다.</p>}
                                    {emailFormatValid === true && isValidEmail === null && <p className='sign-valid-message info'>✓ 중복 확인을 해주세요.</p>}
                                    {isValidEmail === true && <p className='sign-valid-message success'>✓ 사용 가능한 이메일입니다.</p>}
                                    {isValidEmail === false && <p className='sign-valid-message error'>✓ 중복된 이메일입니다.</p>}
                                </div>
                            </div>
                            <button onClick={handleCheckEmail} disabled={!emailFormatValid || isCheckingEmail} className='check-button'>
                                {isCheckingEmail ? '확인 중...' : '중복확인'}
                            </button>
                        </div>

                        <div className='sign-up-form'>
                            <label className='code'>전화번호</label>
                            <div className='code-box'>
                                <SignInput value={number} onChange={handleNumberChange} placeholder='예: 010-1234-5678' />
                                <div className='valid-message-box'>
                                    {numberFormatValid === false && <p className='sign-valid-message error'>✓ 전화번호 형식이 올바르지 않습니다.</p>}
                                    {numberFormatValid === true && isValidNumber === null && <p className='sign-valid-message info'>✓ 중복 확인을 해주세요.</p>}
                                    {isValidNumber === true && <p className='sign-valid-message success'>✓ 사용 가능한 전화번호입니다.</p>}
                                    {isValidNumber === false && <p className='sign-valid-message error'>✓ 중복된 전화번호입니다.</p>}
                                </div>
                            </div>
                            <button onClick={handleCheckNumber} disabled={!numberFormatValid || isCheckingNumber} className='check-button'>
                                {isCheckingNumber ? '확인 중...' : '중복확인'}
                            </button>
                        </div>
                    </div>
                    
                    {/* 버튼 섹션 - 저장과 로그아웃 버튼 나란히 배치 */}
                    <div className='button-section' style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <button 
                            onClick={handleSave} 
                            className={`auth-sign-button ${isValidCompanyName && isValidName && isValidEmail && isValidNumber ? 'active' : 'disabled'}`} 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '저장 중...' : '저장'}
                        </button>
                        
                        {/* <button 
                            onClick={handleSignOut} 
                            className='auth-sign-button active'
                        >
                            SIGN OUT
                        </button> */}
                    </div>
                </main>
            </div>
            <Footer />
            {showModal && (
                <ModalOverlay>
                    <div className='inquiry-modal-container'>
                        <h2 className='inquiry-modal-title'>업체 정보 수정 완료 !</h2>
                        <div className='inquiry-modal-text'>
                            <p>지금 바로 다양한 수요 예측 서비스를</p>
                            <p>무제한으로 이용하세요 !</p>
                        </div>
                        <button className='inquiry-modal-home-button' onClick={() => navigate('/')}>홈으로 가기</button>
                    </div>
                </ModalOverlay>
            )}
        </div>
    );
}