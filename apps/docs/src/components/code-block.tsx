import { useEffect, useState } from "react";
import { highlight, type CodeLang } from "../lib/highlighter";

type CodeBlockProps = {
  code: string;
  lang?: CodeLang;
};

export const CodeBlock = ({ code, lang = "tsx" }: CodeBlockProps) => {
  const [html, setHtml] = useState<string>();
  const trimmed = code.trim();

  useEffect(() => {
    let active = true;

    highlight(trimmed, lang).then((result) => {
      if (active) setHtml(result);
    });

    return () => {
      active = false;
    };
  }, [trimmed, lang]);

  if (!html) {
    return (
      <div className="docs-code">
        <pre>
          <code>{trimmed}</code>
        </pre>
      </div>
    );
  }

  return <div className="docs-code" dangerouslySetInnerHTML={{ __html: html }} />;
};
