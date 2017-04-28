var shims = {
  'react': 'global.React',
  'react-dom': 'global.ReactDOM',
  'react-router': 'global.ReactRouter',
  'react-redux': 'global.ReactRedux'
}


fis.match('app.js', {
  parser: fis.plugin('browserify',{
    option:{
      shims: shims
    }
  })
})
