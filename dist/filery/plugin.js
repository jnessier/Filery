// [Filery: A TinyMCE plugin]  1.0.0 - 2018-09-07  
 (function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Filery"] = factory();
	else
		root["Filery"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 20);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Root reference for iframes.
 */

var root;
if (typeof window !== 'undefined') { // Browser window
  root = window;
} else if (typeof self !== 'undefined') { // Web Worker
  root = self;
} else { // Other environments
  console.warn("Using browser-only version of superagent in non-browser environment");
  root = this;
}

var Emitter = __webpack_require__(2);
var RequestBase = __webpack_require__(3);
var isObject = __webpack_require__(1);
var ResponseBase = __webpack_require__(4);
var Agent = __webpack_require__(6);

/**
 * Noop.
 */

function noop(){};

/**
 * Expose `request`.
 */

var request = exports = module.exports = function(method, url) {
  // callback
  if ('function' == typeof url) {
    return new exports.Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new exports.Request('GET', method);
  }

  return new exports.Request(method, url);
}

exports.Request = Request;

/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest
      && (!root.location || 'file:' != root.location.protocol
          || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  throw Error("Browser-only version of superagent could not find XHR");
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    pushEncodedKeyValuePair(pairs, key, obj[key]);
  }
  return pairs.join('&');
}

/**
 * Helps 'serialize' with serializing arrays.
 * Mutates the pairs array.
 *
 * @param {Array} pairs
 * @param {String} key
 * @param {Mixed} val
 */

function pushEncodedKeyValuePair(pairs, key, val) {
  if (val != null) {
    if (Array.isArray(val)) {
      val.forEach(function(v) {
        pushEncodedKeyValuePair(pairs, key, v);
      });
    } else if (isObject(val)) {
      for(var subkey in val) {
        pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
      }
    } else {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(val));
    }
  } else if (val === null) {
    pairs.push(encodeURIComponent(key));
  }
}

/**
 * Expose serialization method.
 */

request.serializeObject = serialize;

/**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var pair;
  var pos;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    pos = pair.indexOf('=');
    if (pos == -1) {
      obj[decodeURIComponent(pair)] = '';
    } else {
      obj[decodeURIComponent(pair.slice(0, pos))] =
        decodeURIComponent(pair.slice(pos + 1));
    }
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'text/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

request.serialize = {
  'application/x-www-form-urlencoded': serialize,
  'application/json': JSON.stringify
};

/**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    if (index === -1) { // could be empty line, just skip it
      continue;
    }
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Check if `mime` is json or has +json structured syntax suffix.
 *
 * @param {String} mime
 * @return {Boolean}
 * @api private
 */

function isJSON(mime) {
  // should match /json or +json
  // but not /json-seq
  return /[\/+]json($|[^-\w])/.test(mime);
}

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req) {
  this.req = req;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
     ? this.xhr.responseText
     : null;
  this.statusText = this.req.xhr.statusText;
  var status = this.xhr.status;
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
    status = 204;
  }
  this._setStatusProperties(status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this._setHeaderProperties(this.header);

  if (null === this.text && req._responseType) {
    this.body = this.xhr.response;
  } else {
    this.body = this.req.method != 'HEAD'
      ? this._parseBody(this.text ? this.text : this.xhr.response)
      : null;
  }
}

ResponseBase(Response.prototype);

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype._parseBody = function(str) {
  var parse = request.parse[this.type];
  if (this.req._parser) {
    return this.req._parser(this, str);
  }
  if (!parse && isJSON(this.type)) {
    parse = request.parse['application/json'];
  }
  return parse && str && (str.length || str instanceof Object)
    ? parse(str)
    : null;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {}; // preserves header name case
  this._header = {}; // coerces header names to lowercase
  this.on('end', function(){
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch(e) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      // issue #675: return the raw response if the response parsing fails
      if (self.xhr) {
        // ie9 doesn't have 'response' property
        err.rawResponse = typeof self.xhr.responseType == 'undefined' ? self.xhr.responseText : self.xhr.response;
        // issue #876: return the http status code if the response parsing fails
        err.status = self.xhr.status ? self.xhr.status : null;
        err.statusCode = err.status; // backwards-compat only
      } else {
        err.rawResponse = null;
        err.status = null;
      }

      return self.callback(err);
    }

    self.emit('response', res);

    var new_err;
    try {
      if (!self._isResponseOK(res)) {
        new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
      }
    } catch(custom_err) {
      new_err = custom_err; // ok() callback can throw
    }

    // #1000 don't catch errors from the callback to avoid double calling it
    if (new_err) {
      new_err.original = err;
      new_err.response = res;
      new_err.status = res.status;
      self.callback(new_err, res);
    } else {
      self.callback(null, res);
    }
  });
}

/**
 * Mixin `Emitter` and `RequestBase`.
 */

Emitter(Request.prototype);
RequestBase(Request.prototype);

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} [pass] optional in case of using 'bearer' as type
 * @param {Object} options with 'type' property 'auto', 'basic' or 'bearer' (default 'basic')
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass, options){
  if (1 === arguments.length) pass = '';
  if (typeof pass === 'object' && pass !== null) { // pass is optional and can be replaced with options
    options = pass;
    pass = '';
  }
  if (!options) {
    options = {
      type: 'function' === typeof btoa ? 'basic' : 'auto',
    };
  }

  var encoder = function(string) {
    if ('function' === typeof btoa) {
      return btoa(string);
    }
    throw new Error('Cannot use basic auth, btoa is not a function');
  };

  return this._auth(user, pass, options, encoder);
};

/**
 * Add query-string `val`.
 *
 * Examples:
 *
 *   request.get('/shoes')
 *     .query('size=10')
 *     .query({ color: 'blue' })
 *
 * @param {Object|String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `options` (or filename).
 *
 * ``` js
 * request.post('/upload')
 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String|Object} options
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function(field, file, options){
  if (file) {
    if (this._data) {
      throw Error("superagent can't mix .send() and .attach()");
    }

    this._getFormData().append(field, file, options || file.name);
  }
  return this;
};

Request.prototype._getFormData = function(){
  if (!this._formData) {
    this._formData = new root.FormData();
  }
  return this._formData;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  if (this._shouldRetry(err, res)) {
    return this._retry();
  }

  var fn = this._callback;
  this.clearTimeout();

  if (err) {
    if (this._maxRetries) err.retries = this._retries - 1;
    this.emit('error', err);
  }

  fn(err, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
  err.crossDomain = true;

  err.status = this.status;
  err.method = this.method;
  err.url = this.url;

  this.callback(err);
};

// This only warns, because the request is still likely to work
Request.prototype.buffer = Request.prototype.ca = Request.prototype.agent = function(){
  console.warn("This is not supported in browser version of superagent");
  return this;
};

// This throws, because it can't send/receive data as expected
Request.prototype.pipe = Request.prototype.write = function(){
  throw Error("Streaming is not supported in browser version of superagent");
};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */
Request.prototype._isHost = function _isHost(obj) {
  // Native objects stringify to [object File], [object Blob], [object FormData], etc.
  return obj && 'object' === typeof obj && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== '[object Object]';
}

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  if (this._endCalled) {
    console.warn("Warning: .end() was called twice. This is not supported in superagent");
  }
  this._endCalled = true;

  // store callback
  this._callback = fn || noop;

  // querystring
  this._finalizeQueryString();

  return this._end();
};

