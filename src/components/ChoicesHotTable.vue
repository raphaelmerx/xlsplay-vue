<template>
  <hot-table :settings="choicesHotTableSettings" />
</template>

<script>
import { HotTable } from '@handsontable/vue3';

export default {
  components: {
    HotTable,
  },
  props: ['data', 'colWidths', 'updateListNames'],
  data() {
    return {
      choicesHotTableSettings: {
        data: this.data,
        colWidths: this.colWidths,
        afterChange: this.choicesAfterChange,
      },
    };
  },
  methods: {
    // rest of your functions here...
  },
};
</script>

<style scoped></style>
