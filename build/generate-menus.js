var fs=require("fs")
var path = require('path')
require('shelljs/global')
var config = require('../config')
var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
cp('-rf', 'static/.', assetsPath)

function fsExistsSync(path) {
  try{
    fs.accessSync(path,fs.F_OK);
  }catch(e){
    return false;
  }
  return true;
}

function genMenus(dir='./static/doc'){
  let dirs=[];
  var files = fs.readdirSync(dir);
  files.forEach(function(file,index){
    var curPath = path.join(dir,file);
    if(fs.statSync(curPath).isDirectory()) {
      let mapFile=path.join(curPath,'map.json');
      if(fsExistsSync(mapFile)){
        var content=JSON.parse(fs.readFileSync(mapFile,"utf-8"));
        fs.writeFileSync(path.join(curPath,"menus.json"),JSON.stringify(content));
      }

    }
  });
  console.log("菜单生成完毕！")
}

genMenus()
