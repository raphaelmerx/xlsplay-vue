import { read, utils, write } from "xlsx";

export const xlsform_question_types = [
  "start",
  "end",
  "today",
  "deviceid",
  "phonenumber",
  "username",
  "email",
  "audit",
  "integer",
  "decimal",
  "range",
  "text",
  "select_one [list_name]",
  "select_multiple [list_name]",
  "select_one_from_file [file_name]",
  "select_multiple_from_file [file_name]",
  "rank [options]",
  "note",
  "geopoint",
  "geotrace",
  "geoshape",
  "date",
  "time",
  "dateTime",
  "image",
  "audio",
  "background-audio",
  "video",
  "file",
  "barcode",
  "calculate",
  "acknowledge",
  "hidden",
  "xml-external",
  "begin group",
  "end group",
  "begin repeat",
  "end repeat",
];

export const getSheetsData = (file) => {
  const wb = read(file, { type: "binary", cellStyles: true, dense: true });

  // Get all worksheets
  const sheetNames = wb.SheetNames;
  let sheetsData = {};
  let sheetColumnWidths = {};

  sheetNames.forEach((name) => {
    const ws = wb.Sheets[name];

    // minimum of colwidth and 100
    const colsWidths =
      ws["!cols"]?.map((col) => Math.max(col?.wpx / 2, 100) || 100) || [];
    sheetColumnWidths[name] = colsWidths;

    let data = utils.sheet_to_json(ws, { header: 1 });
    data = data.filter((row) => row.length);

    sheetsData[name] = data;
  });
  return { sheetsData, sheetColumnWidths };
};

export const constructSpreadsheet = (worksheets) => {
  const wb = utils.book_new();

  Object.keys(worksheets).forEach((sheetName) => {
    const ws = utils.aoa_to_sheet(worksheets[sheetName]);
    utils.book_append_sheet(wb, ws, sheetName);
  });

  const wbout = write(wb, { bookType: "xlsx", bookSST: true, type: "binary" });
  const buf = new ArrayBuffer(wbout.length);
  const view = new Uint8Array(buf);

  for (let i = 0; i < wbout.length; i++) view[i] = wbout.charCodeAt(i) & 0xff;
  const fileBlob = new Blob([buf], { type: "application/octet-stream" });
  return fileBlob;
};
