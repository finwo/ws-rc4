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
    #include ../node_modules/is-buffer/index.js
    return module.exports || exports;
  })();
  require['rc4-crypt'] = (function() {
    let module  = {},
        exports = undefined;
    #include ../node_modules/rc4-crypt/src/index.js
    return module.exports || exports;
  })();
  require['cws'] = (function() {
    let module  = {},
        exports = undefined;
    #include ../node_modules/cws/src/index.js
    return module.exports || exports;
  })();
  require['ws-transform'] = (function() {
    let module  = {},
        exports = undefined;
    #include ../node_modules/ws-transform/src/index.js
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
return null ||
#include core.js
  ;
});
