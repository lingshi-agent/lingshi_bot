import { describe, expect, it } from "vitest";
import {
  buildParseArgv,
  getFlagValue,
  getCommandPath,
  getPrimaryCommand,
  getPositiveIntFlagValue,
  getVerboseFlag,
  hasHelpOrVersion,
  hasFlag,
  shouldMigrateState,
  shouldMigrateStateFromPath,
} from "./argv.js";

describe("argv helpers", () => {
  it("detects help/version flags", () => {
    expect(hasHelpOrVersion(["node", "lingshi", "--help"])).toBe(true);
    expect(hasHelpOrVersion(["node", "lingshi", "-V"])).toBe(true);
    expect(hasHelpOrVersion(["node", "lingshi", "status"])).toBe(false);
  });

  it("extracts command path ignoring flags and terminator", () => {
    expect(getCommandPath(["node", "lingshi", "status", "--json"], 2)).toEqual(["status"]);
    expect(getCommandPath(["node", "lingshi", "agents", "list"], 2)).toEqual(["agents", "list"]);
    expect(getCommandPath(["node", "lingshi", "status", "--", "ignored"], 2)).toEqual(["status"]);
  });

  it("returns primary command", () => {
    expect(getPrimaryCommand(["node", "lingshi", "agents", "list"])).toBe("agents");
    expect(getPrimaryCommand(["node", "lingshi"])).toBeNull();
  });

  it("parses boolean flags and ignores terminator", () => {
    expect(hasFlag(["node", "lingshi", "status", "--json"], "--json")).toBe(true);
    expect(hasFlag(["node", "lingshi", "--", "--json"], "--json")).toBe(false);
  });

  it("extracts flag values with equals and missing values", () => {
    expect(getFlagValue(["node", "lingshi", "status", "--timeout", "5000"], "--timeout")).toBe(
      "5000",
    );
    expect(getFlagValue(["node", "lingshi", "status", "--timeout=2500"], "--timeout")).toBe("2500");
    expect(getFlagValue(["node", "lingshi", "status", "--timeout"], "--timeout")).toBeNull();
    expect(getFlagValue(["node", "lingshi", "status", "--timeout", "--json"], "--timeout")).toBe(
      null,
    );
    expect(getFlagValue(["node", "lingshi", "--", "--timeout=99"], "--timeout")).toBeUndefined();
  });

  it("parses verbose flags", () => {
    expect(getVerboseFlag(["node", "lingshi", "status", "--verbose"])).toBe(true);
    expect(getVerboseFlag(["node", "lingshi", "status", "--debug"])).toBe(false);
    expect(getVerboseFlag(["node", "lingshi", "status", "--debug"], { includeDebug: true })).toBe(
      true,
    );
  });

  it("parses positive integer flag values", () => {
    expect(getPositiveIntFlagValue(["node", "lingshi", "status"], "--timeout")).toBeUndefined();
    expect(
      getPositiveIntFlagValue(["node", "lingshi", "status", "--timeout"], "--timeout"),
    ).toBeNull();
    expect(
      getPositiveIntFlagValue(["node", "lingshi", "status", "--timeout", "5000"], "--timeout"),
    ).toBe(5000);
    expect(
      getPositiveIntFlagValue(["node", "lingshi", "status", "--timeout", "nope"], "--timeout"),
    ).toBeUndefined();
  });

  it("builds parse argv from raw args", () => {
    const nodeArgv = buildParseArgv({
      programName: "lingshi",
      rawArgs: ["node", "lingshi", "status"],
    });
    expect(nodeArgv).toEqual(["node", "lingshi", "status"]);

    const versionedNodeArgv = buildParseArgv({
      programName: "lingshi",
      rawArgs: ["node-22", "lingshi", "status"],
    });
    expect(versionedNodeArgv).toEqual(["node-22", "lingshi", "status"]);

    const versionedNodeWindowsArgv = buildParseArgv({
      programName: "lingshi",
      rawArgs: ["node-22.2.0.exe", "lingshi", "status"],
    });
    expect(versionedNodeWindowsArgv).toEqual(["node-22.2.0.exe", "lingshi", "status"]);

    const versionedNodePatchlessArgv = buildParseArgv({
      programName: "lingshi",
      rawArgs: ["node-22.2", "lingshi", "status"],
    });
    expect(versionedNodePatchlessArgv).toEqual(["node-22.2", "lingshi", "status"]);

    const versionedNodeWindowsPatchlessArgv = buildParseArgv({
      programName: "lingshi",
      rawArgs: ["node-22.2.exe", "lingshi", "status"],
    });
    expect(versionedNodeWindowsPatchlessArgv).toEqual(["node-22.2.exe", "lingshi", "status"]);

    const versionedNodeWithPathArgv = buildParseArgv({
      programName: "lingshi",
      rawArgs: ["/usr/bin/node-22.2.0", "lingshi", "status"],
    });
    expect(versionedNodeWithPathArgv).toEqual(["/usr/bin/node-22.2.0", "lingshi", "status"]);

    const nodejsArgv = buildParseArgv({
      programName: "lingshi",
      rawArgs: ["nodejs", "lingshi", "status"],
    });
    expect(nodejsArgv).toEqual(["nodejs", "lingshi", "status"]);

    const nonVersionedNodeArgv = buildParseArgv({
      programName: "lingshi",
      rawArgs: ["node-dev", "lingshi", "status"],
    });
    expect(nonVersionedNodeArgv).toEqual(["node", "lingshi", "node-dev", "lingshi", "status"]);

    const directArgv = buildParseArgv({
      programName: "lingshi",
      rawArgs: ["lingshi", "status"],
    });
    expect(directArgv).toEqual(["node", "lingshi", "status"]);

    const bunArgv = buildParseArgv({
      programName: "lingshi",
      rawArgs: ["bun", "src/entry.ts", "status"],
    });
    expect(bunArgv).toEqual(["bun", "src/entry.ts", "status"]);
  });

  it("builds parse argv from fallback args", () => {
    const fallbackArgv = buildParseArgv({
      programName: "lingshi",
      fallbackArgv: ["status"],
    });
    expect(fallbackArgv).toEqual(["node", "lingshi", "status"]);
  });

  it("decides when to migrate state", () => {
    expect(shouldMigrateState(["node", "lingshi", "status"])).toBe(false);
    expect(shouldMigrateState(["node", "lingshi", "health"])).toBe(false);
    expect(shouldMigrateState(["node", "lingshi", "sessions"])).toBe(false);
    expect(shouldMigrateState(["node", "lingshi", "memory", "status"])).toBe(false);
    expect(shouldMigrateState(["node", "lingshi", "agent", "--message", "hi"])).toBe(false);
    expect(shouldMigrateState(["node", "lingshi", "agents", "list"])).toBe(true);
    expect(shouldMigrateState(["node", "lingshi", "message", "send"])).toBe(true);
  });

  it("reuses command path for migrate state decisions", () => {
    expect(shouldMigrateStateFromPath(["status"])).toBe(false);
    expect(shouldMigrateStateFromPath(["agents", "list"])).toBe(true);
  });
});
