import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';



const TestResultsTable = () => {
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    fetchTestResults();
  }, []);

  const fetchTestResults = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/test-results/all');
      if (response.ok) {
        
        const data = await response.json();
        console.log(data);
          const resultsWithGrades = data.map((result) => ({
          ...result,
          numericResult: Number(result.result),
          grade: calculateGrade(Number(result.result), result.number),
          
        }));
        console.log(data);
       
        setTestResults(resultsWithGrades);
      } else {
        console.error('Failed to fetch test results:', response.statusText);
      }
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };
  
  const calculateGrade = (numericResult, totalQuestions) => {
    const percentage = (numericResult / totalQuestions) * 100;
    console.log(percentage);
    if (percentage <= 49) return 2;
    else if (percentage >50 & percentage <= 65) return 3;
    else if (percentage > 65 & percentage<= 74) return 3.5;
    else if (percentage > 74 & percentage <= 85) return 4;
    else if (percentage > 85 & percentage<= 90) return 4.5;
    else if (percentage >= 91) return 5;
  };
  const columns = [
    { field: 'quizName', headerName: 'Test', width: 130 },
    { field: 'name', headerName: 'Imie i nazwisko', width: 150 },
    { field: 'result', headerName: 'Wynik', width: 90 },
    {
      field: 'passed',
      headerName: 'Zaliczone',
      width: 130,
      renderCell: (params) => (
        <span style={{ color: params.value ? 'green' : 'red' }}>
          {params.value ? 'Tak' : 'Nie'}
        </span>
      ),
    },
    {
      field: 'grade',
      headerName: 'Ocena',
      width: 80,
      renderCell: (params) => (
        <span>{calculateGrade(params.row.numericResult, params.row.number)}</span>

      ),
    },
    
  ];
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={testResults} 
        columns={columns}
        pageSize={5} 
       
      />
    </div>
  );
};

export default TestResultsTable;
