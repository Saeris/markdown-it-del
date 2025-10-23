import type MDit from "markdown-it";
import type { default as StateInline, Delimiter } from "markdown-it/lib/rules_inline/state_inline.mjs";
import type Token from "markdown-it/lib/token.mjs";

export const delPlugin = (md: MDit): void => {
  // insert each marker as a separate text token, and add it to delimiter list
  md.inline.ruler.before(`emphasis`, `del`, (state, silent) => {
    const start = state.pos;
    const marker = state.src.charCodeAt(start);

    if (silent) {
      return false;
    }

    if (marker !== 0x2d /* - */) {
      return false;
    }

    const scanned = state.scanDelims(state.pos, true);
    let len = scanned.length;
    const ch = String.fromCharCode(marker);

    if (len < 2) {
      return false;
    }

    if (len % 2) {
      const token = state.push(`text`, ``, 0);
      token.content = ch;
      len--;
    }

    for (let i = 0; i < len; i += 2) {
      const token = state.push(`text`, ``, 0);
      token.content = ch + ch;

      if (!scanned.can_open && !scanned.can_close) {
        continue;
      }

      state.delimiters.push({
        marker,
        length: 0, // disable "rule of 3" length checks meant for emphasis
        // @ts-expect-error
        jump: i / 2, // 1 delimiter = 2 characters
        token: state.tokens.length - 1,
        end: -1,
        open: scanned.can_open,
        close: scanned.can_close
      });
    }

    state.pos += scanned.length;

    return true;
  });

  // Walk through delimiter list and replace text tokens with tags
  const postProcess = (state: StateInline, delimiters: Delimiter[]): void => {
    let token: Token;
    const loneMarkers: number[] = [];
    const max = delimiters.length;

    for (let i = 0; i < max; i++) {
      const startDelim = delimiters[i];

      if (startDelim.marker !== 0x2d /* - */) {
        continue;
      }

      if (startDelim.end === -1) {
        continue;
      }

      const endDelim = delimiters[startDelim.end];

      token = state.tokens[startDelim.token];
      token.type = `del_open`;
      token.tag = `del`;
      token.nesting = 1;
      token.markup = `--`;
      token.content = ``;

      token = state.tokens[endDelim.token];
      token.type = `del_close`;
      token.tag = `del`;
      token.nesting = -1;
      token.markup = `--`;
      token.content = ``;

      if (state.tokens[endDelim.token - 1].type === `text` && state.tokens[endDelim.token - 1].content === `+`) {
        loneMarkers.push(endDelim.token - 1);
      }
    }

    // If a marker sequence has an odd number of characters, it's splitted
    // like this: `~~~~~` -> `~` + `~~` + `~~`, leaving one marker at the
    // start of the sequence.
    //
    // So, we have to move all those markers after subsequent s_close tags.
    //
    while (loneMarkers.length) {
      const i = loneMarkers.pop()!;
      let j = i + 1;

      while (j < state.tokens.length && state.tokens[j].type === `del_close`) {
        j++;
      }

      j--;

      if (i !== j) {
        token = state.tokens[j];
        state.tokens[j] = state.tokens[i];
        state.tokens[i] = token;
      }
    }
  };

  md.inline.ruler2.before(`emphasis`, `del`, (state) => {
    const tokens_meta = state.tokens_meta;
    const max = state.tokens_meta.length;

    postProcess(state, state.delimiters);

    for (let curr = 0; curr < max; curr++) {
      if (tokens_meta[curr]?.delimiters) {
        postProcess(state, tokens_meta[curr]?.delimiters ?? []);
      }
    }

    return true;
  });
};

// eslint-disable-next-line import-x/no-default-export
export default delPlugin;
