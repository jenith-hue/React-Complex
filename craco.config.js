module.exports = {
  webpack: {
    configure: config => {
      config.optimization.runtimeChunk = false;

      config.optimization.splitChunks = {
        cacheGroups: {
          default: false
        }
      };

      config.externals = [
        {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      ];

      return config;
    }
  }
};
