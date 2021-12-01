import { types } from "mobx-state-tree"

export const WishListItem = types
    .model({
        name: types.string,
        price: types.number,
        image: "" //é o mesmo que image: types.optional(types.string, ""), onde image é opcional, e é atribuída uma string vazia como valor default
    })
    .actions(self => ({ //Está entre () para retornar uma lista de ações. Self refere-se ao próprio modelo
        changeName(newName) { //é o mesmo que changeName: function changeName(newName)
            self.name = newName
        },
        changePrice(newPrice) {
            self.price = newPrice
        },
        changeImage(newImage) {
            self.image = newImage
        }
    }));

export const WishList = types
    .model({
        items: types.array(WishListItem)
    })
    .actions(self => ({
        add(item) {
            self.items.push(item)
        }
    }))
    .views(self => ({
        get totalPrice() {
            return self.items.reduce((sum, entry) => sum + entry.price, 0)
        }
    }))