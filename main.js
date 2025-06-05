//fonctionnalité:
//afficher un nombre de choix en fonction du user Input
//display le tableau ligne par ligne
//calculer le total de chaque catégorie
//enlever un aliment facilement avec un bouton "del"
//le quantity va influencer les proportions de manière dynamique

let tableData=[];

let table = new Tabulator("#myTable", {
     // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
    data:tableData, //assign data to table
    // autoColumns:true,
    reactiveData:true,
    
    resizableRows:true,
    layout:"fitColumns", //fit columns to width of table (optional)
    columns:[ //Define Table Columns
        {title:"Name", field:"name", width:150},
        {title:"Quantity", field:"quantity", hozAlign:"center", formatter:"html"},
        {title:"Carbs", field:"carbs",bottomCalc:"sum",hozAlign:"center"},
        {title:"Fats", field:"fats",bottomCalc:"sum",hozAlign:"center"},
        {title:"Proteins", field:"proteins",bottomCalc:"sum",hozAlign:"center"},
        {title:"Calorie", field:"calorie",bottomCalc:"sum",hozAlign:"center"},
        {title:"Delete", field:"del",formatter:"html",hozAlign:"center"},
        
    ],
});

let button = document.getElementById("search");
let userInput = document.getElementById("userInput");
let optionsMenu = document.querySelector(".optionsMenu");
let myTable = document.getElementById("myTable");
let imgContainer = document.querySelector(".imgContainer")
let apiKey = "m9eIaDT8ngVFTNk3zHGegsG9E2G6Kt7RVENv8hhi";
let apikeyImg = "22Zs5kQ7BFsAdyuSOqk6sPrkdxxCi5Z3d2HChvAwBqVMRE3Vp6e5tgk1";

// tableau qui va contenir le aliments créer

const Aliments =[];


//class ALiment
class Aliment {
    constructor(name,carbs,fats,proteins,calories){
        this.name = name,
        this.carbs = carbs,
        this.fats = fats,
        this.proteins = proteins,
        this.calories = calories,
        this.isDeleted = false,
        this.serving = 100
    }

}

///////////////////////////////////////////////////////
// Fonction qui recupere les data en fonction du UserInput
////////////////////////////////////////////////////////////

async function getData(foodName){
    try{
        let response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${foodName}&pageSize=5&dataType=Survey (FNDDS)`);
        let data = await response.json();
        return data.foods;
    }
    catch(err){
        console.log("error : "+ err);
    }
};



//fonction qui génére une image en fonction du mot choisis

async function getImg(word){
    try{
        let response = await fetch(`https://api.pexels.com/v1/search?query=${word}&per_page=1&orientation=landscape&size=small`,{
            headers: {
              Authorization: apikeyImg
            }});
        let data = await response.json();
        return data.photos[0].src.original;
    }
    catch(err){
        console.log("error : "+ err);
    }
};



////////////////////////////////////////////////////////
// function qui garde les première infos en local storage
///////////////////////////////////////////////////////////
function storeData(key,value){

    let content = JSON.stringify(value)
    localStorage.setItem(key,content)
}




//fonction qui propose des choix

function proposeOptions(query){
    
    let div = document.createElement("div");
    div.classList.add("optionContainer");
    div.innerHTML = `<span class="optionName">${query.description}</span>
    <Button class="addButton searchButton" data-id=${query.fdcId} data-name=${query.description}>ADD</Button>`;
    optionsMenu.append(div);

    
}






// function qui convertit les proportions en directe

function convert(numberToConvert,newServingSize){
    return (numberToConvert / 100) * newServingSize; 

}




//fonction qui ajoute les donnée du tableau au tableau data
function fillTableData(){
    
    tableData.splice(0, tableData.length);
    Aliments.forEach((element,index) => {
        
            tableData.push(
            {
                name : element.name,
                quantity : `<input type="number" data-id=${index} class=quantityInput value=${element.serving}>`,
                carbs : element.carbs,
                fats : element.fats,
                proteins : element.proteins,
                calorie : element.calories,
                del : `<span class=delButton data-id=${index}>❌</span>`
            }
        )
        })
        
    }
   
// function qui stocke les donnée

