import logo from "./logo.svg";
import "./App.css";
import "./components/DnD.css";
import React, { useState, useEffect, useRef,useCallback } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import Histogram from "./components/Histogram";
import DragDropFile from "./components/DnD"

function App() {
  function readExcelData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const csvData = XLSX.utils.sheet_to_csv(worksheet);

        Papa.parse(csvData, {
          complete: (results) => resolve(results.data),
          error: (error) => reject(error),
        });
      };
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  }

  const [data, setData] = useState([]);

  function extractNumericData(rawData) {
    // Filter rows that have numeric data.
    const numericRows = rawData.slice(4, 19); // Based on the given data, adjust if necessary

    let numbers = [];

    for (const row of numericRows) {
      // For each row, filter only the numeric values
      const numericValues = row.filter((cell) => !isNaN(cell) && cell !== "");
      numbers = numbers.concat(numericValues.map((val) => parseFloat(val)));
    }

    return numbers;
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const rawData = await readExcelData(file);
      const numericData = extractNumericData(rawData);
      setData(numericData);
    }
  };

  return (
    <div className="App">
      <Histogram data={data} />
      <DragDropFile onFileUpload={handleFileUpload} />
    </div>
  );
}

export default App;
