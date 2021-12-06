import React from "react"
import { observer } from "mobx-react"

import WishListItemView from "./WishListItemView"
import WishListEntry from "./WishListItemEntry"

const WishListView = ({ wishList, readonly }) => (
    <div className="list">
        <ul>
            {
                wishList.items.map((item, idx) => (
                    <WishListItemView key={idx} item={item} readonly={readonly} />
                ))
            }
        </ul>
        Total: {wishList.totalPrice} €{!readonly && <WishListEntry wishList={wishList} />}
    </div>
)

export default observer(WishListView)