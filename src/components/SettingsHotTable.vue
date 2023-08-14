<template>
  <hot-table ref="hotTableRef" :settings="hotTableSettings" />
</template>

<script setup>
import { watch, ref, defineProps, computed, onMounted } from 'vue';
import { HotTable } from '@handsontable/vue3';
import { createCallbackInsertRow, commonHotTableSettings } from '../hottable_utils';
import { useSpreadsheetStore } from '../spreadsheetStore';

const spreadsheet = useSpreadsheetStore();
const hotTableRef = ref(null);

const hotTableSettings = computed(() => ({
  ...commonHotTableSettings,
  colWidths: spreadsheet.colWidths.settings,
}));

watch(
  () => spreadsheet.data.settings,
  (newVal, oldVal) => {
    if (hotTableRef.value && hotTableRef.value.hotInstance) {
      hotTableRef.value.hotInstance.loadData(newVal);
    }
  },
);

onMounted(() => {
  if (hotTableRef.value && hotTableRef.value.hotInstance) {
    hotTableRef.value.hotInstance.loadData(spreadsheet.data.settings);
  }
});
</script>

<style scoped></style>
