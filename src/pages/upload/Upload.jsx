import React, { useState } from 'react';
import './Upload.css';

// 컴포넌트 불러오기
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import NavySection from '../../components/ui/navy-section/NavySection';

export default function Upload() {
    const [salesData, setSalesData] = useState(null);
    const [demandData, setDemandData] = useState(null);
    const [salesFileName, setSalesFileName] = useState('');
    const [demandFileName, setDemandFileName] = useState('');
    const [productCode, setProductCode] = useState('');
    const [savedSalesData, setSavedSalesData] = useState(null);
    const [savedDemandData, setSavedDemandData] = useState(null);
    const [salesSaveStatus, setSalesSaveStatus] = useState('');
    const [demandSaveStatus, setDemandSaveStatus] = useState('');
    
    // 페이지네이션 관련 상태
    const [salesDisplayCount, setSalesDisplayCount] = useState(50); // 처음에 50개 행만 표시
    const [demandDisplayCount, setDemandDisplayCount] = useState(50);
    const ITEMS_PER_LOAD = 50; // 스크롤할 때마다 추가로 로드할 행 수

    // CSV 파일 파싱 함수
    const parseCSV = (text) => {
        const lines = text.split('\n').filter(line => line.trim() !== '');
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

    // 파일 업로드 핸들러
    const handleFileUpload = (event, type) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const csvText = e.target.result;
            const parsedData = parseCSV(csvText);
            
            if (type === 'sales') {
                setSalesData(parsedData);
                setSalesFileName(file.name);
                setSavedSalesData(null); // 새 파일 업로드시 저장 상태 초기화
                setSalesSaveStatus('');
                setSalesDisplayCount(50); // 표시 개수 초기화
            } else {
                setDemandData(parsedData);
                setDemandFileName(file.name);
                setSavedDemandData(null); // 새 파일 업로드시 저장 상태 초기화
                setDemandSaveStatus('');
                setDemandDisplayCount(50); // 표시 개수 초기화
            }
        };
        reader.readAsText(file);
    };

    // 행 추가 함수
    const addRow = (type) => {
        if (type === 'sales' && salesData) {
            const newRow = {};
            salesData.headers.forEach(header => {
                newRow[header] = '';
            });
            
            setSalesData({
                ...salesData,
                data: [newRow, ...salesData.data]
            });
        } else if (type === 'demand' && demandData) {
            const newRow = {};
            demandData.headers.forEach(header => {
                newRow[header] = '';
            });
            
            setDemandData({
                ...demandData,
                data: [newRow, ...demandData.data]
            });
        }
    };

    // 열 추가 함수
    const addColumn = (type) => {
        if (type === 'sales' && salesData) {
            const newColumnName = `새컬럼${salesData.headers.length + 1}`;
            const newHeaders = [...salesData.headers, newColumnName];
            const newData = salesData.data.map(row => ({
                ...row,
                [newColumnName]: ''
            }));
            
            setSalesData({
                headers: newHeaders,
                data: newData
            });
        } else if (type === 'demand' && demandData) {
            const newColumnName = `새컬럼${demandData.headers.length + 1}`;
            const newHeaders = [...demandData.headers, newColumnName];
            const newData = demandData.data.map(row => ({
                ...row,
                [newColumnName]: ''
            }));
            
            setDemandData({
                headers: newHeaders,
                data: newData
            });
        }
    };

    // 셀 값 변경 함수
    const handleCellChange = (type, rowIndex, header, value) => {
        if (type === 'sales' && salesData) {
            const newData = [...salesData.data];
            newData[rowIndex][header] = value;
            setSalesData({
                ...salesData,
                data: newData
            });
        } else if (type === 'demand' && demandData) {
            const newData = [...demandData.data];
            newData[rowIndex][header] = value;
            setDemandData({
                ...demandData,
                data: newData
            });
        }
    };

    // 스크롤 이벤트 핸들러
    const handleTableScroll = (event, type) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
        
        // 스크롤이 90% 이상 내려갔을 때 추가 데이터 로드
        if (scrollPercentage > 0.9) {
            if (type === 'sales' && salesData) {
                const newCount = Math.min(salesDisplayCount + ITEMS_PER_LOAD, salesData.data.length);
                if (newCount > salesDisplayCount) {
                    setSalesDisplayCount(newCount);
                }
            } else if (type === 'demand' && demandData) {
                const newCount = Math.min(demandDisplayCount + ITEMS_PER_LOAD, demandData.data.length);
                if (newCount > demandDisplayCount) {
                    setDemandDisplayCount(newCount);
                }
            }
        }
    };

    // 표시할 데이터 가져오기
    const getDisplayData = (data, type) => {
        if (!data) return null;
        
        const displayCount = type === 'sales' ? salesDisplayCount : demandDisplayCount;
        return {
            ...data,
            data: data.data.slice(0, displayCount)
        };
    };
    const saveTableData = (type) => {
        if (type === 'sales' && salesData) {
            setSavedSalesData(JSON.parse(JSON.stringify(salesData))); // 깊은 복사
            setSalesSaveStatus('저장됨');
            setTimeout(() => setSalesSaveStatus(''), 2000); // 2초 후 상태 메시지 제거
        } else if (type === 'demand' && demandData) {
            setSavedDemandData(JSON.parse(JSON.stringify(demandData))); // 깊은 복사
            setDemandSaveStatus('저장됨');
            setTimeout(() => setDemandSaveStatus(''), 2000); // 2초 후 상태 메시지 제거
        }
    };

    // 변경사항 체크 함수
    const hasUnsavedChanges = (type) => {
        if (type === 'sales') {
            if (!salesData || !savedSalesData) return !!salesData;
            return JSON.stringify(salesData) !== JSON.stringify(savedSalesData);
        } else if (type === 'demand') {
            if (!demandData || !savedDemandData) return !!demandData;
            return JSON.stringify(demandData) !== JSON.stringify(savedDemandData);
        }
        return false;
    };
    const handleHeaderChange = (type, oldHeader, newHeader) => {
        if (type === 'sales' && salesData) {
            const newHeaders = salesData.headers.map(h => h === oldHeader ? newHeader : h);
            const newData = salesData.data.map(row => {
                const newRow = { ...row };
                if (row.hasOwnProperty(oldHeader)) {
                    newRow[newHeader] = row[oldHeader];
                    delete newRow[oldHeader];
                }
                return newRow;
            });
            
            setSalesData({
                headers: newHeaders,
                data: newData
            });
        } else if (type === 'demand' && demandData) {
            const newHeaders = demandData.headers.map(h => h === oldHeader ? newHeader : h);
            const newData = demandData.data.map(row => {
                const newRow = { ...row };
                if (row.hasOwnProperty(oldHeader)) {
                    newRow[newHeader] = row[oldHeader];
                    delete newRow[oldHeader];
                }
                return newRow;
            });
            
            setDemandData({
                headers: newHeaders,
                data: newData
            });
        }
    };

    // 테이블 렌더링 함수
    const renderTable = (data, title, type) => {
        if (!data) return null;

        const displayData = getDisplayData(data, type);
        const totalRows = data.data.length;
        const displayCount = type === 'sales' ? salesDisplayCount : demandDisplayCount;

        return (
            <div className="table-container">
                <div className="table-header">
                    <div className="table-title-section">
                        <h3 className="table-title">{title}</h3>
                        <span className="row-count">
                            ({displayCount} / {totalRows} 행)
                        </span>
                        {hasUnsavedChanges(type) && (
                            <span className="unsaved-indicator">• 저장되지 않음</span>
                        )}
                        {(type === 'sales' && salesSaveStatus) && (
                            <span className="save-status saved">{salesSaveStatus}</span>
                        )}
                        {(type === 'demand' && demandSaveStatus) && (
                            <span className="save-status saved">{demandSaveStatus}</span>
                        )}
                    </div>
                    <div className="table-controls">
                        <button 
                            className="control-button add-row-btn"
                            onClick={() => addRow(type)}
                        >
                            행 추가
                        </button>
                        <button 
                            className="control-button add-col-btn"
                            onClick={() => addColumn(type)}
                        >
                            열 추가
                        </button>
                        <button 
                            className={`control-button save-btn ${hasUnsavedChanges(type) ? 'has-changes' : ''}`}
                            onClick={() => saveTableData(type)}
                        >
                            저장
                        </button>
                    </div>
                </div>
                <div 
                    className="table-wrapper"
                    onScroll={(e) => handleTableScroll(e, type)}
                >
                    <table className="csv-table">
                        <thead>
                            <tr>
                                {displayData.headers.map((header, index) => (
                                    <th key={index}>
                                        <input
                                            type="text"
                                            value={header}
                                            onChange={(e) => handleHeaderChange(type, header, e.target.value)}
                                            className="header-input"
                                        />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {displayData.data.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {displayData.headers.map((header, colIndex) => (
                                        <td key={colIndex}>
                                            <input
                                                type="text"
                                                value={row[header] || ''}
                                                onChange={(e) => handleCellChange(type, rowIndex, header, e.target.value)}
                                                className="cell-input"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {displayCount < totalRows && (
                                <tr>
                                    <td colSpan={displayData.headers.length} className="loading-row">
                                        <div className="loading-text">
                                            스크롤을 내려서 더 많은 데이터를 불러오세요... 
                                            ({totalRows - displayCount}개 행 남음)
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className='page-wrapper'>
                <Header />
                <NavySection />
                <div className='info-main-content'>
                    <div className='container'>
                        <div className='upload-title-container'>
                            <h1 className='upload-title'>수요 예측 서비스</h1>
                        </div>
                        
                        {/* 제품코드 입력 */}
                        <div className='product-code-section'>
                            <label htmlFor='product-code' className='product-code-label'>
                                제품코드
                            </label>
                            <input
                                type="text"
                                id='product-code'
                                value={productCode}
                                onChange={(e) => setProductCode(e.target.value)}
                                placeholder="제품코드를 입력하세요"
                                className='product-code-input'
                            />
                            <button className='upload-search-button'>
                                수요 예측
                            </button>
                        </div>
                        
                        <div className='upload-section'>
                            {/* 판매량 CSV 업로드 */}
                            <div className='upload-box'>
                                <h2 className='upload-title'>판매량 CSV 파일 업로드</h2>
                                <div className='file-input-container'>
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={(e) => handleFileUpload(e, 'sales')}
                                        className='file-input'
                                        id='sales-file'
                                    />
                                    <label htmlFor='sales-file' className='file-label'>
                                        파일 선택
                                    </label>
                                    {salesFileName && (
                                        <span className='file-name'>{salesFileName}</span>
                                    )}
                                </div>
                                <div className='upload-description'>
                                    <p>판매량 CSV 파일을 업로드하면</p>
                                    <p>아래에 표 형태로 변환되어 보입니다</p>
                                </div>
                            </div>

                            {/* 수요량 CSV 업로드 */}
                            <div className='upload-box'>
                                <h2 className='upload-title'>수요량 CSV 파일 업로드</h2>
                                <div className='file-input-container'>
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={(e) => handleFileUpload(e, 'demand')}
                                        className='file-input'
                                        id='demand-file'
                                    />
                                    <label htmlFor='demand-file' className='file-label'>
                                        파일 선택
                                    </label>
                                    {demandFileName && (
                                        <span className='file-name'>{demandFileName}</span>
                                    )}
                                </div>
                                <div className='upload-description'>
                                    <p>수요량 CSV 파일을 업로드하면</p>
                                    <p>아래에 표 형태로 변환되어 보입니다</p>
                                </div>
                            </div>
                        </div>

                        {/* CSV 데이터 테이블 표시 - 좌우 배치 */}
                        {(salesData || demandData) && (
                            <div className='tables-section'>
                                <div className='tables-container'>
                                    {/* 왼쪽: 판매량 테이블 */}
                                    <div className='table-half'>
                                        {salesData && renderTable(salesData, '판매량 데이터', 'sales')}
                                    </div>
                                    
                                    {/* 오른쪽: 수요량 테이블 */}
                                    <div className='table-half'>
                                        {demandData && renderTable(demandData, '수요량 데이터', 'demand')}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}