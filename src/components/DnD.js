import React, { useState, useEffect, useRef } from "react";
import handleFileUpload from '../App'
// drag drop file component
function DragDropFile(props) {
	// drag state
	const [dragActive, setDragActive] = React.useState(false);
	// ref
	const inputRef = React.useRef(null);

	// handle drag events
	const handleDrag = function(e) {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	// triggers when file is dropped
	const handleDrop = function(e) {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			props.onFileUpload({ target: e.dataTransfer });
		}
	};

	const handleChange = function(e) {
		e.preventDefault();
		if (e.target.files && e.target.files[0]) {
			props.onFileUpload(e);
		}
	};


// triggers the input when the button is clicked
	const onButtonClick = () => {
		inputRef.current.click();
	};

	return (
		<form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
			<input ref={inputRef} type="file" id="input-file-upload" multiple={true} onChange={handleChange} />
			<label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : "" }>
				<div>
					<p className="upload-button-text">Drag and drop your file here or</p>
					<i className="gg-software-upload"></i>
					<button className="upload-button" onClick={onButtonClick}>Upload a file</button>
					<p className="upload-button-text">.XLSX</p>
				</div>
			</label>
			{ dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> }
		</form>
	);
};
export default DragDropFile;