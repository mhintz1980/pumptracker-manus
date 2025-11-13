import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "./useTheme";

const originalMatchMedia = window.matchMedia;

describe("useTheme", () => {
  beforeEach(() => {
    document.documentElement.className = "";
    localStorage.clear();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockReturnValue({
        matches: true,
        media: "",
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    });
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  it("initializes from localStorage when available", () => {
    localStorage.setItem("pt-theme", "light");
    const { result } = renderHook(() => useTheme());

    expect(result.current.mode).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });

  it("toggles between dark and light modes", () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.toggle());
    expect(result.current.mode).toBe("light");
    expect(localStorage.getItem("pt-theme")).toBe("light");
    expect(document.documentElement.classList.contains("light")).toBe(true);

    act(() => result.current.toggle());
    expect(result.current.mode).toBe("dark");
    expect(localStorage.getItem("pt-theme")).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
