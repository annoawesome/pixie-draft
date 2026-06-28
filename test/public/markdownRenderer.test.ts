import { describe, expect, test } from "vitest";
import { toHtml } from "../../src/public/service/markdownRenderer";

describe("markdown renderer", () => {
  test("splits text", () => {
    expect(toHtml("Hello\nWorld!")).toBe("<p>Hello</p>\n<p>World!</p>");
  });

  test("reduces redundant newlines", () => {
    // Weird behavior,
    expect(toHtml("Hello\n\nWorld!")).toBe("<p>Hello</p>\n<p>World!</p>");
  });

  // italics
  test("converts line to italics", () => {
    expect(toHtml("_hello!_")).toBe("<p><i>_hello!_</i></p>");
  });

  test("converts phrase to italics", () => {
    expect(toHtml("Good _morning_ sunshine")).toBe(
      "<p>Good <i>_morning_</i> sunshine</p>",
    );
  });

  test("converts to italics with punctuation", () => {
    expect(toHtml("do_not_convert")).toBe("<p>do_not_convert</p>");
  });

  test("does not convert to italics", () => {
    expect(toHtml("_Go_! Go!")).toBe("<p><i>_Go_</i>! Go!</p>");
  });

  // bold
  test("converts line to bold", () => {
    expect(toHtml("__hello!__")).toBe("<p><b>__hello!__</b></p>");
  });

  test("converts phrase to bold", () => {
    expect(toHtml("Good __morning__ sunshine")).toBe(
      "<p>Good <b>__morning__</b> sunshine</p>",
    );
  });

  test("converts to bold with punctuation", () => {
    expect(toHtml("__Go__! Go!")).toBe("<p><b>__Go__</b>! Go!</p>");
  });

  test("does not convert to bold", () => {
    expect(toHtml("do__not__convert")).toBe("<p>do__not__convert</p>");
  });

  // italics + bold
  test("converts line to italics & bold", () => {
    expect(toHtml("___hello!___")).toBe("<p><i><b>___hello!___</b></i></p>");
  });

  test("converts phrase to italics & bold", () => {
    expect(toHtml("Good ___morning___ sunshine")).toBe(
      "<p>Good <i><b>___morning___</b></i> sunshine</p>",
    );
  });

  test("converts to italics & bold with punctuation", () => {
    expect(toHtml("___Go___! Go!")).toBe("<p><i><b>___Go___</b></i>! Go!</p>");
  });

  test("does not convert to italics &  bold", () => {
    expect(toHtml("do___not___convert")).toBe("<p>do___not___convert</p>");
  });

  // headers
  test("convert to header 1", () => {
    expect(toHtml("# Header 1")).toBe("<h1># Header 1</h1>");
  });

  test("does not convert to header 1", () => {
    expect(toHtml("#Header 1")).toBe("<p>#Header 1</p>");
  });

  test("convert to header 2", () => {
    expect(toHtml("## Header 2")).toBe("<h2>## Header 2</h2>");
  });

  test("does not convert to header 2", () => {
    expect(toHtml("##Header 2")).toBe("<p>##Header 2</p>");
  });
});
