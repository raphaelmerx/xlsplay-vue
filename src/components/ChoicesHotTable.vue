<template>
  <hot-table ref="hotTableRef" :settings="choicesHotTableSettings" />
</template>

<script setup>
import { watch, ref, defineProps, computed, onMounted } from 'vue';
import { HotTable } from '@handsontable/vue3';
import { createCallbackInsertRow, commonHotTableSettings } from '../hottable_utils';
import { useSpreadsheetStore } from '../spreadsheetStore';

const spreadsheet = useSpreadsheetStore();
const hotTableRef = ref(null);

const choicesHotTableSettings = computed(() => ({
  ...commonHotTableSettings,
  colWidths: spreadsheet.colWidths.choices,
}));

watch(
  () => spreadsheet.data.choices,
  (newVal, oldVal) => {
    if (hotTableRef.value && hotTableRef.value.hotInstance) {
      console.log('loadData');
      hotTableRef.value.hotInstance.loadData(newVal);
    }
  },
);

onMounted(() => {
  if (hotTableRef.value && hotTableRef.value.hotInstance) {
    hotTableRef.value.hotInstance.loadData(spreadsheet.data.choices);
  }
});
</script>

<style scoped></style>
