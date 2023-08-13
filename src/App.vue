<template>
  <el-config-provider>
    <main>
      <div class="App">
        <splitpanes class="default-theme" :push-other-pages="true">
          <pane min-size="20" max-size="80" :push-other-panes="true">
            <div class="buttons-container">
              <el-button @click="showFileModal = true">Load new file</el-button>
              <FileModal v-if="showFileModal" @close="showFileModal = false" />
              <div v-if="spreadsheet.data.survey" class="grid-item">
                <el-button @click="handleFileDownload">Download</el-button>
              </div>
              <div v-if="spreadsheet.data.survey" class="grid-item">
                <el-button type="primary" @click="handleFilePreview">Preview</el-button>
              </div>
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
                  :key="`${sheetName}_${index}`"
                >
                  <SurveyHotTable v-if="sheetName === 'survey'" />
                  <ChoicesHotTable v-if="sheetName === 'choices'" />
                  <SettingsHotTable v-if="sheetName === 'settings'" />
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
  </el-config-provider>
</template>
<script setup>
import { useSpreadsheetStore } from './spreadsheetStore';
import { ref } from 'vue';
import { registerRenderer } from 'handsontable/renderers';
import { registerAllModules } from 'handsontable/registry';
import { saveAs } from 'file-saver';

import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

import { beginGroupRowRenderer } from './hottable_utils';
import SurveyHotTable from './components/SurveyHotTable.vue';
import ChoicesHotTable from './components/ChoicesHotTable.vue';
import SettingsHotTable from './components/SettingsHotTable.vue';
import FileModal from './components/FileModal.vue';
import { constructSpreadsheet } from './utils';

registerAllModules();
registerRenderer('beginGroupRowRenderer', beginGroupRowRenderer);

const spreadsheet = useSpreadsheetStore();
const sheetName = ref('survey');
const previewUrl = ref(null);
const showFileModal = ref(false);

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

const handleFileDownload = async () => {
  const fileBlob = constructSpreadsheet(spreadsheet.data);
  saveAs(fileBlob, 'spreadsheet.xlsx');
};
</script>

<style scoped>
.full-size-iframe {
  width: 400px;
  height: 100vh;
  border: none;
}
</style>
