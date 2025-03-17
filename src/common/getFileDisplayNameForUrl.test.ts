import { expect } from "@std/expect";
import { getFileDisplayNameForUrl } from "./getFileDisplayNameForUrl.ts";
import { describe, it } from "@std/testing/bdd";

describe("getFileDisplayNameForUrl", () => {
  it("returns the last part of the URL decoded", () => {
    const url = "http://example.com/path/to/file%20name";
    const result = getFileDisplayNameForUrl(url);
    expect(result).toBe("file name");
  });

  it("returns the original URL if the last part is empty", () => {
    const url = "http://example.com/path/to/";
    const result = getFileDisplayNameForUrl(url);
    expect(result).toBe(url);
  });

  it("handles URLs with no slashes", () => {
    const url = "file%20name";
    const result = getFileDisplayNameForUrl(url);
    expect(result).toBe("file name");
  });

  it("handles URLs with special characters", () => {
    const url = "http://example.com/path/to/file%20name%21";
    const result = getFileDisplayNameForUrl(url);
    expect(result).toBe("file name!");
  });

  it("handles empty URL", () => {
    const url = "";
    const result = getFileDisplayNameForUrl(url);
    expect(result).toBe("");
  });

  it("handles zip files without encoded chars", () => {
    const url = "http://example.com/path/to/file.zip";
    const result = getFileDisplayNameForUrl(url);
    expect(result).toBe("file.zip");
  });

  it("handles zip files with encoded chars", () => {
    const url = "http://example.com/path/to/file%20name.zip";
    const result = getFileDisplayNameForUrl(url);
    expect(result).toBe("file name.zip");
  });
});
