import type { PropsWithChildren } from "react";

export const Section = ({
  title,
  children,
}: PropsWithChildren<{ title: string }>) => (
  <section className="pg-card">
    <h2>{title}</h2>
    {children}
  </section>
);
