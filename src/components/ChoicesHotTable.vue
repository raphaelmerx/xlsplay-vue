<template>
  <hot-table ref="hotTableRef" :settings="choicesHotTableSettings" />
</template>

<script setup>
import { watch, ref, defineProps, computed, onMounted } from 'vue';
import { HotTable } from '@handsontable/vue3';
import { commonHotTableSettings, loadDataToHotTableRef } from '../hottable_utils';
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
    loadDataToHotTableRef(hotTableRef, newVal);
  },
);

onMounted(() => {
  loadDataToHotTableRef(hotTableRef, spreadsheet.data.choices);
});
</script>

<style scoped></style>
