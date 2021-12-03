import React from "react"
import ReactDOM from "react-dom"
import "./assets/index.css"
import App from "./components/App"

import { getSnapshot, onSnapshot } from "mobx-state-tree"

import { WishList } from "./models/WishList"

let initialState = {
    items: [
        {
            name: "LEGO Mindstorms EV3",
            price: 349.95,
            image: "https://images-na.ssl-images-amazon.com/images/I/71CpQw%2BufNL._SL1000_.jpg"
        },
        {
            name: "Miracles - C.S. Lewis",
            price: 12.91,
            image:
                "https://images-na.ssl-images-amazon.com/images/I/51a7xaMpneL._SX329_BO1,204,203,200_.jpg"
        }
    ]    
}

// if (localStorage.getItem('wishlistapp')) {
//     const json = JSON.parse(localStorage.getItem('wishlistapp'));
//     //Alterações no modelo podem ocorrer, fazendo com que este fique diferente da estrutura armazenada na localStorage
//     //A verificação abaixo visa resolver este problema
//     if (WishList.is(json)) initialState = json;
// }

let wishList = WishList.create(initialState);

onSnapshot(wishList, (snapshot) => {
    localStorage.setItem("wishlistapp", JSON.stringify(snapshot));
})


function renderApp() {
    ReactDOM.render(<App wishList={wishList} />, document.getElementById("root"));
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
        const snapshot = getSnapshot(wishList);
        wishList = WishList.create(snapshot);
        renderApp();
    })
}

// setInterval(() => {
//     wishList.items[0].changePrice(wishList.items[0].price + 1)
// }, 1000)