// In-browser SQL editor for SQL-track problems. Runs DuckDB in the visitor's browser
// (duckdb-wasm from a CDN); nothing is sent to a server.
//
// The visitor's query is stored as a table (config.result_table). Grading runs the
// fingerprint SQL that the site build prepared against that table and compares the
// hashes. The correct rows are never on the page. See toolkit/sql_editor.py.

const config = JSON.parse(document.getElementById("editor-config").textContent);
const sqlBox = document.getElementById("editor-sql");
const runButton = document.getElementById("editor-run");
const checkButton = document.getElementById("editor-check");
const statusLine = document.getElementById("editor-status");
const messageBox = document.getElementById("editor-message");
const resultBox = document.getElementById("editor-result");

const DRAFT_KEY = "nulltrap.draft." + config.slug;
const PREVIEW_ROWS = 50;

function loadDraft() {
  try { return window.localStorage.getItem(DRAFT_KEY); } catch (error) { return null; }
}
function saveDraft() {
  try { window.localStorage.setItem(DRAFT_KEY, sqlBox.value); } catch (error) { /* storage blocked */ }
}

sqlBox.value = loadDraft() || config.starter;
sqlBox.addEventListener("input", saveDraft);
sqlBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    run(false);
  } else if (event.key === "Tab") {
    event.preventDefault();  // indent instead of leaving the editor
    const start = sqlBox.selectionStart;
    sqlBox.setRangeText("    ", start, sqlBox.selectionEnd, "end");
    saveDraft();
  }
});

let connectionPromise = null;

async function connect() {
  statusLine.textContent = "Loading the SQL engine (first run only, a few MB) ...";
  const duckdb = await import(config.engine_url);
  const bundle = await duckdb.selectBundle(duckdb.getJsDelivrBundles());
  // A worker cannot be started straight from another origin, so wrap it in a local blob.
  const workerUrl = URL.createObjectURL(
    new Blob(['importScripts("' + bundle.mainWorker + '");'], { type: "text/javascript" })
  );
  const db = new duckdb.AsyncDuckDB(new duckdb.VoidLogger(), new Worker(workerUrl));
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
  URL.revokeObjectURL(workerUrl);

  statusLine.textContent = "Loading the data ...";
  for (const table of config.tables) {
    const response = await fetch(table.url);
    if (!response.ok) throw new Error("Could not load the table " + table.name + ".");
    await db.registerFileBuffer(table.name + ".parquet", new Uint8Array(await response.arrayBuffer()));
  }
  const connection = await db.connect();
  for (const table of config.tables) {
    await connection.query(
      'CREATE TABLE "' + table.name + "\" AS SELECT * FROM read_parquet('" + table.name + ".parquet')"
    );
  }
  return connection;
}

function getConnection() {
  if (!connectionPromise) {
    connectionPromise = connect().catch((error) => {
      connectionPromise = null;  // let the next click try again
      throw error;
    });
  }
  return connectionPromise;
}

async function rows(connection, sql) {
  const table = await connection.query(sql);
  return table.toArray().map((row) => row.toJSON());
}

