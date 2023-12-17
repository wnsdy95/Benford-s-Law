import logo from "./logo.svg";
import "./App.css";
import "./components/DnD.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import Histogram from "./components/Histogram";
import DragDropFile from "./components/DnD";
import SampleData from "./components/SampleData";
import Dropdown from "./components/Dropdown";

function App() {
  const [data, setData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [textBoxContent, setTextBoxContent] = useState(data.join("\n"));
  const [isLoading, setIsLoading] = useState(true);

  const handleApplyClick = useCallback(() => {
    setIsLoading(true);
    const text = textBoxContent;
    const numbers = text
      .split("\n")
      .map((line) => parseFloat(line))
      .filter((num) => !isNaN(num));
    setFileName("Testing Own Data");
    setData(numbers);
  }, [textBoxContent]);

  const handleClearClick = useCallback(() => {
    setIsLoading(true);
    setData([]); // Clear the data array
    setFileName("Cleared"); // Reset the file name
    setTextBoxContent(""); // Clear the text box content
  }, []);

  const handleTextBoxChange = useCallback((e) => {
    setTextBoxContent(e.target.value);
  }, []);

  const options = ["one", "two", "three"];
  const defaultOption = options[0];

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
              Benford's law, or the Newcomb–Benford law, observes that in
              real-life numerical data, smaller digits often appear as the first
              digit. For example, the number 1 occurs as the first digit 30% of
              the time, whereas 9 appears only 5% of the time. If digits were
              uniformly distributed, each would occur 11.1% of the time. The law
              also applies to the distribution of second, third digits, digit
              combinations, and so on.
            </p>
            <DragDropFile
              setData={setData}
              setTextBoxContent={setTextBoxContent}
              setFileName={setFileName}
              setIsLoading={setIsLoading}
            />
            <Dropdown
              setData={setData}
              setTextBoxContent={setTextBoxContent}
              setFileName={setFileName}
              setIsLoading={setIsLoading}
            />
            {/*<Dropdown options={options} onChange={this._onSelect} value={defaultOption} placeholder="Select an option" />;*/}
          </div>
          <p className="description">
            The deviation formula is,<br></br>
            ((DD - ID) / ID) x 100, <br></br>
            where DD: Data Distribution <br></br>
            <span class="tab"></span>   ID: Ideal Distribution <br></br>
            The deviation shows how far away the data distribution is from the ideal distribution. Typically, if
            tha data distribution is 20% away (especially if the high value digits, such as 8, 9), then it is regarded as artificial or manipulated data.
            In the case of the lottery, it does not fit with the Benford's law; since, the number of lottery is more likely
            to be identifier rather than the number as a mathematical term.
          </p>
        </div>

        <div className="right_part">
          {fileName !== "" ? (
            <h1 className={"File_name"}>{fileName}</h1>
          ) : (
            <></>
          )}
          <div className="main_content">
            <div className="text-area">
              <textarea
                className="data_textBox"
                value={textBoxContent}
                onChange={handleTextBoxChange}
              />
              <button className={"apply"} onClick={handleApplyClick}>
                Apply
              </button>
              <button className={"apply"} onClick={handleClearClick}>
                Clear
              </button>
            </div>
            <div className="histogram">
              <Histogram
                className="his"
                data={data}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
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
