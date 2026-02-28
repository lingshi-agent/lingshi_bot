import path from "node:path";
import { describe, expect, it } from "vitest";
import { resolveGatewayStateDir } from "./paths.js";

describe("resolveGatewayStateDir", () => {
  it("uses the default state dir when no overrides are set", () => {
    const env = { HOME: "/Users/test" };
    expect(resolveGatewayStateDir(env)).toBe(path.join("/Users/test", ".lingshi"));
  });

  it("appends the profile suffix when set", () => {
    const env = { HOME: "/Users/test", LINGSHI_PROFILE: "rescue" };
    expect(resolveGatewayStateDir(env)).toBe(path.join("/Users/test", ".lingshi-rescue"));
  });

  it("treats default profiles as the base state dir", () => {
    const env = { HOME: "/Users/test", LINGSHI_PROFILE: "Default" };
    expect(resolveGatewayStateDir(env)).toBe(path.join("/Users/test", ".lingshi"));
  });

  it("uses LINGSHI_STATE_DIR when provided", () => {
    const env = { HOME: "/Users/test", LINGSHI_STATE_DIR: "/var/lib/lingshi" };
    expect(resolveGatewayStateDir(env)).toBe(path.resolve("/var/lib/lingshi"));
  });

  it("expands ~ in LINGSHI_STATE_DIR", () => {
    const env = { HOME: "/Users/test", LINGSHI_STATE_DIR: "~/lingshi-state" };
    expect(resolveGatewayStateDir(env)).toBe(path.resolve("/Users/test/lingshi-state"));
  });

  it("preserves Windows absolute paths without HOME", () => {
    const env = { LINGSHI_STATE_DIR: "C:\\State\\lingshi" };
    expect(resolveGatewayStateDir(env)).toBe("C:\\State\\lingshi");
  });
});
