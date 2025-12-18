<template>
  <div ref="editorContainer" :class="['h-full w-full overflow-hidden text-sm', theme === 'dark' ? 'theme-dark' : 'theme-light']"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { markdown } from '@codemirror/lang-markdown'
import { githubLight, githubDark } from '../themes/github'
import { linter } from '@codemirror/lint'
import { keymap } from '@codemirror/view'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { ViewPlugin, Decoration, WidgetType, placeholder as placeholderExt } from '@codemirror/view'
import type { DecorationSet } from '@codemirror/view'
import { RangeSetBuilder } from '@codemirror/state'
import * as markdownlintLib from 'markdownlint'
const markdownlint = (markdownlintLib as any).default || markdownlintLib

const props = defineProps<{
  modelValue: string
  theme?: 'light' | 'dark'
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur'): void
}>()

const editorContainer = ref<HTMLElement | null>(null)
let editorView: EditorView | null = null

// Header Badge Widget
class HeaderBadgeWidget extends WidgetType {
  level: number
  constructor(level: number) {
    super()
    this.level = level
  }

  toDOM() {
    const span = document.createElement("span")
    span.className = "header-badge"
    span.textContent = `H${this.level}`
    return span
  }
}

// Header Badge Plugin
const headerBadgePlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = this.buildDecorations(view)
  }

  update(update: any) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = this.buildDecorations(update.view)
    }
  }

  buildDecorations(view: EditorView) {
    const builder = new RangeSetBuilder<Decoration>()
    
    for (const { from, to } of view.visibleRanges) {
      for (let pos = from; pos <= to;) {
        const line = view.state.doc.lineAt(pos)
        const text = line.text
        const match = text.match(/^(#{1,6})\s/)
        
        if (match && match[1]) {
          const level = match[1].length
          const deco = Decoration.replace({
            widget: new HeaderBadgeWidget(level)
          })
          builder.add(line.from, line.from + match[0].length, deco)
        }
        pos = line.to + 1
      }
    }
    return builder.finish()
  }
}, {
  decorations: v => v.decorations
})

// Custom GFM Linter
const gfmLinter = linter((view) => {
  const content = view.state.doc.toString()
  const options = {
    strings: {
      content: content
    },
    config: {
      "default": true,
      "MD013": false, // Disable line length check
    }
  }

  const diagnostics: any[] = []
  
  // Run markdownlint synchronously
  const result = markdownlint.sync(options)
  
  if (result.content) {
    result.content.forEach((error: any) => {
      // Create diagnostic for each error
      // markdownlint returns line numbers (1-indexed). CodeMirror needs position (0-indexed).
      // We need to find the start and end position of the line.
      const lineInfo = view.state.doc.line(error.lineNumber)
      
      diagnostics.push({
        from: lineInfo.from,
        to: lineInfo.to,
        severity: 'error',
        message: `${error.ruleNames[0]}: ${error.ruleDescription}`,
        source: 'markdownlint'
      })
    })
  }

  return diagnostics
})



const initEditor = () => {
  if (!editorContainer.value) return

  const extensions = [
    basicSetup,
    markdown(),
    keymap.of([indentWithTab, ...defaultKeymap]),
    gfmLinter,
    headerBadgePlugin,
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        emit('update:modelValue', update.state.doc.toString())
      }
      if (update.focusChanged && !update.view.hasFocus) {
        emit('blur')
      }
    })
  ]

  if (props.placeholder) {
    extensions.push(placeholderExt(props.placeholder))
  }

  if (props.theme === 'dark') {
    extensions.push(githubDark)
  } else {
    extensions.push(githubLight)
  }
// ...

  const state = EditorState.create({
    doc: props.modelValue,
    extensions: extensions
  })

  editorView = new EditorView({
    state,
    parent: editorContainer.value
  })
}

onMounted(() => {
  initEditor()
})

onBeforeUnmount(() => {
  if (editorView) {
    editorView.destroy()
  }
})

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  if (editorView) {
    const currentValue = editorView.state.doc.toString()
    if (newValue !== currentValue) {
      editorView.dispatch({
        changes: { from: 0, to: currentValue.length, insert: newValue }
      })
    }
  }
})

// Watch for theme changes
watch(() => props.theme, () => {
  if (editorView) {
    // Re-initialize to apply theme cleanly
    editorView.destroy()
    initEditor()
  }
})

</script>

<style scoped>
/* Ensure the editor takes full height */
:deep(.cm-editor) {
  height: 100%;
}
:deep(.cm-scroller) {
  font-family: 'Fira Code', monospace; 
}

/* Rich Markdown Styling */
:deep(.cm-content) {
  font-family: 'Fira Code', monospace;
}

/* Headers */
/* Headers */
:deep(.cm-heading-1) {
  font-size: 2em;
  font-weight: bold;
  display: inline-block;
  margin-top: 0.5em;
  margin-bottom: 0.25em;
}
:deep(.cm-heading-2) {
  font-size: 1.5em;
  font-weight: bold;
  margin-top: 0.5em;
  margin-bottom: 0.25em;
}
:deep(.cm-heading-3) {
  font-size: 1.25em;
  font-weight: bold;
  margin-top: 0.5em;
  margin-bottom: 0.25em;
}
:deep(.cm-heading-4) {
  font-size: 1.1em;
  font-weight: bold;
}
:deep(.cm-heading-5) {
  font-size: 1em;
  font-weight: bold;
}
:deep(.cm-heading-6) {
  font-size: 1em;
  font-weight: bold;
}

/* Text Styling */
/* Text Styling */
:deep(.cm-strong) {
  font-weight: bold;
}
:deep(.cm-em) {
  font-style: italic;
}
:deep(.cm-link) {
  text-decoration: underline;
}
:deep(.cm-strikethrough) {
  text-decoration: line-through;
  opacity: 0.6;
}

/* Header Badge Styling */
/* Header Badge Styling */
:deep(.header-badge) {
  display: inline-block;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  padding: 0 6px;
  border-radius: 4px;
  margin-right: 8px;
  vertical-align: middle;
  height: 20px;
  line-height: 20px;
  transform: translateY(-2px); /* Align with larger text */
}

.theme-light :deep(.header-badge) {
  background-color: #0366d6; /* GitHub Blue */
}

.theme-dark :deep(.header-badge) {
  background-color: #1f6feb; /* GitHub Dark Blue */
}
</style>
