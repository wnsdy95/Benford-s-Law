import logo from "./logo.svg";
import "./App.css";
import "./components/DnD.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import Histogram from "./components/Histogram";
import DragDropFile from "./components/DnD";

function App() {
  const [data, setData] = useState([]);
  const [textBoxContent, setTextBoxContent] = useState(data.join("\n"));

  const handleTextBoxChange = (e) => {
    setTextBoxContent(e.target.value);
    const text = e.target.value;
    const numbers = text
      .split("\n")
      .map((line) => parseFloat(line))
      .filter((num) => !isNaN(num));
    setData(numbers);
  };

  return (
    <div className="App">
      <textarea
        style={{ width: "100px", height: "200px" }}
        value={textBoxContent}
        onChange={handleTextBoxChange}
      />
      <Histogram data={data} />
      <DragDropFile setData={setData} />
    </div>
  );
}

export default App;
