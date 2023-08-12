<template>
  <main>
    <div class="App">
      <splitpanes class="default-theme" :push-other-pages="true">
        <pane min-size="20" max-size="80" :push-other-panes="true">
          <div>
            <input accept=".xls,.xlsx" id="upload-button" type="file" @change="handleFileUpload" />
            Upload File
          </div>
          <div>OR</div>
          <div>
            <label for="example-file-select">Select an example file</label>
            <select id="example-file-select" v-model="selectedFile" @change="handleSelectChange">
              <option value="starter.xlsx">starter.xlsx</option>
              <option value="anc_visit.xlsx">anc_visit.xlsx</option>
              <option value="baseline_household_survey.xlsx">baseline_household_survey.xlsx</option>
              <option value="fatal_injury_surveillance_form.xlsx">fatal_injury_surveillance_form.xlsx</option>
              <option value="household_water_survey.xlsx">household_water_survey.xlsx</option>
              <option value="monthly_project_report.xlsx">monthly_project_report.xlsx</option>
              <option value="shelter_material_survey.xlsx">shelter_material_survey.xlsx</option>
              <option value="spraying_survey.xlsx">spraying_survey.xlsx</option>
            </select>
          </div>
          <div v-if="Object.keys(spreadsheet.data).length > 0" class="grid-item">
            <button class="btn-outlined" @click="handleFileDownload">Download</button>
          </div>
          <div v-if="Object.keys(spreadsheet.data).length > 0" class="grid-item">
            <button class="btn-contained" @click="handleFilePreview">Preview</button>
          </div>

          <v-tabs v-model="sheetName" grow>
            <v-tab v-for="(sheetName, index) in Object.keys(spreadsheet.data)" :key="index">
              {{ sheetName }}
            </v-tab>
          </v-tabs>
          <v-card-text>
            <v-window v-model="sheetName">
              <v-window-item
                v-for="(sheetName, index) in Object.keys(spreadsheet.data)"
                :key="`${selectedFile}_${index}`"
              >
                <SurveyHotTable v-if="sheetName === 'survey'" :colWidths="colWidths[sheetName]" />
                <ChoicesHotTable v-if="sheetName === 'choices'" :colWidths="colWidths[sheetName]" />
                <SettingsHotTable v-if="sheetName === 'settings'" :colWidths="colWidths[sheetName]" />
              </v-window-item>
            </v-window>
          </v-card-text>
        </pane>
        <pane min-size="20" max-size="80">
          <iframe v-if="previewUrl" :src="previewUrl" class="full-size-iframe"></iframe>
        </pane>
      </splitpanes>
    </div>
  </main>
</template>
<script setup>
import { useSpreadsheetStore } from './spreadsheetStore';
import { ref } from 'vue';
import { registerRenderer } from 'handsontable/renderers';
import { registerAllModules } from 'handsontable/registry';
import { saveAs } from 'file-saver';

import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

import { constructSpreadsheet, getSheetsData } from './utils';
import { beginGroupRowRenderer } from './hottable_utils';
import SurveyHotTable from './components/SurveyHotTable.vue';
import ChoicesHotTable from './components/ChoicesHotTable.vue';
import SettingsHotTable from './components/SettingsHotTable.vue';

registerAllModules();
registerRenderer('beginGroupRowRenderer', beginGroupRowRenderer);

const spreadsheet = useSpreadsheetStore();
const selectedFile = ref('');
const colWidths = ref({});
const sheetName = ref('survey');
const previewUrl = ref(null);

const handleSelectChange = async function (event) {
  const fileName = event.target.value;
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
    colWidths.value = sheetColumnWidths;
  };
  reader.readAsArrayBuffer(file);
};

const handleFileUpload = async function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = async evt => {
    const bstr = evt.target.result;
    const { sheetsData, sheetColumnWidths } = getSheetsData(bstr);
    spreadsheet.setData(sheetsData);
    colWidths.value = sheetColumnWidths;
  };
  reader.readAsArrayBuffer(file);
};

const handleFilePreview = async () => {
  const fileBlob = constructSpreadsheet(spreadsheet.data);

  let formData = new FormData();
  formData.append('file', fileBlob, 'spreadsheet.xlsx');
  try {
    const url =
      process.env.NODE_ENV === 'development'
        ? 'http://127.0.0.1:8000/api/xform/'
        : 'https://xlsform-online.fly.dev/api/xform/';
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    // if it's a 400 error, show the message in response.json()["error"]
    if (response.status === 400) {
      const data = await response.json();
      alert(data['error']);
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const xml_url = data.xml_url;
    previewUrl.value = `https://staging.enketo.getodk.org/preview?form=${xml_url}`;
  } catch (error) {
    alert('There was a problem with the request:', error);
  }
};
</script>

<style scoped>
.full-size-iframe {
  width: 400px;
  height: 100vh;
  border: none;
}
</style>
