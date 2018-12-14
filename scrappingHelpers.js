const fs = require('fs');
const path = require('path');
const testFolder = './src/media_numerated/';
const dataFolder = './src/data/';

/*
  JEST TO TYLKO PRZECHOWALNIA PRZYDATNYCH FUNKCJI
  tylko jako podstawa do pracy z nastepnymi arkuszami pytan
  sciezki, foldery, nazwy - wszystko ewentualnie trzeba pozmieniac
*/

/* aktywowane w konsoli przegladarki na stronie wyeksportowanej przez libreoffice calc z 
arkusza ministerstwa infrastruktury. wszystkie przydatne informacje sa pakowane do obiektu 
questions ktory potem mozna wyeksportowac rowniez do JSONa 
*/
const scrapHTMLSpreadsheet = () => {
  questions = [];
  categories = {};
  structure = {
    specialist: [],
    basic: []
  };

  [].slice.call(document.querySelectorAll("tr")).slice(1).forEach(el => {
    child = index => el.children[index].textContent;
    questionToAdd = {
      q: child(2),
      as: [child(3), child(4), child(5)],
      a: child(14).replace(".", ""),
      c: child(18).split(","),
      l: child(16),
      l: child(16),
      p: Number(child(17)),
      s: child(20),
      x: child(24),
    };

    const alfabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const isTrue = questionToAdd.a === "T";
    const isFalse = questionToAdd.a === "N";
    const media = child(15);
    const questionRelationToSafety = child(22);

    if (media) questionToAdd.m = media;
    if (questionRelationToSafety && questionRelationToSafety !== "brak treści") questionToAdd.r = questionRelationToSafety;
    if (isTrue || isFalse) {
      questionToAdd.as = ["Tak", "Nie"];
      questionToAdd.a = isTrue ? 0 : 1;
    } else {
      questionToAdd.a = alfabet.indexOf(questionToAdd.a.toUpperCase())
    }

    child(18).split(",").forEach(category => {
      categories[category] = categories[category] || [];
      categories[category].push(questionToAdd);
    });
    const zakres = questionToAdd.l.toUpperCase();
    if (zakres === "PODSTAWOWY") {
      structure.basic.push(questionToAdd);
      questionToAdd.l = 0;
    }
    else if (zakres === "SPECJALISTYCZNY") {
      structure.specialist.push(questionToAdd);
      questionToAdd.l = 1;
    }

    questions.push(questionToAdd);
  });
};

/*
nadaje sciezki mediow z questions2 do DOBRE1 i zapisuje jako DOBRE2.json
uzyte tylko w celu jednorazowej naprawy
*/
const updateMediaNames = () =>{
  var goodPaths = JSON.parse(fs.readFileSync('./src/data/questions2.json', 'utf8'));
  var goodData = JSON.parse(fs.readFileSync('./src/data/DOBRE1.json', 'utf8'));
  var good = [];

  goodData.forEach((obj,i)=>{
    if("m" in obj){
      obj.m = goodPaths[i].m;
    }
  });

  fs.writeFileSync('./src/data/DOBRE2.json', JSON.stringify(goodData));
};

/*
zamienia nazwy plikow w jsonie na czyste numerki w celu ulatwieniu pracy z nimi w parcelu.
zamienia rowniez formaty .wmv na .mp4 (tylko w nazwie w jsonie oczywiscie)
*/
const renameMedia = () => {
  const folder = fs.readdirSync(testFolder);
  var questions = JSON.parse(fs.readFileSync('./src/data/questionsNum.json', 'utf8'));

  folder.forEach((file, i) => {
    /* const name = i + path.extname(file);
     if(file.split("_").length !== 1){
       fs.renameSync(
         path.join(testFolder, file),
         path.join(testFolder, file.split("_")[0] + ".mp4")
       );
     }
   
   if(questions.includes(file) && path.extname(file) === )
   */

  });

  questions.forEach((e, i) => {
    if (e.m && path.extname(e.m) === ".wmv"){
      e.m = path.parse(e.m).name + ".mp4";
    } 
  });

  fs.writeFileSync('./src/data/questions2.json', JSON.stringify(questions));
};

// scrapHTMLSpreadsheet();
// renameMedia();
// updateMediaNames();