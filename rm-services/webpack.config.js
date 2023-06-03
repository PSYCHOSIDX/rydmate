module.exports = {
    // ...
    resolve: {
      fallback: {
        buffer: require.resolve('buffer/'),
        url: require.resolve('url/'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        assert: require.resolve('assert/')
      }
    }
    // ...
  };