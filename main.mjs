import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import express from "express";
import { Console } from "node:console";

const app = express();
const client = new PrismaClient();

app.use(express.urlencoded({ extended: true }));

app.get("/", (request, response) => {
    const template = readFileSync("./index.html", "utf-8");
    response.send(template);
  });
  

app.post("/send", async (request, response) => {
    const dish = request.body.dish; // 料理名
    const ingredients = request.body.ingredients; // 材料名
    const time = request.body.time; // 時間帯

   const g = await DishSearch(dish, ingredients, time)
    const template = readFileSync("./index.html", "utf-8");
    var html = template
    
    if (g.length<1){
        html = template.replace(
            "<!--data-->",
            "該当するFが見つかりません..."
          );
    }
    else{
        html = template.replace(
            "<!--data-->",

            g.map((firstArray) =>
            firstArray.join("")),
          )
    }
    response.send(html);
  });

app.listen(3000);
//----------------------mainの関数------------------
async function DishSearch(DishName , Ingredients , Timetype){


        if (DishName !== null){
            const dNameArray = DishName.split(' ');

            if(Ingredients !== null){
                const iNameArray = Ingredients.split(' ');
                //pattern1
                return _pattern1(dNameArray,iNameArray,Timetype);

            }
            else{
                //pattern2
                return _pattern2(dNameArray,Timetype);
            }





        }
        else{

            if(Ingredients !== null){
                const iNameArray = Ingredients.split(' ');
                //pattern3
                return _pattern3(iNameArray,Timetype);
            }
            else{
                //pattern4
                return _pattern4(Timetype);
            }
            
        }


 }
//----------------------------------------patternごと関数------------------------


async function _pattern1(_dishName , _ingredients , _timetype){
//最初の名前入力を含み、時間帯の一致したのを出力
            const _firstDishesArray = await  DishNameTimeSearch(_dishName[0], _timetype)
            if (_firstDishesArray.length < 1){
                return _firstDishesArray
            }
//全ての名前入力を満たすものを出力
            const _secondDishesArray = DishNameConfigure(_firstDishesArray,_dishName);
            if (_secondDishesArray.length < 1){
                return _secondDishesArray
            }
//全ての材料入力を満たすものを出力
            return fReturn(IngreNameConfigure(_secondDishesArray,_ingredients))
 }



 async function _pattern2(_dishName , _timetype){
    //最初の名前入力を含み、時間帯の一致したのを出力
                const _firstDishesArray = await  DishNameTimeSearch(_dishName[0], _timetype);
                if (_firstDishesArray.length < 1){
                    return _firstDishesArray
                }
    //全ての名前入力を満たすものを出力
                return fReturn(DishNameConfigure(_firstDishesArray,_dishName))
     }
    
    async function _pattern3(_ingredients , _timetype){
//最初の名前入力を含み、時間帯の一致したのを出力
            const _secondDishesArray = await DishNameTimeSearch("", _timetype);
            if (_secondDishesArray.length < 1){
                return _secondDishesArray
            }
//全ての名前入力を満たすものを出力
            return fReturn(IngreNameConfigure(_secondDishesArray,_ingredients))
}


async function _pattern4(_timetype){
//最初の名前入力を含み、時間帯の一致したのを出力
            return fReturn(await DishNameTimeSearch("", _timetype))
}

//-----------------基本関数--------------------------------

//F情報抽出
function fReturn(fArray){
    var s =[]
    for (  var i = 0;  i < fArray.length ;  i++  ) {
        var u = []
        u.push(`<p><b>${fArray[i].name}</b></p>`);
        u.push("<p>素材</p>")
        for (  var v = 0;  v < fArray[i].dishingredients.length ;  v++  ) {
            u.push(` &#009; &#009;&#009; <li>${fArray[i].dishingredients[v].ingredients.name}</li>`)
        }
        u.push("<p></p>")
        s.push(u)
    }
    return s
}

//全料理名一致か
function DishNameConfigure(_firstDishesArray,_dishName){
    var _returnArray = [];

    for (  var i = 0;  i < _firstDishesArray.length ;  i++  ) {
        
        for (  var v = 0;  v < _dishName.length ;  v++  ) {
            if(!_firstDishesArray[i].name.includes(_dishName[v])){
                break;
            }
            else if(v == _dishName.length-1){
                _returnArray.push(_firstDishesArray[i]);
            }

        }
    }

    return _returnArray
}

//全材料名一致か
function IngreNameConfigure(_secondDishesArray,_ingredients){
    var _returnArray = [];

    for (  var i = 0;  i < _secondDishesArray.length ;  i++  ) {
        var itsIngredientsName = [];

         const koko = _secondDishesArray[i].dishingredients.length
        for (  var r = 0;  r < koko ;  r++  ) {
            itsIngredientsName.push(_secondDishesArray[i].dishingredients[r].ingredients.name)
        }
        for (  var v = 0;  v < _ingredients.length ;  v++  ) {
            if(!itsIngredientsName.includes(_ingredients[v])){
                break;
            }
            else if(v == _ingredients.length-1){
                _returnArray.push(_secondDishesArray[i]);
                break;
            }

        }
    }

    return _returnArray
}
//料理名と時間で検索
  async  function DishNameTimeSearch(_dishName,_timetype){   //dishNameと食べる時間を料理名に含むFを選ぶ。
    const dishes =await client.dish.findMany({
        where: 
        {
            AND:[{
                    name: 
                { 
                    contains:_dishName
                },
            },
                 {wheneat:
                 {
                     contains:_timetype
                 }},
            ],
        },
        include: {
                    dishingredients: {
                        include: {
                            ingredients: true
                        }
                    }
                }
       
        }
    )
 return dishes;
  }





// const html = `
//     <ul>
//         ${dishes.map(dish => `
//             <li>
//                 ${dish.name}
//                 <ul>
//                     ${dish.dishingredients.map(d => 
//                         `<li>${d.ingredients.name}</li>`
//                     )}
//                 </ul>
//             </li>
//         `)}
//     </ul>
// `
//6901650305

