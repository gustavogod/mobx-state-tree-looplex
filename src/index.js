import React from "react";
import ReactDOM from "react-dom";
import "./assets/index.css";
import App from "./components/App";

import { getSnapshot } from "mobx-state-tree";

import { Group } from "./models/Group";

let initialState = {
  users: {
    "a342": {
        id: "a342",
        name: "Homer",
        gender: "m"
    },
    "5fc2": {
        id: "5fc2",
        name: "Marge",
        gender: "f"
    },
    "663b": {
        id: "663b",
        name: "Bart",
        gender: "m"
    },
    "65aa": {
        id: "65aa",
        name: "Maggie",
        gender: "f"
    },
    "ba32": {
        id: "ba32",
        name: "Lisa",
        gender: "f"
    }      
  }
}

let group = Group.create(initialState);

// if (localStorage.getItem('wishlistapp')) {
//     const json = JSON.parse(localStorage.getItem('wishlistapp'));
//     //Alterações no modelo podem ocorrer, fazendo com que este fique diferente da estrutura armazenada na localStorage
//     //A verificação abaixo visa resolver este problema
//     if (WishList.is(json)) initialState = json;
// }
// onSnapshot(wishList, (snapshot) => {
//     localStorage.setItem("wishlistapp", JSON.stringify(snapshot));
// })



function renderApp() {
    ReactDOM.render(<App group={group} />, document.getElementById("root"));
}
renderApp();

 // Técnica de hot module reloading
if (module.hot) { // propriedade do webpack
    module.hot.accept(["./components/App"], () => {
        // new components
        renderApp();
    })

    module.hot.accept(["./models/WishList"], () => {
        // new model definitions
        const snapshot = getSnapshot(group);
        group = Group.create(snapshot);
        renderApp();
    })
}

// setInterval(() => {
//     wishList.items[0].changePrice(wishList.items[0].price + 1)
// }, 1000)

// Comando para criar o servidor JSON falso
// npx json-server --port 3001 --watch db.json
//TEM QUE SER NPX, POIS NPM NÃO ESTAVA RECONHECENDO O SCRIPT