function getSavedData(){
    if(!localStorage.getItem('saved')){
        console.log(true)
        return
    }
    let dataJson = JSON.parse(localStorage.getItem('saved'));
    dataJson.forEach((e)=>{
        Aliments.push(e);
    })
    fillTableData();

    tableData.forEach((e,i)=>{
        e.carbs = convert(Number(Aliments[i].carbs),Aliments[i].serving).toFixed(2);
        e.fats = convert(Number(Aliments[i].fats),Aliments[i].serving).toFixed(2);
        e.proteins = convert(Number(Aliments[i].proteins),Aliments[i].serving).toFixed(2);
        e.calorie = convert(Number(Aliments[i].calories),Aliments[i].serving).toFixed(2);
    })
    

}


function saveData(){
    let content= JSON.stringify(Aliments);
    localStorage.setItem("saved",content);
   
}




////////////////////////////////////////////
// button qui active la research de la Data
////////////////////////////////////////////
button.addEventListener("click", async function (e){
    e.preventDefault();
    //cas ou l'input est vide
    if(!userInput.value){
        alert("Please fill with food name !");
        return;
    }
    //creer des propositions à ajouter aux tableaux
    document.querySelector(".placeHolderText").classList.add("invisible");
    let data = await getData(userInput.value);
    
    optionsMenu.innerHTML = "";
    imgContainer.innerHTML = "";
    
    if(data.length == 0){
        
        document.querySelector(".placeHolderText").innerHTML = "Nothing Found ! Try something else.";
        document.querySelector(".placeHolderText").classList.remove("invisible");
        return
    }
    let imgData = await getImg(userInput.value);
    setTimeout(()=>{
        imgContainer.innerHTML = `<img src=${imgData} alt=img>`;
    },500);
    
    

    console.log(data);
    localStorage.clear();
    data.forEach((element,index) => {
        setTimeout(()=>{
            proposeOptions(element);
            //on stocke les propositions dans le local storage
            storeData(element.fdcId,element);
        },300*(index+1))
           
        });
       
    
    userInput.value='';

    
})




// button pour ajouter un aliment à la liste


optionsMenu.addEventListener("click",async function(e){
    e.preventDefault();
    if(e.target.classList.contains("addButton")){
        let foodId = e.target.dataset.id;
        //je recupere les infos nutritive de l'aliment dans le local storage en utilisant son data id comme clé.
        let obj = JSON.parse(localStorage.getItem(foodId));
        console.log(obj);

        let proteine;
        let carbs;
        let fats;
        let calories;
        //je recherche dans l'array les élément qui nous intéressent.
         obj.foodNutrients.forEach((element) => {
             switch(element.nutrientName){
                        case "Protein":
                            proteine = element.value;
                            break
                        case "Total lipid (fat)":
                            fats = element.value;
                            break
                        case "Carbohydrate, by difference":
                            carbs = element.value;
                            break
                        case "Energy":
                            calories = element.value;
                            break

            }
        })

        // on rajoute l'aliment à la liste des aliments

        Aliments.push(new Aliment(
            obj.description,
            carbs,
            fats,
            proteine,
            calories
        
        ))
        //on remplit la tableData
        fillTableData();
        
        saveData()
    }

})

// button qui enleve le l'aliment de la liste

myTable.addEventListener("click",(element) =>{
    element.preventDefault();
    if (element.target.classList.contains("delButton")){
        let id = element.target.dataset.id;
        // Aliments[id].isDeleted = true;
        Aliments.splice(id,1)
        fillTableData();
        saveData()
    }
})

//bouton qui regle la quantité de nourriture

myTable.addEventListener("input",(element) =>{
    element.preventDefault();
    if (element.target.classList.contains("quantityInput")){
        let id = element.target.dataset.id;
        let value = Number(element.target.value);
        console.log(id);

        Aliments[id].serving = Number(element.target.value);
        console.log(tableData);
        tableData[id].carbs = convert(Number(Aliments[id].carbs),value).toFixed(2);
        tableData[id].fats = convert(Number(Aliments[id].fats),value).toFixed(2);
        tableData[id].proteins = convert(Number(Aliments[id].proteins),value).toFixed(2);
        tableData[id].calorie = convert(Number(Aliments[id].calories),value).toFixed(2);
        saveData()
    }
    
})

getSavedData();







