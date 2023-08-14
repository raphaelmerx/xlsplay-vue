<template>
  <hot-table ref="hotTableRef" :settings="hotTableSettings" />
</template>

<script setup>
import { watch, ref, defineProps, computed, onMounted } from 'vue';
import { HotTable } from '@handsontable/vue3';
import { commonHotTableSettings, loadDataToHotTableRef } from '../hottable_utils';
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
    loadDataToHotTableRef(hotTableRef, newVal);
  },
);

onMounted(() => {
  loadDataToHotTableRef(hotTableRef, spreadsheet.data.settings);
});
</script>

<style scoped></style>
