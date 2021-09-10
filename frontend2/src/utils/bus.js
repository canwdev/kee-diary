import Vue from 'vue'
const bus = new Vue()

export const BUS_SAVE_NOTES_START = 'DO_UPDATE_DB'

export function busEmitSaveNotes() {
  return new Promise((resolve) => {
    bus.$emit(BUS_SAVE_NOTES_START, resolve)
  })
}

export default bus
