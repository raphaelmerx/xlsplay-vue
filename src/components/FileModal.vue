<template>
  <el-dialog v-model="dialogVisible" title="Load a new XLSForm">
    <div class="buttons-container">
      <div>
        <el-upload
          v-model:file-list="fileList"
          :show-file-list="false"
          :auto-upload="false"
          accept=".xlsx, .xls"
          @change="handleFileUpload"
        >
          <el-button type="success" plain>
            <el-icon class="el-icon--left"><Upload /></el-icon>
            Upload File
          </el-button>
        </el-upload>
      </div>
      <div>OR</div>
      <div>
        <el-select
          v-model="selectedFile"
          id="example-file-select"
          class="m-2"
          placeholder="Select an example file"
          @change="handleSelectChange"
        >
          <el-option value="starter.xlsx">starter.xlsx</el-option>
          <el-option value="anc_visit.xlsx">anc_visit.xlsx</el-option>
          <el-option value="baseline_household_survey.xlsx">baseline_household_survey.xlsx</el-option>
          <el-option value="fatal_injury_surveillance_form.xlsx">fatal_injury_surveillance_form.xlsx</el-option>
          <el-option value="household_water_survey.xlsx">household_water_survey.xlsx</el-option>
          <el-option value="monthly_project_report.xlsx">monthly_project_report.xlsx</el-option>
          <el-option value="shelter_material_survey.xlsx">shelter_material_survey.xlsx</el-option>
          <el-option value="spraying_survey.xlsx">spraying_survey.xlsx</el-option>
        </el-select>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Done</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { getSheetsData } from '../utils';
import { useSpreadsheetStore } from '../spreadsheetStore';

const spreadsheet = useSpreadsheetStore();

const dialogVisible = ref(true);
const fileList = ref([]);
const selectedFile = ref(null);

const handleFileUpload = async function (file) {
  if (!file?.raw) return;
  const reader = new FileReader();
  reader.onload = async evt => {
    const bstr = evt.target.result;
    const { sheetsData, sheetColumnWidths } = getSheetsData(bstr);
    spreadsheet.setData(sheetsData);
    spreadsheet.setColWidths(sheetColumnWidths);
  };
  reader.readAsArrayBuffer(file.raw);
};

const handleSelectChange = async function (fileName) {
  selectedFile.value = fileName;
  if (!fileName) return;

  const response = await fetch(`/xlsform_examples/${fileName}`);
  const blob = await response.blob();
  var file = new File([blob], fileName, {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const reader = new FileReader();
  reader.onload = async evt => {
    const bstr = evt.target.result;
    const { sheetsData, sheetColumnWidths } = getSheetsData(bstr);
    spreadsheet.setData(sheetsData);
    spreadsheet.setColWidths(sheetColumnWidths);
  };
  reader.readAsArrayBuffer(file);
};
</script>

<style scoped></style>
