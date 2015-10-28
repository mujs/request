module('mu.request', function (require) {
  'use strict';

  var partial = require('mu.fn.partial'),
      reduce  = require('mu.list.reduce'),
      events  = require('mu.async.events');

  var httpRequest = function (method, url, data) {
    var req = new XMLHttpRequest(),
        channel = events();

    req.addEventListener('load', function () {
      channel.emit('response', this.responseText);
    });

    req.addEventListener('error', function () {
      channel.emit('error', this.status, this.responseText);
    });

    req.open(method, url, true);
    req.send(data);

    return channel;
  };

  var interpolateUrl = function (template, params) {
    return reduce(params, template, function (acc, item, index) {
      return acc.replace(':' + index, item);
    });
  };

  var queryString = function (query) {
    return reduce(query, '', function (acc, item, index) {
      acc += acc ? '&' : '?';
      acc += index + '=' + item;
      return acc;
    });
  };

  var prepareRequest = function (method, template, params, query, data) {
    var url = interpolateUrl(template, params) + queryString(query);
    return httpRequest(method, url, data);
  };

  var request = function (urlTemplate) {
    return function (params) {
      return {
        get: partial(prepareRequest, 'GET', urlTemplate, params),
        post: partial(prepareRequest, 'POST', urlTemplate, params, null),
        put: partial(prepareRequest, 'PUT', urlTemplate, params, null),
        delete: partial(prepareRequest, 'DELETE', urlTemplate, params)
      };
    };
  };

  return request;
});
