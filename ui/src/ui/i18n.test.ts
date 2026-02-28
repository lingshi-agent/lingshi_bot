import { afterEach, describe, expect, it } from "vitest";
import { resolveLocale, tr } from "./i18n.ts";

type MutableGlobal = typeof globalThis & {
  LINGSHI_UI_LOCALE?: string;
  LINGSHI_LOCALE?: string;
  __LINGSHI_DESKTOP_BOOTSTRAP__?: { locale?: string };
};

function clearLocaleGlobals() {
  const g = globalThis as MutableGlobal;
  delete g.LINGSHI_UI_LOCALE;
  delete g.LINGSHI_LOCALE;
  delete g.__LINGSHI_DESKTOP_BOOTSTRAP__;
}

afterEach(() => {
  clearLocaleGlobals();
});

describe("resolveLocale", () => {
  it("normalizes zh and en variants", () => {
    (globalThis as MutableGlobal).LINGSHI_UI_LOCALE = "zh_CN";
    expect(resolveLocale()).toBe("zh-CN");

    (globalThis as MutableGlobal).LINGSHI_UI_LOCALE = "en";
    expect(resolveLocale()).toBe("en-US");
  });

  it("prefers desktop bootstrap locale", () => {
    (globalThis as MutableGlobal).LINGSHI_UI_LOCALE = "en-US";
    (globalThis as MutableGlobal).__LINGSHI_DESKTOP_BOOTSTRAP__ = { locale: "zh-CN" };
    expect(resolveLocale()).toBe("zh-CN");
  });

  it("falls back to default zh-CN for unknown locale", () => {
    (globalThis as MutableGlobal).LINGSHI_UI_LOCALE = "fr-FR";
    expect(resolveLocale()).toBe("zh-CN");
  });
});

describe("tr", () => {
  it("formats template params", () => {
    (globalThis as MutableGlobal).LINGSHI_UI_LOCALE = "en-US";
    expect(tr("config.unsavedChangesCount", { count: 3 })).toBe("3 unsaved changes");

    (globalThis as MutableGlobal).LINGSHI_UI_LOCALE = "zh-CN";
    expect(tr("config.unsavedChangesCount", { count: 3 })).toBe("3 处未保存的更改");
  });
});
