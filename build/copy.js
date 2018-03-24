require('shelljs/global')
var config = require('../config')
cp('-rf', 'static/doc/.', config.build.assetsRoot+"/static/doc")
console.log("copy end")
