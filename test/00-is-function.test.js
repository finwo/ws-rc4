import expect from 'expect';
import wsrc4  from '../dist/node';

expect.extend(require('jest-isa'));

test('Ensure wsrc4 is a function', ()=>{
  expect(wsrc4).isA(Function);
});
