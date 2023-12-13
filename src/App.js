import logo from "./logo.svg";
import "./App.css";
import "./components/DnD.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import Histogram from "./components/Histogram";
import DragDropFile from "./components/DnD";
import SampleData from "./components/SampleData";

function App() {
  const [data, setData] = useState([]);
  const [fileName, setFileName] = useState("");
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
  const navigateToURL = () => {
    window.location.href = "https://en.wikipedia.org/wiki/Benford%27s_law";
  };
  return (
    <div className="App">
      <div className="Main">
        <div className="left_part">
          <div className="Title-Wrap">
            <h1 className="title">Benford's Law</h1>
            <h2 className="sub-title">Test your data</h2>
            <p className="link" onClick={navigateToURL}>
              About Benford's Law...
            </p>
            <SampleData
              setData={setData}
              setTextBoxContent={setTextBoxContent}
              setFileName={setFileName}
            />
          </div>
          <DragDropFile
            setData={setData}
            setTextBoxContent={setTextBoxContent}
            setFileName={setFileName}
          />
        </div>

        <div className="right_part">
          <h2 className="sub-title">Pokemon Weight</h2>
          <div className="main_content">
            <textarea
              className="data_textBox"
              value={textBoxContent}
              onChange={handleTextBoxChange}
            />
            <div className="histogram">
              {fileName !== "" ? <div>File: {fileName}</div> : <></>}
              <Histogram className="his" data={data} />
            </div>
            <div></div>
          </div>
        </div>
      </div>
      <p className="bagging">
        Established by Team, HIRE ME: Junhaeng Lee, Junyong Min, Ohsu Kwon
      </p>
    </div>
  );
}

export default App;
