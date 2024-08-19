'use strict';

console.log('functions ready');


//Basic: Traer del html lo que necesite

const mainPage = document.querySelector('.js-page');
const searchBtn = document.querySelector('.js-search-btn');
const searchField = document.querySelector('.js-search-input');
const resetBtn = document.querySelector('.js-reset-btn');
const drinksList = document.querySelector('.js-drinks-list');
const warning = document.querySelector('.js-search-warning');
const favDrinksList = document.querySelector('.js-fav-drinks-list');
const drinksLi = document.querySelectorAll('.js-drink');
const deleteAllFavsBtn = document.querySelector('.js-delete-all-favs');

deleteAllFavsBtn.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>Borrar todos mis favoritos';

//1.Declaro dos variables: la que será el array de bebidas y la que será el array de las bebidas fav

let drinks = [];
let favDrinks = [];

//7.Función ara borrar solo la bebida a la que hagamos click de nuestra lista de favs

const deleteFavDrink = (event) => {
    const clickedDrinkId = event.currentTarget.parentElement.id;
    const favDrinksIndex = favDrinks.findIndex(  //Saco el índice de los fav clikados
        (drink) => drink.idDrink === clickedDrinkId
    );
    const drinksListItems = drinksList.querySelectorAll('.js-drinks-list li'); //Me traigo todos los li de la lista
    drinksListItems.forEach((drinkLi) => {  //Miro a ver si el id del elemento clikado coincide con el id d alguno del array
        if (drinkLi.id === clickedDrinkId) {
            drinkLi.classList.remove('fav__drink');  //Si el li que cliko en favs para eliminarlo de favs está en el array de drinks, en este mismo array le quito la clase
        }
    });
    //Se elimina, se rendeirza y se guarda en las favs del local
    favDrinks.splice(favDrinksIndex, 1);
    renderFavDrinksList(favDrinks);
    localStorage.setItem('favUserDrinks', JSON.stringify(favDrinks));
    if (favDrinks.length === 0) {
        deleteAllFavsBtn.classList.add('hidden');
    }
};


//6.He intentado renderizar los favoritos con el mismo render de las otras bebidas pero me lia y queda un código muy raro. Render para las bebidas fav que responde al click en la cruz para borrarlos

const renderFavDrinksList = () => {
    deleteAllFavsBtn.classList.remove('hidden');
    favDrinksList.innerHTML = '';
    for (const drink of favDrinks){
        const drinkName = drink.strDrink;
        const drinkImg = drink.strDrinkThumb;
        const drinkId = drink.idDrink;
        favDrinksList.innerHTML += `
            <li class="drinks__section--item js-drink" id="${drinkId}">
                <span class="drink__delete js-delete"><i class="fas fa-times"></i></span>
                <img class="drink__img" src="${drinkImg}" alt="${drinkName}">
                <h3 class="drink__name">${drinkName}</h3>
            </li>
        `;
        }
        const deleteCross = document.querySelectorAll('.js-delete');
        deleteCross.forEach(cross => {
            cross.addEventListener('click', deleteFavDrink);
        });
        if (favDrinks.length === 0) {
            deleteAllFavsBtn.classList.add('hidden');
        }
};


//5.Una vez que los datos están por pantalla, la usuaria tiene que poder seleccionar un fav que se va a pintar en otra lista, sin borrarse de la principal. Tengo que poner la función de añadir favorito antes que render porque luego la tengo que llamar para el click encima de cada li

const addFavDrink = (event) => {
    console.log(event.currentTarget.id);
    const clickedDrink = event.currentTarget.id;
    const drink = drinks.find((drink) => drink.idDrink === clickedDrink);
    console.log(drink.strDrink);
    const favDrinksIndex = favDrinks.findIndex((drink) => drink.idDrink === clickedDrink );
    if(favDrinksIndex !== -1){  //Si la bebida está en favoritos se le añade el span que es la X para borrarla 
        const deleteFavDrink = document.querySelector('.js-delete');
        deleteFavDrink.addEventListener('click', deleteFavDrink);
        favDrinks.splice(favDrinksIndex, 1);
        event.currentTarget.classList.remove('fav__drink');
       
    } else {
        if(drink && drink.idDrink){
            event.currentTarget.classList.add('fav__drink');
            favDrinks.push(drink);
        }
    }
    renderFavDrinksList(favDrinks);
    localStorage.setItem('favUserDrinks', JSON.stringify(favDrinks));
    if (favDrinks.length === 0) {
        deleteAllFavsBtn.classList.add('hidden');
    }

};
 

