<template>
  <hot-table :settings="surveyHotTableSettings" />
</template>

<script>
import { HotTable } from '@handsontable/vue3';

export default {
  components: {
    HotTable,
  },
  props: ['data', 'colWidths', 'updateQuestionIds', 'questionIds'],
  data() {
    return {
      surveyHotTableSettings: {
        data: this.data,
        colWidths: this.colWidths,
        cells: this.surveyCellsOption(this.questionIds),
        contextMenu: this.surveyContextMenu,
        afterInit: this.updateQuestionIds,
        afterChange: this.surveyAfterChange,
      },
    };
  },
  methods: {
    // rest of your functions here...
  },
};
</script>

<style scoped></style>
