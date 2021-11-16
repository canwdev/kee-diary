<template>
  <div id="code-container" style="height:100%;"></div>
</template>

<script>
import * as monaco from 'monaco-editor'
import {MonacoMarkdownExtension} from 'monaco-markdown'
import {mapGetters} from 'vuex'

export default {
  name: 'DetailEditor',
  props: {
    fontSize: {
      type: [Number, String],
      default: null
    },
    fontFamily: {
      type: String,
      default: null
    },
  },
  computed: {
    ...mapGetters([
      'editorTheme',
    ]),
  },
  watch: {
    fontSize() {
      this.setFontSize()
    },
    fontFamily() {
      this.setFontFamily()
    },
    editorTheme(nv) {
      this.editor.updateOptions({
        theme: nv
      })
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    initCodeEditor(editorValue) {
      const container = document.getElementById('code-container')

      const editor = monaco.editor.create(container, {
        value: editorValue,
        lineNumbers: 'off',
        language: 'markdown',
        theme: this.editorTheme,
        wordWrap: true,
        minimap: {
          enabled: false
        },
        scrollbar: {
          alwaysConsumeMouseWheel: false
        },
        quickSuggestions: false
      })
      this.editor = editor

      const mdExtension = new MonacoMarkdownExtension()
      mdExtension.activate(editor)

      // editor.setSize(null, '100%') // set height
      // this.setFontFamily(editor)
      this.setFontSize()
      this.fontFamily && this.setFontFamily(editor)

      editor.onDidChangeModelContent(event => {
        this.$emit('onChange', event)
      })
    },
    setFontSize() {
      this.editor.updateOptions({
        fontSize: this.fontSize
      })
    },
    setFontFamily() {
      this.editor.updateOptions({
        fontFamily: this.fontFamily
      })
    },
    getEditor() {
      return this.editor
    },
    getValue() {
      return this.editor.getValue()
    },
    handleResize() {
      if (this.editor) {
        this.editor.layout()
      }
    }
  }
}
</script>

<style scoped>

</style>
