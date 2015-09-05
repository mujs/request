define('request', function (require) {
  'use strict';

  var partial = require('mu.fn.partial'),
      each    = require('mu.list.each'),
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
    each(params, function (item, index) {
      template = template.replace(':' + index, item);
    });

    return template;
  };

  var prepareRequest = function (method, urlTemplate, urlParams, data) {
    var url = interpolateUrl(urlTemplate, urlParams);
    return httpRequest(method, url, data);
  };

  var request = function (url) {
    return {
      get: partial(prepareRequest, 'GET', url),
      post: partial(prepareRequest, 'POST', url),
      put: partial(prepareRequest, 'PUT', url),
      'delete': partial(prepareRequest, 'DELETE', url)
    };
  };

  return request;
});
