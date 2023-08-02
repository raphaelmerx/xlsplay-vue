<template>
  <hot-table :settings="baseHotTableSettings" />
</template>

<script>
import { HotTable } from '@handsontable/vue3';

export default {
  components: {
    HotTable,
  },
  props: ['data'],
  data() {
    return {
      baseHotTableSettings: {
        data: this.data,
        rowHeaders: true,
        colHeaders: true,
        height: '100vh',
        licenseKey: 'non-commercial-and-evaluation', // for non-commercial use only
        dropdownMenu: true,
        manualColumnMove: true,
        manualRowMove: true,
        manualColumnResize: true,
        fixedRowsTop: 1,
        contextMenu: true,
      },
    };
  },
};
</script>

<style scoped></style>
