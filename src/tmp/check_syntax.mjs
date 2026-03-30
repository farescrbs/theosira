import fs from "fs";
import ts from "typescript";

const code = fs.readFileSync("/supabase/functions/server/index.tsx", "utf-8");
const result = ts.transpileModule(code, {
  compilerOptions: {
    target: ts.ScriptTarget.ESNext,
    jsx: ts.JsxEmit.React
  }
});
console.log("Syntax check complete, if there are diagnostics they will be printed:");
if (result.diagnostics && result.diagnostics.length > 0) {
  console.log(result.diagnostics);
} else {
  console.log("No syntax errors found by transpileModule.");
}
