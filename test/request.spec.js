'use strict';

var expect = require('expect.js');

describe('request', function () {
  var request = require('../dist/node/request');

  it('should return something', function () {
    expect(request).not.to.be(undefined);
  });
});
