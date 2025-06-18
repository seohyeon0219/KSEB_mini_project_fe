import './MyPage.css';

import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import AuthNavyLine from '../../components/ui/auth-navy-line/AuthNavyLine';

import SignInput from '../../components/ui/sign-input/SignInput';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyPage() {

    // 상태변수들
    const [companyName, setCompanyName] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');

    // 핸들러 함수
    const handleCompanyNameChange = (e) => {
        setCompanyName(e.target.value);
    }

    const handleNameChange = (e) => {
        setName(e.target.value);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handleNumberChange = (e) => {
        setNumber(e.target.value);
    }

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
                        <label htmlFor='companyName' className='code'>상호명</label>
                        <div className='code-box'>
                            <SignInput 
                                type='text'    
                                id='companyName' 
                                value={companyName}
                                onChange={handleCompanyNameChange}
                            ></SignInput> 
                            <div className='valid-message-box'>
                            </div> 
                        </div>
                    </div>
                    <div className='sign-up-form'>
                        <label htmlFor='name' className='code'>사업자 이름</label>
                        <div className='code-box'>
                            <SignInput 
                                type='text' 
                                id='name' 
                                value={name}
                                onChange={handleNameChange}
                            ></SignInput>
                            {/* 사업자명 입력 결과 실시간 */}
                            <div className='valid-message-box'>
                            </div>
                        </div>
                        <button className='check-button'>수정</button>
                    </div>
                    <div className='sign-up-form'>
                        <label htmlFor='email' className='code'>사업자 이메일</label>
                        <div className='code-box'>
                            <SignInput 
                                type='email' 
                                id='email' 
                                value={email}
                                onChange={handleEmailChange}
                            ></SignInput>
                            {/* 사업자 이메일 입력 결과 */}
                            <div className='valid-message-box'>
                            </div>
                        </div>
                        <button className='check-button'>수정</button>
                    </div>
                    <div className='sign-up-form'>
                        <label htmlFor='number' className='code'>전화번호</label>
                        <div className='code-box'>
                            <SignInput 
                                type='text' 
                                id='number' 
                                value={number}
                                onChange={handleNumberChange}
                            ></SignInput>

                            {/* 전화번호 입력 결과 실시간*/}
                            <div className='valid-message-box'></div>
                        </div>
                        <button className='check-button'>수정</button>
                    </div>
                </div>

                <button className='auth-sign-button'>저장</button>
            </main>
        </div>
        <Footer />
        </div>
    )
}