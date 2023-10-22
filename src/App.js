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

  return (
    <div className="App">
      <Histogram data={data} />
      <DragDropFile setData={setData} />
    </div>
  );
}

export default App;
