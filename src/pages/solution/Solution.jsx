import './Solution.css';

// 컴포넌트 불러오기
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import solutionPageComputer from '../../assets/solutionPageComputer.png';
// import solutionPageFolder from '../../assets/solutionPageFolder.png';
// import solutionPageAlgorithm from '../../assets/solutionPageAlgorithm.png';
// import solutionPagePaper from '../../assets/solutionPagePaper.png';

export default function Solution() {

    return (
        <div>
            <div className='page-wrapper'>
                <Header />
                <div className='main-content'>
                    <div className='container'>
                        <div className='solution-content'>
                            <div className='solution-text-box'>
                                <h1 className='solution-text-box-title'>
                                    수요 예측 서비스 <br />
                                    알고리즘이란?</h1>
                                <p className='solution-text-box-subtitle'>
                                    머신러닝 및 시계열 알고리즘을 활용한<br />
                                    수요 예측 모델에 대해 확인해보세요.
                                </p>
                            </div>
                            <div className='solution-navy-box'>
                                <div className='solution-navy-box-top'>
                                    <img className='solution-page-computer' src={solutionPageComputer} alt='computer 로고'></img>
                                    <p className='solution-navy-box-text'>
                                        <span className='solution-text-highlight'>머신러닝</span> 및 <span className='solution-text-highlight'>시계열 알고리즘</span> 을 활용한<br />
                                        수요 예측 모델에 대해 확인해보세요.
                                    </p>
                                </div>
                                <div className='solution-white-box'>
                                    <p className='solution-white-box-navy-text'>수요 예측 서비스 알고리즘은 <strong>시계열 형태의 데이터</strong>를 기반으로 수요를 예측합니다.</p>
                                    <br /><br />

                                    <h2 className='solution-white-box-navy-text'>시계열 데이터란?</h2>
                                    <br /><br />
                                    <p className='solution-white-box-navy-text'><strong>시간의 흐름</strong>에 따라 수집된 데이터로, <strong>평균, 추세, 계절성</strong> 등 다양한 특징을 가지고 있습니다.</p>
                                    <p className='solution-white-box-navy-text'><strong>RISKCATCH</strong>는 사용자가 입력한 데이터를 기반으로 이러한 특징들을 분석합니다.</p>
                                    <br /><br />
                                    <h2 className='solution-white-box-navy-text'>알고리즘</h2>
                                    <br /><br />
                                    <p className='solution-white-box-navy-text'><strong>자체 로직</strong>과 <strong>XGBoost</strong>를 결합하여, 보다 정교한 수요 예측을 수행합니다.</p>
                                    <br />
                                    <h3 className='solution-white-box-navy-text'>&nbsp;&nbsp;자체 로직</h3>
                                    <p className='solution-white-box-navy-text'><strong>&nbsp;&nbsp;&nbsp;&nbsp; 이동평균, 가중 이동평균, 지수 평활, 선형 회귀</strong> 등의 통계적 기법을 활용하여<br/> 시계열 데이터의 변동성과 추세를 정제된 피처로 변환합니다.</p>
                                    <br />
                                    <h3 className='solution-white-box-navy-text'>&nbsp;&nbsp;XGBoost</h3>
                                    <p className='solution-white-box-navy-text'><strong>&nbsp;&nbsp;&nbsp;&nbsp; 결정 트리 기반의 회귀 모델</strong>로, 여러 개의 약한 학습기 (weak learner) 를 반복 학습시켜<br/> 예측 오차를 최소화하고 <strong>미래 수요, 생산을 정밀하게 예측</strong>합니다.</p>
                                    <br /><br />
                                    <h2 className='solution-white-box-navy-text'>분석 결과</h2>
                                    <br /><br />
                                    <p className='solution-white-box-navy-text'><strong>수요 예측 서비스 알고리즘</strong>이 분석한 결과를 <strong>그래프 형태와 표</strong>로 시각화한 후 제공하여,</p>
                                    <p className='solution-white-box-navy-text'>사용자가 <strong>실제 수요를 예측하는 데 직접적인 도움</strong>을 받을 수 있습니다.</p>
                                    <p className='solution-white-box-navy-text'>또한 <strong>R², RMSE, MAE, MAD</strong> 같은 <strong>정량적 예측 정확도 지표</strong>를 같이 제공하여, <br/>모델을 <strong>신뢰하고 활용할 수 있는 기반</strong>을 마련해 줍니다.</p>
                                    <br /><br /><br /><br />
                                    <p className='solution-white-box-navy-text-bottom'>
                                        <strong>사용자는 단순히 데이터를 입력하기만 하면 됩니다.</strong><br />
                                        리스캐치는 <strong>자체 로직</strong>을 통해 통계 기반 피처를 생성하고,<br />
                                        이를 <strong>XGBoost</strong> 에 활용하여 정밀하게 <strong>수요를 예측</strong>합니다. <br />
                                        예측 결과는 <strong>직관적인 시각화</strong>와 함께 제공되어,<br/><strong>빠르고 정확한 의사결정</strong>에 바로 활용할 수 있습니다.
                                    </p>
                                    
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