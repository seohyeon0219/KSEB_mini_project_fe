import './Home.css';

import HomeHeader from '../../components/home-header/HomeHeader';
import Footer from '../../components/footer/Footer';
import arrowIcon from '../../assets/arrow-icon.svg';

import { useNavigate } from 'react-router-dom';

export default function Home() {

    const navigate = useNavigate();

    const goToUpload = () => {
        navigate('/upload');
    }

    const goToSolution = () => {
        navigate('/solution');
    }

    return (
        <div>
            <div className='home-page-background'>
                <HomeHeader />
                <div className='feature-section'>
                <div className='feature-card'>
                    <div className='feature-card-left'>
                        <h2 className='feature-card-title'>수요 예측 기능</h2>
                        <p className='feature-card-text'>판매량, 수익량을 등록하고<br />수요 예측을 확인해보세요.</p>
                        <button className='feature-card-button' onClick={goToUpload}>
                            자세히 보기
                            <img src={arrowIcon} alt='arrow' className='arrow-icon'></img>
                        </button>
                    </div>
                    <div className='feature-white-line'></div>
                    <div className='feature-card-right'>
                        <h2 className='feature-card-title'>수요 예측 알고리즘이란?</h2>
                        <p className='feature-card-text'>머신러닝 및 시계열 알고리즘을 활용한<br />수요 예측 모델에 대해 확인해보세요.</p>
                        <button className='feature-card-button' onClick={goToSolution}>
                            자세히 보기
                            <img src={arrowIcon} alt='arrow' className='arrow-icon'></img>
                        </button>
                    </div>

                </div>
            </div>     
            </div>
            
            <Footer />
        </div>
    )
}