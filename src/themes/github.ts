import { EditorView } from '@codemirror/view'
import type { Extension } from '@codemirror/state'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'

// GitHub Light Theme
const githubLightColors = {
  background: "#ffffff",
  foreground: "#24292e",
  selection: "#BBDFFF",
  selectionMatch: "#BBDFFF",
  cursor: "#24292e",
  dropdownBackground: "#ffffff",
  dropdownBorder: "#e1e4e8",
  activeLine: "#f6f8fa",
  matchingBracket: "#34d058",
  keyword: "#d73a49",
  storage: "#d73a49",
  variable: "#24292e",
  parameter: "#24292e",
  function: "#6f42c1",
  string: "#032f62",
  constant: "#005cc5",
  type: "#6f42c1",
  class: "#6f42c1",
  number: "#005cc5",
  comment: "#6a737d",
  heading: "#005cc5",
  invalid: "#cb2431",
  regexp: "#032f62",
}

const githubLightTheme = EditorView.theme({
  "&": {
    color: githubLightColors.foreground,
    backgroundColor: githubLightColors.background
  },
  ".cm-content": {
    caretColor: githubLightColors.cursor
  },
  "&.cm-focused .cm-cursor": {
    borderLeftColor: githubLightColors.cursor
  },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
    backgroundColor: githubLightColors.selection
  },
  ".cm-panels": {
    backgroundColor: githubLightColors.dropdownBackground,
    color: githubLightColors.foreground
  },
  ".cm-panels.cm-panels-top": {
    borderBottom: "2px solid " + githubLightColors.dropdownBorder
  },
  ".cm-panels.cm-panels-bottom": {
    borderTop: "2px solid " + githubLightColors.dropdownBorder
  },
  ".cm-searchMatch": {
    backgroundColor: "#72a1ff59",
    outline: "1px solid #457dff"
  },
  ".cm-searchMatch.cm-searchMatch-selected": {
    backgroundColor: "#6199ff2f"
  },
  ".cm-activeLine": {
    backgroundColor: githubLightColors.activeLine
  },
  ".cm-selectionMatch": {
    backgroundColor: githubLightColors.selectionMatch
  },
  ".cm-matchingBracket, .cm-nonmatchingBracket": {
    backgroundColor: "#bad0f847",
    outline: "1px solid #457dff"
  },
  ".cm-gutters": {
    backgroundColor: githubLightColors.background,
    color: "#6a737d",
    border: "none"
  },
  ".cm-activeLineGutter": {
    backgroundColor: githubLightColors.activeLine
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "transparent",
    border: "none",
    color: "#ddd"
  },
  ".cm-tooltip": {
    border: "1px solid #e1e4e8",
    backgroundColor: githubLightColors.dropdownBackground
  },
  ".cm-tooltip .cm-tooltip-arrow:before": {
    borderTopColor: "transparent",
    borderBottomColor: "transparent"
  },
  ".cm-tooltip .cm-tooltip-arrow:after": {
    borderTopColor: githubLightColors.dropdownBackground,
    borderBottomColor: githubLightColors.dropdownBackground
  },
  ".cm-tooltip-autocomplete": {
    "& > ul > li[aria-selected]": {
      backgroundColor: githubLightColors.activeLine,
      color: githubLightColors.foreground
    }
  }
}, { dark: false })

const githubLightHighlightStyle = HighlightStyle.define([
  { tag: [t.standard(t.tagName), t.tagName, t.angleBracket], color: "#22863a" },
  { tag: [t.variableName, t.attributeName], color: githubLightColors.variable },
  { tag: [t.className, t.typeName], color: githubLightColors.type },
  { tag: [t.keyword], color: githubLightColors.keyword },
  { tag: [t.string, t.meta, t.regexp], color: githubLightColors.string },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: githubLightColors.function },
  { tag: [t.number, t.bool, t.null], color: githubLightColors.constant },
  { tag: [t.comment], color: githubLightColors.comment },
  { tag: [t.heading], color: githubLightColors.heading, fontWeight: "bold" },
  { tag: [t.invalid], color: githubLightColors.invalid },
  { tag: [t.strong], fontWeight: "bold" },
  { tag: [t.emphasis], fontStyle: "italic" },
  { tag: [t.strikethrough], textDecoration: "line-through" },
  { tag: [t.link], color: githubLightColors.constant, textDecoration: "underline" },
])

export const githubLight: Extension = [
  githubLightTheme,
  syntaxHighlighting(githubLightHighlightStyle)
]

