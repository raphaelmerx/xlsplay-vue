<script setup>
import HelloWorld from './components/HelloWorld.vue';
import TheWelcome from './components/TheWelcome.vue';
</script>

<template>
  <main>
    <div class="App">
      <div>
        <input
          accept=".xls,.xlsx"
          style="display: none"
          id="raised-button-file"
          type="file"
          @change="handleFileUpload"
        />
        <label htmlFor="raised-button-file">
          <Button variant="outlined" component="span"> Upload File </Button>
        </label>
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
      <div v-if="Object.keys(hotData).length > 0" class="grid-item">
        <button class="btn-outlined" @click="handleFileDownload">Download</button>
      </div>
      <div v-if="Object.keys(hotData).length > 0" class="grid-item">
        <button class="btn-contained" @click="handleFilePreview">Preview</button>
      </div>

      <v-tabs v-model="activeTab" grow>
        <v-tab v-for="(sheetName, index) in Object.keys(hotData)" :key="index">
          {{ sheetName }}
        </v-tab>

        <v-tab-item v-for="(sheetName, index) in Object.keys(hotData)" :key="`${selectedFile}_${index}`">
          <SurveyHotTable
            v-if="sheetName === 'survey'"
            :data="hotData[sheetName]"
            :colWidths="colWidths[sheetName]"
            :updateQuestionIds="updateQuestionIds"
            :questionIds="questionIds"
            :listNames="listNames"
          />
          <ChoicesHotTable
            v-if="sheetName === 'choices'"
            :data="hotData[sheetName]"
            :colWidths="colWidths[sheetName]"
            :updateListNames="updateListNames"
          />
          <BaseHotTable v-if="sheetName !== 'survey' && sheetName !== 'choices'" :data="hotData[sheetName]" />
        </v-tab-item>
      </v-tabs>
    </div>
  </main>
</template>

<script>
import BaseHotTable from './components/BaseHotTable.vue';
import SurveyHotTable from './components/SurveyHotTable.vue';
import ChoicesHotTable from './components/ChoicesHotTable.vue';

import { registerRenderer } from 'handsontable/renderers';
import { registerAllModules } from 'handsontable/registry';
import { constructSpreadsheet, getSheetsData } from './utils';
import { beginGroupRowRenderer } from './hottable_utils';
import { saveAs } from 'file-saver';

registerAllModules();
registerRenderer('beginGroupRowRenderer', beginGroupRowRenderer);

export default {
  data() {
    return {
      hotData: {},
      colWidths: {},
      selectedFile: '',
      previewUrl: '',
      questionIds: [],
      listNames: [],
    };
  },
  methods: {
    updateQuestionIds() {
      // implementation
    },
    updateListNames() {
      // implementation
    },
    handleFileUpload(e) {
      // implementation
    },
    handleSelectChange(event) {
      // implementation
    },
    handleFileDownload() {
      // implementation
    },
    handleFilePreview() {
      // implementation
    },
  },
};
</script>

<style scoped>
/* your styles here */
</style>
