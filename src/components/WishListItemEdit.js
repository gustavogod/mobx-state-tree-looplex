import React, { Component } from "react"
import { observer } from "mobx-react"

class WishListItemEdit extends Component {
    render() {
        const { item } = this.props
        return (
            <div className="item-edit">
                Thing: <input value={item.name} onChange={this.onNameChange} />
                <br />
                Price: <input 
                        className="input-price"
                        type="number" 
                        value={item.price > 0 ? item.price : ""} 
                        onChange={this.onPriceChange} 
                        min="0"
                        placeholder="0,00"
                        />
                <br />
                Image: <input value={item.image} onChange={this.onImageChange} />
                <br />
            </div>
        )
    }

    onNameChange = event => {
        this.props.item.changeName(event.target.value)
    }

    onPriceChange = event => {
        const price = parseFloat(parseFloat(event.target.value).toFixed(2));
        if (!isNaN(price)) this.props.item.changePrice(price)
    }

    onImageChange = event => {
        this.props.item.changeImage(event.target.value)
    }
}

export default observer(WishListItemEdit)