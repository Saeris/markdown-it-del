import { fileURLToPath } from "node:url";
import markdownit from "markdown-it";
import generate from "markdown-it-testgen";
import del from "../index.js";

describe(`markdown-it-del`, () => {
  const md = markdownit().use(del);

  generate(fileURLToPath(new URL(`__fixtures__/del.txt`, import.meta.url)), md);
});
