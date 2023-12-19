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
          <p className="description2">
            The deviation formula, represented as,<br></br><br></br>
            ((DD - ID) / ID) x 100, <br></br>
            where  DD: Data Distribution <br></br>
            <span class="tab"></span> ID: Ideal Distribution <br></br><br></br>
            is a mathematical expression used to quantify the difference between the actual data distribution (DD) and the ideal or expected distribution (ID). This formula calculates the percentage deviation of the observed data distribution from the ideal distribution.<br></br><br></br>

            <span className="tab"></span>In this context, "DD" stands for "Data Distribution," which refers to the observed distribution of data in a given dataset. "ID," on the other hand, represents the "Ideal Distribution," which is the theoretical or expected distribution of data based on Benford's Law.<br></br><br></br>

            <span className="tab"></span>The resultant value from this formula indicates the extent of deviation of the actual data from the expected norm. A significant deviation, particularly when it exceeds 20%, especially in the higher value digits like 8 or 9, is often considered indicative of artificial or manipulated data. This is because natural datasets typically adhere to certain statistical properties or laws, such as Benford's Law.<br></br><br></br>

            <span className="tab"></span>In the context of lotteries, this formula and its implications is not particularly relevant. Lottery numbers are often expected to conform to specific statistical patterns. However, unlike traditional applications of Benford's Law, which is generally applicable to naturally occurring datasets, lottery numbers are more akin to identifiers rather than naturally occurring mathematical figures. Therefore, the distribution of lottery numbers might not necessarily align with the patterns predicted by Benford's Law, which primarily applies to datasets where numbers are representative of naturally occurring quantities or sizes.
          </p>
        </div>

        <div className="right_part">
          {fileName !== "" ? (
            <h1 className={"File_name"}>{fileName}</h1>
          ) : (
            <div className="empty_file_name"></div>
          )}
          <div className="main_content">
            <div className="text-area">
              <textarea
                className="data_textBox"
                value={textBoxContent}
                onChange={handleTextBoxChange}
              />

              <button color={"white"} className="glitch-btn" onClick={handleApplyClick}>Apply</button>
              <button color={"black"} className="glitch-btn" type="button" name="Hover" onClick={handleClearClick}>Clear</button>

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
