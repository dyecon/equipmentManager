import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

function DishSearch(DishName , Ingredients , Timetype){

    DishName = DishName.split(' ');
        if (DishName !== null){

            if(Ingredients !== null){
                //pattern1


            }
            else{
                //pattern2
            }





        }
        else{

            if(Ingredients !== null){
                
                //pattern3
            }
            else{
                //pattern4
            }
            
        }


 }

 function _pattern1(_dishName , _ingredients , _timetype){
    switch (_timetype) {
        case "夜":
            const v = DishNameSearch(_dishName, _timetype)


            break;
        case "朝":
            break;
        default:
      }
      
 }




async  function DishNameSearch(){   //DishNameを料理名に含むFを選ぶ。
    const dishes =await client.dish.findMany({
        where: 
        {
            //AND:[{
                    name: 
                { 
                    contains:"カ"
                },
           // },
                // {wheneat:
                // {
                //     contains:_timetype
                // }},
            //],
        },
        }
    )
 return dishes;
  }
const u =await DishNameSearch();

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

// const dishe = await dishes.findMany({
//     include: {
//         dishingredients: {
//             include: {
//                 ingredients: true
//             }
//         }
//     }
// });
debugger;