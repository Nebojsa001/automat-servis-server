const xlsx = require("xlsx");
const fs = require("fs");

// Učitaj Excel fajl
const workbook = xlsx.readFile("automat-servis-svi-korisnici.xlsx");

// Kreiraj prazan objekat za podatke
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets["BROD"];

// Konvertuj sheet u JSON format
const data = xlsx.utils.sheet_to_json(sheet);

console.log(data);
fs.writeFileSync("podaci.json", JSON.stringify(data, null, 2));
