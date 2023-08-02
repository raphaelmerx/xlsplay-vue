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
