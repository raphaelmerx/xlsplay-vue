<template>
  <hot-table ref="hotTableRef" :settings="surveyHotTableSettings" />
</template>

<script setup>
import { HotTable } from '@handsontable/vue3';
import { xlsform_question_types } from '../utils';
import { createCallbackInsertRow, commonHotTableSettings } from '../hottable_utils';
import { ContextMenu } from 'handsontable/plugins/contextMenu';
import { watch, ref, defineProps, computed } from 'vue';
import { useSpreadsheetStore } from '../spreadsheetStore';

const props = defineProps({
  colWidths: Array, // or another appropriate type, depending on your structure
  // Other props as needed
});

const spreadsheet = useSpreadsheetStore();
const hotTableRef = ref(null);

const surveyHotTableSettings = computed(() => ({
  ...commonHotTableSettings,
  colWidths: props.colWidths,
  cells: surveyCellsOption(spreadsheet.questionIds),
  contextMenu: surveyContextMenu,
}));

watch(
  () => spreadsheet.data.survey,
  (newVal, oldVal) => {
    if (hotTableRef.value && hotTableRef.value.hotInstance) {
      hotTableRef.value.hotInstance.loadData(newVal);
    }
  },
);

const surveyCellsOption = function (questionIds) {
  return function (row, col) {
    const cellProperties = {};

    // colour highlighting for groups and repeats
    if (['begin group', 'begin repeat', 'end group', 'end repeat'].indexOf(this.instance.getDataAtCell(row, 0) > -1)) {
      cellProperties.renderer = 'beginGroupRowRenderer';
    }

    // autocomplete using question ids
    if (col === 0) {
      cellProperties.type = 'autocomplete';
      cellProperties.source = xlsform_question_types.concat(
        spreadsheet.listNames.map(listName => `select_one ${listName}`),
      );
    } else if (col >= 2) {
      cellProperties.type = 'autocomplete';
      cellProperties.source = function (query, process) {
        if (query.includes('${')) {
          process(spreadsheet.questionIds.map(value => '${' + value + '}'));
        }
      };
    }

    return cellProperties;
  };
};

const surveyContextMenu = {
  items: {
    insert_question: {
      name: 'Insert question',
      submenu: {
        items: [
          {
            key: 'insert_question:text',
            name: 'Text',
            callback: createCallbackInsertRow(['text', 'question_id', 'Question Label']),
          },
          {
            key: 'insert_question:select_one',
            name: 'Select one',
            callback: createCallbackInsertRow(['select_one [list_name]', 'question_id', 'Question Label']),
          },
          {
            key: 'insert_question:geopoint',
            name: 'GPS point',
            callback: createCallbackInsertRow(['geopoint', 'store_gps', 'Collect the GPS coordinates of this store']),
          },
          {
            key: 'insert_question:geotrace',
            name: 'GPS trace',
            callback: createCallbackInsertRow(['geotrace', 'pipe', 'Pipeline']),
          },
          {
            key: 'insert_question:image',
            name: 'Image',
            callback: createCallbackInsertRow(['image', 'img', 'Upload an image']),
          },
          {
            key: 'insert_question:audio',
            name: 'Audio',
            callback: createCallbackInsertRow(['audio', 'animal_sound', 'Upload an audio']),
          },
        ],
      },
    },
    insert_group: {
      name: 'Insert group',
      callback: function callback() {
        var latestSelection = this.getSelectedRangeLast().getBottomRightCorner();
        this.alter('insert_row_below', latestSelection.row, 3, 'ContextMenu.rowBelow');

        var groupStartIndex = latestSelection.row + 1;
        this.populateFromArray(groupStartIndex, 0, [['begin group', 'group_id', 'Group label']]);
        this.populateFromArray(groupStartIndex + 1, 0, [['text', 'text_question_id', 'Text question label']]);
        this.populateFromArray(groupStartIndex + 2, 0, [['end group', '', '']]);
      },
    },
    insert_repeat: {
      name: 'Insert repeat',
      callback: function callback() {
        var latestSelection = this.getSelectedRangeLast().getBottomRightCorner();
        this.alter('insert_row_below', latestSelection.row, 3, 'ContextMenu.rowBelow');

        var repeatStartIndex = latestSelection.row + 1;
        this.populateFromArray(repeatStartIndex, 0, [['begin repeat', 'repeat_id', '']]);
        this.populateFromArray(repeatStartIndex + 1, 0, [['text', 'text_question_id', 'Text question label']]);
        this.populateFromArray(repeatStartIndex + 2, 0, [['end repeat', '', '']]);
      },
    },
    sp0: ContextMenu.SEPARATOR,
    row_above: {},
    row_below: {},
    sp1: ContextMenu.SEPARATOR,
    col_left: {},
    col_right: {},
    sp2: ContextMenu.SEPARATOR,
    remove_row: {},
    remove_col: {},
    sp3: ContextMenu.SEPARATOR,
    undo: {},
    redo: {},
    sp4: ContextMenu.SEPARATOR,
    alignment: {},
    copy: {},
    cut: {},
    clear_custom: {
      name: 'Clear all cells (custom)',
      callback: function () {
        this.clear();
      },
    },
  },
};
</script>

<style scoped></style>
