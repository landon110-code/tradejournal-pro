import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const start = html.indexOf('function parseCsvText(text)');
const end = html.indexOf("$('previewCsvBtn').addEventListener", start);
assert.ok(start >= 0 && end > start, 'CSV helper functions should exist in index.html');

const localDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const context = { localDateKey };
vm.runInNewContext(
  html.slice(start, end) +
    '\nthis.helpers = { parseCsvText, normalizedSide, readNum, parseCsvDate, probableDuplicate };',
  context
);
const { parseCsvText, normalizedSide, readNum, parseCsvDate, probableDuplicate } = context.helpers;

test('CSV parser handles quoted commas, escaped quotes, and multiline fields', () => {
  const rows = parseCsvText('Symbol,Notes,Price\r\nCL,"wait, then ""confirm""",75.25\r\nCL,"line one\nline two",76');
  assert.equal(rows.length, 2);
  assert.equal(rows[0].symbol, 'CL');
  assert.equal(rows[0].notes, 'wait, then "confirm"');
  assert.equal(rows[1].notes, 'line one\nline two');
  assert.equal(rows[1].price, '76');
});

test('CSV parser strips a UTF-8 BOM from the first header', () => {
  const rows = parseCsvText('\uFEFFSymbol,Entry\nCL,75.2');
  assert.equal(rows[0].symbol, 'CL');
  assert.equal(rows[0].entry, '75.2');
});

test('date parser accepts ISO and US dates but rejects impossible dates', () => {
  assert.equal(parseCsvDate('2026-10-12T14:30:00Z'), '2026-10-12');
  assert.equal(parseCsvDate('10/12/2026'), '2026-10-12');
  assert.equal(parseCsvDate('10-12-26'), '2026-10-12');
  assert.equal(parseCsvDate('2026-02-31'), null);
  assert.equal(parseCsvDate('not a date'), null);
  assert.equal(parseCsvDate(''), null);
});

test('direction parser refuses ambiguous values rather than silently guessing long', () => {
  assert.equal(normalizedSide('Long'), 'long');
  assert.equal(normalizedSide('SELL SHORT'), 'short');
  assert.equal(normalizedSide('bullish'), 'long');
  assert.equal(normalizedSide('market'), null);
  assert.equal(normalizedSide(''), null);
});

test('numeric parser handles currency formatting and invalid values', () => {
  assert.equal(readNum('$1,234.50'), 1234.5);
  assert.equal(readNum(''), null);
  assert.equal(readNum('bad'), null);
  assert.equal(readNum('bad', 0), 0);
});

test('duplicate detection compares date, symbol, side, prices, and quantity', () => {
  const a = { trade_date: '2026-10-12', symbol: 'CL', side: 'long', entry_price: 75, exit_price: 76, contracts: 1 };
  assert.equal(probableDuplicate(a, { ...a, symbol: 'cl' }), true);
  assert.equal(probableDuplicate(a, { ...a, contracts: 2 }), false);
  assert.equal(probableDuplicate(a, { ...a, side: 'short' }), false);
});