function quote(name) {
  return '"' + name.replace(/"/g, '""') + '"';
}

function showMessage(kind, title, hints) {
  messageBox.className = "editor-message " + kind;
  messageBox.replaceChildren();
  const heading = document.createElement("strong");
  heading.textContent = title;
  messageBox.append(heading);
  if (hints && hints.length) {
    const list = document.createElement("ul");
    hints.forEach((hint) => {
      const item = document.createElement("li");
      item.textContent = hint;
      list.append(item);
    });
    messageBox.append(list);
  }
  messageBox.hidden = false;
}

function showTable(columns, preview, rowCount) {
  const table = document.createElement("table");
  const head = table.createTHead().insertRow();
  columns.forEach((column) => {
    const cell = document.createElement("th");
    cell.textContent = column;
    head.append(cell);
  });
  const body = table.createTBody();
  preview.forEach((row) => {
    const line = body.insertRow();
    columns.forEach((column) => {
      const cell = line.insertCell();
      if (row[column] === null) {
        cell.textContent = "NULL";
        cell.className = "null";
      } else {
        cell.textContent = row[column];
      }
    });
  });
  const caption = document.createElement("p");
  caption.className = "note";
  caption.textContent = rowCount > preview.length
    ? rowCount + " rows. Showing the first " + preview.length + "."
    : rowCount + (rowCount === 1 ? " row." : " rows.");
  resultBox.replaceChildren(caption, table);
}

// Runs the visitor's query into the result table and shows a preview.
async function execute(connection) {
  const sql = sqlBox.value.trim().replace(/;\s*$/, "");
  if (!sql) throw new Error("Write a query first.");
  await connection.query("CREATE OR REPLACE TEMP TABLE " + config.result_table + " AS\n" + sql);

  const described = await rows(connection, "DESCRIBE " + config.result_table);
  const columns = described.map((column) => column.column_name);
  const asText = columns.map((column) => "CAST(" + quote(column) + " AS VARCHAR) AS " + quote(column));
  const preview = await rows(
    connection, "SELECT " + asText.join(", ") + " FROM " + config.result_table + " LIMIT " + PREVIEW_ROWS
  );
  const counted = await rows(connection, "SELECT count(*) AS n FROM " + config.result_table);
  const rowCount = Number(counted[0].n);
  showTable(columns, preview, rowCount);
  return { columns, rowCount };
}

async function fingerprint(connection, sql) {
  try {
    return (await rows(connection, sql))[0].fp;
  } catch (error) {
    return null;  // for example a text column where a number is expected: counts as wrong
  }
}

// Same hints as check() in the notebook: what kind of thing is wrong, never the answer.
async function grade(connection, result) {
  const expected = config.expected;
  const actual = result.columns.map((column) => column.toLowerCase());
  const hints = [];
  const missing = expected.columns.filter((column) => actual.indexOf(column) === -1);
  const extra = actual.filter((column) => expected.columns.indexOf(column) === -1);
  if (missing.length) hints.push("Missing columns: " + missing.join(", ") + ".");
  if (extra.length) hints.push("Unexpected columns: " + extra.join(", ") + ".");
  if (hints.length) return hints;

  if (result.rowCount !== expected.row_count) {
    return ["Row count is wrong: your result has " + result.rowCount + " rows, expected " + expected.row_count + "."];
  }
  if ((await fingerprint(connection, expected.fingerprint_sql)) === expected.fingerprint) return [];

  const wrong = [];
  for (const check of expected.column_checks) {
    if ((await fingerprint(connection, check.sql)) !== check.fingerprint) wrong.push(check.name);
  }
  if (wrong.length) return ["Columns and row count are right, but values are wrong in: " + wrong.join(", ") + "."];
  return ["Each column has the right set of values, but they are combined into the wrong rows."];
}

// DuckDB repeats the "LINE n: ..." part of some errors, and counts the CREATE TABLE line
// that execute() puts in front of the visitor's query.
function cleanError(error) {
  const seen = [];
  String(error.message || error).split("\n").forEach((line) => {
    const fixed = line.replace(/^LINE (\d+):/, (match, number) => "LINE " + Math.max(1, number - 1) + ":");
    const isPointer = /^\s*\^\s*$/.test(fixed);
    if (isPointer ? seen.some((other) => /^\s*\^\s*$/.test(other)) : seen.indexOf(fixed) !== -1) return;
    seen.push(fixed);
  });
  return seen.join("\n");
}

async function run(withCheck) {
  runButton.disabled = checkButton.disabled = true;
  messageBox.hidden = true;
  try {
    const connection = await getConnection();
    statusLine.textContent = "Running ...";
    const result = await execute(connection);
    if (withCheck) {
      const hints = await grade(connection, result);
      if (hints.length) {
        showMessage("wrong", "Not correct yet.", hints);
      } else {
        showMessage("right", "Correct. Your result matches the expected output.");
        if (window.nullTrapMarkSolved) window.nullTrapMarkSolved(config.slug);
      }
    }
    statusLine.textContent = "";
  } catch (error) {
    resultBox.replaceChildren();
    statusLine.textContent = "";
    showMessage("error", "The query did not run.", [cleanError(error)]);
  } finally {
    runButton.disabled = checkButton.disabled = false;
  }
}

runButton.addEventListener("click", () => run(false));
checkButton.addEventListener("click", () => run(true));
