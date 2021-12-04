import { types, flow } from 'mobx-state-tree';

import { WishList } from './WishList';

const User = types
    .model({
        id: types.string,
        name: types.string,
        gender: types.enumeration("gender", ["m", "f"]),
        //é o mesmo que -> gender: types.union(types.literal("m"), types.literal("f")) 
        //literal -> pois o valor tem que ser exatamente esse. union -> unir 2 tipos literals
        wishList: types.optional(WishList, {}) // WishList opcional, com valor default vazio
    })
    .actions(self => ({
        getSuggestions: flow(function*() {
            const response = yield window.fetch(`http://localhost:3001/suggestions_${self.gender}`);
            const suggestions = yield response.json();
            self.wishList.items.push( ...suggestions);
        })
    }));

export const Group = types.model({
    users: types.map(User)
});