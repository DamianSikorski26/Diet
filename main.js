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
    autoColumns:true,
    reactiveData:true,
    layout:"fitColumns", //fit columns to width of table (optional)
    columns:[ //Define Table Columns
        {title:"Name", field:"name", width:150},
        {title:"Quantity", field:"quantity", hozAlign:"left", formatter:"progress"},
        {title:"Carbs", field:"carbs",topCalc:"sum"},
        {title:"Fats", field:"fats",topCalc:"sum"},
        {title:"Proteins", field:"proteins",topCalc:"sum"},
        {title:"Calorie", field:"carbs",topCalc:"sum"},
        {title:"", field:"del"},
    ],
});








let button = document.querySelector(".searchButton");
let userInput = document.getElementById("userInput");
let optionsMenu = document.querySelector(".optionsMenu") 
let apiKey = "m9eIaDT8ngVFTNk3zHGegsG9E2G6Kt7RVENv8hhi";
let apikeyImg = "22Zs5kQ7BFsAdyuSOqk6sPrkdxxCi5Z3d2HChvAwBqVMRE3Vp6e5tgk1";

// tableau qui va contenir le aliments créer

const Aliments =[];


//class ALiment
class Aliment {
    constructor(img,name,carbs,fats,proteins,calories){
        this.img =img;
        this.name = name,
        this.quantity = 100,
        this.carbs = carbs,
        this.fats = fats,
        this.proteins = proteins,
        this.calories = calories
    }

}

// Fonction qui recupere les data en fonction du UserInput


async function getData(foodName){
    try{
        let response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${foodName}&pageSize=5
        `);
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
        let response = await fetch(`https://api.pexels.com/v1/search?query=${word}&per_page=1`,{
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







//fonction qui propose des choix

function proposeOptions(query){
    let div = document.createElement("div");
    div.classList.add("optionContainer");
    div.innerHTML = `<span class="optionName">${query.description}</span>
    <Button class="addButton" data-id=${query.fdcId} >ADD</Button>`;
    optionsMenu.append(div);
}




// button qui active la research de la Data

button.addEventListener("click", async function (e){
    e.preventDefault();
    //cas ou l'input est vide
    if(!userInput.value){
        alert("Please fill with food name !");
        return;
    }

    let data = await getData(userInput.value);
    console.log(data);
    data.forEach((element) => {
        proposeOptions(element);
    })
    
})

//button pour ajouter un aliment à la liste

optionsMenu.addEventListener("click",async function(e){
    e.preventDefault();
    if(e.target.classList.contains("addButton")){
        Aliments.push(new Aliment())
    }
    Aliments.push(new Aliment(await getImg(userInput)))
    tableData.push({name:"jean"});
    console.log(tableData)
    
})



