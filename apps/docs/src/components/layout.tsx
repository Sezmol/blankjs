import { useEffect, useLayoutEffect, useState } from "react";
import { NavLink, Outlet, ScrollRestoration, useLocation } from "react-router";
import { Button, Dialog } from "@blankjs/react";
import { nav } from "../routes";
import { Logo } from "./logo";

type Theme = "dark" | "light";

const NavSections = () => (
  <nav className="docs-nav">
    {nav.map((section) => (
      <div key={section.title} className="docs-nav-section">
        <div className="docs-nav-heading">{section.title}</div>
        {section.items.map((item) => (
          <NavLink key={item.path} to={item.path} end className="docs-nav-link">
            {item.title}
          </NavLink>
        ))}
      </div>
    ))}
  </nav>
);

export const Layout = () => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("bk-docs-theme") as Theme | null) ?? "dark",
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-bk-theme", theme);
    localStorage.setItem("bk-docs-theme", theme);
  }, [theme]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);

    const page = nav
      .flatMap((section) => section.items)
      .find((item) => item.path === pathname);

    document.title =
      page && page.path !== "/" ? `${page.title} | blankjs` : "blankjs";
  }, [pathname]);

  return (
    <div className="docs">
      <ScrollRestoration />
      <header className="docs-header">
        <div className="docs-header-inner">
          <NavLink to="/" className="docs-logo">
            <Logo />
            blankjs
          </NavLink>

          <div className="docs-header-actions">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            >
              {theme === "dark" ? "Light" : "Dark"}
            </Button>

            <a
              className="docs-header-link"
              href="https://github.com/Sezmol/blankjs"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>

            <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
              <Dialog.Trigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="docs-menu-button"
                >
                  Menu
                </Button>
              </Dialog.Trigger>

              <Dialog.Content className="docs-menu-dialog">
                <Dialog.Title>Navigation</Dialog.Title>
                <NavSections />
                <Dialog.Close>Close</Dialog.Close>
              </Dialog.Content>
            </Dialog.Root>
          </div>
        </div>
      </header>

      <div className="docs-body">
        <aside className="docs-sidebar">
          <NavSections />
        </aside>

        <main className="docs-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
