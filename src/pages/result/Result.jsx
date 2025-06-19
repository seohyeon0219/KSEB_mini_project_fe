import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Result.css';

// 컴포넌트 불러오기
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';

export default function Result() {
    const location = useLocation();
    const navigate = useNavigate();
    const [resultData, setResultData] = useState(null);
    const [csv1Data, setCsv1Data] = useState(null);
    const [csv2Data, setCsv2Data] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // CSV 문자열을 파싱하는 함수
    const parseCSVString = (csvString) => {
        if (!csvString) return null;
        
        const lines = csvString.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) return null;

        const headers = lines[0].split(',').map(header => header.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(value => value.trim());
            if (values.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index];
                });
                data.push(row);
            }
        }

        return { headers, data };
    };

    useEffect(() => {
        // URL state에서 분석 결과 데이터 가져오기
        if (location.state && location.state.analysisResult) {
            const { analysisResult } = location.state;
            setResultData(analysisResult);

            // CSV 데이터 파싱
            if (analysisResult.csv1) {
                setCsv1Data(parseCSVString(analysisResult.csv1));
            }
            if (analysisResult.csv2) {
                setCsv2Data(parseCSVString(analysisResult.csv2));
            }

            setIsLoading(false);
        } else {
            // 결과 데이터가 없으면 업로드 페이지로 리다이렉트
            alert('분석 결과를 찾을 수 없습니다. 다시 시도해주세요.');
            navigate('/upload');
        }
    }, [location.state, navigate]);

    // 테이블 렌더링 함수
    const renderCSVTable = (csvData, title) => {
        if (!csvData) return null;

        return (
            <div className="result-table-container">
                <h3 className="result-table-title">{title}</h3>
                <div className="result-table-wrapper">
                    <table className="result-csv-table">
                        <thead>
                            <tr>
                                {csvData.headers.map((header, index) => (
                                    <th key={index} className="result-table-header">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {csvData.data.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {csvData.headers.map((header, colIndex) => (
                                        <td key={colIndex} className="result-table-cell">
                                            {row[header] || ''}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // 이미지 렌더링 함수
    const renderImage = (base64Image, title) => {
        if (!base64Image) return null;

        return (
            <div className="result-image-container">
                <h4 className="result-image-title">{title}</h4>
                <img 
                    src={`data:image/png;base64,${base64Image}`} 
                    alt={title}
                    className="result-image"
                />
            </div>
        );
    };

    if (isLoading) {
        return (
            <div>
                <div className='page-wrapper'>
                    <Header />
                    <div className='result-main-content'>
                        <div className='container'>
                            <div className='loading-container'>
                                <h2>분석 결과를 불러오는 중...</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <div className='page-wrapper'>
                <Header />
                <div className='result-main-content'>
                    <div className='container'>
                        <div className='result-title-container'>
                            <h1 className='result-title'>수요 예측 분석 결과</h1>
                            <p className='result-subtitle'>
                                제품코드: {location.state?.productCode || '알 수 없음'}
                            </p>
                        </div>

                        {/* 이미지 섹션 - 2x2 그리드 */}
                        <div className='result-images-section'>
                            <h2 className='section-title'>분석 차트</h2>
                            <div className='images-grid'>
                                <div className='image-row'>
                                    {renderImage(resultData?.image1, '차트 1')}
                                    {renderImage(resultData?.image2, '차트 2')}
                                </div>
                                <div className='image-row'>
                                    {renderImage(resultData?.image3, '차트 3')}
                                    {renderImage(resultData?.image4, '차트 4')}
                                </div>
                            </div>
                        </div>

                        {/* CSV 테이블 섹션 - csv2, csv1 순서로 한 줄에 배치 */}
                        <div className='result-tables-section'>
                            <h2 className='section-title'>분석 데이터</h2>
                            <div className='tables-row'>
                                {renderCSVTable(csv2Data, '분석 결과 2')}
                                {renderCSVTable(csv1Data, '분석 결과 1')}
                            </div>
                        </div>

                        {/* 버튼 섹션 */}
                        <div className='result-actions'>
                            <button 
                                className='result-button back-button'
                                onClick={() => navigate('/upload')}
                            >
                                다시 분석하기
                            </button>
                            <button 
                                className='result-button home-button'
                                onClick={() => navigate('/')}
                            >
                                홈으로 가기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}