import React, { useState, useEffect, useRef } from "react";
import handleFileUpload from "../App";
import * as XLSX from "xlsx";
import Papa from "papaparse";
// drag drop file component
function DragDropFile({ setData }) {
  // drag state
  const [dragActive, setDragActive] = React.useState(false);
  // ref
  const inputRef = React.useRef(null);

  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload({ target: e.dataTransfer });
    }
  };

  const handleChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e);
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const rawData = await readExcelData(file);
      const numericData = extractNumericData(rawData);
      setData(numericData);
    }
  };

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

  return (
    <form
      id="form-file-upload"
      onDragEnter={handleDrag}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        ref={inputRef}
        type="file"
        id="input-file-upload"
        multiple={true}
        onChange={handleChange}
      />
      <label
        id="label-file-upload"
        htmlFor="input-file-upload"
        className={dragActive ? "drag-active" : ""}
      >
        <div>
          <p className="upload-button-text">Drag and drop your file here or</p>
          <i className="gg-software-upload"></i>
          <button className="upload-button" onClick={onButtonClick}>
            Upload a file
          </button>
          <p className="upload-button-text">.XLSX</p>
        </div>
      </label>
      {dragActive && (
        <div
          id="drag-file-element"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
    </form>
  );
}
export default DragDropFile;
