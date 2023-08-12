import { textRenderer } from 'handsontable/renderers';

export const beginGroupRowRenderer = function (instance, td, row, col, prop, value, cellProperties) {
  textRenderer.apply(this, arguments); // Use the default text renderer first

  const rowData = instance.getDataAtRow(row); // Get data for the row

  if (rowData[0] === 'begin group') {
    td.style.backgroundColor = '#FDE9D9';
  } else if (rowData[0] === 'end group') {
    td.style.backgroundColor = '#FEF4EC';
  } else if (rowData[0] === 'begin repeat') {
    td.style.backgroundColor = '#E5DFEC';
  } else if (rowData[0] === 'end repeat') {
    td.style.backgroundColor = '#F5F2F7';
  }
};

export const commonHotTableSettings = {
  rowHeaders: true,
  colHeaders: true,
  height: '100vh',
  licenseKey: 'non-commercial-and-evaluation', // for non-commercial use only
  dropdownMenu: true,
  manualColumnMove: true,
  manualRowMove: true,
  manualColumnResize: true,
  fixedRowsTop: 1,
  contextMenu: true,
};

export const createCallbackInsertRow = row => {
  return function () {
    var latestSelection = this.getSelectedRangeLast().getBottomRightCorner();
    this.alter('insert_row_below', latestSelection.row, 1, 'ContextMenu.rowBelow');
    var newRowIndex = latestSelection.row + 1;
    this.populateFromArray(newRowIndex, 0, [row]);
  };
};
