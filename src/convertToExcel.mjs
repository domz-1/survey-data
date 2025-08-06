import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import {Data} from './json_data.js';
import { fileURLToPath } from 'url';
// Get current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'final_files');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Define column names (same as in your React component)
const names = [
  "gender", "region", "age", "city", "q1_rating", "q1_reason",
  "q2_rating", "q2_reason", "q2_reason-Comment", "q3_rating",
  "q3_reason", "q4_1_rating", "q5_1_rating", "rating_outside_توفر المنتجات البترولية",
  "rating_outside_المسافات بين المحطات", "rating_outside_النظافة العامة لمرافق المحطة",
  "rating_outside_نظافة وصيانة المسجد", "rating_outside_نظافة دورات المياه",
  "rating_outside_مظهر العاملين", "rating_outside_تنوع العلامات التجارية (مطاعم ومقاهي)",
  "rating_outside_مستوى التموينات", "rating_outside_خدمات السيارات (مغسلة - تغيير زيوت...)",
  "rating_inside_توفر المنتجات البترولية", "rating_inside_المسافات بين المحطات",
  "rating_inside_النظافة العامة لمرافق المحطة", "rating_inside_توفر المصليات",
  "rating_inside_توفر دورات المياه", "rating_inside_مظهر العاملين",
  "rating_inside_التموينات", "rating_inside_خدمة تعبئة الماء والهواء المجانية",
  "question1", "HappendAt", "InstanceId"
];

// Function to format date from /Date(timestamp)/ format
function formatDate(dateString) {
  if (typeof dateString === "string" && dateString.includes("/Date(")) {
    const timestamp = parseInt(dateString.replace("/Date(", "").replace(")/", ""));
    const date = new Date(timestamp);
    return date.toLocaleString();
  }
  return dateString;
}

// Function to process array values
function processArrayValue(value) {
  if (Array.isArray(value)) {
    return value.join('\n');
  }
  return value;
}

// Function to create Excel file
async function createExcelFile() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Survey Data');

  // Add headers
  const headers = ['ID', ...names];
  worksheet.addRow(headers);

  // Add data rows
  Data.forEach((item, index) => {
    const row = [index + 1]; // ID column
    
    names.forEach((name) => {
      if (!item[name]) {
        row.push('');
      } else if (name === 'HappendAt') {
        row.push(formatDate(item[name]));
      } else if (Array.isArray(item[name])) {
        row.push(processArrayValue(item[name]));
      } else {
        row.push(item[name]);
      }
    });

    worksheet.addRow(row);
  });

  // Style the worksheet
  worksheet.columns.forEach((column, index) => {
    column.width = index === 0 ? 5 : 20; // ID column narrower
    if (index > 0 && names[index - 1].includes('rating')) {
      column.width = 15;
    }
  });

  // Save Excel file
  const excelPath = path.join(outputDir, 'survey_data.xlsx');
  await workbook.xlsx.writeFile(excelPath);
  console.log(`Excel file created at: ${excelPath}`);
}

// Function to create CSV file
function createCSVFile() {
  let csvContent = '';

  // Add headers
  csvContent += 'ID,' + names.join(',') + '\n';

  // Add data rows
  Data.forEach((item, index) => {
    const row = [index + 1]; // ID column
    
    names.forEach((name) => {
      if (!item[name]) {
        row.push('');
      } else if (name === 'HappendAt') {
        row.push(`"${formatDate(item[name])}"`);
      } else if (Array.isArray(item[name])) {
        row.push(`"${processArrayValue(item[name])}"`);
      } else {
        // Escape quotes in CSV
        const value = String(item[name]).replace(/"/g, '""');
        row.push(`"${value}"`);
      }
    });

    csvContent += row.join(',') + '\n';
  });

  // Save CSV file
  const csvPath = path.join(outputDir, 'survey_data.csv');
  fs.writeFileSync(csvPath, csvContent);
  console.log(`CSV file created at: ${csvPath}`);
}

// Run both functions
(async () => {
  try {
    await createExcelFile();
    createCSVFile();
    console.log('Conversion completed successfully!');
  } catch (error) {
    console.error('Error during conversion:', error);
  }
})();