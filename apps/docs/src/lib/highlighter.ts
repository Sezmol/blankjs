import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

export type CodeLang = "tsx" | "bash" | "css";

let highlighterPromise: Promise<HighlighterCore> | undefined;

const getHighlighter = () => {
  highlighterPromise ??= createHighlighterCore({
    themes: [
      import("shiki/themes/github-dark-default.mjs"),
      import("shiki/themes/github-light-default.mjs"),
    ],
    langs: [
      import("shiki/langs/tsx.mjs"),
      import("shiki/langs/bash.mjs"),
      import("shiki/langs/css.mjs"),
    ],
    engine: createJavaScriptRegexEngine(),
  });

  return highlighterPromise;
};

export const highlight = async (code: string, lang: CodeLang) => {
  const highlighter = await getHighlighter();

  return highlighter.codeToHtml(code, {
    lang,
    themes: {
      light: "github-light-default",
      dark: "github-dark-default",
    },
    defaultColor: false,
  });
};
