const fs = require('fs');
const Papa = require('papaparse');
const { performance } = require('perf_hooks');

const directory = './';
const outputFile = './database.csv';
const reportDirectory = './reports';

if (!fs.existsSync(outputFile)) {
    fs.writeFileSync(outputFile, '');
}

// Read existing data from output CSV file
let existingData = [];
if (fs.existsSync(outputFile)) {
    existingData = Papa.parse(fs.readFileSync(outputFile, 'utf8'), {
        header: true,
        dynamicTyping: true,
    }).data;
}

// Create an index of existing rows by Id for faster lookups
let indexById = new Map();
existingData.forEach((row) => indexById.set(row.Id, row));

// Create a report directory if it does not exist
if (!fs.existsSync(reportDirectory)) {
    fs.mkdirSync(reportDirectory);
}

let date = new Date();
let options = {
    timeZone: 'CET',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
};
let timestamp = date
    .toLocaleString('fr-FR', options)
    .replaceAll('/', '-')
    .replaceAll(',', '')
    .replaceAll(':', '-');
console.log(timestamp);

let reportContent = `Database updated successfully!!!\n`;
let reportFile = reportDirectory + '/' + timestamp + '_database_update_report.txt';

// Iterate through input CSV files in the directory
fs.readdirSync(directory)
    .filter((afile) => afile.endsWith('.csv') && !afile.startsWith('database'))
    .forEach((file, index) => {
        // Start timer
        let startTime = performance.now();
        console.log(index + file);
        let data = fs.readFileSync(directory + '/' + file, 'utf8');
        let rows = Papa.parse(data, { header: true, dynamicTyping: true }).data;

        let rowsUpdated = 0;
        let rowsAdded = 0;
        let outputHeaders

        // Check if the headers of the input CSV match those of the output CSV
        let headersMatch = true;
        if (rows.length > 0 && existingData.length > 0) {
            let inputHeaders = Object.keys(rows[0]);

            outputHeaders = Object.keys(existingData[0]);
            if (inputHeaders.length !== outputHeaders.length) {
                headersMatch = false;
            } else {
                for (let i = 0; i < inputHeaders.length; i++) {
                    if (inputHeaders[i] !== outputHeaders[i]) {
                        headersMatch = false;
                        break;
                    }
                }
            }
        } else {
            headersMatch = true;
        }

        if (!headersMatch) {
            // Write error message to report file and move to next file
            reportContent += `********************* File n°${index + 1} *************************\n`;
            reportContent += `Error: Headers of file ${file} do not match the headers of the output CSV file.\n`;
            reportContent += `Expected headers : ${outputHeaders.join(", ")}\n`;
            reportContent += `At: ${date}\n\n`;
            fs.writeFileSync(reportFile, reportContent);
            return;
        }

        // Process each row in the input CSV
        rows.forEach((row) => {
            if (row.Id) {
                // Check if the Id already exists in the output CSV
                let existingRow = indexById.get(row.Id);

                // Update existing row or add a new row
                if (existingRow) {
                    Object.keys(row).forEach((key) => {
                        existingRow[key] = row[key];
                    });
                    rowsUpdated++;
                } else {
                    existingData.push(row);
                    indexById.set(row.Id, row);
                    rowsAdded++;
                }
            }
        });
        // End timer
        let endTime = performance.now();
        let timeTaken = (endTime - startTime) / 1000;

        // Write report to file
        reportContent += `********************* File n°${index + 1} *************************\n`;
        reportContent += `- File: ${file}\n`;
        reportContent += `- Rows Added: ${rowsAdded}\n`;
        reportContent += `- Rows Updated: ${rowsUpdated}\n`;
        reportContent += `- Time taken: ${timeTaken.toFixed(3)} seconds\n`;
        reportContent += `- New total number of rows in database: ${
            existingData.length
          }\n`;
        reportContent += `At: ${date}\n\n`;
        fs.writeFileSync(reportFile, reportContent);
    });
// Write updated data to output CSV file
let csvData = Papa.unparse(existingData, { header: true });
fs.writeFileSync(outputFile, csvData);