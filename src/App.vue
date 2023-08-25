<template>
  <el-config-provider>
    <main>
      <div class="App">
        <v-snackbar v-model="previewSnackbar" multi-line vertical location="bottom" timeout="-1">
          {{ previewText }}

          <template v-slot:actions>
            <v-btn color="red" variant="text" @click="previewSnackbar = false"> Close </v-btn>
          </template>
        </v-snackbar>
        <div class="split-container">
          <div class="pane" ref="leftPane">
            <div v-if="!spreadsheet.data.survey" class="intro-text">
              Welcome to XLSPlay! Start by loading an XLSForm:
            </div>
            <div class="buttons-container">
              <el-button @click="showFileModal = true" type="success" plain>
                <el-icon class="el-icon--left"><Plus /></el-icon>
                Load new file
              </el-button>
              <FileModal v-if="showFileModal" @close="showFileModal = false" />
              <div v-if="spreadsheet.data.survey" class="grid-item">
                <el-button @click="handleFileDownload" type="success" plain>
                  <el-icon class="el-icon--left"><Download /></el-icon>
                  Download
                </el-button>
              </div>
              <div v-if="spreadsheet.data.survey" class="grid-item">
                <el-button type="success" @click="handleFilePreview" :loading="isPreviewLoading">Preview</el-button>
              </div>
            </div>

            <v-tabs v-model="sheetName" v-if="spreadsheet.data.survey">
              <v-tab v-for="(sheetName, index) in Object.keys(spreadsheet.data)" :key="index">
                {{ sheetName }}
              </v-tab>
            </v-tabs>
            <v-window v-model="sheetName" v-if="spreadsheet.data.survey">
              <v-window-item v-for="(sheetName, index) in Object.keys(spreadsheet.data)" :key="`${sheetName}_${index}`">
                <SurveyHotTable v-if="sheetName === 'survey'" />
                <ChoicesHotTable v-if="sheetName === 'choices'" />
                <DefaultHotTable v-if="sheetName !== 'survey' && sheetName !== 'choices'" :sheetName="sheetName" />
              </v-window-item>
            </v-window>
          </div>
          <div class="resizer" @mousedown="startResize" v-if="previewUrl"></div>
          <div class="pane">
            <iframe v-if="previewUrl" :src="previewUrl" class="full-size-iframe"></iframe>
          </div>
        </div>
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

import { beginGroupRowRenderer } from './hottable_utils';
import SurveyHotTable from './components/SurveyHotTable.vue';
import ChoicesHotTable from './components/ChoicesHotTable.vue';
import DefaultHotTable from './components/DefaultHotTable.vue';
import FileModal from './components/FileModal.vue';
import { constructSpreadsheet } from './utils';

registerAllModules();
registerRenderer('beginGroupRowRenderer', beginGroupRowRenderer);

const spreadsheet = useSpreadsheetStore();
const sheetName = ref('survey');
const previewUrl = ref(null);
const showFileModal = ref(false);

const isPreviewLoading = ref(false);
const previewSnackbar = ref(false);
const previewText = ref('');

const handleFilePreview = async () => {
  const fileBlob = constructSpreadsheet(spreadsheet.data);

  let formData = new FormData();
  formData.append('file', fileBlob, 'spreadsheet.xlsx');
  try {
    isPreviewLoading.value = true;
    const url =
      process.env.NODE_ENV === 'development'
        ? 'http://127.0.0.1:8000/api/xform/'
        : 'https://xlsform-online.fly.dev/api/xform/';
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    isPreviewLoading.value = false;
    previewSnackbar.value = false;

    // if it's a 400 error, show the message in response.json()["error"]
    if (response.status === 400) {
      const data = await response.json();
      previewSnackbar.value = true;
      previewText.value = data['error'];
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const xml_url = data.xml_url;
    previewUrl.value = `https://staging.enketo.getodk.org/preview?form=${xml_url}`;
  } catch (error) {
    isPreviewLoading.value = false;
    previewSnackbar.value = true;
    previewText.value = error;
  }
};

const handleFileDownload = async () => {
  const fileBlob = constructSpreadsheet(spreadsheet.data);
  saveAs(fileBlob, 'spreadsheet.xlsx');
};

const leftPane = ref(null);

const startResize = event => {
  const performResize = event => {
    leftPane.value.style.width = `${event.clientX}px`;
  };

  const stopResize = () => {
    window.removeEventListener('mousemove', performResize);
    window.removeEventListener('mouseup', stopResize);
  };

  window.addEventListener('mousemove', performResize);
  window.addEventListener('mouseup', stopResize);
};
</script>

<style scoped>
.full-size-iframe {
  width: 400px;
  height: 100vh;
  border: none;
}
.split-container {
  display: flex;
}
@media (max-width: 768px) {
  .split-container {
    flex-direction: column;
  }
}

.pane {
  flex-grow: 1;
  overflow: hidden;
}

.resizer {
  cursor: ew-resize;
  width: 5px; /* Adjust as needed */
  background-color: #ccc; /* Adjust as needed */
}

.intro-text {
  margin-top: 1rem;
}
</style>