//4.Saco los datos por pantalla con una función render (hago una que tenga el li dentro del bucle para no hacer dos funciones):

const renderDrinksList = (array) => {
    drinksList.innerHTML = '';
    for (const drink of array){
        const drinkName = drink.strDrink;
        let drinkImg = drink.strDrinkThumb;
        if (!drinkImg) {
            drinkImg = 'http://via.placeholder.com/100x100';
        }
        const drinkId = drink.idDrink;
        let alcohol = drink.strAlcoholic;
        let drinkAlc = '';
        if (alcohol === 'Non alcoholic'){
            drinkAlc = 'sin'
        } else {
            drinkAlc ='con'
        }
        const li = document.createElement('li');
        li.classList.add('drinks__section--item');
        li.id = drinkId;
        if (favDrinks.some((favDrink) => favDrink.idDrink === drinkId)) {
            li.classList.add('fav__drink');
        }
        li.innerHTML = `
            <img class="drink__img" src="${drinkImg}" alt="${drinkName}">
            <h3 class="drink__name">${drinkName}</h3>
            <p class="drink__alcohol">${drinkAlc} alcohol</p>
        `;
        li.addEventListener('click', addFavDrink); 
        drinksList.appendChild(li);
    }
};

//2.Traigo los datos de la api y ya los dejo guardados en local storage

const getApiData = () => {
    const searchWord = searchField.value;
    fetch (
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchWord}`

    )
    .then(response => response.json())
    .then((dataApi) => {
        drinks = dataApi.drinks;
        console.log(drinks);
        renderDrinksList(drinks);
        localStorage.setItem('drinks', JSON.stringify(drinks));
    });
};

// 3.Hay que renderizar depués de buscar las bebidas, así que preparo el botón de buscar que va a comprobar que se haya escrito algo, y cuando se haya escrito lo paso todo a minúscula para evitar errores. Después ya llamo a render, a getapi 

const handleSearch = (event) => {
    event.preventDefault();
    const searchValue = searchField.value;
    if(searchValue === ''){
        warning.classList.remove('hidden');
        warning.innerHTML = 'Ups, parece que no has elegido un cocktail.<br>Introduce en el buscador el nombre de tu cocktail favorito.';
    } else {
        warning.classList.add('hidden'); 
        //Tengo que hacer una lista de las bebidas que salgan por la búsqueda
        const searchedDrinks = drinks.filter((drink) =>  
        drink.strDrink.toLowerCase().includes(searchValue.toLowerCase()));
        renderDrinksList(searchedDrinks);
        console.log(searchedDrinks);
        getApiData();  //Super importante llamar aquí a get api para que no me de error
    };
};


//9.Esta función me vacía el array de favs, el local de favs y la lista renderizada, y me quita la clase que modifica los favs pero en la lista de drinks

const deleteAllFavDrinks = (event) => {
    event.preventDefault();
    favDrinks = [];
    localStorage.removeItem('favUserDrinks');
    favDrinksList.innerHTML = '';
    if(favDrinks.length === 0){
        deleteAllFavsBtn.classList.add('hidden');
    }
    const drinksListItems = drinksList.querySelectorAll('.js-drinks-list li'); 
    drinksListItems.forEach((drinkLi) => {
        drinkLi.classList.remove('fav__drink');
    });
    
}

deleteAllFavsBtn.addEventListener('click', deleteAllFavDrinks);


//Basic: función que ejecuta lo que va a ver el usuario cuando refresque la página o vuelva otra vez, que son sus favs guardados

const init = () => {
    const favUserDrinks = JSON.parse(localStorage.getItem('favUserDrinks'));
    if(favUserDrinks !== null){
        favDrinks = favUserDrinks;
        renderFavDrinksList(favDrinks);
    }
    fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita')
    .then(response => response.json())
    .then((dataApi) => {
        const margaritaDrinks = dataApi.drinks;
        console.log(margaritaDrinks);
        renderDrinksList(margaritaDrinks);
        drinks.push(...margaritaDrinks);
    });

};

//8.Esta función borra la búsqueda y la lista de la derecha 

const handleReset = (event) => {
    event.preventDefault();
    searchField.value = ''; 
    drinks = [];
    drinksList.innerHTML = ''; 
    init();
};

//Basic: aqui va lo que tiene que estar listo para usar cuando el usuario abra la página 

init();
searchBtn.addEventListener('click', handleSearch);
resetBtn.addEventListener('click', handleReset);


