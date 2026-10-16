'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { filterEntries, normalizeEditions } = require('../script.js');
for (const file of ['jaibs-1', 'jaibs-2']) {
    const data = require(`../${file}.json`);
    test(`${file}: original search predicate and order are preserved`, () => {
        const queries = ['', ' ', 'VEDA', 'veda', 'Ā', 'ā', 'ṛ', 'RV', 'zzqqxx', '1951'];
        // Include an actual abbreviation from every record, including abbreviation-only hits.
        queries.push(...Object.values(data).flatMap(value => value.abbreviation || []));
        for (const raw of queries) {
            const query = raw.toLowerCase();
            const expected = Object.entries(data).filter(([key, value]) =>
                key.toLowerCase().includes(query) ||
                (value.abbreviation || []).some(abbr => abbr.toLowerCase().includes(query)));
            assert.deepEqual(filterEntries(data, raw), expected, raw);
        }
        assert.equal(filterEntries(data, '').length, file === 'jaibs-1' ? 138 : 5);
        assert.equal(filterEntries(data, 'zzqqxx').length, 0);
    });
}
test('only titles and abbreviations are searched without trimming or Unicode normalization', () => {
    const data = { 'Rājan': { abbreviation: ['RV '], edition: { bibliography: 'edition-only' } } };
    assert.equal(filterEntries(data, 'rv ').length, 1);
    for (const query of [' rv', 'Rājan', 'edition-only']) assert.equal(filterEntries(data, query).length, 0);
});
test('edition normalization accepts arrays, single objects, and absent editions', () => {
    const edition = { bibliography: 'Source' };
    const array = [edition];
    assert.equal(normalizeEditions(array), array);
    assert.deepEqual(normalizeEditions(edition), [edition]);
    assert.deepEqual(normalizeEditions(undefined), []);
    assert.deepEqual(normalizeEditions(null), []);
});
