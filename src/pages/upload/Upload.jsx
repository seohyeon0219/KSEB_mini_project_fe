import React, { useState, useEffect } from 'react';
import './Upload.css';
import { useNavigate } from 'react-router-dom';

// 컴포넌트 불러오기
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import NavySection from '../../components/ui/navy-section/NavySection';

export default function Upload() {
    const navigate = useNavigate();

    const [salesData, setSalesData] = useState(null);
    const [demandData, setDemandData] = useState(null);
    const [salesFileName, setSalesFileName] = useState('');
    const [demandFileName, setDemandFileName] = useState('');
    const [productCode, setProductCode] = useState('');
    const [savedSalesData, setSavedSalesData] = useState(null);
    const [savedDemandData, setSavedDemandData] = useState(null);
    const [salesSaveStatus, setSalesSaveStatus] = useState('');
    const [demandSaveStatus, setDemandSaveStatus] = useState('');
    const [isUploading, setIsUpLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true); // 초기 데이터 로딩 상태
    
    // 페이지네이션 관련 상태
    const [salesDisplayCount, setSalesDisplayCount] = useState(50);
    const [demandDisplayCount, setDemandDisplayCount] = useState(50);
    const ITEMS_PER_LOAD = 50;

    // 컴포넌트 마운트 시 저장된 데이터 불러오기
    useEffect(() => {
        loadSavedData();
    }, []);

    // 저장된 데이터를 백엔드에서 불러오는 함수
    const loadSavedData = async () => {
        const token = localStorage.getItem('access_token') || localStorage.getItem('authToken');
        
        if (!token) {
            console.log('토큰이 없습니다. 로그인이 필요합니다.');
            setIsLoadingData(false);
            return;
        }

        try {
            setIsLoadingData(true);
            
            // 백엔드에서 사용자의 저장된 데이터 목록 조회
            const response = await fetch('http://165.246.80.74:8000/api/files/list/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const savedFiles = await response.json();
                console.log('저장된 파일 목록:', savedFiles);
                
                // 저장된 데이터가 있으면 변환해서 표시
                if (savedFiles && savedFiles.length > 0) {
                    await processLoadedData(savedFiles, token);
                }
            } else {
                console.log('저장된 데이터를 불러올 수 없습니다.');
            }
        } catch (error) {
            console.error('데이터 로딩 중 오류:', error);
        } finally {
            setIsLoadingData(false);
        }
    };

    // 불러온 데이터를 CSV 형태로 변환하는 함수
    const processLoadedData = async (savedFiles, token) => {
        try {
            // 판매량과 생산량 데이터를 분리
            const salesFiles = savedFiles.filter(file => file.type_idx === 2); // 판매량
            const demandFiles = savedFiles.filter(file => file.type_idx === 1); // 생산량
            
            // 판매량 데이터 처리
            if (salesFiles.length > 0) {
                const salesCSVData = convertFilesToCSV(salesFiles, '판매량');
                setSalesData(salesCSVData);
                setSavedSalesData(JSON.parse(JSON.stringify(salesCSVData)));
                setSalesFileName('기존_판매량_데이터.csv');
                setSalesSaveStatus('불러옴');
                setTimeout(() => setSalesSaveStatus(''), 3000);
                
                // 제품코드 설정 (첫 번째 제품코드 사용)
                if (salesFiles.length > 0 && salesFiles[0].name) {
                    setProductCode(salesFiles[0].name);
                }
            }

            // 생산량 데이터 처리
            if (demandFiles.length > 0) {
                const demandCSVData = convertFilesToCSV(demandFiles, '생산량');
                setDemandData(demandCSVData);
                setSavedDemandData(JSON.parse(JSON.stringify(demandCSVData)));
                setDemandFileName('기존_생산량_데이터.csv');
                setDemandSaveStatus('불러옴');
                setTimeout(() => setDemandSaveStatus(''), 3000);
                
                // 제품코드가 아직 설정되지 않았으면 설정
                if (!productCode && demandFiles.length > 0 && demandFiles[0].name) {
                    setProductCode(demandFiles[0].name);
                }
            }

        } catch (error) {
            console.error('데이터 변환 중 오류:', error);
        }
    };

    // 백엔드 데이터를 CSV 형태로 변환하는 함수
    const convertFilesToCSV = (files, dataType) => {
        if (!files || files.length === 0) return null;

        // 날짜별로 그룹핑
        const dateGroups = {};
        const productCodes = new Set();

        files.forEach(file => {
            const date = file.date;
            const productCode = file.name;
            const quantity = file.number;

            productCodes.add(productCode);

            if (!dateGroups[date]) {
                dateGroups[date] = {};
            }
            dateGroups[date][productCode] = quantity;
        });

        // 헤더 생성 (Date + 제품코드들)
        const headers = ['Date', ...Array.from(productCodes).sort()];
        
        // 데이터 생성
        const data = Object.keys(dateGroups).sort().map(date => {
            const row = { Date: date };
            Array.from(productCodes).forEach(productCode => {
                row[productCode] = dateGroups[date][productCode] || '';
            });
            return row;
        });

        return {
            headers,
            data
        };
    };

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

    // CSV 데이터를 문자열로 변환하는 함수
    const convertToCSV = (data) => {
        if (!data || !data.headers || !data.data) return '';
        
        const headerRow = data.headers.join(',');
        const dataRows = data.data.map(row => {
            return data.headers.map(header => {
                const value = row[header] || '';
                if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',');
        });
        
        return [headerRow, ...dataRows].join('\n');
    };

    // CSV 파일 다운로드 함수
    const downloadCSV = (type) => {
        let data, filename;
        
        if (type === 'sales' && salesData) {
            data = salesData;
            filename = salesFileName ? salesFileName.replace('.csv', '_수정됨.csv') : '판매량_데이터.csv';
        } else if (type === 'demand' && demandData) {
            data = demandData;
            filename = demandFileName ? demandFileName.replace('.csv', '_수정됨.csv') : '생산량_데이터.csv';
        } else {
            alert('다운로드할 데이터가 없습니다.');
            return;
        }

        const csvString = convertToCSV(data);
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvString], { type: 'text/csv;charset=utf-8;' });
        
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert(`${filename} 파일이 다운로드되었습니다.`);
    };

    // CSV 파일을 File 객체로 생성하는 함수
    const createCSVFile = (csvString, filename) => {
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        return new File([blob], filename, { type: 'text/csv' });
    };

    // 백엔드 분석 API 호출 함수
    const sendDataToAnalysisAPI = async () => {
        if (!productCode.trim()) {
            alert('제품코드를 입력해주세요.');
            return;
        }

        if (!savedSalesData && !savedDemandData) {
            alert('저장된 데이터가 없습니다. 먼저 데이터를 저장해주세요.');
            return;
        }

        setIsUpLoading(true);

        try {
            // FormData 객체 생성
            const formData = new FormData();
            
            // 제품코드 추가
            formData.append('code', productCode);

            // 생산량 데이터 (file1)
            if (savedDemandData) {
                const demandCSV = convertToCSV(savedDemandData);
                const demandFile = createCSVFile(demandCSV, 'production_data.csv');
                formData.append('file1', demandFile);
            }

            // 판매량 데이터 (file2)
            if (savedSalesData) {
                const salesCSV = convertToCSV(savedSalesData);
                const salesFile = createCSVFile(salesCSV, 'sales_data.csv');
                formData.append('file2', salesFile);
            }

            // 백엔드 분석 API 호출
            const response = await fetch('http://165.246.80.74:8000/api/files/analyze-json/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log('분석 결과:', result);
                
                // 결과 페이지로 이동하면서 결과 데이터 전달
                navigate('/result', { 
                    state: { 
                        analysisResult: result,
                        productCode: productCode,
                        originalSalesData: savedSalesData,
                        originalDemandData: savedDemandData
                    } 
                });
            } else {
                const errorData = await response.text();
                console.error('분석 API 전송 실패:', errorData);
                alert('분석 요청에 실패했습니다.');
            }

        } catch (error) {
            console.error('분석 API 전송 중 오류:', error);
            alert('분석 요청 중 오류가 발생했습니다: ' + error.message);
        } finally {
            setIsUpLoading(false);
        }
    };

    // 백엔드에 데이터 저장하는 함수 (기존 데이터 저장 API)
    const sendDataToBackend = async () => {
        if (!productCode.trim()) {
            alert('제품코드를 입력해주세요.');
            return;
        }

        if (!savedSalesData && !savedDemandData) {
            alert('저장된 데이터가 없습니다. 먼저 데이터를 저장해주세요.');
            return;
        }

        try {
            const token = localStorage.getItem('access_token') || localStorage.getItem('authToken');
            
            if (!token) {
                alert('로그인이 필요합니다.');
                return;
            }

            const sendRequests = [];

            // 판매량 데이터 처리 (type_idx: 2)
            if (savedSalesData) {
                const salesRequests = await processDataForBackend(savedSalesData, productCode, 2, token);
                sendRequests.push(...salesRequests);
            }

            // 생산량 데이터 처리 (type_idx: 1)
            if (savedDemandData) {
                const demandRequests = await processDataForBackend(savedDemandData, productCode, 1, token);
                sendRequests.push(...demandRequests);
            }

            // 모든 요청 병렬 처리
            const results = await Promise.allSettled(sendRequests);
            
            // 결과 확인
            const successCount = results.filter(result => result.status === 'fulfilled').length;
            const totalCount = results.length;
            
            if (successCount === totalCount) {
                console.log(`백엔드 데이터 저장 성공: ${successCount}/${totalCount}`);
                return true;
            } else {
                console.error('백엔드 데이터 저장 실패:', results.filter(result => result.status === 'rejected'));
                throw new Error(`백엔드 데이터 저장 실패: ${successCount}/${totalCount}`);
            }

        } catch (error) {
            console.error('백엔드 데이터 저장 중 오류:', error);
            throw error;
        }
    };

    // 데이터를 백엔드 형식으로 변환하고 전송하는 함수
    const processDataForBackend = async (data, productCode, typeIdx, token) => {
        const requests = [];

        const dateColumn = data.headers.find(header => 
            header.toLowerCase().includes('date') || 
            header.toLowerCase().includes('날짜') ||
            header.toLowerCase().includes('일자') ||
            header === 'Date'
        ) || data.headers[0];

        const productCodeColumn = data.headers.find(header => 
            header.toString().trim() === productCode.toString().trim()
        );

        if (!productCodeColumn) {
            throw new Error(`제품코드 "${productCode}"와 일치하는 컬럼을 찾을 수 없습니다. 사용 가능한 제품코드: ${data.headers.filter(h => h !== dateColumn).join(', ')}`);
        }

        console.log(`날짜 컬럼: ${dateColumn}, 제품코드 컬럼: ${productCodeColumn}`);

        for (const row of data.data) {
            const dateValue = row[dateColumn];
            const quantityValue = row[productCodeColumn];

            if (!dateValue || quantityValue === undefined || quantityValue === null || quantityValue === '') {
                continue;
            }

            const formattedDate = formatDate(dateValue);
            if (!formattedDate) {
                console.warn(`잘못된 날짜 형식: ${dateValue}`);
                continue;
            }

            const numericQuantity = parseFloat(quantityValue);
            if (isNaN(numericQuantity)) {
                console.warn(`잘못된 수량 형식: ${quantityValue} (날짜: ${dateValue})`);
                continue;
            }

            const request = fetch('http://165.246.80.74:8000/api/files/register/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type_idx: typeIdx,
                    name: productCode,
                    number: numericQuantity,
                    date: formattedDate
                })
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            });

            requests.push(request);
        }

        if (requests.length === 0) {
            throw new Error(`제품코드 "${productCode}"에 대한 유효한 데이터가 없습니다.`);
        }

        console.log(`${productCodeColumn}에 대해 ${requests.length}개의 요청을 생성했습니다.`);
        return requests;
    };

    // 날짜 형식을 YYYY-MM-DD로 변환하는 함수
    const formatDate = (dateString) => {
        if (!dateString) return null;

        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return dateString;
        }

        if (/^\d{4}\/\d{2}\/\d{2}$/.test(dateString)) {
            return dateString.replace(/\//g, '-');
        }

        if (/^\d{4}\.\d{2}\.\d{2}$/.test(dateString)) {
            return dateString.replace(/\./g, '-');
        }

        const mmddyyyy = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (mmddyyyy) {
            const month = mmddyyyy[1].padStart(2, '0');
            const day = mmddyyyy[2].padStart(2, '0');
            return `${mmddyyyy[3]}-${month}-${day}`;
        }

        const dateObj = new Date(dateString);
        if (!isNaN(dateObj.getTime())) {
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        console.warn(`지원하지 않는 날짜 형식: ${dateString}`);
        return null;
    };

    // 수요 예측 실행 함수 (데이터 저장 + 분석 요청)
    const goToResult = async () => {
        setIsUpLoading(true);

        try {
            // 1. 백엔드에 데이터 저장 (선택사항)
            // console.log('백엔드에 데이터 저장 중...');
            // await sendDataToBackend();

            // 2. 분석 API 호출
            console.log('분석 API 호출 중...');
            await sendDataToAnalysisAPI();

        } catch (error) {
            console.error('처리 중 오류:', error);
            alert('처리 중 오류가 발생했습니다: ' + error.message);
        } finally {
            setIsUpLoading(false);
        }
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
                setSavedSalesData(null);
                setSalesSaveStatus('');
                setSalesDisplayCount(50);
            } else {
                setDemandData(parsedData);
                setDemandFileName(file.name);
                setSavedDemandData(null);
                setDemandSaveStatus('');
                setDemandDisplayCount(50);
            }
        };
        reader.readAsText(file);
    };

    // 새로고침 버튼 추가
    const handleRefreshData = () => {
        loadSavedData();
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
            setSavedSalesData(JSON.parse(JSON.stringify(salesData)));
            setSalesSaveStatus('저장됨');
            setTimeout(() => setSalesSaveStatus(''), 2000);
        } else if (type === 'demand' && demandData) {
            setSavedDemandData(JSON.parse(JSON.stringify(demandData)));
            setDemandSaveStatus('저장됨');
            setTimeout(() => setDemandSaveStatus(''), 2000);
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
                            className="control-button download-btn"
                            onClick={() => downloadCSV(type)}
                            style={{
                                backgroundColor: 'rgb(255, 152, 17)',
                                marginRight: '5px',
                            }}
                        >
                            CSV 다운
                        </button>
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
                            {/* 데이터 새로고침 버튼 추가 */}
                            {/* <button 
                                className='refresh-button'
                                onClick={handleRefreshData}
                                disabled={isLoadingData}
                                style={{
                                    marginLeft: '20px',
                                    padding: '8px 16px',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: isLoadingData ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isLoadingData ? '불러오는 중...' : '저장된 데이터 새로고침'}
                            </button> */}
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
                            <button 
                                className={`upload-search-button ${
                                    (!productCode.trim() || (!savedSalesData && !savedDemandData) || isUploading) 
                                    ? 'disabled' : ''
                                }`}
                                onClick={goToResult}
                                disabled={!productCode.trim() || (!savedSalesData && !savedDemandData) || isUploading}
                            >
                                {isUploading ? '분석 중...' : '수요 예측'}
                            </button>
                        </div>
                        
                        {/* 로딩 상태 표시 */}
                        {isLoadingData && (
                            <div className='loading-section' style={{ textAlign: 'center', margin: '20px 0' }}>
                                <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>저장된 데이터를 불러오는 중...</p>
                            </div>
                        )}
                        
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
                                        disabled={isUploading || isLoadingData}
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
                                    {salesSaveStatus === '불러옴' && (
                                        <p style={{ color: '#28a745', fontWeight: 'bold' }}>
                                            ✓ 기존에 저장된 데이터를 불러왔습니다.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* 생산량 CSV 업로드 */}
                            <div className='upload-box'>
                                <h2 className='upload-title'>생산량 CSV 파일 업로드</h2>
                                <div className='file-input-container'>
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={(e) => handleFileUpload(e, 'demand')}
                                        className='file-input'
                                        id='demand-file'
                                        disabled={isUploading || isLoadingData}
                                    />
                                    <label htmlFor='demand-file' className='file-label'>
                                        파일 선택
                                    </label>
                                    {demandFileName && (
                                        <span className='file-name'>{demandFileName}</span>
                                    )}
                                </div>
                                <div className='upload-description'>
                                    <p>생산량 CSV 파일을 업로드하면</p>
                                    <p>아래에 표 형태로 변환되어 보입니다</p>
                                    {demandSaveStatus === '불러옴' && (
                                        <p style={{ color: '#28a745', fontWeight: 'bold' }}>
                                            ✓ 기존에 저장된 데이터를 불러왔습니다.
                                        </p>
                                    )}
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
                                    
                                    {/* 오른쪽: 생산량 테이블 */}
                                    <div className='table-half'>
                                        {demandData && renderTable(demandData, '생산량 데이터', 'demand')}
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