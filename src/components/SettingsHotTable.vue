<template>
  <hot-table ref="hotTableRef" :settings="hotTableSettings" />
</template>

<script setup>
import { watch, ref, defineProps, computed } from 'vue';
import { HotTable } from '@handsontable/vue3';
import { createCallbackInsertRow, commonHotTableSettings } from '../hottable_utils';
import { useSpreadsheetStore } from '../spreadsheetStore';

const spreadsheet = useSpreadsheetStore();
const hotTableRef = ref(null);

const props = defineProps({
  colWidths: Array,
});

const hotTableSettings = computed(() => ({
  ...commonHotTableSettings,
  colWidths: props.colWidths,
}));

watch(
  () => spreadsheet.data.settings,
  (newVal, oldVal) => {
    if (hotTableRef.value && hotTableRef.value.hotInstance) {
      hotTableRef.value.hotInstance.loadData(newVal);
    }
  },
);
</script>

<style scoped></style>
