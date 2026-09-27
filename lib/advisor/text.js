/*
  Utilidades de texto del asesor: normalizacion y coincidencia tolerante a
  tildes, mayusculas, plurales y errores de tipeo leves.
*/

export function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9+.@\-\s]/g, " ")
    .replace(/(^|\s)[.\-]+|[.\-]+(?=\s|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    let last = prev[0];
    prev[0] = i;
    let rowMin = prev[0];
    for (let j = 1; j <= b.length; j += 1) {
      const tmp = prev[j];
      prev[j] =
        a[i - 1] === b[j - 1] ? last : Math.min(last, prev[j], prev[j - 1]) + 1;
      last = tmp;
      if (prev[j] < rowMin) rowMin = prev[j];
    }
    if (rowMin > max) return max + 1;
  }
  return prev[b.length];
}

/*
  Devuelve el peso de coincidencia de un termino contra el texto normalizado.
    - frase o palabra exacta: 2 (frases de varias palabras: 3)
    - prefijo (servidor -> servidores): 1.5
    - error de tipeo de 1 letra en palabras de 7+ caracteres: 1
*/
export function termScore(normText, tokens, rawTerm) {
  const term = normalize(rawTerm);
  if (!term) return 0;
  const padded = ` ${normText} `;
  if (term.includes(" ")) {
    return padded.includes(` ${term} `) ? 3 : 0;
  }
  if (padded.includes(` ${term} `)) return 2;
  if (term.length >= 5) {
    for (const token of tokens) {
      if (token.length > term.length && token.startsWith(term)) return 1.5;
      if (
        term.length > 4 &&
        term.startsWith(token) &&
        token.length >= term.length - 1 &&
        token.length >= 5
      )
        return 1.5;
    }
  }
  if (term.length >= 7) {
    for (const token of tokens) {
      if (
        Math.abs(token.length - term.length) <= 1 &&
        levenshtein(token, term, 1) <= 1
      ) {
        return 1;
      }
    }
  }
  return 0;
}

export function scoreTerms(normText, terms) {
  const tokens = normText.split(" ");
  let score = 0;
  const hits = [];
  for (const term of terms) {
    const s = termScore(normText, tokens, term);
    if (s > 0) {
      score += s;
      hits.push(term);
    }
  }
  return { score, hits };
}

export function hasAny(normText, patterns) {
  return patterns.some((pattern) =>
    pattern instanceof RegExp
      ? pattern.test(normText)
      : ` ${normText} `.includes(` ${normalize(pattern)} `),
  );
}

export function pick(list, seed = 0) {
  return list[Math.abs(seed) % list.length];
}
