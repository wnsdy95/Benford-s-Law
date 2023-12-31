import React, { useState } from "react";
import { readExcelData, readTextData } from "../utilities/readingFile";

const SampleData = ({ setData, setTextBoxContent, setFileName }) => {
  const [isHovered, setIsHovered] = useState(false);

  // const filePath = "/assets/sampleData.xlsx";
  const filePath = "/assets/pokemon_weight.txt";
  // const filePath = "/assets/Electric_Vehicle_Population_Data.xlsx";
  // const filePath = "/assets/weather.xlsx";

  const handleSampleData = async () => {
    const response = await fetch(filePath); // use filePath here
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
    <div style={{ position: "absolute", top: "30px", right: "30px" }}>
      <img
        src={
          isHovered ? "/assets/snorlax-logo2.png" : "/assets/snorlax-logo1.png"
        }
        alt={"snorlax"}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleSampleData}
        style={{ cursor: "pointer", height: "50px", weight: "50px" }}
      />
    </div>
  );
};

export default SampleData;
