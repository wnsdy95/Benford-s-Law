import React, { useState, useEffect, useRef, memo } from "react";
import handleFileUpload from "../App";
import { readExcelData, readTextData } from "../utilities/readingFile";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { styled } from "@mui/system";

// drag drop file component
const DragDropFile = memo(({
  setData,
  setTextBoxContent,
  setFileName,
  setIsLoading,
}) => {
  // drag state
  const [dragActive, setDragActive] = React.useState(false);
  // ref
  const inputRef = React.useRef(null);

  // upload icon hovering
  const StyledUploadIcon = styled(UploadFileIcon, {
    name: "StyledUploadIcon",
    slot: "Wrapper",
  })({
    color: "goldenrod",
    "&:hover": { color: "rgb(227, 150, 62)" },
  });

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
    setIsLoading(true);
    const file = event.target.files[0];
    if (file) {
      let numericData;
      const fileExtension = file.name.split(".").pop();
      if (fileExtension === "xlsx") {
        numericData = await readExcelData(file);
      } else if (fileExtension === "txt") {
        numericData = await readTextData(file);
      }
      setData(numericData);
      setTextBoxContent(numericData.join("\n"));
      setFileName(file.name);
    }
  };

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
        <div className="upload-div">
          <StyledUploadIcon sx={{ fontSize: 70, color: "#ffffff" }} />
        </div>

        <div>
          {/* <p className="upload-button-text"></p> */}
          <button className="upload-button" onClick={onButtonClick}>
            Drag and drop to upload a file <br></br>(.XLSX .TXT)
          </button>
          {/* <p className="upload-button-text"></p> */}
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
});
export default DragDropFile;
