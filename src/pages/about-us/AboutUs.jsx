import './AboutUs.css';

// 컴포넌트 불러오기
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import NavySection from '../../components/ui/navy-section/NavySection';
import GraySection from '../../components/ui/gray-section/GraySection';



export default function AboutUs() {

    const members = [
        {
            name: '정해윤',
            role: '팀장\ndevops',
            email: import.meta.env.VITE_MEMBER_HAEYOON_EMAIL || 'riskCatch@example.com',
            phone: import.meta.env.VITE_MEMBER_HAEYOON_NUMBER || '010-0000-0000'
        },

        {
            name: '김서현',
            role: 'frontend',
            email: import.meta.env.VITE_MEMBER_SEOHYEON_EMAIL || 'riskCatch@example.com',
            phone: import.meta.env.VITE_MEMBER_SEOHYEON_NUMBER || '010-0000-0000'
        },
        {
            name: '김재걸',
            role: 'devops',
            email: import.meta.env.VITE_MEMBER_GEOGEOL_EMAIL || 'riskCatch@example.com',
            phone: import.meta.env.VITE_MEMBER_GEOGEOL_NUMBER || '010-0000-0000'            
        },
        {
            name: '김찬빈',
            role: 'backend',
            email: import.meta.env.VITE_MEMBER_CHANBIN_EMAIL || 'riskCatch@example.com',
            phone: import.meta.env.VITE_MEMBER_CHANBIN_NUMBER || '010-0000-0000'            
        },
        {
            name: '도종명',
            role: 'AI / DATA',
            email: import.meta.env.VITE_MEMBER_JONGMYEONG_EMAIL || 'riskCatch@example.com',
            phone: import.meta.env.VITE_MEMBER_JONGMYEONG_NUMBER || '010-0000-0000'            
        }
    ];

    return (
        <div>
            <div className='page-wrapper'>
                <Header />
                <NavySection />
                <div className='info-main-content'>
                    <GraySection />
                    <div className='container'>
                        <div className='title-container'>
                            <h1 className='title'>ABOUT <br />US : RISKCATCH</h1>
                            <p className='sub-title'>리스캐치 팀에 대한 설명</p>
                        </div>

                        <div className='member-container'>
                            {members.map((member, index) => (
                                <div key={index} className='member'>
                                    <div className='navy-ribbon'>
                                        <h3 className='name'>🧑🏻‍💼&nbsp;{member.name}</h3>
                                    </div>
                                    <div className='member-text'>
                                        <p className='member-text-top'>
                                            {member.role.split('\n').map((line, i) => (
                                                <span key={i}>
                                                    {line}
                                                    {i < member.role.split('\n').length - 1 && <br />}
                                                </span>
                                            ))}
                                        </p>
                                        <p className='member-text-bottom'>
                                            {member.email}<br />{member.phone}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}