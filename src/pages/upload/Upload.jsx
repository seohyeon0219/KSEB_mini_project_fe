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
    const [isLoadingData, setIsLoadingData] = useState(true);
    
    // 저장 진행률 관련 상태 추가
    const [isSavingSales, setIsSavingSales] = useState(false);
    const [isSavingDemand, setIsSavingDemand] = useState(false);
    const [saveProgress, setSaveProgress] = useState({ current: 0, total: 0, type: '' });
    
    // 페이지네이션 관련 상태
    const [salesDisplayCount, setSalesDisplayCount] = useState(50);
    const [demandDisplayCount, setDemandDisplayCount] = useState(50);
    const ITEMS_PER_LOAD = 50;

    // 진행률 표시 모달 컴포넌트
    const ProgressModal = ({ isVisible, progress }) => {
        if (!isVisible) return null;

        const percentage = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

        return ;

        // return (
        //     <div style={{
        //         position: 'fixed',
        //         top: 0,
        //         left: 0,
        //         right: 0,
        //         bottom: 0,
        //         backgroundColor: 'rgba(0, 0, 0, 0.7)',
        //         display: 'flex',
        //         justifyContent: 'center',
        //         alignItems: 'center',
        //         zIndex: 9999
        //     }}>
        //         <div style={{
        //             backgroundColor: 'white',
        //             padding: '30px',
        //             borderRadius: '10px',
        //             minWidth: '400px',
        //             textAlign: 'center',
        //             boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        //         }}>
        //             <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
        //                 {progress.type} 데이터 저장 중...
        //             </h3>
                    
        //             {/* 진행률 바 */}
        //             <div style={{
        //                 width: '100%',
        //                 height: '20px',
        //                 backgroundColor: '#f0f0f0',
        //                 borderRadius: '10px',
        //                 overflow: 'hidden',
        //                 marginBottom: '15px'
        //             }}>
        //                 <div style={{
        //                     width: `${percentage}%`,
        //                     height: '100%',
        //                     backgroundColor: '#4CAF50',
        //                     transition: 'width 0.3s ease',
        //                     borderRadius: '10px'
        //                 }}></div>
        //             </div>
                    
        //             {/* 진행률 텍스트 */}
        //             <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
        //                 {percentage}%
        //             </div>
                    
        //             {/* 상세 진행률 */}
        //             <div style={{ fontSize: '14px', color: '#666' }}>
        //                 {progress.current} / {progress.total} 항목 처리됨
        //             </div>
                    
        //             {/* 로딩 스피너 */}
        //             <div style={{
        //                 marginTop: '20px',
        //                 display: 'inline-block',
        //                 width: '30px',
        //                 height: '30px',
        //                 border: '3px solid #f3f3f3',
        //                 borderTop: '3px solid #4CAF50',
        //                 borderRadius: '50%',
        //                 animation: 'spin 1s linear infinite'
        //             }}></div>
        //         </div>
        //     </div>
        // );
    };

    // 환경변수 확인 함수
    const checkEnvironment = () => {
        console.log('=== 환경 설정 확인 ===');
        console.log('VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);
        console.log('현재 도메인:', window.location.origin);
        console.log('모든 환경변수:', import.meta.env);
    };

    // 컴포넌트 마운트 시 환경 확인
    useEffect(() => {
        checkEnvironment();
        loadSavedData();
    }, []);

    // 백엔드에서 저장된 데이터를 불러오는 함수
    const loadSavedData = async () => {
        const token = localStorage.getItem('access_token') || localStorage.getItem('authToken');
        
        if (!token) {
            console.log('토큰이 없습니다. 로그인이 필요합니다.');
            setIsLoadingData(false);
            return;
        }

        try {
            setIsLoadingData(true);
            console.log('저장된 데이터 로딩 시작...');
            
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://165.246.80.9:8000';
            const response = await fetch(`${backendUrl}/api/files/read/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const savedData = await response.json();
                console.log('=== 백엔드에서 받은 데이터 ===');
                console.log('전체 응답:', savedData);
                console.log('type1_data (생산량):', savedData.type1_data);
                console.log('type2_data (판매량):', savedData.type2_data);
                
                await processBackendData(savedData);
                
            } else if (response.status === 401) {
                console.log('인증 오류: 토큰이 유효하지 않거나 만료됨');
                localStorage.removeItem('access_token');
                localStorage.removeItem('authToken');
            } else {
                console.log('저장된 데이터를 불러올 수 없습니다. 상태코드:', response.status);
                const errorText = await response.text();
                console.log('오류 내용:', errorText);
            }
        } catch (error) {
            console.error('데이터 로딩 중 오류:', error);
        } finally {
            setIsLoadingData(false);
        }
    };

    // 백엔드 데이터를 CSV 형태로 변환하여 테이블에 표시
    const processBackendData = async (backendData) => {
        try {
            console.log('백엔드 데이터 처리 시작...');
            
            if (backendData.type1_data && backendData.type1_data.length > 0) {
                console.log('생산량 데이터 처리 중...');
                const demandCSVData = convertBackendDataToCSV(backendData.type1_data, '생산량');
                
                if (demandCSVData) {
                    setDemandData(demandCSVData);
                    setSavedDemandData(JSON.parse(JSON.stringify(demandCSVData)));
                    setDemandFileName('기존_생산량_데이터.csv');
                    setDemandSaveStatus('불러옴');
                    setTimeout(() => setDemandSaveStatus(''), 3000);
                    
                    if (backendData.type1_data[0] && backendData.type1_data[0].name) {
                        setProductCode(backendData.type1_data[0].name);
                    }
                    
                    console.log('생산량 데이터 처리 완료:', demandCSVData);
                }
            } else {
                console.log('생산량 데이터가 없습니다.');
            }

            if (backendData.type2_data && backendData.type2_data.length > 0) {
                console.log('판매량 데이터 처리 중...');
                const salesCSVData = convertBackendDataToCSV(backendData.type2_data, '판매량');
                
                if (salesCSVData) {
                    setSalesData(salesCSVData);
                    setSavedSalesData(JSON.parse(JSON.stringify(salesCSVData)));
                    setSalesFileName('기존_판매량_데이터.csv');
                    setSalesSaveStatus('불러옴');
                    setTimeout(() => setSalesSaveStatus(''), 3000);
                    
                    if (!productCode && backendData.type2_data[0] && backendData.type2_data[0].name) {
                        setProductCode(backendData.type2_data[0].name);
                    }
                    
                    console.log('판매량 데이터 처리 완료:', salesCSVData);
                }
            } else {
                console.log('판매량 데이터가 없습니다.');
            }

        } catch (error) {
            console.error('백엔드 데이터 처리 중 오류:', error);
        }
    };

    // 백엔드 데이터를 CSV 테이블 형식으로 변환
    const convertBackendDataToCSV = (dataArray, dataType) => {
        if (!dataArray || dataArray.length === 0) {
            console.log(`${dataType} 데이터가 비어있습니다.`);
            return null;
        }

        try {
            console.log(`${dataType} 데이터 변환 시작, 레코드 수:`, dataArray.length);
            
            const dateGroups = {};
            const productCodes = new Set();

            dataArray.forEach(record => {
                const date = record.date;
                const productCode = record.name;
                const quantity = record.number;

                productCodes.add(productCode);

                if (!dateGroups[date]) {
                    dateGroups[date] = {};
                }
                
                if (dateGroups[date][productCode]) {
                    dateGroups[date][productCode] += quantity;
                } else {
                    dateGroups[date][productCode] = quantity;
                }
            });

            const headers = ['Date', ...Array.from(productCodes).sort()];
            
            const data = Object.keys(dateGroups)
                .sort()
                .map(date => {
                    const row = { Date: date };
                    
                    Array.from(productCodes).forEach(productCode => {
                        row[productCode] = dateGroups[date][productCode] || 0;
                    });
                    
                    return row;
                });

            return { headers, data };

        } catch (error) {
            console.error(`${dataType} 데이터 변환 중 오류:`, error);
            return null;
        }
    };

    // CSV 테이블 데이터를 백엔드 형식으로 변환하는 함수
    const convertCSVToBackendFormat = (csvData, typeIdx) => {
        if (!csvData || !csvData.headers || !csvData.data) {
            console.warn('CSV 데이터가 유효하지 않습니다.');
            return [];
        }

        const backendData = [];
        
        csvData.data.forEach(row => {
            const date = row.Date;
            if (!date) return;

            csvData.headers.forEach(header => {
                if (header !== 'Date' && row[header] && row[header] !== '0' && row[header] !== '') {
                    backendData.push({
                        type_idx: typeIdx,
                        date: date,
                        name: header,
                        number: parseInt(row[header]) || 0
                    });
                }
            });
        });

        return backendData;
    };

    // 백엔드에 데이터 저장하는 함수 (진행률 포함)
    const saveDataToBackend = async (data, dataType) => {
        const token = localStorage.getItem('access_token') || localStorage.getItem('authToken');
        
        if (!token) {
            alert('로그인이 필요합니다.');
            return false;
        }

        if (!data || !data.headers || !data.data || data.data.length === 0) {
            alert('저장할 데이터가 없습니다.');
            return false;
        }

        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        try {
            console.log(`=== ${dataType} 데이터 백엔드 저장 시작 ===`);
            
            // 저장 상태 설정
            if (dataType === '판매량') {
                setIsSavingSales(true);
                setSalesSaveStatus('저장 중...');
            } else {
                setIsSavingDemand(true);
                setDemandSaveStatus('저장 중...');
            }
            
            const typeIdx = dataType === '판매량' ? 2 : 1;
            const backendDataArray = convertCSVToBackendFormat(data, typeIdx);
            
            if (backendDataArray.length === 0) {
                alert('저장할 유효한 데이터가 없습니다.');
                return false;
            }

            // 진행률 초기화
            setSaveProgress({
                current: 0,
                total: backendDataArray.length,
                type: dataType
            });

            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://165.246.80.9:8000';

            const response = await fetch(`${backendUrl}/api/files/register/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data : backendDataArray
                })
            });
            


            // for (let i = 0; i < backendDataArray.length; i++) {
            //     const item = backendDataArray[i];
                
            //     try {
            //         // 진행률 업데이트


            //         const response = await fetch(`${backendUrl}/api/files/register/`, {
            //             method: 'POST',
            //             headers: {
            //                 'Authorization': `Bearer ${token}`,
            //                 'Content-Type': 'application/json',
            //             },
            //             body: JSON.stringify({
            //                 type_idx: item.type_idx,
            //                 date: item.date,
            //                 name: item.name,
            //                 number: item.number
            //             })
            //         });

            //         if (response.ok) {
            //             successCount++;
            //             console.log(`${i + 1}/${backendDataArray.length} 저장 성공`);
            //         } else {
            //             errorCount++;
            //             const errorText = await response.text();
            //             errors.push(`항목 ${i + 1}: ${errorText}`);
            //             console.error(`${i + 1}/${backendDataArray.length} 저장 실패:`, response.status, errorText);
            //         }

            //         // 요청 간 짧은 지연 (서버 부하 방지)
            //         if (i < backendDataArray.length - 1) {
            //             await new Promise(resolve => setTimeout(resolve, 50));
            //         }

            //     } catch (error) {
            //         errorCount++;
            //         errors.push(`항목 ${i + 1}: ${error.message}`);
            //         console.error(`${i + 1}/${backendDataArray.length} 전송 오류:`, error);
            //     }
            // }
            
            if (response.ok) {
                successCount = backendDataArray.length;
                errorCount = 0;
            }
            else {
                errorCount++;
            //     const errorText = await response.text();
            //     errors.push(`항목 ${i + 1}: ${errorText}`);
            //     console.error(`${i + 1}/${backendDataArray.length} 저장 실패:`, response.status, errorText);
            }


            // 결과 요약
            console.log(`${dataType} 저장 완료: 성공 ${successCount}개, 실패 ${errorCount}개`);
            
            if (errorCount > 0) {
                console.error('저장 실패 항목들:', errors);
                alert(`${dataType} 데이터 저장 완료!\n성공: ${successCount}개\n실패: ${errorCount}개\n\n실패한 항목이 있습니다. 콘솔을 확인해주세요.`);
            } else {
                setSaveProgress({
                    current: backendDataArray.length,
                    total: backendDataArray.length,
                    type: dataType
                });
                alert(`${dataType} 데이터 저장 완료! (${successCount}개 항목)`);
            }

            return successCount > 0;

        } catch (error) {
            console.error(`${dataType} 저장 중 오류:`, error);
            alert(`${dataType} 데이터 저장 중 오류가 발생했습니다: ${error.message}`);
            return false;
        } finally {
            // 저장 상태 해제
            if (dataType === '판매량') {
                setIsSavingSales(false);
                setSalesSaveStatus('저장됨');
                setTimeout(() => setSalesSaveStatus(''), 10000);
            } else {
                setIsSavingDemand(false);
                setDemandSaveStatus('저장됨');
                setTimeout(() => setDemandSaveStatus(''), 10000);
            }
            
            // 진행률 초기화
            setSaveProgress({ current: 0, total: 0, type: '' });
        }
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
        if (!data || !data.headers || !data.data) {
            console.warn('Invalid data structure for CSV conversion');
            return '';
        }
        
        const headerRow = data.headers.map(header => {
            if (header.includes(',') || header.includes('"') || header.includes('\n')) {
                return `"${header.replace(/"/g, '""')}"`;
            }
            return header;
        }).join(',');
        
        const dataRows = data.data.map(row => {
            return data.headers.map(header => {
                const value = (row[header] || '').toString();
                if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',');
        });
        
        const csvContent = [headerRow, ...dataRows].join('\n');
        console.log('CSV 변환 완료. 행 수:', dataRows.length + 1);
        return csvContent;
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

    // 새로고침 버튼
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

    // 테이블 데이터 저장 함수 (수정됨)
    const saveTableData = async (type) => {
        if (type === 'sales' && salesData) {
            setSavedSalesData(JSON.parse(JSON.stringify(salesData)));
            await saveDataToBackend(salesData, '판매량');
        } else if (type === 'demand' && demandData) {
            setSavedDemandData(JSON.parse(JSON.stringify(demandData)));
            await saveDataToBackend(demandData, '생산량');
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

    // 수요 예측 실행 함수 (기존 코드 유지)
    const goToResult = () => {
        if (!productCode.trim()) {
            alert('제품코드를 입력해주세요.');
            return;
        }

        if (!savedSalesData && !savedDemandData) {
            alert('저장된 데이터가 없습니다. 먼저 데이터를 저장해주세요.');
            return;
        }

        // 분석 API 호출 로직은 기존 코드 사용
        alert('분석을 시작합니다!');
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
                            <span className={`save-status ${salesSaveStatus.includes('실패') ? 'error' : 'saved'}`}>
                                {salesSaveStatus}
                            </span>
                        )}
                        {(type === 'demand' && demandSaveStatus) && (
                            <span className={`save-status ${demandSaveStatus.includes('실패') ? 'error' : 'saved'}`}>
                                {demandSaveStatus}
                            </span>
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
                            disabled={
                                (type === 'sales' && (salesSaveStatus === '저장 중...' || isSavingSales)) ||
                                (type === 'demand' && (demandSaveStatus === '저장 중...' || isSavingDemand))
                            }
                        >
                            {(type === 'sales' && (salesSaveStatus === '저장 중...' || isSavingSales)) ||
                             (type === 'demand' && (demandSaveStatus === '저장 중...' || isSavingDemand)) 
                             ? '저장 중...' : '저장'}
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
            {/* CSS 애니메이션 추가 */}
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>

            {/* 진행률 모달 */}
            <ProgressModal 
                isVisible={isSavingSales || isSavingDemand} 
                progress={saveProgress} 
            />

            {/* 전체 로딩 오버레이 (데이터 로딩 중일 때) */}
            {isLoadingData && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9998
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            border: '5px solid #f3f3f3',
                            borderTop: '5px solid #3498db',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 20px'
                        }}></div>
                        <p style={{ fontSize: '18px', color: '#333' }}>
                            저장된 데이터를 불러오는 중...
                        </p>
                    </div>
                </div>
            )}

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
                            <button 
                                className="control-button refresh-btn"
                                onClick={handleRefreshData}
                                disabled={isLoadingData}
                                style={{
                                    marginLeft: '10px',
                                    backgroundColor: '#17a2b8',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                {isLoadingData ? '로딩중...' : '데이터 새로고침'}
                            </button>
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
                                        disabled={isUploading || isLoadingData || isSavingSales}
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
                                        disabled={isUploading || isLoadingData || isSavingDemand}
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