Request.prototype._end = function() {
  var self = this;
  var xhr = (this.xhr = request.getXHR());
  var data = this._formData || this._data;

  this._setTimeouts();

  // state change
  xhr.onreadystatechange = function(){
    var readyState = xhr.readyState;
    if (readyState >= 2 && self._responseTimeoutTimer) {
      clearTimeout(self._responseTimeoutTimer);
    }
    if (4 != readyState) {
      return;
    }

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status;
    try { status = xhr.status } catch(e) { status = 0; }

    if (!status) {
      if (self.timedout || self._aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  var handleProgress = function(direction, e) {
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
    }
    e.direction = direction;
    self.emit('progress', e);
  };
  if (this.hasListeners('progress')) {
    try {
      xhr.onprogress = handleProgress.bind(null, 'download');
      if (xhr.upload) {
        xhr.upload.onprogress = handleProgress.bind(null, 'upload');
      }
    } catch(e) {
      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
      // Reported here:
      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
    }
  }

  // initiate request
  try {
    if (this.username && this.password) {
      xhr.open(this.method, this.url, true, this.username, this.password);
    } else {
      xhr.open(this.method, this.url, true);
    }
  } catch (err) {
    // see #1149
    return this.callback(err);
  }

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if (!this._formData && 'GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
    // serialize stuff
    var contentType = this._header['content-type'];
    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
    if (!serialize && isJSON(contentType)) {
      serialize = request.serialize['application/json'];
    }
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;

    if (this.header.hasOwnProperty(field))
      xhr.setRequestHeader(field, this.header[field]);
  }

  if (this._responseType) {
    xhr.responseType = this._responseType;
  }

  // send stuff
  this.emit('request', this);

  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
  // We need null here if data is undefined
  xhr.send(typeof data !== 'undefined' ? data : null);
  return this;
};

request.agent = function() {
  return new Agent();
};

["GET", "POST", "OPTIONS", "PATCH", "PUT", "DELETE"].forEach(function(method) {
  Agent.prototype[method.toLowerCase()] = function(url, fn) {
    var req = new request.Request(method, url);
    this._setDefaults(req);
    if (fn) {
      req.end(fn);
    }
    return req;
  };
});

Agent.prototype.del = Agent.prototype['delete'];

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn) {
  var req = request('GET', url);
  if ('function' == typeof data) (fn = data), (data = null);
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn) {
  var req = request('HEAD', url);
  if ('function' == typeof data) (fn = data), (data = null);
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * OPTIONS query to `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.options = function(url, data, fn) {
  var req = request('OPTIONS', url);
  if ('function' == typeof data) (fn = data), (data = null);
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

function del(url, data, fn) {
  var req = request('DELETE', url);
  if ('function' == typeof data) (fn = data), (data = null);
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
}

request['del'] = del;
request['delete'] = del;

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn) {
  var req = request('PATCH', url);
  if ('function' == typeof data) (fn = data), (data = null);
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn) {
  var req = request('POST', url);
  if ('function' == typeof data) (fn = data), (data = null);
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn) {
  var req = request('PUT', url);
  if ('function' == typeof data) (fn = data), (data = null);
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return null !== obj && 'object' === typeof obj;
}

module.exports = isObject;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Expose `Emitter`.
 */

if (true) {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Module of mixed-in functions shared between node and client code
 */
var isObject = __webpack_require__(1);

/**
 * Expose `RequestBase`.
 */

module.exports = RequestBase;

/**
 * Initialize a new `RequestBase`.
 *
 * @api public
 */

function RequestBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in RequestBase.prototype) {
    obj[key] = RequestBase.prototype[key];
  }
  return obj;
}

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.clearTimeout = function _clearTimeout(){
  clearTimeout(this._timer);
  clearTimeout(this._responseTimeoutTimer);
  delete this._timer;
  delete this._responseTimeoutTimer;
  return this;
};

/**
 * Override default response body parser
 *
 * This function will be called to convert incoming data into request.body
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.parse = function parse(fn){
  this._parser = fn;
  return this;
};

/**
 * Set format of binary response body.
 * In browser valid formats are 'blob' and 'arraybuffer',
 * which return Blob and ArrayBuffer, respectively.
 *
 * In Node all values result in Buffer.
 *
 * Examples:
 *
 *      req.get('/')
 *        .responseType('blob')
 *        .end(callback);
 *
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.responseType = function(val){
  this._responseType = val;
  return this;
};

/**
 * Override default request body serializer
 *
 * This function will be called to convert data set via .send or .attach into payload to send
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.serialize = function serialize(fn){
  this._serializer = fn;
  return this;
};

/**
 * Set timeouts.
 *
 * - response timeout is time between sending request and receiving the first byte of the response. Includes DNS and connection time.
 * - deadline is the time from start of the request to receiving response body in full. If the deadline is too short large files may not load at all on slow connections.
 *
 * Value of 0 or false means no timeout.
 *
 * @param {Number|Object} ms or {response, deadline}
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.timeout = function timeout(options){
  if (!options || 'object' !== typeof options) {
    this._timeout = options;
    this._responseTimeout = 0;
    return this;
  }

  for(var option in options) {
    switch(option) {
      case 'deadline':
        this._timeout = options.deadline;
        break;
      case 'response':
        this._responseTimeout = options.response;
        break;
      default:
        console.warn("Unknown timeout option", option);
    }
  }
  return this;
};

/**
 * Set number of retry attempts on error.
 *
 * Failed requests will be retried 'count' times if timeout or err.code >= 500.
 *
 * @param {Number} count
 * @param {Function} [fn]
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.retry = function retry(count, fn){
  // Default to 1 if no count passed or true
  if (arguments.length === 0 || count === true) count = 1;
  if (count <= 0) count = 0;
  this._maxRetries = count;
  this._retries = 0;
  this._retryCallback = fn;
  return this;
};

var ERROR_CODES = [
  'ECONNRESET',
  'ETIMEDOUT',
  'EADDRINFO',
  'ESOCKETTIMEDOUT'
];

/**
 * Determine if a request should be retried.
 * (Borrowed from segmentio/superagent-retry)
 *
 * @param {Error} err
 * @param {Response} [res]
 * @returns {Boolean}
 */
RequestBase.prototype._shouldRetry = function(err, res) {
  if (!this._maxRetries || this._retries++ >= this._maxRetries) {
    return false;
  }
  if (this._retryCallback) {
    try {
      var override = this._retryCallback(err, res);
      if (override === true) return true;
      if (override === false) return false;
      // undefined falls back to defaults
    } catch(e) {
      console.error(e);
    }
  }
  if (res && res.status && res.status >= 500 && res.status != 501) return true;
  if (err) {
    if (err.code && ~ERROR_CODES.indexOf(err.code)) return true;
    // Superagent timeout
    if (err.timeout && err.code == 'ECONNABORTED') return true;
    if (err.crossDomain) return true;
  }
  return false;
};

/**
 * Retry request
 *
 * @return {Request} for chaining
 * @api private
 */

RequestBase.prototype._retry = function() {

  this.clearTimeout();

  // node
  if (this.req) {
    this.req = null;
    this.req = this.request();
  }

  this._aborted = false;
  this.timedout = false;

  return this._end();
};

/**
 * Promise support
 *
 * @param {Function} resolve
 * @param {Function} [reject]
 * @return {Request}
 */

RequestBase.prototype.then = function then(resolve, reject) {
  if (!this._fullfilledPromise) {
    var self = this;
    if (this._endCalled) {
      console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises");
    }
    this._fullfilledPromise = new Promise(function(innerResolve, innerReject) {
      self.end(function(err, res) {
        if (err) innerReject(err);
        else innerResolve(res);
      });
    });
  }
  return this._fullfilledPromise.then(resolve, reject);
};

RequestBase.prototype['catch'] = function(cb) {
  return this.then(undefined, cb);
};

/**
 * Allow for extension
 */

RequestBase.prototype.use = function use(fn) {
  fn(this);
  return this;
};

RequestBase.prototype.ok = function(cb) {
  if ('function' !== typeof cb) throw Error("Callback required");
  this._okCallback = cb;
  return this;
};

RequestBase.prototype._isResponseOK = function(res) {
  if (!res) {
    return false;
  }

  if (this._okCallback) {
    return this._okCallback(res);
  }

  return res.status >= 200 && res.status < 300;
};

/**
 * Get request header `field`.
 * Case-insensitive.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

RequestBase.prototype.get = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Get case-insensitive header `field` value.
 * This is a deprecated internal API. Use `.get(field)` instead.
 *
 * (getHeader is no longer used internally by the superagent code base)
 *
 * @param {String} field
 * @return {String}
 * @api private
 * @deprecated
 */

RequestBase.prototype.getHeader = RequestBase.prototype.get;

/**
 * Set header `field` to `val`, or multiple fields with one object.
 * Case-insensitive.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Remove header `field`.
 * Case-insensitive.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 */
RequestBase.prototype.unset = function(field){
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Write the field `name` and `val`, or multiple fields with one object
 * for "multipart/form-data" request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 *
 * request.post('/upload')
 *   .field({ foo: 'bar', baz: 'qux' })
 *   .end(callback);
 * ```
 *
 * @param {String|Object} name
 * @param {String|Blob|File|Buffer|fs.ReadStream} val
 * @return {Request} for chaining
 * @api public
 */
RequestBase.prototype.field = function(name, val) {
  // name should be either a string or an object.
  if (null === name || undefined === name) {
    throw new Error('.field(name, val) name can not be empty');
  }

  if (this._data) {
    console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObject(name)) {
    for (var key in name) {
      this.field(key, name[key]);
    }
    return this;
  }

  if (Array.isArray(val)) {
    for (var i in val) {
      this.field(name, val[i]);
    }
    return this;
  }

  // val should be defined now
  if (null === val || undefined === val) {
    throw new Error('.field(name, val) val can not be empty');
  }
  if ('boolean' === typeof val) {
    val = '' + val;
  }
  this._getFormData().append(name, val);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */
RequestBase.prototype.abort = function(){
  if (this._aborted) {
    return this;
  }
  this._aborted = true;
  this.xhr && this.xhr.abort(); // browser
  this.req && this.req.abort(); // node
  this.clearTimeout();
  this.emit('abort');
  return this;
};

RequestBase.prototype._auth = function(user, pass, options, base64Encoder) {
  switch (options.type) {
    case 'basic':
      this.set('Authorization', 'Basic ' + base64Encoder(user + ':' + pass));
      break;

    case 'auto':
      this.username = user;
      this.password = pass;
      break;

    case 'bearer': // usage would be .auth(accessToken, { type: 'bearer' })
      this.set('Authorization', 'Bearer ' + user);
      break;
  }
  return this;
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

RequestBase.prototype.withCredentials = function(on) {
  // This is browser-only functionality. Node side is no-op.
  if (on == undefined) on = true;
  this._withCredentials = on;
  return this;
};

/**
 * Set the max redirects to `n`. Does noting in browser XHR implementation.
 *
 * @param {Number} n
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.redirects = function(n){
  this._maxRedirects = n;
  return this;
};

/**
 * Maximum size of buffered response body, in bytes. Counts uncompressed size.
 * Default 200MB.
 *
 * @param {Number} n
 * @return {Request} for chaining
 */
RequestBase.prototype.maxResponseSize = function(n){
  if ('number' !== typeof n) {
    throw TypeError("Invalid argument");
  }
  this._maxResponseSize = n;
  return this;
};

/**
 * Convert to a plain javascript object (not JSON string) of scalar properties.
 * Note as this method is designed to return a useful non-this value,
 * it cannot be chained.
 *
 * @return {Object} describing method, url, and data of this request
 * @api public
 */

RequestBase.prototype.toJSON = function() {
  return {
    method: this.method,
    url: this.url,
    data: this._data,
    headers: this._header,
  };
};

/**
 * Send `data` as the request body, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"}')
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
 *      request.post('/user')
 *        .send('name=tobi')
 *        .send('species=ferret')
 *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.send = function(data){
  var isObj = isObject(data);
  var type = this._header['content-type'];

  if (this._formData) {
    console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObj && !this._data) {
    if (Array.isArray(data)) {
      this._data = [];
    } else if (!this._isHost(data)) {
      this._data = {};
    }
  } else if (data && this._data && this._isHost(this._data)) {
    throw Error("Can't merge these send calls");
  }

  // merge
  if (isObj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    // default to x-www-form-urlencoded
    if (!type) this.type('form');
    type = this._header['content-type'];
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!isObj || this._isHost(data)) {
    return this;
  }

  // default to json
  if (!type) this.type('json');
  return this;
};

/**
 * Sort `querystring` by the sort function
 *
 *
 * Examples:
 *
 *       // default order
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery()
 *         .end(callback)
 *
 *       // customized sort function
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery(function(a, b){
 *           return a.length - b.length;
 *         })
 *         .end(callback)
 *
 *
 * @param {Function} sort
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.sortQuery = function(sort) {
  // _sort default to true but otherwise can be a function or boolean
  this._sort = typeof sort === 'undefined' ? true : sort;
  return this;
};

/**
 * Compose querystring to append to req.url
 *
 * @api private
 */
RequestBase.prototype._finalizeQueryString = function(){
  var query = this._query.join('&');
  if (query) {
    this.url += (this.url.indexOf('?') >= 0 ? '&' : '?') + query;
  }
  this._query.length = 0; // Makes the call idempotent

  if (this._sort) {
    var index = this.url.indexOf('?');
    if (index >= 0) {
      var queryArr = this.url.substring(index + 1).split('&');
      if ('function' === typeof this._sort) {
        queryArr.sort(this._sort);
      } else {
        queryArr.sort();
      }
      this.url = this.url.substring(0, index) + '?' + queryArr.join('&');
    }
  }
};

// For backwards compat only
RequestBase.prototype._appendQueryString = function() {console.trace("Unsupported");}

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

RequestBase.prototype._timeoutError = function(reason, timeout, errno){
  if (this._aborted) {
    return;
  }
  var err = new Error(reason + timeout + 'ms exceeded');
  err.timeout = timeout;
  err.code = 'ECONNABORTED';
  err.errno = errno;
  this.timedout = true;
  this.abort();
  this.callback(err);
};

RequestBase.prototype._setTimeouts = function() {
  var self = this;

  // deadline
  if (this._timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self._timeoutError('Timeout of ', self._timeout, 'ETIME');
    }, this._timeout);
  }
  // response timeout
  if (this._responseTimeout && !this._responseTimeoutTimer) {
    this._responseTimeoutTimer = setTimeout(function(){
      self._timeoutError('Response timeout of ', self._responseTimeout, 'ETIMEDOUT');
    }, this._responseTimeout);
  }
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Module dependencies.
 */

var utils = __webpack_require__(5);

/**
 * Expose `ResponseBase`.
 */

module.exports = ResponseBase;

/**
 * Initialize a new `ResponseBase`.
 *
 * @api public
 */

function ResponseBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in ResponseBase.prototype) {
    obj[key] = ResponseBase.prototype[key];
  }
  return obj;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

ResponseBase.prototype.get = function(field) {
  return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

ResponseBase.prototype._setHeaderProperties = function(header){
    // TODO: moar!
    // TODO: make this a util

    // content-type
    var ct = header['content-type'] || '';
    this.type = utils.type(ct);

    // params
    var params = utils.params(ct);
    for (var key in params) this[key] = params[key];

    this.links = {};

    // links
    try {
        if (header.link) {
            this.links = utils.parseLinks(header.link);
        }
    } catch (err) {
        // ignore
    }
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

ResponseBase.prototype._setStatusProperties = function(status){
    var type = status / 100 | 0;

    // status / class
    this.status = this.statusCode = status;
    this.statusType = type;

    // basics
    this.info = 1 == type;
    this.ok = 2 == type;
    this.redirect = 3 == type;
    this.clientError = 4 == type;
    this.serverError = 5 == type;
    this.error = (4 == type || 5 == type)
        ? this.toError()
        : false;

    // sugar
    this.created = 201 == status;
    this.accepted = 202 == status;
    this.noContent = 204 == status;
    this.badRequest = 400 == status;
    this.unauthorized = 401 == status;
    this.notAcceptable = 406 == status;
    this.forbidden = 403 == status;
    this.notFound = 404 == status;
    this.unprocessableEntity = 422 == status;
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.type = function(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.params = function(str){
  return str.split(/ *; */).reduce(function(obj, str){
    var parts = str.split(/ *= */);
    var key = parts.shift();
    var val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Parse Link header fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.parseLinks = function(str){
  return str.split(/ *, */).reduce(function(obj, str){
    var parts = str.split(/ *; */);
    var url = parts[0].slice(1, -1);
    var rel = parts[1].split(/ *= */)[1].slice(1, -1);
    obj[rel] = url;
    return obj;
  }, {});
};

/**
 * Strip content related fields from `header`.
 *
 * @param {Object} header
 * @return {Object} header
 * @api private
 */

exports.cleanHeader = function(header, changesOrigin){
  delete header['content-type'];
  delete header['content-length'];
  delete header['transfer-encoding'];
  delete header['host'];
  // secuirty
  if (changesOrigin) {
    delete header['authorization'];
    delete header['cookie'];
  }
  return header;
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

function Agent() {
  this._defaults = [];
}

["use", "on", "once", "set", "query", "type", "accept", "auth", "withCredentials", "sortQuery", "retry", "ok", "redirects",
 "timeout", "buffer", "serialize", "parse", "ca", "key", "pfx", "cert"].forEach(function(fn) {
  /** Default setting for all requests from this agent */
  Agent.prototype[fn] = function(/*varargs*/) {
    this._defaults.push({fn:fn, arguments:arguments});
    return this;
  }
});

Agent.prototype._setDefaults = function(req) {
    this._defaults.forEach(function(def) {
      req[def.fn].apply(req, def.arguments);
    });
};

module.exports = Agent;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(8);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(18)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(9);
exports = module.exports = __webpack_require__(10)(false);
// imports


// module
exports.push([module.i, "#filery-dialog-body{background:#c5c5c5}#filery-dialog-body .filery-container{overflow:hidden;padding:0 10px 0 0;position:relative}.filery-container .filery-item{display:block;float:left;padding:2px;position:relative;width:calc(50% - 4px)}.filery-item.disabled{opacity:.5}.filery-item.disabled .filery-item-body:hover{background:#fff;cursor:not-allowed}.filery-item.selected .filery-item-body,.filery-item.selected .filery-item-body:hover{background:#f0f6fd;border-color:#1e6abc;transition:all .3s ease}.filery-item.selected .file-buttons{display:block;transition:all .3s ease}.filery-item.selected .file-title .file-title-name{margin:20px 0 0;transition:all .3s ease}.filery-item .filery-item-body:hover{background:#f0f6fd;border-color:transparent;transition:all .3s ease}.filery-item .filery-item-body{background:#fff;border:3px solid transparent;cursor:pointer;display:block;overflow:hidden;transition:all .3s ease}.filery-item .file-buttons{bottom:4px;display:none;position:absolute;right:4px;transition:all .3s ease}.filery-item .file-buttons ul{list-style:none;margin:0!important;padding:5px}.filery-item .file-buttons ul li{background:#2276d2;color:#fff;cursor:pointer;display:inline-block;font-size:11px;height:16px;line-height:16px;margin:0 0 0 2px;padding:3px 5px}.filery-item .file-buttons ul li:hover{background:#1e6abc}.filery-item .file-buttons ul li .mce-ico{color:#fff;font-size:16px;height:16px;line-height:13px;text-align:center;width:16px}.filery-item .file-buttons ul li.delete{background:#fff;border:1px solid #b3b3b3;color:#595959;padding:2px}.filery-item .file-buttons ul li.delete .mce-ico{color:#595959}.filery-item .file-thumbnail{float:left;height:80px;padding:5px;position:relative;width:80px}.filery-item .file-thumbnail .file-thumbnail-image{background:url(" + escape(__webpack_require__(11)) + ") no-repeat 50%;bottom:0;height:80%;left:0;margin:auto;position:absolute;right:0;top:0;width:80%}.filery-item .file-thumbnail .file-thumbnail-image.audio{background-image:url(" + escape(__webpack_require__(12)) + ")}.filery-item .file-thumbnail .file-thumbnail-image.code{background-image:url(" + escape(__webpack_require__(13)) + ")}.filery-item .file-thumbnail .file-thumbnail-image.text{background-image:url(" + escape(__webpack_require__(14)) + ")}.filery-item .file-thumbnail .file-thumbnail-image.image{background-image:url(" + escape(__webpack_require__(15)) + ")}.filery-item .file-thumbnail .file-thumbnail-image.zip{background-image:url(" + escape(__webpack_require__(16)) + ")}.filery-item .file-thumbnail .file-thumbnail-image.video{background-image:url(" + escape(__webpack_require__(17)) + ")}.filery-item .file-title{float:left;height:80px;padding:5px;width:calc(100% - 100px)}.filery-item .file-title .file-title-name{display:block;font-weight:700;height:20px;margin:25px 0 0;overflow:hidden;text-overflow:ellipsis;transition:all .3s ease;white-space:nowrap}.filery-item .file-title .file-title-meta{color:#929292;height:20px;list-style:none;margin:0;padding:0}.filery-item .file-title .file-title-meta li{display:inline-block;font-size:12px;margin:0 5px 0 0}", ""]);

// exports


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = function escape(url) {
    if (typeof url !== 'string') {
        return url
    }
    // If url is already wrapped in quotes, remove them
    if (/^['"].*['"]$/.test(url)) {
        url = url.slice(1, -1);
    }
    // Should url be wrapped?
    // See https://drafts.csswg.org/css-values-3/#urls
    if (/["'() \t\n]/.test(url)) {
        return '"' + url.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"'
    }

    return url
}


/***/ }),
/* 10 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACz0lEQVR4Ae2bT2saQRjGo6s3L5Jb0n6G+gGkyalJaAq9WNr03lv8gyRn78H1Ty/Fe7HgqdRSekzwnCL0EzQlJReFkNxc7fPKCrJk2XXeFfYl78Iy68y8M+/zm2edCJONDb2UgBJQAkrg8RJIcKTbtr2dSqXOMMYO7i3OWH6x0+m0VC6X237t3HpjAK74IRLY5CYREO8AwmtA6Af0M2o2BtBqtT4nEokjzPoD94disfjXKAOfoHa7PVtqusPzc8zxa6kuksek6SgQv+vGRi5+OafZbPYRnzMov5HrltuieDYGgMnn73zUK+8VNRgMKqj7DuDblmX1a7VaxtuH85kDgDNv6Nher+eMRqO3CBgCQi6bzXYLhYIVeoCAjrEHQPlj1ek74BD3NSAc5vP5BtVHcYkAQELpVXMc5xW+C+4B4bjZbBYfFQASW6lULlG8B4RpMpm0AYFcwbrEOGChslQqfcXzCW4LELqNRiO3aDMpxQEgkYBgwwWf8JgBhD5nexQJgCCMx+NjFD+522OcAVyT0Hq9/pRK74WdYYK6N3DCb872GFsAEHZBovFjq4M/i594AdBn7Ay3KF6i743p9ph6aOA41E0mk1OIfwFh+8jnChAC00Jfei1W2h5j64BqtXoFCDms7hfc/wLVG3aIrQNID0FA8S6MNs+vxzAh8z6xdUBoBcyOCoAJUHy4OkD8EjIFqAOYAMWHqwPELyFTgDqACVB8uDpA/BIyBagDmADFh6sDxC8hU4A6gAlQfLg6QPwSMgWoA5gAxYerA8QvIVOAOoAJUHy4OkD8EjIFqAOYAMWHqwPELyFTAMcB81NcfgeYmHmtFL7IweQoDQfAuZtlx+8o20oqDDu74jtu+CKn0KNxzgidgvgeTmYdpNPpP0gk9KTr6IhcRsiFjtCudBk7gE5vY8JnmHitp7iC1Li271Iu6/7njaBctF0JKAF5BP4Dai3F4B4r5IQAAAAASUVORK5CYII="

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEmUlEQVR4Ae2azUtUURjGHUcTwY200/ob0miRYObKCg3aGH1Qy3Y6fpREkYhlaOao0yZcFmHgKjSiZSZMC1GE/oIUpc0IUYjTfPR75d64DDPeO/ecmbmj98DhnHs+3+d53nPPuR8VFX7wGfAZ8BnwGTi+DARUoIfD4caqqqpJxrhIbFAZK1ffVCoV6uvri+SqVy13TYABfgMDTqoaYdM/CQnXIGHJpp2ratcEzM7OvgsEAreY9RPxXm9v75YrC3J0ikQiaUvVb/JtzLFuKdOSrXQ7CuDbjb7awVttSqfTr7iuI10Ur7PW6ci7JoDJD9a8buUzQa2srPRT9hHCG4PB4NLIyEhdZhuVaxUCVOZ13HdhYSEZi8Vu0GEDEprq6+vnu7u7g44HsGnoeQLEflSXe0AXcRsSulpbW6elXEcoCwIEqCy1ZDJ5lXvBH0jomZmZ6T1WBAjY/v7+NZLbkJCqrKwMQ4J4hVIoGw8wUYZCoQ/kHxCDkDA/PT3dZNa5ScuOAAEJCWG84DXZOkhYUtkey5IAIWF3d7eH5LPq9uhlArYF6NTU1GlJMwM7Q4Ky63jCd5Xt0bMEAGxZQPOwNcex+FQmAXLNzvCLpJO2P91uj1XZBvZCWSKRGAJ8B8AuY88mJNiaRVtZFnltj571gMHBwU1IaELd98QdW/QuG3jWAwSPkEBy0wm2jKdHJ10O2njWAxwjUGzoE6BIYNl39z2g7CVUBODpXcDExh2+hnwzL0dbOPu3sC228DyQ9YRo9nGaepIAOfkJWA42Es8D+CxpDeAPcJF3is+2XckJyKYuVp8ywRoI9iHhG/ko4OUdobZQdAKs6oJC3Lk5U13KtiiL4gVRAc7L0DXO/fuCmv7lTQAYNq3qAvC/uuSj1EVZ31sCthih6B5ggkLdAQGL0uumumZdMdOSEcCnLm1vdlUI8w9CKuwdhb6+BxwFFVUw+B6gwt5R6HvsPaBk5wA77+FrzwWOwPIJ7BxR7JS/Q14QtQZPEsBHz0ecEp+B1PrY18G1RK2hYAS4VRDwbQKe54K/HJOH+ST+RhDjDXcpG6XshE4GCkIAP1A9xtCnGJq3gvS7L/0IwzwjTFjATvAkKJfjljLlrPaboCgo4EVBrHuIgg0SJU9Z3IHFsuYrTOWt7ff29t5ar3XktXtAMRSESG1firR7AKrkVDCbqllUXJUyWfOZdbW1tXeMsoM2mfVurrV7wGFGxOPxACAqDlMQkiYB38k4o7LmTdLMmyDlKWlz2Dz51BXCA5QUHBgY+AqAYaKIMw7wbYmSlzLIe2K04VI9aPcADHyJWUoK8kpsjG10GeDmQUiQroryOsHLoNoJ4E3PMtugKDhKFAWt21bKqYIGUPGGgoZCLAH5iWkMtdoBu0jcMeKilEHQ84IiynNw7R5gzl8sBc353KYF8QC3xpSinwoBcmeWDxVZf2AqJhjTBllq+c6rQsAXY7K5XL+y5WuMm/YG+Dmjr2mT46FU7gFDMH6Jo++V6urqH3JoKWXAlhi2yLaZV3DtATypyfe7M0xc0L+47NAYbj8vtohNdu39ep8BnwGfASsD/wCFydj2qVnUJAAAAABJRU5ErkJggg=="

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEBklEQVR4Ae2au2/TUBTGm9fWJWKjIDrCRP+ACjzxEEWCoTx3tiaNWjqwEBYW2qQNC+qOCsqAEEWIiYI6gyohwUZLURFLKiGYmgffV+VKlmXXjo+vsdVrybr2vffce76fz8mNH0NDZjMEDAFDwBA4vAQyEum1Wm0kn88/whhnsR+VjOVl2+12y9PT0w2vdml9aAB98Rtw4IjUCR/7DiBcAYRVn36hmkMDWFpaeprJZG5h1jfY75RKpR+hPPAwajQaPVvTHxyfwRyfbHWRHGbDjgLxVt82cvF2n3q93mOcD6N8xaizt0VxHBoAJt/P+aivvFPU+vp6BXWvAXwkl8utVqvVYWcfybkEgGTewLbNZrPTarVuwGADEMaKxeLK5ORkLvAAPh0TD4D+46rzN2AC+w4gTIyPj9dZH8WWCgAUylTrdDqX8VvwFxCmFhcXS4cKAMVWKpWPKG4DQjebzdYAgVEh2lITAUpluVx+ieO72HOAsFKv18dUW5gydQAoEhBqiIInOBwGhFXJ8phKAISwu7s7heKtdHlMMoAdCl1YWDjO0rlhZWij7hoi4bNkeUwsAAj7QNG42VrG3+JjTgA8x8rwG8Ul9P0VdnnMuw2chLp2uz0H8ecg7AL82QYEX7fQl2kx0PKY2AiYmZnZBoQxXN1n2H/6qg/ZIbERQD2EgOJmEG2Ou8cgJvt9EhsBgRUIOxoAQoCpNzcRkPpLKBRgIkAIMPXmJgJSfwmFAkwECAGm3txEQOovoVBAIu4G8WBzFG99vkHLFh5yjAo1DWSelBSw6DXu+9dYxrnFAgBvkqvcvYThya7FNrwGX2OpNj871U9SagdAEXhUdR/7vfn5+ZNuzqLNYj3e/LxT7exLG9oeBE/1D1tqBaDEw7k9hPf12dnZr05Hmf+oO4F9C+1bqp19aYPzPZ0QtAFwisfLjBdKnKO0eO6W/7TRDUELgAHED3nlv4KkG0LkAAYRT5Eq/3G4xnO3TSeEyAG4CfCqs+c/3vxuevXTWR85AFytKvL2AZwu4Oo+R0RcPUCAxTa3/LfbcAyOhboCx+Yc9nbJceQA6ExQCH75z7F0iuf4WgBw4CAQ/PJft3itANwg2P8IqfxHSG+65T/aT+kKe/qmNm0RoCZQkQChDx1/hKx+n/eqr70ElC+0iTrn7XPwOJa7QbcfrSD572bnFCA91x4BXg765b+XXdT1sUSAm9Nx3/e7+cC6/xYBXg7FXW8AxE08afNJImD/Ky6vD5jiFKp8wJI58Kc0EgBq/V72+pQtDgh98cv9uZRPgaeWrAJzIH4ey9nFQqHwHY4EnlRHR/jSgi/8hHagLXQE8OttTHgaE2v9istPTT/sV+gLffLrb9oNAUPAELAT+AfgtbbFNhUwgwAAAABJRU5ErkJggg=="

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADHUlEQVR4Ae2aS4sTQRDHk0xyyyV4c/UzmA8Q1JMPXMFLxMfd2+ZBcM+5SyYPL5K7RMhJjIjHlVy8KAt+AndRvCQg6y2T+O9lBpohs93Tj2Wa1MAwPdPV1VW/qu5KoHM5uogAESACRGB3CeR1XPd9f69YLL6Cjlu4r+roShq7Xq+brVZrlNSv+10ZQOj8MQy4omuEYHwACI8AYSaQU+pWBjAcDt/m8/lnmPUT7heNRuNUyYKEQaPRaMN1naF9E3N8574ZaRZUtcD52+FY487zNm02m9d4L+P5gWUd32eirQwAk5+vedORjzs1n8/b+PYRwPc8z5t1u91yXEbnXQeAzrzSY6fTabBYLJ5gwDEgVCuVyqRer3vSCgSCRUF/6u7Y2k0cj8yR3n8Q9TPo3Yeyr4CwX6vV+gDTSFSeoiPzGRD5wpZaEAQPsRf8A4SDwWCQbQAswnyU4++RY2me7Xb7G+SfA8K6UCj4gMCyQutyJgMiL5vN5nu0X+L2AGHS7/erUZ/K0zgAUaRF/TJOAIKPLHgD2TIgzHTKo3EAMg6YkFkulwfQ81m3PGYZwC8GqtfrXd8GDJVhhe+PkQk/dMpjZgHAsS/McfzZGqMEXtsGAcvpL74/gOyfqDxuk7vom/HfARdNlqZvtVodwvk7cOwexp0AgnA4ZNmySFUeM5sBnU7nBBCqiO473L+F3isKWM8Atusr2pZjEDD2qcx42V+gcV2ZzYC4obbeCYAtsq7oNb4HqK7FtMB09hZ+rp1fAsYzwFRk+CjZbO98BhAAm+nlgm7jewBVARfCztloPAOoCnB0XWhSFXAhSjZtNL4HUBWwGS4Luo1nAFUBC1GyqZKqgE26Lug2vgdQFXAh7JyNxjOAqgBH14UmVQEXomTTRuN7AFUBm+GyoNt4BlAVsBAlmyqpCtik64JunQw4P8WFXX/rAabLdD6yQeUojQ6Ao9DJcdJRtsuAEDo/DueKbJKeWqcKHIL4XZzMul8qlX7CEOlJbQjClgVsYUdoU13KGYByd4oJb2Biq6e4RN6EaT9htjCbRPLUTwSIABHgCfwHjO70GFXHf2wAAAAASUVORK5CYII="

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEI0lEQVR4Ae1azWsTQRRvvhHioamItXroRYQeWk9SSNSTWmxRkIqtN4XemjQUeysEr/lq04stngSpUBTEFhVBqESPSsG/wIaIlxREBSEf/l7YhWVJsrszO8kumYFhZmfmzbzfb97M7M6+gQEZJAOSAcmAZKB/GfDwQM/lciN+vz+NPi4jnubpq51svV5PLC0tFdrV85YzE6CAP4ACQ7xKGMjXQMItkLBr0I6pmpmA9fX1Zx6PZx6jvkFciMfjJSYN2ggVCoWGpuo38pcwxldNmS1ZL2svAH9FkbUdvFanRqOxgecw0tdkddo6O/LMBGDw5pq3e+b1oIrFYhJleyB8xOfz7aZSqbC+Dc8zDwE845qW3dnZqVUqlbsQOAAJE4ODg9uzs7M+0x0YNHQ8AaQ/Zp32gGnEMkiYjkajeSq3I7iCAAJKS61Wq81gL/gDEhbX1tbifUUAgU0mk1+Q3AMJda/XmwMJZBVcwTUWoKJMJBKvkH+I6AMJ2/l8fkKtY0ldRwCBBAk5WMFjZMMgYZfneHQlAUTC0dHRIpJ3vMejkwkoE9BsNnuWUn3AyVBF2R1Ywjee49GxBADYRwKNj60tvBaf0RNAzzgZfiG5gbY/WY9Hf6uOnVBWrVZXAP4qgF2HPocgwVAttKVlYel4dKwFLC8vH4KECczuc8QfhugZGzjWAggPkYBkzgw23dejGZFmG8dagGkEnA0lAZwEul5cWoDrp5ATgLQATgJdLy4twPVTyAlAWgAnga4Xt/1bgPWd3CqT+BRm/qulHavvl4DtFqCya9cMqf2pqd0WJi1AZVZ0iuvrKdzgbtE4+N29gDt++qvc8yBsCeiREXhcWTXv9hQiWl526uVEP/f9EugaAWT2uNsrUaS86Jk123/XloCy5g3NHv/7HmCpzODHxzzu/v+aBcLarmsWYEZBuN2sYn94AgJuwg/gQyaTOWFGjqeNIwgghweA3wTwRyoY5C8Gg8FP6XR6VC0TkfacAPzYPBaLxV4CcKt94VwoFPqMl58LIsBTn13ZA7CWgzBpcnb6Rz4/5PZCgwN8BH9/yP1tkp7bhFPYOPexN9yGq9z7Nm2Yi4UTgBegYTg3vYCGTZBwbxkdGxubC4fDQwD/FuXnjbSHdRxH3AMJ943aWq0XSgDAT2JTI/DDqmIAMh2JRIqY1ZPacrW+QxpAX0871DNVCSMAmxqt6Q0ADrbQbBzlLYoNi5iEOvUqjAAA3Ow0sFPqen4K9JoISUCvZ6DX49u+B4i6CRJFlFwCHMyWSRavqS0dmDj6tSyq6oB3C8uuNDwWsK9outXOlc0yEgYBBXzzqg3iqk6me+LZA1bA+DWc91OBQOA7FDE9qIiG0KUCXciF1lJgtgBsdiUMOI6BhXpxGaFRzH6bdCGdjNrLesmAZEAyoGXgP2npK6MUeMjoAAAAAElFTkSuQmCC"

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEIUlEQVR4Ae1aS08UQRBmXzcuxBvobxDvROEiGjDxgjEar97YZUMELxgiXoTsLiwXw5UYTDgZ1ig3JRx9hMRfIATiZUmMXsw+/GozzXbaGefRU70T6Uk6011VXY+vqnuefX32sAhYBCwCFoHzi0BKJ/RyuTyUzWZXoOMa2qCOLq+5rVarMDMzU/Xi69IjA+AEfwAHLug64TO/CRBuA4Saj1wkdmQA1tbWXqZSqXuw+hbtYT6fP3LzoFqttmU65ALZVOb9hI6rmPtF1hVHPx1VCYIfdeZ6Bh9Vtzyv3W6vY9yP8w5VncyLox8ZABjvrHmvzAvnKONy1imzSnaFqOt5f3+/CMYbAD6UyWRqi4uL/a6CEYk6AEQ0GW7a9vZ2s16v38WsA4AwPDAwsDU1NZUJp8Vbmh0ANeNqRXi71uUg67QHTKIdA4TJkZGRSper12MHQM+97mxaas1m8xb2gl8AYXp1dTXf5UbvsQOgZlytiDCuF4vFz5C/DxBa6XS6DBCoKrQOdgC0vHOZXCgUXoP8CC0DELYqlcqwi1hgEjsAasbVigjsqSQIEMqoghcg9QOEms7lkR0Aye9Yu6enp9NQuKt7eWQHQM24WhH/QOWYeKVS6ZKbDK4MDdDvoBK+6lwe2QFwcz4IDYHtkRwetjYA2kW3OQD3B+gTkP0e9fKYdVMcJ40yLuujipDHXv1GozGH4K8jsBuQOYQeL9EzOmRpWYS6PCa2AmZnZw8BwjCy+wrt5CzKmDuBsuFmU2Q2aEaFvNAVdJ6Q9zsL/WH1JrYC/AKOi5/YPSCuAP30nPsKYAeA1qS8LmmtivXqlx0TfHYATAShY8PuATro/Q9z2ZeA3QMSXiZ2D0h4gtjdM74HsEcU0gA7ACH9MS7Ovgfgze043tvRc3rnwF1gDR871/Gxc1fQenlmrQB8QF1A8O8Q4IQU5ATRiCfRetZlAwABjuENzVO8zPiNNo+PGoPUqE804uGV9mjPIncMsy0BBDjv2FjAa+xlKdBlgEPD5/jY+Rjn9zTo1cFWAQjoCgWF9b6pBifROjIq3+SYDQCUedMvkCAyfjp0+WwAwLFP5Bw2vAeqkxLto8ozPWbbA5DdFewDtPsv0ZoXZe8EvwR6G/yS6YBVe2wVgOv8How9QZA5NNrwjqlRn2jEw5PiB9Uh02M2ACgQBPgMpzFUww7aidN2UA2jDs90vH/ZY1sCwpKT5Z5nWvijnlkrQDWWxLEFIIlZMemTrQCTaCfRlq2AJGbFpE+2AkyinURbOhXQ+YsL7/hcf2AyGazwgW61w9rVAUDc3m54/coW1pko8k7wG85c4VNgVTrPAnNAfBxPdjdzudw3OBLYKIcgfKnDF/qFNtQRuQLwkHMEg5dhmPUvLr9onLLfIl/IJz95y7cIWAQsAjICfwAoTowRDqziuQAAAABJRU5ErkJggg=="

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADRElEQVR4Ae2aS4sTQRDHN69bLsGbq5/BfICgnnzgCl4iPu7eNg+Ce85d8vQiuUuEnMSIeFzJWVnYT7C7rHhJQPSWSfxXmIJh2GEmXT2xh+mBoWamu6qrflU9PSG9t2cPS8ASsAQsgfQSyEhC73a7+/l8/g1s3MF5XWIrSHe1WtUbjcYwqF36XBmAG/wJHLgmdSJE3wGEJ4AwDemn1KwMYDAYvM9kMi8w6hecr2q12oWSBwFKw+Fw7Wn6g+vbGOOH55mWy6yqFQR/19XVHrzXp/V6/Rb3RchPVHXeNh3XygAw+GbO6868P6jZbNbEs88Avp/L5abtdrvo7yO5lwCQjBtZdzKZOPP5/BkUTgChXCqVxtVqNRfZQEhH4wGQ/8g6vQMOcF4CwkGlUunRcx1HIgBQoDTVHMd5jHfBX0A47Pf7tVQBoGCbzeZ3iJeAsMpms11AoKoQHYmpAI6yXq9/xPVrnDlAGPd6vTK3qcjEAaAgAaGLKniHyyIgTCXLYyIBEITFYnEI8VW6PJoM4JIC7XQ6N0n6D6wMSzx7iko4lSyPxgJAYN8oaPzYGuGz+IYfAN1jZfgN8Qh9f6kuj/mrDJvwbLlcHiH4ewjsAfw5B4RQt9CXpsVWy6OxFdBqtc4BoYzsfsD5MzR6xQ7GVgDFQxAgnkeJzffrMYrKpo+xFRA5AmFHC0AIMPHqtgISn0JhALYChAATr24rIPEpFAag/UtQ9Yts2zjwQ0j5Pw3vWKmfAtorgOlyhrgi+J7bo0q/Pt9H1Q/rZysgjJBqu+5M6bbHcaW+AmIDQHNedd5zdrxStz22HRsAHsB0GdsqoHvO6rbHibEVwCR0S57/nDmWquP47ana8evZCvAT0XXvzzhncFv7bIfltvph/VNfAbEB0L1u67bHlREbAB7AdGm/A0zPUNz+xTYFdM9Z3fYYbGwAeADT5c7eAdJ1XKoflAhbAUFkVJ/TXFXV/R96qa8ACYDNLi7MzSs3MO0ym+yDylYaCYBjN8hR0Fa2XUBwgx+5Y7FPkYeWrAJHIH4fO7MeFgqFMzgSedA4OsKXOXyhLbRbHcoVgJfdBQa8hYFj3cUVFo1b9mPyhXwK62/bLQFLwBLwEvgH8dYTTD+hviwAAAAASUVORK5CYII="

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target, parent) {
  if (parent){
    return parent.querySelector(target);
  }
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target, parent) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target, parent);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(19);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertAt.before, target);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	if(options.attrs.nonce === undefined) {
		var nonce = getNonce();
		if (nonce) {
			options.attrs.nonce = nonce;
		}
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function getNonce() {
	if (false) {}

	return __webpack_require__.nc;
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 19 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/superagent/lib/client.js
var client = __webpack_require__(0);

// CONCATENATED MODULE: ./src/ts/Filery/Model/File.ts
class File {
    constructor(url, name, size, time, extension, type) {
        this.url = url;
        this.name = name;
        this.size = size;
        this.time = time;
        this.extension = extension;
        this.type = type;
    }
    getName() {
        return this.name;
    }
    getUrl() {
        return this.url;
    }
    getExtension() {
        return this.extension;
    }
    getType() {
        return this.type;
    }
    getFormattedSize(decimals = 2) {
        if (this.size === 0) {
            return '0 Bytes';
        }
        let k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], i = Math.floor(Math.log(this.size) / Math.log(k));
        return parseFloat((this.size / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
    }
    getFormattedTime() {
        let date = new Date(this.time * 1000), month = date.getMonth() + 1, day = date.getDate(), hour = date.getHours(), minute = date.getMinutes();
        return date.getFullYear() + '-' + ((month < 10 ? '0' : '') + month) + '-' + ((day < 10 ? '0' : '') + day) + ' ' + ((hour < 10 ? '0' : '') + hour) + ':' + ((minute < 10 ? '0' : '') + minute);
    }
}

// CONCATENATED MODULE: ./src/ts/Filery/ApiClient.ts


class ApiClient_ApiClient {
    static setUrl(url) {
        this.url = url;
    }
    static handleError(error) {
        let message = error.message;
        try {
            message = JSON.parse(error.response.text).error;
        }
        finally {
        }
        return Promise.reject(tinymce.i18n.translate(message));
    }
    static async read(dir) {
        return await client["get"](this.url)
            .set('X-Filery-Token', tinymce.settings.filery_api_token)
            .query({
            'dir': dir,
        })
            .then((response) => {
            let files = new Array();
            response.body.forEach((value) => {
                files.push(new File(value.url, value.name, value.size, value.time, value.extension, value.type));
            });
            return files;
        })
            .catch(this.handleError);
    }
    static async upload(fileData, dir) {
        let formData = new FormData();
        if (typeof fileData.blob === 'function' && fileData.blob() instanceof Blob) {
            formData.append('file', fileData.blob(), fileData.filename());
        }
        else {
            formData.append('file', fileData);
        }
        return await client["post"](this.url)
            .set('X-Filery-Token', tinymce.settings.filery_api_token)
            .query({
            'dir': dir,
        })
            .send(formData)
            .then((response) => {
            return new File(response.body.url, response.body.name, response.body.size, response.body.time, response.body.extension, response.body.type);
        })
            .catch(this.handleError);
    }
    static async delete(file, dir) {
        return await client["delete"](this.url)
            .set('X-Filery-Token', tinymce.settings.filery_api_token)
            .query({
            'dir': dir,
            'fileName': file.getName(),
        })
            .then((response) => {
            return true;
        })
            .catch(this.handleError);
    }
}

// CONCATENATED MODULE: ./src/ts/Filery/UI/Control.ts
class Control {
    constructor() {
        this.events = {};
    }
    static createByElement(element) {
        let control = new Control();
        control.set(element);
        return control;
    }
    static createByTag(tagName, attributes) {
        let control = new Control();
        control.set(Control.createElement(tagName, attributes));
        return control;
    }
    find(query) {
        return Control.createBySelector(query, this.element);
    }
    getParent() {
        if (this.element.parentElement) {
            return Control.createByElement(this.element.parentElement);
        }
        return null;
    }
    getChildren() {
        let controls = new Array();
        Array.from(this.element.children).forEach((element) => {
            controls.push(Control.createByElement(element));
        });
        return controls;
    }
    getSiblings() {
        let controls = new Array();
        var element = this.element.parentElement.firstChild;
        for (; element; element = element.nextSibling) {
            if (element.nodeType !== 1 || element === this.element)
                continue;
            controls.push(Control.createByElement(element));
        }
        return controls;
    }
    ;
    static createBySelector(query, target) {
        let controls = new Array();
        target.querySelectorAll(query).forEach((element) => {
            controls.push(this.createByElement(element));
        });
        return controls;
    }
    static createByHtml(html) {
        let template = Control.createElement('template');
        template.innerHTML = html.trim();
        let controls = new Array();
        template.content.childNodes.forEach((element) => {
            controls.push(this.createByElement(element));
        });
        return controls;
    }
    static createElement(tagName, attributes) {
        let element = document.createElement(tagName);
        if (attributes) {
            Object.keys(attributes).forEach((key) => {
                let value = attributes[key];
                if (key === 'className') {
                    element.classList.add(value);
                }
                else if (key.startsWith('on') && typeof value === 'function') {
                    element.addEventListener(key.substring(2), value);
                }
                else {
                    if (typeof value === 'boolean' && key) {
                        element.setAttribute(key, '');
                    }
                    else {
                        element.setAttribute(key, value);
                    }
                }
            });
        }
        return element;
    }
    getAttribute(name) {
        return this.element.getAttribute(name);
    }
    setAttribute(name, value) {
        this.element.setAttribute(name, value);
        return this;
    }
    html(html) {
        this.element.innerHTML = html;
        return this;
    }
    get() {
        return this.element;
    }
    set(element) {
        this.element = element;
        return this;
    }
    remove() {
        if (this.element) {
            this.element.remove();
        }
        return this;
    }
    append(child) {
        if (child instanceof Control) {
            this.element.appendChild(child.get());
        }
        else if (typeof child === 'string') {
            this.element.insertAdjacentHTML('beforeend', child);
        }
        return this;
    }
    text(text) {
        this.element.appendChild(document.createTextNode(text));
        return this;
    }
    prepend(child) {
        if (child instanceof Control) {
            this.element.insertAdjacentElement('afterbegin', child.get());
        }
        else if (typeof child === 'string') {
            this.element.insertAdjacentHTML('afterbegin', child);
        }
        return this;
    }
    css(styles) {
        if (typeof styles === 'object') {
            Object.keys(styles).forEach((key) => {
                this.element.style[key] = styles[key];
            });
        }
        else if (typeof styles === 'string') {
            this.element.style.cssText = styles;
        }
        return this;
    }
    on(type, listener, options) {
        this.element.addEventListener(type, listener, options);
        this.events[type] = listener;
        return this;
    }
    once(type, listener, options) {
        this.on(type, listener, options);
        this.trigger(type, (e) => {
            this.off(type);
        });
        return this;
    }
    off(type) {
        this.element.removeEventListener(type, this.events[type]);
        return this;
    }
    trigger(type, detail) {
        if (/^(?:mouse|pointer|contextmenu|drag|drop)|click/.test(type)) {
            this.element.dispatchEvent(new MouseEvent(type, detail));
        }
        else if (/^key/.test(type)) {
            this.element.dispatchEvent(new KeyboardEvent(type, detail));
        }
        else {
            this.element.dispatchEvent(new CustomEvent(type, detail));
        }
        return this;
    }
    unwrap() {
        let parent = this.element.parentElement;
        while (this.element.firstChild)
            parent.insertBefore(this.element.firstChild, this.element);
        parent.removeChild(this.element);
        this.element = parent;
        return this;
    }
    fadeOut(callback, time = 30) {
        let opacity = 1;
        if (this.element.style.opacity) {
            opacity = Number(this.element.style.opacity);
        }
        let fadeEffect = setInterval(() => {
            if (opacity > 0) {
                opacity -= 0.1;
                this.element.style.opacity = String(opacity);
            }
            else {
                this.element.style.display = 'none';
                callback(this);
                clearInterval(fadeEffect);
            }
        }, time);
        return this;
    }
    fadeIn(callback, time = 30) {
        let opacity = 1;
        if (this.element.style.opacity) {
            opacity = Number(this.element.style.opacity);
        }
        let fadeEffect = setInterval(() => {
            if (opacity < 1) {
                opacity += 0.1;
                this.element.style.opacity = String(opacity);
            }
            else {
                this.element.style.display = '';
                callback(this);
                clearInterval(fadeEffect);
            }
        }, time);
        return this;
    }
    addClass(className) {
        this.element.classList.add(className);
        return this;
    }
    removeClass(className) {
        this.element.classList.remove(className);
        return this;
    }
    hasClass(className) {
        return this.element.classList.contains(className);
    }
}

// CONCATENATED MODULE: ./src/ts/Filery/UI/FileThumbnail.ts

class FileThumbnail_FileThumbnail extends Control {
    constructor(file) {
        super();
        this.element = Control.createElement('div', {
            className: 'file-thumbnail'
        });
        let fileThumbnailImage = Control
            .createByTag('span', {
            className: 'file-thumbnail-image'
        })
            .addClass(file.getType());
        if (file.getType() === 'image') {
            fileThumbnailImage.css('background-image: url("' + encodeURI(file.getUrl()) + '"); background-size: contain');
        }
        this.append(fileThumbnailImage);
    }
}

// CONCATENATED MODULE: ./src/ts/Filery/UI/FileTitle.ts

class FileTitle_FileTitle extends Control {
    constructor(file) {
        super();
        this.element = Control.createElement('span', {
            className: 'file-title'
        });
        let fileTitleName = Control
            .createByTag('span', {
            className: 'file-title-name'
        })
            .text(file.getName());
        this.append(fileTitleName);
        let fileTitleMeta = Control
            .createByTag('ul', {
            className: 'file-title-meta'
        })
            .append('<li>' + file.getFormattedSize() + '</li>')
            .append('<li>' + file.getFormattedTime() + '</li>');
        this.append(fileTitleMeta);
    }
}

// CONCATENATED MODULE: ./src/ts/Filery/UI/FileButtons.ts


class FileButtons_FileButtons extends Control {
    constructor(file, config) {
        super();
        this.file = file;
        this.config = config;
        this.element = Control.createElement('div', {
            className: 'file-buttons',
        });
        let buttons = Control.createByTag('ul');
        if (this.config.type === 'select') {
            buttons.append(Control
                .createByTag('li', {
                className: 'select',
                title: tinymce.i18n.translate('Select')
            })
                .text(tinymce.i18n.translate('Select'))
                .on('click', (e) => {
                e.preventDefault();
                this.insertFile('select');
            }));
        }
        else {
            buttons.append(Control
                .createByTag('li', {
                className: 'link',
                title: tinymce.i18n.translate('Insert link')
            })
                .text(tinymce.i18n.translate('Insert link'))
                .on('click', (e) => {
                e.preventDefault();
                this.insertFile('link');
            }));
            if (this.file.getType() === 'image') {
                buttons.append(Control
                    .createByTag('li', {
                    className: 'image',
                    title: tinymce.i18n.translate('Insert image')
                })
                    .text(tinymce.i18n.translate('Insert image'))
                    .on('click', (e) => {
                    e.preventDefault();
                    this.insertFile('image');
                }));
            }
        }
        buttons.append(Control
            .createByTag('li', {
            className: 'delete',
            title: tinymce.i18n.translate('Delete')
        })
            .prepend('<i class="mce-ico mce-i-remove"></i>')
            .on('click', (e) => {
            e.preventDefault();
            this.deleteFile();
        }));
        this.append(buttons);
    }
    insertFile(type) {
        if (this.config.callback(this.file, type)) {
            this.config.editor.windowManager.close(window);
            let text = tinymce.i18n.translate(['"{0}" as link successfully inserted.', this.file.getName()]);
            if (type === 'image') {
                text = tinymce.i18n.translate(['"{0}" as image successfully inserted.', this.file.getName()]);
            }
            this.config.editor.notificationManager.open({
                text: text,
                type: 'success',
                timeout: 3000
            });
            return this;
        }
        else {
            console.error('Insert callback failed (or returned false/null).');
        }
        return this;
    }
    deleteFile() {
        this.config.editor.windowManager.confirm(tinymce.i18n.translate(['Are you sure you want to delete "{0}"?', this.file.getName()]), (state) => {
            if (state) {
                ApiClient_ApiClient
                    .delete(this.file)
                    .then(() => {
                    this.getParent().fadeOut(() => {
                        this.config.editor.windowManager.confirm(tinymce.i18n.translate(['"{0}" successfully deleted. Do you want to remove the content with reference to the deleted file?', this.file.getName()]), (state) => {
                            if (state) {
                                Control
                                    .createBySelector('img', this.config.editor.getBody())
                                    .forEach((img) => {
                                    if (img.getAttribute('src').endsWith(this.file.getName())) {
                                        img.remove();
                                    }
                                });
                                Control
                                    .createBySelector('a', this.config.editor.getBody())
                                    .forEach((a) => {
                                    if (a.getAttribute('href').endsWith(this.file.getName())) {
                                        a.unwrap();
                                    }
                                });
                            }
                        });
                    }, 30);
                })
                    .catch((error) => {
                    this.config.editor.windowManager.alert(tinymce.i18n.translate(['Delete failed: {0}', error]));
                });
            }
        });
        return this;
    }
}

// CONCATENATED MODULE: ./src/ts/Filery/UI/Item.ts




class Item_Item extends Control {
    constructor(file, config) {
        super();
        this.file = file;
        this.element = Control.createElement('div', {
            className: 'filery-item'
        });
        this.setAttribute('title', file.getName());
        let itemBody = Control
            .createByTag('div', {
            className: 'filery-item-body'
        });
        if (config.filter.length === 0 || config.filter.indexOf(file.getType()) !== -1) {
            itemBody.on('click', (e) => {
                e.preventDefault();
                this.getSiblings().forEach((item) => {
                    item.removeClass('selected');
                });
                if (this.hasClass('selected')) {
                    this.removeClass('selected');
                }
                else {
                    this.addClass('selected');
                }
            });
        }
        else {
            this.addClass('disabled');
        }
        itemBody
            .append(new FileThumbnail_FileThumbnail(file))
            .append(new FileTitle_FileTitle(file));
        this
            .append(itemBody)
            .append(new FileButtons_FileButtons(file, config));
    }
}

// CONCATENATED MODULE: ./src/ts/Filery/UI/Container.ts


class Container_Container extends Control {
    constructor(files = [], config) {
        super();
        this.element = Control.createElement('div', {
            className: 'filery-container'
        });
        files.forEach((file) => {
            this.append(new Item_Item(file, config));
        });
    }
}

// CONCATENATED MODULE: ./src/ts/Filery/Plugin.ts



class Plugin_Plugin {
    constructor(config) {
        this.config = config;
    }
    openDialog() {
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Escape') {
                this.config.editor.windowManager.close(window);
            }
        });
        this.config.editor.windowManager.open({
            title: tinymce.i18n.translate(['File manager']),
            id: 'filery-dialog',
            height: Number.parseInt(this.config.editor.settings.filery_dialog_height),
            width: 700,
            autoScroll: true,
            buttons: [{
                    text: tinymce.i18n.translate(['Upload']),
                    icon: 'upload',
                    classes: 'primary',
                    onClick: (e) => {
                        e.preventDefault();
                        this.uploadFile();
                    }
                }, {
                    text: tinymce.i18n.translate(['Cancel']),
                    onclick: 'close',
                }],
            onOpen: (e) => {
                e.preventDefault();
                this.loadFiles();
            }
        });
    }
    uploadFile() {
        Control
            .createByTag('input', {
            'type': 'file',
        })
            .on('change', (e) => {
            ApiClient_ApiClient
                .upload(e.target.files[0])
                .then((file) => {
                this.config.editor.windowManager.alert(tinymce.i18n.translate(['"{0}" successfully uploaded.', file.getName()]), () => {
                    this.loadFiles();
                });
            })
                .catch((error) => {
                this.config.editor.windowManager.alert(tinymce.i18n.translate('Upload failed.') + ' ' + error);
            });
        })
            .trigger('click');
        return this;
    }
    loadFiles() {
        ApiClient_ApiClient
            .read()
            .then((files) => {
            if (this.config.filter.length > 0) {
            }
            Control
                .createBySelector('#filery-dialog-body', document)[0]
                .html('')
                .append(new Container_Container(files, this.config));
        })
            .catch((error) => {
            this.config.editor.windowManager.alert(tinymce.i18n.translate('Load failed.') + ' ' + error);
        });
    }
}

// EXTERNAL MODULE: ./src/sass/plugin.scss
var sass_plugin = __webpack_require__(7);

// CONCATENATED MODULE: ./src/ts/plugin.ts



/* harmony default export */ var ts_plugin = (function (editor, url) {
    ApiClient_ApiClient.setUrl(editor.settings.filery_api_url);
    editor.addButton('filery', {
        icon: 'browse',
        title: 'File manager',
        onClick: function () {
            let config = {
                filter: [],
                callback: (file, insertType) => {
                    if (insertType === 'image') {
                        editor.insertContent('<img src="' + file.getUrl() + '" title="' + file.getName() + '" />');
                    }
                    else {
                        let content = editor.selection.getContent();
                        editor.insertContent('<a href="' + file.getUrl() + '" title="' + file.getName() + '">' + (content ? content : file.getName()) + '</a>');
                    }
                    return true;
                },
                type: 'insert',
                editor: editor
            };
            let plugin = new Plugin_Plugin(config);
            plugin.openDialog();
        }
    });
    return {
        getMetadata: function () {
            return {
                name: 'Filery',
                url: 'https://www.neoflow.ch'
            };
        }
    };
});

// CONCATENATED MODULE: ./src/ts/index.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "filePickerCallback", function() { return filePickerCallback; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "imagesUploadHandler", function() { return imagesUploadHandler; });



tinymce.PluginManager.add('filery', ts_plugin);
function filePickerCallback(callback, value, meta) {
    let filter = [];
    if (meta.filetype === 'image') {
        filter = [
            'image'
        ];
    }
    else if (meta.filetype === 'media') {
        filter = [
            'video',
            'audio'
        ];
    }
    let config = {
        filter: filter,
        callback: (file) => {
            callback(file.getUrl(), {
                text: file.getName(),
                title: file.getName()
            });
            return true;
        },
        type: 'select',
        editor: tinymce.activeEditor
    };
    let plugin = new Plugin_Plugin(config);
    plugin.openDialog();
}
function imagesUploadHandler(blobInfo, success, failure) {
    ApiClient_ApiClient
        .upload(blobInfo)
        .then((file) => {
        success(file.getUrl());
    })
        .catch((error) => {
        failure(error);
    });
}
;


/***/ })
/******/ ]);
}); 