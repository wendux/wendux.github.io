var fs=require("fs")
var path = require('path')

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
        var config=JSON.parse(fs.readFileSync(mapFile,"utf-8"));
        config.dir=file;
        dirs.push(config);
      }
    }
  });
  fs.writeFileSync('static/list.json',JSON.stringify(dirs));
  console.log(dirs)
}

genMenus()
