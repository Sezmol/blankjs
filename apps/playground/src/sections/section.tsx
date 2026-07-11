import type { PropsWithChildren } from "react";

export const Section = ({
  title,
  className,
  children,
}: PropsWithChildren<{ title: string; className?: string }>) => (
  <section className={["pg-card", className].filter(Boolean).join(" ")}>
    <h2>{title}</h2>
    {children}
  </section>
);
