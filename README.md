request
=======

An `XMLHttpRequest` decorator

Usage
-----

```js
request('/api/employee/:id')
.get({ id: '123' })
.on('response', function (employee) {
  console.log(employee);
});
```
