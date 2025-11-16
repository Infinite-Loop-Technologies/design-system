'use client';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';
/**
 * Deps for this one is intense: https://uiwjs.github.io/react-codemirror/
 */
const code = `console.log('TODO: Add syntax highlighting.');`;

/**
 * CodeMirror theme using ONLY CSS variables.
 * These point directly at your ShadCN/Tailwind tokens.
 */
export const myTheme = createTheme({
    theme: 'light', // doesn't matter; vars override everything
    settings: {
        background: 'var(--background)',
        backgroundImage: '',
        foreground: 'var(--foreground)',
        caret: 'var(--primary)',

        // selection
        selection: 'color-mix(in oklch, var(--primary) 25%, transparent)',
        selectionMatch: 'color-mix(in oklch, var(--primary) 25%, transparent)',

        // line highlight
        lineHighlight: 'color-mix(in oklch, var(--foreground) 8%, transparent)',

        // gutters
        gutterBackground: 'var(--background)',
        gutterForeground: 'var(--muted-foreground)',
    },

    styles: [
        { tag: t.comment, color: 'var(--muted-foreground)' },

        // variables & identifiers
        { tag: t.variableName, color: 'var(--primary)' },

        // strings
        {
            tag: [t.string, t.special(t.brace)],
            color: 'var(--accent-foreground)',
        },

        // literals
        {
            tag: [t.number, t.bool, t.null],
            color: 'var(--secondary-foreground)',
        },

        // keywords / operators
        { tag: t.keyword, color: 'var(--primary)' },
        { tag: t.operator, color: 'var(--foreground)' },

        // types / classes
        { tag: t.className, color: 'var(--foreground)' },
        { tag: t.definition(t.typeName), color: 'var(--foreground)' },
        { tag: t.typeName, color: 'var(--foreground)' },

        // jsx-ish tags
        { tag: t.angleBracket, color: 'var(--foreground)' },
        { tag: t.tagName, color: 'var(--primary)' },
        { tag: t.attributeName, color: 'var(--muted-foreground)' },
    ],
});

export default function CodeEditor() {
    return (
        <CodeMirror
            value={code}
            extensions={[
                markdown({
                    base: markdownLanguage,
                    codeLanguages: languages,
                }),
            ]}
            theme={myTheme}
        />
    );
}
