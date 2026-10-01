"use client";

import { Menu, Moon, Sun } from "lucide-react";

type HeaderProps = {
  title: string;
  light: boolean;
  onToggleTheme: () => void;
  onToggleNavigation: () => void;
};

export function Header({ title, light, onToggleTheme, onToggleNavigation }: HeaderProps) {
  return (
    <header>
      <div className="breadcrumb">
        <button className="mobile-menu" aria-label="Toggle navigation" onClick={onToggleNavigation}>
          <Menu size={21} />
        </button>
        <span>Workspace</span>
        <span>/</span>
        <strong>{title}</strong>
      </div>
      <div className="header-right">
        <span className="local-label">
          <span />
          Local workspace
        </span>
        <button className="icon-button" aria-label="Toggle theme" onClick={onToggleTheme}>
          {light ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <span className="avatar small">AG</span>
      </div>
    </header>
  );
}
