import React from "react";
import ReactDOM from "react-dom";
import "./assets/index.css";
import App from "./components/App";

import { getSnapshot } from "mobx-state-tree";

import { Group } from "./models/Group";

let initialState = { users: {} };

let group = (window.group = Group.create(initialState));
//o uso do window auxilia na visualização com a devtools
//dar um window.group.toJSON() no console é o mesmo que invocar um getSnapshot
group.load();

//CÓDIGO QUE TINHA SIDO USADO PARA DEMONSTRAÇÃO DO USO DA LOCALSTORAGE
// if (localStorage.getItem('wishlistapp')) {
//     const json = JSON.parse(localStorage.getItem('wishlistapp'));
//     //Alterações no modelo podem ocorrer, fazendo com que este fique diferente da estrutura armazenada na localStorage
//     //A verificação abaixo visa resolver este problema
//     if (WishList.is(json)) initialState = json;
// }
// onSnapshot(wishList, (snapshot) => {
//     localStorage.setItem("wishlistapp", JSON.stringify(snapshot));
// })

//CÓDIGO APLICADO PARA DEMONSTRAÇÃO DA EXECUÇÃO DAS CHAMADAS ASSÍNCRONAS FEITAS COM generator, flow E yield
// addMiddleware(group, (call, next) => {
//     console.log(`[${call.type}] ${call.name}`);
//     return next(call);
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
        group = (window.group = Group.create(snapshot));
        renderApp();
    })
}

// setInterval(() => {
//     wishList.items[0].changePrice(wishList.items[0].price + 1)
// }, 1000)

// Comando para criar o servidor JSON falso
// npx json-server --port 3001 --watch db.json
//TEM QUE SER NPX, POIS NPM NÃO ESTAVA RECONHECENDO O SCRIPT