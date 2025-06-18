import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Inquiry.css';

// 컴포넌트 불러오기
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import InquiryInput from '../../components/ui/inquiry-input/InquiryInput';
import ModalOverlay from '../../components/ui/modal-overlay/ModalOverlay';

export default function Inquiry() {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/');
    }

    // 문의하기 모달
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    }

    return (
        <div>
            <div className='page-wrapper'>
                <Header />
                <div className='inquiry-main-content'>
                    <h1 className='inquiry-title'>문의하기</h1>
                    <div className='inquiry-section'>
                        <div className='inquiry-subtitle'>
                            <div className='inquiry-subtitle-top'>
                                <p>Hi!</p>
                                <p>How can</p>
                                <p>we help you ?</p>
                            </div>
                            <div className='inquiry-subtitle-bottom'>
                                <p>리스캐치를 이용해주셔서 감사합니다.</p>
                                <p>문의를 남겨주시면</p>
                                <p>빠른 시일 내에</p>
                                <p>이메일로 답변드리겠습니다.</p>
                            </div>
                        </div>
                        <div className='inquiry-box'>
                            <InquiryInput 
                                type='text'
                                className=''
                                placeholder='사업명'
                            />
                            <InquiryInput 
                                type='text'
                                className=''
                                placeholder='사업자명'
                            />
                            <InquiryInput 
                                type='text'
                                className=''
                                placeholder='사업자 이메일'
                            />
                            <InquiryInput 
                                type='text'
                                className=''
                                placeholder='전화번호'
                            />
                            <textarea className='inquiry-textarea' placeholder='문의사항에 대해 자세한 내용을 남겨주세요.'></textarea>
                            
                            <button className='inquiry-button' onClick={openModal}>문의하기</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            {/* 문의하기 모달 */}
            {showModal && (
                <ModalOverlay>
                    <div className='inquiry-modal-container'>
                        <h2 className='inquiry-modal-title'>문의하기 완료 !</h2>
                        <div className='inquiry-modal-text'>
                            <p>문의하신 내용은 확인 후</p>
                            <p>최대한 빠르게 연락드리겠습니다.</p>
                        </div>
                        <button className='inquiry-modal-home-button' onClick={goToHome}>홈으로 가기</button>
                    </div>
                </ModalOverlay>
            )}
        </div>
    )
}