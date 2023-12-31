import * as XLSX from "xlsx";
import Papa from "papaparse";

export async function readExcelData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const csvData = XLSX.utils.sheet_to_csv(worksheet);

      Papa.parse(csvData, {
        complete: (results) => {
          const rawData = results.data;
          const numericData = extractNumericData(rawData);
          resolve(numericData);
        },
        error: (error) => reject(error),
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
}

function extractNumericData(rawData) {
  // Filter rows that have numeric data.
  //   const numericRows = rawData.slice(4, 19); // Based on the given data, adjust if necessary
  let numbers = [];
  for (const row of rawData) {
    // For each row, filter only the numeric values
    const numericValues = row.filter((cell) => !isNaN(cell) && cell !== "");
    numbers = numbers.concat(numericValues.map((val) => parseFloat(val)));
  }
  return numbers;
}

export async function readTextData(file) {
  try {
    const data = await file.text();

    const lines = data.split("\n");

    const numericData = [];
    for (let line of lines) {
      const numbersInLine = line.match(/\b\d+(\.\d+)?\b/g); // Regex to match numbers, including decimals
      if (numbersInLine) {
        numericData.push(...numbersInLine.map((num) => parseFloat(num)));
      }
    }
    return numericData;
  } catch (error) {
    console.error("Error reading the text file:", error);
  }
}
