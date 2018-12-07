// Build by finwo @ vr 7 dec 2018 11:14:42 CET
(function (factory) {

  // Handle RequireJS
  if ( ('function' === typeof define) && define.amd ) {
    return define(['rc4-crypt', 'cws', 'ws-transform'], factory);
  }

  // Manually-packed (until I find a way to exclude 'ws')
  let require = function (name) {
    return require[name];
  };
  require['is-buffer'] = (function() {
    let module  = {},
        exports = undefined;
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}
    return module.exports || exports;
  })();
  require['rc4-crypt'] = (function() {
    let module  = {},
        exports = undefined;
// Basic RC4 implementation, I forgot where the code originally was based on
// If you recognize it, please let me know so I can credit the right person

const isBuffer = require('is-buffer');

function toByteArray(subject) {

  // Already-parsed (sort-of)
  if (!subject) return null;
  if (Array.isArray(subject)) return subject;
  if (isBuffer(subject)) return [...subject];
  if ('string' !== typeof subject) return null;

  // Hex strings
  if (subject.match(/^([0-9a-f]{2})*$/i)) {
    return subject
      .match(/[0-9a-f]{2}/ig)
      .map(c => parseInt(c, 16));
  }

  // Use the string as bytes
  return [...Buffer.from(subject, 'utf8')];
}

module.exports = function RC4(key) {
  key = toByteArray(key);

  let i, x, y = 0, t, x2, s = [];
  for (i = 0; i < 256; i++) s[i] = i;
  for (x = 0; x < 256; x++) {
    y    = (key[x % key.length] + s[x] + y) % 256;
    t    = s[x];
    s[x] = s[y];
    s[y] = t
  }
  x = y = 0;

  return function coder(data) {
    if (isBuffer(data)) return Buffer.from([...data].map(coder));
    if ('string' === typeof data) return Buffer.from([...Buffer.from(data)].map(coder));
    if ('number' !== typeof data) return false;
    x2    = (x++) % 256;
    y     = (s[x2] + y) % 256;
    t     = s[x2];
    s[x2] = s[y];
    s[y]  = t;
    return data ^ s[(s[x2] + s[y]) % 256]
  }
};
    return module.exports || exports;
  })();
  require['cws'] = (function() {
    let module  = {},
        exports = undefined;
if ('object' === typeof window) {
  const WebSocket = window.WebSocket || false;
  if (!WebSocket) throw new Error('This browser does not support websockets');

  // Small eventEmitter library
  // Copied from https://github.com/finwo/js-simple-ee/blob/master/index.js
  const EventEmitter = window.EventEmitter || function EventEmitter(subject) {
    subject = subject || this;
    if (subject === window) return new EventEmitter();
    subject._events = {};
    subject.on      = function (name, handler) {
      (subject._events[name] = subject._events[name] || [])
        .push(handler);
      return subject;
    };
    subject.off     = function (name, handler) {
      subject._events[name] = (subject._events[name] || [])
        .filter(function (listener) {
          return handler !== listener;
        });
      return subject;
    };
    subject.emit    = function () {
      var args = Array.prototype.slice.call(arguments),
          name = args.shift(),
          list = (subject._events[name] = subject._events[name] || []).concat(subject._events['*'] || []);
      list.forEach(function (handler) {
        handler.apply(subject, args.slice());
      });
      return subject;
    };
    subject.once    = function (name, handler) {
      subject.on(name, function g() {
        subject.off(name, g);
        handler.apply(subject, arguments);
      });
    };
  };

  // Our wrapper
  function CWS(...args) {
    let ws     = new WebSocket(...args);
    let out    = new EventEmitter();
    ws.onopen  = function () {
      out.emit('open')
    };
    ws.onclose = function () {
      out.emit('close')
    };

    ws.onmessage = async function (chunk) {
      chunk = chunk.data || chunk;

      if ('function' === typeof Blob) {
        if (chunk instanceof Blob) {
          chunk = Buffer.from(await new Response(chunk).arrayBuffer());
        }
      }

      out.emit('message', chunk);
    };

    out.queue = [];
    out.send  = function (chunk) {
      if (ws.readyState > 1) return;
      out.queue.push(chunk);
      let current = false;
      try {
        while (out.queue.length) {
          current = out.queue.shift();
          ws.send(current);
        }
      } catch (e) {
        if (current) out.queue.unshift(current);
      }
    };

    return out;
  }

  // Browser export
  window.CWS = CWS;

  // Browserify
  if ('object' === typeof module) {
    module.exports = CWS;
  }

} else if ('object' === typeof module) {
  module.exports = require('ws');
}
    return module.exports || exports;
  })();
  require['ws-transform'] = (function() {
    let module  = {},
        exports = undefined;
const direct = d => d;

module.exports = function (remote, {egress = direct, ingress = direct, convert = false} = {}) {
  const local = Object.create(remote);

  // Intercept egress
  local.send = async function( chunk ) {
    return remote.send(await egress(chunk));
  };

  // Intercept adding events
  local.on = function( type, listener ) {
    if ('message' !== type) { remote.on(type, listener); return local; }
    remote.on('message', async function(chunk) {
      switch(convert) {
        case 'buffer':
          return listener(Buffer.from(await ingress(chunk)));
        case 'string':
          return listener(Buffer.from(await ingress(chunk)).toString());
        default:
          return listener(await ingress(chunk));
      }
    });
    return local;
  };

  // Handle browser-style onopen
  // Using forEach to not overwrite type after iteration
  ['open','message','close','error'].forEach(function(type) {
    Object.defineProperty(local, 'on' + type, {
      enumerable  : true,
      configurable: true,
      get         : () => function () {},
      set         : listener => local.on(type, listener)
    })
  });

  // Return the transforming socket
  return local;
};
    return module.exports || exports;
  })();

  // Browserify
  if ('object' === typeof module) {
    module.exports = factory(
      require('rc4-crypt'),
      require('cws'),
      require('ws-transform')
    );
    return;
  }

  // Plain old browser usage
  window.WSRC4 = window.WSRC4 || factory(
    require('rc4-crypt'),
    require('cws'),
    require('ws-transform')
  );

})(function(rc4,WS,transform) {
function (key) {

  // Creating an encrypted client
  function sws(...args) {
    return transform(new WS(...args), {
      egress : rc4(key),
      ingress: rc4(key),
      convert: 'string'
    })
  }

  // Creating an encrypted server
  sws.Server = function (...args) {
    let server = new WS.Server(...args),
        local  = Object.create(server);

    // Intercept event registering
    local.on = function (type, listener) {
      if ('connection' !== type) {
        server.on(type, listener);
        return local;
      }
      server.on('connection', function (socket, req) {
        listener(transform(socket, {
          egress : rc4(key),
          ingress: rc4(key),
          convert: 'string'
        }), req);
      });
      return local;
    };

    // Return the intercepted server
    return local;
  };

  // Add alias
  sws.Client = sws;

  // Return the encrypted socket lib
  return sws;
}
});
