import type { ReactNode } from "react";
import { IntroductionPage } from "./pages/introduction";
import { GettingStartedPage } from "./pages/getting-started";
import { SelectPage } from "./pages/select";
import { DialogPage } from "./pages/dialog";
import { FieldPage } from "./pages/field";
import { FormPage } from "./pages/form";
import { NumberFieldPage } from "./pages/number-field";
import { SliderPage } from "./pages/slider";
import { PopoverPage } from "./pages/popover";
import { TooltipPage } from "./pages/tooltip";
import { AccordionPage } from "./pages/accordion";
import { ButtonPage } from "./pages/button";
import { CheckboxPage } from "./pages/checkbox";
import { SwitchPage } from "./pages/switch";
import { TabsPage } from "./pages/tabs";
import { TextInputPage } from "./pages/text-input";
import { TextareaPage } from "./pages/textarea";
import { PasswordFieldPage } from "./pages/password-field";

export type NavItem = {
  title: string;
  path: string;
  element: ReactNode;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const nav: NavSection[] = [
  {
    title: "Overview",
    items: [
      { title: "Introduction", path: "/", element: <IntroductionPage /> },
      {
        title: "Getting Started",
        path: "/getting-started",
        element: <GettingStartedPage />,
      },
    ],
  },
  {
    title: "Components",
    items: [
      {
        title: "Accordion",
        path: "/components/accordion",
        element: <AccordionPage />,
      },
      {
        title: "Button",
        path: "/components/button",
        element: <ButtonPage />,
      },
      {
        title: "Checkbox",
        path: "/components/checkbox",
        element: <CheckboxPage />,
      },
      { title: "Dialog", path: "/components/dialog", element: <DialogPage /> },
      { title: "Field", path: "/components/field", element: <FieldPage /> },
      { title: "Form", path: "/components/form", element: <FormPage /> },
      {
        title: "NumberField",
        path: "/components/number-field",
        element: <NumberFieldPage />,
      },
      {
        title: "PasswordField",
        path: "/components/password-field",
        element: <PasswordFieldPage />,
      },
      {
        title: "Popover",
        path: "/components/popover",
        element: <PopoverPage />,
      },
      { title: "Select", path: "/components/select", element: <SelectPage /> },
      {
        title: "Slider",
        path: "/components/slider",
        element: <SliderPage />,
      },
      {
        title: "Switch",
        path: "/components/switch",
        element: <SwitchPage />,
      },
      {
        title: "Tabs",
        path: "/components/tabs",
        element: <TabsPage />,
      },
      {
        title: "Textarea",
        path: "/components/textarea",
        element: <TextareaPage />,
      },
      {
        title: "TextInput",
        path: "/components/text-input",
        element: <TextInputPage />,
      },
      {
        title: "Tooltip",
        path: "/components/tooltip",
        element: <TooltipPage />,
      },
    ],
  },
];
