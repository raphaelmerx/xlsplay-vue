<template>
  <hot-table ref="hotTableRef" :settings="hotTableSettings" />
</template>

<script setup>
import { watch, ref, defineProps, computed, onMounted } from 'vue';
import { HotTable } from '@handsontable/vue3';
import { commonHotTableSettings, loadDataToHotTableRef } from '../hottable_utils';
import { useSpreadsheetStore } from '../spreadsheetStore';
import { DefaultProps } from 'element-plus';

const spreadsheet = useSpreadsheetStore();
const hotTableRef = ref(null);
const { sheetName } = defineProps(['sheetName']);

const hotTableSettings = computed(() => ({
  ...commonHotTableSettings,
  colWidths: spreadsheet.colWidths[sheetName],
}));

watch(
  () => spreadsheet.data[sheetName],
  (newVal, oldVal) => {
    loadDataToHotTableRef(hotTableRef, newVal);
  },
);

onMounted(() => {
  loadDataToHotTableRef(hotTableRef, spreadsheet.data[sheetName]);
});
</script>

<style scoped></style>
