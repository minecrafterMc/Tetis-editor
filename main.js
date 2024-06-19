const colors = document.getElementById("colors");
var colorId = 0;
const shapes = document.getElementById("blocks");
var blockId = 0;
var sBlockId = 0;
var shapeText = "rotation 1";
var json = {};
var mods = false;
function create(element){
  return document.createElement(element);
}
function getE(id){
  return document.getElementById(id);
}
function addNewColor(){
  let div = create("div");
  div.id = "colorMaster-"+colorId;
  let inputs = [];
  let names = ["name","Shape color","Background color","Trail color","Fallen color","Text color"];
  let codeNames = ["name","shapecolor","emptycolor","trailcolor","fallencolor","textcolor"];
  if (colorId == 0) {
  let namedata = create("p");
  namedata.innerHTML = JSON.stringify(codeNames);
  namedata.style.display = "none";
  namedata.id = "colorStorage";
  colors.appendChild(namedata);
}
  let i = 0;
  while (i != names.length){
    inputs[i] = create("input");
    inputs[i].id = "color-"+colorId+"-"+i;
    if (i != 0){inputs[i].type = "color";}
    else{inputs[i].type="text";
      inputs[i].placeholder="Color name";
    }
    let text = create("p");
    text.innerHTML = names[i];
    if(i!=0){
    div.appendChild(text);}
    div.appendChild(inputs[i]);
    i++;
  }
  colors.appendChild(div);
  colorId++;
}
function removeColor(){
  if (colorId > 1){
  let div = getE("colorMaster-"+(colorId - 1));
  div.remove();
  colorId--;
  }
}
function addCompleteShape(){
  let mDiv = create("div");
  mDiv.id = "blockMaster-"+blockId;
  shapeText = "shape " + (blockId +1) + " rotation 1";
  mDiv.appendChild(addNewShape());
  shapeText = "shape " + (blockId+1) + " rotation 2";
mDiv.appendChild(addNewShape());
shapeText = "shape " + (blockId+1) + " rotation 3";
mDiv.appendChild(addNewShape());
shapeText = "shape " + (blockId+1) + " rotation 4";
mDiv.appendChild(addNewShape());
shapes.appendChild(mDiv);
blockId++;
}
function addNewShape(){
  let div = create("div");
  let text = create("p");
  text.innerHTML = shapeText;
  div.appendChild(text);
  let inputs = [];
  let i = 0;
  while (i != 16){
    inputs[i] = create("input");
    inputs[i].id = "block-"+sBlockId+"-"+i;
    inputs[i].type = "checkbox";
    div.appendChild(inputs[i]);
    if ((i + 1) % 4 == 0){
      div.appendChild(create("br"))
    }
    i++;
  }
  sBlockId++;
  return div;
}
function removeShape(){
  if (blockId > 1){
  let div = getE("blockMaster-"+(blockId - 1));
  div.remove();
  blockId--;
  sBlockId -= 4;
  }
}
function getMinMax(arr){
  let i = 0;
  let tempArr = [3,0,3,0]
  while (i < arr.length){
    if (arr[i]){
      if (i % 4 < tempArr[0]){
        tempArr[0] = i % 4;
      }
      if (i % 4 > tempArr[1]){
        tempArr[1] = i % 4;
      }
    }
    i++
  }
  let splitArr = [[arr[0],arr[1],arr[2],arr[3]],[arr[4],arr[5],arr[6],arr[7]],[arr[8],arr[9],arr[10],arr[11]],[arr[12],arr[13],arr[14],arr[15]]];
  let flippedArr = [splitArr[0][0],splitArr[1][0],splitArr[2][0],splitArr[3][0],splitArr[0][1],splitArr[1][1],splitArr[2][1],splitArr[3][1],splitArr[0][2],splitArr[1][2],splitArr[2][2],splitArr[3][2],splitArr[0][3],splitArr[1][3],splitArr[2][3],splitArr[3][3]];
  i = 0;
  while (i < flippedArr.length) {
  if (flippedArr[i]) {
    if (i % 4 < tempArr[2]) {
      tempArr[2] = i % 4;
    }
    if (i % 4 > tempArr[3]) {
      tempArr[3] = i % 4;
    }
  }
  i++
}
  return tempArr;
}
function compile(){
  json.name = getE("name").value;
  json.time = getE("time").value;
  json.updateTimer = 1000 / getE("speed").value;
  json.lives = getE("lives").value;
  json.multi = getE("multi").value;
  json.ppenalty = getE("ppenalty").value;
  json.tpenalty = getE("tpenalty").value;
  json.colors = []
  let cNames = JSON.parse(getE("colorStorage").innerHTML);
  let i = 0;
  while (i < colorId){
    json.colors[i] = {}
    let j = 0;
    while (j < cNames.length){
      json.colors[i][cNames[j]] = getE("color-"+i+"-"+j).value;
      j++;
    }
    i++;
  }
  i = 0;
  json.blocks = [];
  while (i < sBlockId) {
  json.blocks[i] = []
  let j = 0;
  while (j < 16) {
    json.blocks[i][j] = getE("block-" + i + "-" + j).checked;
    j++;
  }
  json.blocks[i] = json.blocks[i].concat(getMinMax(json.blocks[i]));
  i++;
}
if (mods){
  
}
json.enableMods = mods;
json.onLoad = getE("onLoad").value;
json.tick = getE("tick").value;
json.onBlockFall = getE("onBlockFall").value;
json.onLineCleared = getE("onLineCleared").value;
json.onDeath = getE("onDeath").value;
json.blocks.splice(0,0,[
         false,
         false,
         false,
         false,
         false,
         true,
         true,
         false,
         false,
         false,
         false,
         false,
         false,
         false,
         false,
         false,
         1,
         2,
         1,
         1
      ]);
  console.log(json);
  let Outputfile = JSON.stringify(json,null,3);
  let link = document.createElement("a");
  let file = new Blob([Outputfile], { type: 'json/plain' });
  link.href = URL.createObjectURL(file);
  link.download = document.getElementById("name").value + ".json";
  link.click();
  URL.revokeObjectURL(link.href);
}
function toggleMods(){
  if (mods){
    mods = !mods;
    getE("mods").style.display = "none";
    getE("mod").style.backgroundColor="#ff2626";
  }
  else{
    mods = !mods;
    getE("mods").style.display = "block";
    getE("mod").style.backgroundColor="#27db66";
  }
}
addNewColor();
addCompleteShape();
toggleMods();