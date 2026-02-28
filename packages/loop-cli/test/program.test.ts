import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createProgram } from '../src/program.js';

test('program exposes expected top-level commands', () => {
    const program = createProgram();
    const names = program.commands.map((command) => command.name());

    assert.ok(names.includes('init'));
    assert.ok(names.includes('doctor'));
    assert.ok(names.includes('fix'));
    assert.ok(names.includes('graph'));
    assert.ok(names.includes('new'));
    assert.ok(names.includes('add'));
    assert.ok(names.includes('update'));
    assert.ok(names.includes('diff'));
    assert.ok(names.includes('extract'));
    assert.ok(names.includes('lane'));
    assert.ok(names.includes('toolchain'));
});
