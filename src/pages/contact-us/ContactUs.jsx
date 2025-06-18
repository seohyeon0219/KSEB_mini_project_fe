import './ContactUs.css';

// 컴포넌트 불러오기
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import NavySection from '../../components/ui/navy-section/NavySection';
import GraySection from '../../components/ui/gray-section/GraySection';


export default function ContactUs() {
    const members = {phone : import.meta.env.VITE_MEMBER_HAEYOON_NUMBER || '010-0000-0000'};

    return (
        <div>
            <div className='page-wrapper'>
                <Header />
                <NavySection />
                <div className='info-main-content'>
                    <GraySection />
                    <div className='container'>
                        <div className='title-container'>
                            <h1 className='title'>CONTACT <br/>US</h1>
                            <p className='sub-title'>리스캐치에 오시는 법을 안내해드립니다.</p>
                        </div>

                        <div className='contact-us-info-section'>
                            {/* 구글 지도 */}
                            <iframe 
                                className='contact-us-map'
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3167.4208834302326!2d126.65418729999999!3d37.45078340000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357b79ab3057fbc5%3A0xc52f3a80a72357b5!2z7J247ZWY64yA7ZWZ6rWQIDYw7KO864WE6riw64WQ6rSA!5e0!3m2!1sko!2skr!4v1748966453979!5m2!1sko!2skr"
                                width="600" 
                                height="450" 
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                                title="인천 본사 위치"
                            >
                            </iframe>

                            <h2 className='contact-us-company-name'>RISKCATCH 인천 본사</h2>

                            <div className='contact-us-info-box'>
                                <div className='info-wrapper'>
                                    <h2 className='info-title'>주소</h2>
                                    <div className='info-navy-line' />
                                    <p className='info-text'>인천 미추홀구 인하로 100 60주년 기념관 1401B</p>
                                </div>
                                <div className='info-wrapper'>
                                    <h2 className='info-title'>문의전화</h2>
                                    <div className='info-navy-line'/>
                                    <p className='info-text'>{members.phone}</p>
                                </div>
                                <div className='info-wrapper'>
                                    <h2 className='info-title'>이용시간</h2>
                                    <div className='info-navy-line' />
                                    <p className='info-text'>월 ~ 금 9 : 00 - 18 : 00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
