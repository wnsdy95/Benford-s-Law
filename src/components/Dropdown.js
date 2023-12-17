import React, { useState } from "react";
import { readExcelData, readTextData } from "../utilities/readingFile";
import "./Dropdown.css";


const DropdownMenu = ({
  setData,
  setTextBoxContent,
  setFileName,
  setIsLoading,
}) => {
  const [selectedOption, setSelectedOption] = useState("");

  const options = [
    { label: "Pokemon Weight", filePath: "/assets/pokemon_weight.txt" },
    { label: "Regional Weather", filePath: "/assets/regional_weather.xlsx" },
    { label: "Lottery Powerball", filePath: "/assets/Lottery_Powerball.xlsx" },
  ];

  const handleSelectChange = async (event) => {
    const selectedLabel = event.target.value;
    const selected = options.find((option) => option.label === selectedLabel);
    if (selected) {
      setSelectedOption(selectedLabel);
      setIsLoading(true);
      await handleSampleData(selected.filePath);
    }
  };

  const handleSampleData = async (filePath) => {
    const response = await fetch(filePath);
    const file = await response.blob();
    if (file) {
      let numericData;
      const fileExtension = filePath.split(".").pop();
      if (fileExtension === "xlsx") {
        numericData = await readExcelData(file);
      } else if (fileExtension === "txt") {
        numericData = await readTextData(file);
      }
      setData(numericData);
      setTextBoxContent(numericData.join("\n"));
      setFileName(filePath.split("/")[2]);
    }
  };

  return (
    <div className={"option"}>
      <select
        className="drop"
        value={selectedOption}
        onChange={handleSelectChange}
      >

        <option className="down" value="">Select an example data</option>
        <option value="Pokemon Weight">Pokemon Weight</option>
        <option value="Regional Weather">Regional Weather</option>
        <option value="Lottery Powerball">Lottery Powerball</option>
      </select>
    </div>
  );
};

export default DropdownMenu;
