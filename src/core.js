function (key, opts) {
  opts = Object.assign({
    onerror: function(){},
  },opts||{});

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

    // Log server errors
    server.on('error', function(...args) {
      (function handle(fn) {
        if (Array.isArray(fn)) return fn.map(handle);
        if ('function' !== typeof fn) return;
        fn('server',...args);
      })(opts.onerror);
    });

    // Intercept event registering
    local.on = function (type, listener) {
      // Not connection = not interested
      if ('connection' !== type) {
        server.on(type, listener);
        return local;
      }
      server.on('connection', function (socket, req) {

        // Log socket errors
        socket.on('error', function(...args) {
          if (Array.isArray(fn)) return fn.map(handle);
          if ('function' !== typeof fn) return;
          fn('socket',...args);
        });

        // Return wrapped socket
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
