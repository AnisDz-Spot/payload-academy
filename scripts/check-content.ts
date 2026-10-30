// Guards the source tree against copy/paste corruption: syntax-highlighting
// markup pasted into code, replacement characters, double-encoded entities and
// common mojibake. Run in CI via `npm run check:content`.
import fs from 'node:fs';
import path from 'node:path';

const ROOTS = ['app', 'components', 'data', 'lib', 'scripts', 'tests'];
const EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.css', '.json', '.md']);
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'build']);

// The app's own syntax highlighter legitimately emits these class names.
const HIGHLIGHT_ALLOW = new Set([
  path.normalize('components/LessonView.tsx'),
  path.normalize('app/globals.css'),
]);

interface Pattern {
  name: string;
  re: RegExp;
  allow?: Set<string>;
}

const PATTERNS: Pattern[] = [
  { name: 'replacement character (U+FFFD)', re: /\uFFFD/ },
  {
    name: 'syntax-highlight markup pasted into source',
    re: /\bhl-(string|comment|keyword|number|bool|type|function|tag|attr|literal)\b/,
    allow: HIGHLIGHT_ALLOW,
  },
  { name: 'pasted highlighter artifact', re: /(string|number|bool|keyword|type|function)">"/ },
  { name: 'double-encoded HTML entity', re: /&amp;(lt|gt|quot|#39|#x27);/ },
  { name: 'entity in an import specifier', re: /from\s+&quot;/ },
  // Built from escapes so this guard file never matches itself.
  { name: 'mojibake (mis-decoded UTF-8)', re: /(\u00e2\u20ac|\u00c3\u00a9|\u00c2\u00b7|\u00f0\u0178)/ },
];

function walk(dir: string, out: string[]): void {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(path.join(dir, entry.name), out);
    } else if (entry.isFile() && EXTS.has(path.extname(entry.name))) {
      out.push(path.join(dir, entry.name));
    }
  }
}

function main(): void {
  const files: string[] = [];
  for (const root of ROOTS) walk(root, files);

  const findings: string[] = [];
  for (const file of files) {
    const rel = path.normalize(path.relative(process.cwd(), file));
    const text = fs.readFileSync(file, 'utf8');
    const lines = text.split(/\r?\n/);
    for (const pattern of PATTERNS) {
      if (pattern.allow?.has(rel)) continue;
      lines.forEach((line, i) => {
        if (pattern.re.test(line)) {
          findings.push(`${rel}:${i + 1} [${pattern.name}] ${line.trim().slice(0, 120)}`);
        }
      });
    }
  }

  if (findings.length > 0) {
    console.error(`✗ content check found ${findings.length} issue(s):\n`);
    for (const f of findings) console.error('  ' + f);
    process.exitCode = 1;
    return;
  }

  console.log(`✓ content check clean (${files.length} files scanned)`);
}

main();
