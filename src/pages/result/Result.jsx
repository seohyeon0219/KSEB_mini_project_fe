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
    const [imageErrors, setImageErrors] = useState({});

    // CSV 문자열을 파싱하는 함수 (개선된 버전)
    const parseCSVString = (csvString) => {
        if (!csvString || typeof csvString !== 'string') {
            console.warn('Invalid CSV string:', csvString);
            return null;
        }
        
        try {
            const lines = csvString.split('\n').filter(line => line.trim() !== '');
            if (lines.length === 0) return null;

            // CSV 파싱 (따옴표 처리 개선)
            const parseCSVLine = (line) => {
                const result = [];
                let current = '';
                let inQuotes = false;
                
                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    
                    if (char === '"') {
                        if (inQuotes && line[i + 1] === '"') {
                            current += '"';
                            i++; // 다음 따옴표 스킵
                        } else {
                            inQuotes = !inQuotes;
                        }
                    } else if (char === ',' && !inQuotes) {
                        result.push(current.trim());
                        current = '';
                    } else {
                        current += char;
                    }
                }
                result.push(current.trim());
                return result;
            };

            const headers = parseCSVLine(lines[0]);
            const data = [];

            for (let i = 1; i < lines.length; i++) {
                const values = parseCSVLine(lines[i]);
                if (values.length === headers.length) {
                    const row = {};
                    headers.forEach((header, index) => {
                        row[header] = values[index] || '';
                    });
                    data.push(row);
                }
            }

            console.log(`CSV 파싱 완료: ${headers.length}개 컬럼, ${data.length}개 행`);
            return { headers, data };
        } catch (error) {
            console.error('CSV 파싱 오류:', error);
            return null;
        }
    };

    // 이미지 로드 에러 핸들링
    const handleImageError = (imageKey) => {
        setImageErrors(prev => ({
            ...prev,
            [imageKey]: true
        }));
        console.error(`이미지 로드 실패: ${imageKey}`);
    };

    useEffect(() => {
        // URL state에서 분석 결과 데이터 가져오기
        if (location.state && location.state.analysisResult) {
            const { analysisResult } = location.state;
            console.log('분석 결과 데이터:', analysisResult);
            setResultData(analysisResult);

            // CSV 데이터 파싱
            if (analysisResult.csv1) {
                console.log('CSV1 데이터 파싱 시작');
                setCsv1Data(parseCSVString(analysisResult.csv1));
            }
            if (analysisResult.csv2) {
                console.log('CSV2 데이터 파싱 시작');
                setCsv2Data(parseCSVString(analysisResult.csv2));
            }

            // 이미지 개수 확인
            const imageCount = [
                analysisResult.image1, 
                analysisResult.image2, 
                analysisResult.image3, 
                analysisResult.image4
            ].filter(img => img && img.trim() !== '').length;
            console.log(`총 ${imageCount}개의 이미지 데이터 확인`);

            setIsLoading(false);
        } else {
            // 결과 데이터가 없으면 업로드 페이지로 리다이렉트
            console.warn('분석 결과 데이터가 없습니다.');
            alert('분석 결과를 찾을 수 없습니다. 다시 시도해주세요.');
            navigate('/upload');
        }
    }, [location.state, navigate]);

    // 테이블 렌더링 함수 (개선된 버전)
    const renderCSVTable = (csvData, title) => {
        if (!csvData || !csvData.headers || !csvData.data) {
            return (
                <div className="result-table-container">
                    <h3 className="result-table-title">{title}</h3>
                    <div className="no-data-message">
                        <p>표시할 데이터가 없습니다.</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="result-table-container">
                <h3 className="result-table-title">
                    {title} ({csvData.data.length}행 × {csvData.headers.length}열)
                </h3>
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
                            {csvData.data.slice(0, 100).map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {csvData.headers.map((header, colIndex) => (
                                        <td key={colIndex} className="result-table-cell">
                                            {row[header] || ''}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {csvData.data.length > 100 && (
                                <tr>
                                    <td colSpan={csvData.headers.length} className="truncated-message">
                                        ... 및 {csvData.data.length - 100}개 행 더 있음
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {csvData.data.length > 100 && (
                    <button 
                        className="download-csv-btn"
                        onClick={() => downloadCSV(csvData, title)}
                    >
                        전체 데이터 CSV 다운로드
                    </button>
                )}
            </div>
        );
    };

    // CSV 다운로드 함수
    const downloadCSV = (csvData, title) => {
        if (!csvData || !csvData.headers || !csvData.data) return;

        const headerRow = csvData.headers.join(',');
        const dataRows = csvData.data.map(row => {
            return csvData.headers.map(header => {
                const value = (row[header] || '').toString();
                if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',');
        });

        const csvContent = [headerRow, ...dataRows].join('\n');
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${title}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // 이미지 렌더링 함수 (개선된 버전)
    const renderImage = (base64Image, title, imageKey) => {
        if (!base64Image || base64Image.trim() === '') {
            return (
                <div className="result-image-container empty">
                    <h4 className="result-image-title">{title}</h4>
                    <div className="no-image-message">
                        <p>이미지가 없습니다</p>
                    </div>
                </div>
            );
        }

        if (imageErrors[imageKey]) {
            return (
                <div className="result-image-container error">
                    <h4 className="result-image-title">{title}</h4>
                    <div className="image-error-message">
                        <p>이미지 로드 실패</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="result-image-container">
                <h4 className="result-image-title">{title}</h4>
                <img 
                    src={`data:image/png;base64,${base64Image}`} 
                    alt={title}
                    className="result-image"
                    onError={() => handleImageError(imageKey)}
                    onLoad={() => console.log(`이미지 로드 성공: ${title}`)}
                />
                <button 
                    className="download-image-btn"
                    onClick={() => downloadImage(base64Image, title)}
                    style={{ border: '1.5px solid rgb(0, 0, 0)', padding: '5px', borderRadius: '5px', backgroundColor: '#F2F2F2', marginTop: '10px', cursor: 'pointer' }}
                >
                    이미지 다운로드
                </button>
            </div>
        );
    };

    // 이미지 다운로드 함수
    const downloadImage = (base64Image, title) => {
        try {
            const link = document.createElement('a');
            link.href = `data:image/png;base64,${base64Image}`;
            link.download = `${title}_${new Date().toISOString().split('T')[0]}.png`;
            link.click();
        } catch (error) {
            console.error('이미지 다운로드 실패:', error);
            alert('이미지 다운로드에 실패했습니다.');
        }
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
                                <div className="loading-spinner"></div>
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
                            <p className='result-timestamp'>
                                분석 시간: {new Date().toLocaleString('ko-KR')}
                            </p>
                        </div>

                        {/* 이미지 섹션 - 2x2 그리드 */}
                        <div className='result-images-section'>
                            <h2 className='section-title'>분석 차트</h2>
                            <div className='images-grid'>
                                <div className='image-row'>
                                    {renderImage(resultData?.image1, '생산량 분석', 'image1')}
                                    {renderImage(resultData?.image2, '판매량 분석', 'image2')}
                                </div>
                                <div className='image-row'>
                                    {renderImage(resultData?.image3, '예측 결과', 'image3')}
                                    {renderImage(resultData?.image4, '종합 분석', 'image4')}
                                </div>
                            </div>
                        </div>

                        {/* CSV 테이블 섹션 */}
                        <div className='result-tables-section'>
                            <h2 className='section-title'>분석 데이터</h2>
                            <div className='tables-row'>
                                {renderCSVTable(csv1Data, '생산량 분석 결과')}
                                {renderCSVTable(csv2Data, '판매량 분석 결과')}
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