import { defineStore } from 'pinia';

export const useSpreadsheetStore = defineStore({
  id: 'spreadsheet',
  state: () => ({
    data: {
      survey: undefined,
      choices: undefined,
      settings: undefined,
    },
    isUpdating: false,
  }),
  actions: {
    setSheetData(sheetName, data) {
      if (!this.isUpdating) {
        this.isUpdating = true;
        this.data[sheetName] = data;
        this.isUpdating = false;
      }
    },
    setData(allSheetData) {
      Object.keys(allSheetData).forEach(sheetName => {
        this.setSheetData(sheetName, allSheetData[sheetName]);
      });
    },
  },
  getters: {
    listNames() {
      let listNames = this.data.choices
        ?.slice(1)
        .map(row => row[0])
        .filter(Boolean);
      return [...new Set(listNames)];
    },
    questionIds() {
      return this.data.survey
        ?.slice(1)
        .map(row => row[1])
        .filter(Boolean)
        .reverse();
    },
  },
});
