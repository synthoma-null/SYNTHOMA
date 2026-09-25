/** @jest-environment node */
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, 'run-postgres-tests.js'), 'utf8');
function run(url) {
  const spawnSync = jest.fn(() => ({ status: 0 }));
  const fakeRequire = () => ({ spawnSync });
  fakeRequire.resolve = (name) => name;
  const context = {
    require: fakeRequire, URL, console: { error: jest.fn() },
    process: { env: { SYNTHOMA_POSTGRES_TEST_URL: url, DIRECT_URL: 'postgresql://production.example/live' }, execPath: 'node', cwd: () => '/workspace', exit: () => { throw new Error('exit'); } },
  };
  try { vm.runInNewContext(source, context); } catch (error) { if (error.message !== 'exit') throw error; }
  return spawnSync;
}
it('overrides both database URLs before running migrations and tests', () => {
  const url = 'postgresql://localhost:5432/synthoma_test_ci';
  const spawn = run(url);
  expect(spawn).toHaveBeenCalledTimes(2);
  for (const call of spawn.mock.calls) expect(call[2].env).toMatchObject({ DATABASE_URL: url, DIRECT_URL: url });
});
it('rejects remote databases before starting any child process', () => {
  expect(run('postgresql://production.example/synthoma_test_ci')).not.toHaveBeenCalled();
});
