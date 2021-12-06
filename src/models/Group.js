import { types, flow, applySnapshot } from 'mobx-state-tree';

import { WishList } from './WishList';
import { createStorable } from './Storable';

const User = types.compose( //Para compor as actions importadas de ./Storable
    types
        .model({
            id: types.identifier, //Necessário para se criar uma chave (id) única para cada  instância de User. Necessário para se usar junto com o types.reference(User).
            name: types.string,
            gender: types.enumeration("gender", ["m", "f"]),
            //é o mesmo que -> gender: types.union(types.literal("m"), types.literal("f")) 
            //literal -> pois o valor tem que ser exatamente esse. union -> unir 2 tipos literals
            wishList: types.optional(WishList, {}), // WishList opcional, com valor default vazio
            recipient: types.maybe(types.reference(types.late(() => User))) //age como uma chave estrangeira do usuário
            //Não seria possível utilizar types.reference(User), pois User faria referência a um tipo de dado ainda não definido. Esse problema é resolvido com types.late()
            //Nesse caso, o maybe é usado para que se possa ter um recipient undefined, já que pode não haver nenhuma instância de User referenciada no momento  
        })
        .actions(self => ({
            getSuggestions: flow(function* getSuggestions() {
                const response = yield window.fetch(`http://localhost:3001/suggestions_${self.gender}`);
                self.wishList.items.push(...(yield response.json()));
            })
        })),
    createStorable("users", "id")
);

export const Group = types
    .model({
        users: types.map(User)
    })
    .actions(self => {
        let controller;

        return {
            afterCreate() {
                self.load();
            },
            load: flow(function* load() {
                controller = window.AbortController && new window.AbortController();
                try {
                    const response = yield window.fetch(
                        `http://localhost:3001/users`,
                        { signal: controller && controller.signal }
                    );
                    const users = yield response.json();
                    applySnapshot(
                        self.users, 
                        users.reduce((base, user) => ({ ...base, [user.id]: user }), {}) //Adiciona novo usuário
                    );
                    console.log("success");
                } catch (e) {
                    console.log("aborted", e.name);
                }
            }),
            reload() {
                //abort current request  
                if (controller) controller.abort();
                self.load();
            },
            beforeDestroy() { //life cycle hook
                if (controller) controller.abort();
            },
            drawLots() {
                const allUsers = Array.from(self.users.values());

                // not enought users
                if (allUsers.length <= 1) return;

                //not assigned lots
                let remaining = allUsers.slice();

                allUsers.forEach(user => {
                    // edge case: the only person without recipient
                    // is the same as the only remaining lot
                    // swap lot's with some random other person
                    if (remaining.length === 1 && remaining[0] === user) {
                        const swapWith = allUsers[Math.floor(Math.random() * (allUsers.length - 1))];
                        user.recipient = swapWith.recipient;
                        swapWith.recipient = self;
                    } else {
                        while (!user.recipient) {
                            // Pick random lot from remaining list
                            let recipientIdx = Math.floor(Math.random() * remaining.length);

                            // If it is not the current user, assign it as recipient, and remove the lot
                            if (remaining[recipientIdx] !== user) {
                                user.recipient = remaining[recipientIdx];
                                remaining.splice(recipientIdx, 1);
                            }
                        }
                    }
                })
            }
        }
    });