// GitHub Dark Theme
const githubDarkColors = {
  background: "#0d1117",
  foreground: "#c9d1d9",
  selection: "#264f78",
  selectionMatch: "#264f78",
  cursor: "#c9d1d9",
  dropdownBackground: "#161b22",
  dropdownBorder: "#30363d",
  activeLine: "#161b22",
  matchingBracket: "#34d058",
  keyword: "#ff7b72",
  storage: "#ff7b72",
  variable: "#c9d1d9",
  parameter: "#c9d1d9",
  function: "#d2a8ff",
  string: "#a5d6ff",
  constant: "#79c0ff",
  type: "#d2a8ff",
  class: "#d2a8ff",
  number: "#79c0ff",
  comment: "#8b949e",
  heading: "#79c0ff",
  invalid: "#ff7b72",
  regexp: "#a5d6ff",
}

const githubDarkTheme = EditorView.theme({
  "&": {
    color: githubDarkColors.foreground,
    backgroundColor: githubDarkColors.background
  },
  ".cm-content": {
    caretColor: githubDarkColors.cursor
  },
  "&.cm-focused .cm-cursor": {
    borderLeftColor: githubDarkColors.cursor
  },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
    backgroundColor: githubDarkColors.selection
  },
  ".cm-panels": {
    backgroundColor: githubDarkColors.dropdownBackground,
    color: githubDarkColors.foreground
  },
  ".cm-panels.cm-panels-top": {
    borderBottom: "2px solid " + githubDarkColors.dropdownBorder
  },
  ".cm-panels.cm-panels-bottom": {
    borderTop: "2px solid " + githubDarkColors.dropdownBorder
  },
  ".cm-searchMatch": {
    backgroundColor: "#72a1ff59",
    outline: "1px solid #457dff"
  },
  ".cm-searchMatch.cm-searchMatch-selected": {
    backgroundColor: "#6199ff2f"
  },
  ".cm-activeLine": {
    backgroundColor: githubDarkColors.activeLine
  },
  ".cm-selectionMatch": {
    backgroundColor: githubDarkColors.selectionMatch
  },
  ".cm-matchingBracket, .cm-nonmatchingBracket": {
    backgroundColor: "#bad0f847",
    outline: "1px solid #457dff"
  },
  ".cm-gutters": {
    backgroundColor: githubDarkColors.background,
    color: "#8b949e",
    border: "none"
  },
  ".cm-activeLineGutter": {
    backgroundColor: githubDarkColors.activeLine
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "transparent",
    border: "none",
    color: "#ddd"
  },
  ".cm-tooltip": {
    border: "1px solid #30363d",
    backgroundColor: githubDarkColors.dropdownBackground
  },
  ".cm-tooltip .cm-tooltip-arrow:before": {
    borderTopColor: "transparent",
    borderBottomColor: "transparent"
  },
  ".cm-tooltip .cm-tooltip-arrow:after": {
    borderTopColor: githubDarkColors.dropdownBackground,
    borderBottomColor: githubDarkColors.dropdownBackground
  },
  ".cm-tooltip-autocomplete": {
    "& > ul > li[aria-selected]": {
      backgroundColor: githubDarkColors.activeLine,
      color: githubDarkColors.foreground
    }
  }
}, { dark: true })

const githubDarkHighlightStyle = HighlightStyle.define([
  { tag: [t.standard(t.tagName), t.tagName, t.angleBracket], color: "#7ee787" },
  { tag: [t.variableName, t.attributeName], color: githubDarkColors.variable },
  { tag: [t.className, t.typeName], color: githubDarkColors.type },
  { tag: [t.keyword], color: githubDarkColors.keyword },
  { tag: [t.string, t.meta, t.regexp], color: githubDarkColors.string },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: githubDarkColors.function },
  { tag: [t.number, t.bool, t.null], color: githubDarkColors.constant },
  { tag: [t.comment], color: githubDarkColors.comment },
  { tag: [t.heading], color: githubDarkColors.heading, fontWeight: "bold" },
  { tag: [t.invalid], color: githubDarkColors.invalid },
  { tag: [t.strong], fontWeight: "bold" },
  { tag: [t.emphasis], fontStyle: "italic" },
  { tag: [t.strikethrough], textDecoration: "line-through" },
  { tag: [t.link], color: githubDarkColors.constant, textDecoration: "underline" },
])

export const githubDark: Extension = [
  githubDarkTheme,
  syntaxHighlighting(githubDarkHighlightStyle)
]
