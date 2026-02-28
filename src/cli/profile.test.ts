import path from "node:path";
import { describe, expect, it } from "vitest";
import { formatCliCommand } from "./command-format.js";
import { applyCliProfileEnv, parseCliProfileArgs } from "./profile.js";

describe("parseCliProfileArgs", () => {
  it("leaves gateway --dev for subcommands", () => {
    const res = parseCliProfileArgs([
      "node",
      "lingshi",
      "gateway",
      "--dev",
      "--allow-unconfigured",
    ]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBeNull();
    expect(res.argv).toEqual(["node", "lingshi", "gateway", "--dev", "--allow-unconfigured"]);
  });

  it("still accepts global --dev before subcommand", () => {
    const res = parseCliProfileArgs(["node", "lingshi", "--dev", "gateway"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("dev");
    expect(res.argv).toEqual(["node", "lingshi", "gateway"]);
  });

  it("parses --profile value and strips it", () => {
    const res = parseCliProfileArgs(["node", "lingshi", "--profile", "work", "status"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("work");
    expect(res.argv).toEqual(["node", "lingshi", "status"]);
  });

  it("rejects missing profile value", () => {
    const res = parseCliProfileArgs(["node", "lingshi", "--profile"]);
    expect(res.ok).toBe(false);
  });

  it("rejects combining --dev with --profile (dev first)", () => {
    const res = parseCliProfileArgs(["node", "lingshi", "--dev", "--profile", "work", "status"]);
    expect(res.ok).toBe(false);
  });

  it("rejects combining --dev with --profile (profile first)", () => {
    const res = parseCliProfileArgs(["node", "lingshi", "--profile", "work", "--dev", "status"]);
    expect(res.ok).toBe(false);
  });
});

describe("applyCliProfileEnv", () => {
  it("fills env defaults for dev profile", () => {
    const env: Record<string, string | undefined> = {};
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    const expectedStateDir = path.join("/home/peter", ".lingshi-dev");
    expect(env.LINGSHI_PROFILE).toBe("dev");
    expect(env.LINGSHI_STATE_DIR).toBe(expectedStateDir);
    expect(env.LINGSHI_CONFIG_PATH).toBe(path.join(expectedStateDir, "lingshi.json"));
    expect(env.LINGSHI_GATEWAY_PORT).toBe("19001");
  });

  it("does not override explicit env values", () => {
    const env: Record<string, string | undefined> = {
      LINGSHI_STATE_DIR: "/custom",
      LINGSHI_GATEWAY_PORT: "19099",
    };
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    expect(env.LINGSHI_STATE_DIR).toBe("/custom");
    expect(env.LINGSHI_GATEWAY_PORT).toBe("19099");
    expect(env.LINGSHI_CONFIG_PATH).toBe(path.join("/custom", "lingshi.json"));
  });
});

describe("formatCliCommand", () => {
  it("returns command unchanged when no profile is set", () => {
    expect(formatCliCommand("lingshi doctor --fix", {})).toBe("lingshi doctor --fix");
  });

  it("returns command unchanged when profile is default", () => {
    expect(formatCliCommand("lingshi doctor --fix", { LINGSHI_PROFILE: "default" })).toBe(
      "lingshi doctor --fix",
    );
  });

  it("returns command unchanged when profile is Default (case-insensitive)", () => {
    expect(formatCliCommand("lingshi doctor --fix", { LINGSHI_PROFILE: "Default" })).toBe(
      "lingshi doctor --fix",
    );
  });

  it("returns command unchanged when profile is invalid", () => {
    expect(formatCliCommand("lingshi doctor --fix", { LINGSHI_PROFILE: "bad profile" })).toBe(
      "lingshi doctor --fix",
    );
  });

  it("returns command unchanged when --profile is already present", () => {
    expect(
      formatCliCommand("lingshi --profile work doctor --fix", { LINGSHI_PROFILE: "work" }),
    ).toBe("lingshi --profile work doctor --fix");
  });

  it("returns command unchanged when --dev is already present", () => {
    expect(formatCliCommand("lingshi --dev doctor", { LINGSHI_PROFILE: "dev" })).toBe(
      "lingshi --dev doctor",
    );
  });

  it("inserts --profile flag when profile is set", () => {
    expect(formatCliCommand("lingshi doctor --fix", { LINGSHI_PROFILE: "work" })).toBe(
      "lingshi --profile work doctor --fix",
    );
  });

  it("trims whitespace from profile", () => {
    expect(formatCliCommand("lingshi doctor --fix", { LINGSHI_PROFILE: "  jblingshi  " })).toBe(
      "lingshi --profile jblingshi doctor --fix",
    );
  });

  it("handles command with no args after lingshi", () => {
    expect(formatCliCommand("lingshi", { LINGSHI_PROFILE: "test" })).toBe("lingshi --profile test");
  });

  it("handles pnpm wrapper", () => {
    expect(formatCliCommand("pnpm lingshi doctor", { LINGSHI_PROFILE: "work" })).toBe(
      "pnpm lingshi --profile work doctor",
    );
  });
});
