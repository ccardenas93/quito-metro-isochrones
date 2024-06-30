const path = require('path');

module.exports = function override(config, env) {
  // Configuración para servir archivos estáticos correctamente
  config.devServer = {
    ...config.devServer,
    static: {
      directory: path.join(__dirname, 'public'),
    },
    historyApiFallback: true,
  };

  return config;
};
