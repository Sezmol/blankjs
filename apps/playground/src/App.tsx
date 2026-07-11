import { useEffect, useState } from "react";
import { Button } from "@blankjs/react";
import "@blankjs/react/styles.css";
import "./index.css";

import { ButtonSection } from "./sections/button-section";
import { TextInputSection } from "./sections/text-input-section";
import { PasswordFieldSection } from "./sections/password-field-section";
import { TextareaSection } from "./sections/textarea-section";
import { CheckboxSection } from "./sections/checkbox-section";
import { SwitchSection } from "./sections/switch-section";
import { RadioSection } from "./sections/radio-section";
import { SelectSection } from "./sections/select-section";
import { ComboboxSection } from "./sections/combobox-section";
import { MultiSelectSection } from "./sections/multi-select-section";
import { FormSection } from "./sections/form-section";
import { SizesSection } from "./sections/sizes-section";
import { TabsSection } from "./sections/tabs-section";

function App() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-bk-theme", theme);
  }, [theme]);

  return (
    <div className="pg-page" id="top">
      <header className="pg-header">
        <h1>blankjs</h1>
        <Button
          variant="ghost"
          onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        >
          theme: {theme}
        </Button>
      </header>

      <main className="pg-grid">
        <ButtonSection />
        <TextInputSection />
        <PasswordFieldSection />
        <TextareaSection />
        <CheckboxSection />
        <SwitchSection />
        <RadioSection />
        <SelectSection />
        <ComboboxSection />
        <MultiSelectSection />
        <FormSection />
        <TabsSection />
        <SizesSection />
      </main>
    </div>
  );
}

export default App;
