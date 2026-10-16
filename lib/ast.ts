// lib/ast.ts
//
// Server-only helpers around the TypeScript compiler API. These are used to
// structurally grade learner solutions (not substring matching). Never import
// this file from a client component — it pulls in the full `typescript`
// compiler and would bloat the browser bundle.

import ts from 'typescript';

export interface AstContext {
  sourceFile: ts.SourceFile;
  syntaxErrors: ts.Diagnostic[];
  code: string;
}

export function parseCode(code: string): AstContext {
  const sourceFile = ts.createSourceFile(
    'solution.ts',
    code,
    ts.ScriptTarget.Latest,
    /* setParentNodes */ true,
    ts.ScriptKind.TSX,
  );
  const diagnostics =
    (sourceFile as unknown as { parseDiagnostics?: ts.Diagnostic[] }).parseDiagnostics || [];
  return { sourceFile, syntaxErrors: diagnostics, code };
}

export function syntaxErrorMessages(ctx: AstContext): string[] {
  return ctx.syntaxErrors.map((d) => ts.flattenDiagnosticMessageText(d.messageText, ' '));
}

function walk(node: ts.Node, cb: (n: ts.Node) => void): void {
  cb(node);
  ts.forEachChild(node, (child) => walk(child, cb));
}

export function propName(p: ts.ObjectLiteralElementLike): string | undefined {
  if (!ts.isPropertyAssignment(p)) return undefined;
  const n = p.name;
  if (
    ts.isIdentifier(n) ||
    ts.isStringLiteral(n) ||
    ts.isNumericLiteral(n) ||
    ts.isNoSubstitutionTemplateLiteral(n)
  ) {
    return n.text;
  }
  return undefined;
}

export function objectLit(
  expr: ts.Expression | undefined,
): ts.ObjectLiteralExpression | undefined {
  return expr && ts.isObjectLiteralExpression(expr) ? expr : undefined;
}

export function getPropExpr(
  obj: ts.ObjectLiteralExpression | undefined,
  name: string,
): ts.Expression | undefined {
  if (!obj) return undefined;
  for (const p of obj.properties) {
    if (ts.isPropertyAssignment(p) && propName(p) === name) return p.initializer;
  }
  return undefined;
}

export function findObjectByVar(
  ctx: AstContext,
  name: string,
): ts.ObjectLiteralExpression | undefined {
  let found: ts.ObjectLiteralExpression | undefined;
  walk(ctx.sourceFile, (node) => {
    if (found) return;
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === name
    ) {
      const init = node.initializer;
      if (init && ts.isObjectLiteralExpression(init)) found = init;
    }
  });
  return found;
}

export function functionTextByVar(ctx: AstContext, name: string): string | undefined {
  let text: string | undefined;
  walk(ctx.sourceFile, (node) => {
    if (text) return;
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === name
    ) {
      const init = node.initializer;
      if (init && (ts.isArrowFunction(init) || ts.isFunctionExpression(init))) {
        text = init.getText(ctx.sourceFile);
      }
    }
  });
  return text;
}

export function findPropsAnywhere(ctx: AstContext, name: string): ts.Expression[] {
  const out: ts.Expression[] = [];
  walk(ctx.sourceFile, (node) => {
    if (ts.isPropertyAssignment(node) && propName(node) === name) out.push(node.initializer);
  });
  return out;
}

export function firstPropAnywhere(ctx: AstContext, name: string): ts.Expression | undefined {
  return findPropsAnywhere(ctx, name)[0];
}

export function getNested(ctx: AstContext, path: string[]): ts.Expression | undefined {
  if (!path.length) return undefined;
  let current: ts.Expression | undefined = firstPropAnywhere(ctx, path[0]);
  for (let i = 1; i < path.length && current; i++) {
    current = getPropExpr(objectLit(current), path[i]);
  }
  return current;
}

export function findObjectWithPropValue(
  ctx: AstContext,
  name: string,
  value: string,
): ts.ObjectLiteralExpression | undefined {
  let found: ts.ObjectLiteralExpression | undefined;
  walk(ctx.sourceFile, (node) => {
    if (found) return;
    if (ts.isObjectLiteralExpression(node) && strOf(getPropExpr(node, name)) === value) {
      found = node;
    }
  });
  return found;
}

export function strOf(expr: ts.Expression | undefined): string | undefined {
  if (!expr) return undefined;
  if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) return expr.text;
  return undefined;
}

export function numOf(expr: ts.Expression | undefined): number | undefined {
  if (!expr) return undefined;
  if (ts.isNumericLiteral(expr)) return Number(expr.text);
  if (
    ts.isPrefixUnaryExpression(expr) &&
    expr.operator === ts.SyntaxKind.MinusToken &&
    ts.isNumericLiteral(expr.operand)
  ) {
    return -Number(expr.operand.text);
  }
  return undefined;
}

export function boolOf(expr: ts.Expression | undefined): boolean | undefined {
  if (!expr) return undefined;
  if (expr.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (expr.kind === ts.SyntaxKind.FalseKeyword) return false;
  return undefined;
}

export function arrayElements(expr: ts.Expression | undefined): ts.Expression[] {
  if (expr && ts.isArrayLiteralExpression(expr)) return expr.elements.slice();
  return [];
}

export function objectArray(expr: ts.Expression | undefined): ts.ObjectLiteralExpression[] {
  return arrayElements(expr)
    .map((e) => objectLit(e))
    .filter((o): o is ts.ObjectLiteralExpression => o !== undefined);
}

export function arrayStrings(expr: ts.Expression | undefined): string[] {
  return arrayElements(expr)
    .map((e) => strOf(e))
    .filter((s): s is string => typeof s === 'string');
}

export function callName(expr: ts.Expression | undefined): string | undefined {
  if (!expr || !ts.isCallExpression(expr)) return undefined;
  const c = expr.expression;
  if (ts.isIdentifier(c)) return c.text;
  if (ts.isPropertyAccessExpression(c)) return c.name.text;
  return undefined;
}

export function callArgs(expr: ts.Expression | undefined): ts.Expression[] {
  if (expr && ts.isCallExpression(expr)) return expr.arguments.slice();
  return [];
}

export function findCalls(
  ctx: AstContext,
  namePredicate: (name: string) => boolean,
): ts.CallExpression[] {
  const out: ts.CallExpression[] = [];
  walk(ctx.sourceFile, (node) => {
    if (ts.isCallExpression(node)) {
      const n = callName(node);
      if (n && namePredicate(n)) out.push(node);
    }
  });
  return out;
}

export function hasImportFrom(ctx: AstContext, moduleName: string): boolean {
  let found = false;
  ctx.sourceFile.forEachChild((node) => {
    if (
      ts.isImportDeclaration(node) &&
      ts.isStringLiteral(node.moduleSpecifier) &&
      node.moduleSpecifier.text === moduleName
    ) {
      found = true;
    }
  });
  return found;
}

export function defaultExportExpr(ctx: AstContext): ts.Expression | undefined {
  let expr: ts.Expression | undefined;
  ctx.sourceFile.forEachChild((node) => {
    if (ts.isExportAssignment(node) && !node.isExportEquals) expr = node.expression;
  });
  return expr;
}
