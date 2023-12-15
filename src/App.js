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
            <h1 className="title">BENFORD'S LAW</h1>
            <div className="description-contents">

              <p className="description">
                Benford's law, or the Newcomb–Benford law,
                observes that in real-life numerical data,
                smaller digits often appear as the first digit.
                For example, the number 1 occurs as the first digit
                30% of the time, whereas 9 appears only 5% of the time.
                If digits were uniformly distributed, each would occur
                11.1% of the time. The law also applies to the
                distribution of second, third digits, digit combinations, and so on.
              </p>
              <SampleData
                setData={setData}
                setTextBoxContent={setTextBoxContent}
                setFileName={setFileName}
              />

          <DragDropFile
            setData={setData}
            setTextBoxContent={setTextBoxContent}
            setFileName={setFileName}
          />
            </div>
        </div>

        <div className="right_part">
          <div className="main_content">
            <textarea
              className="data_textBox"
              value={textBoxContent}
              onChange={handleTextBoxChange}
            />
            <div className="histogram">
              {fileName !== "" ? <h1 className={"File_name"}>{fileName}</h1> : <></>}
              <Histogram className="his" data={data} />
            </div>

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
