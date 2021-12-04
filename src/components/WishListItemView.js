import React, { Component } from "react"
import { observer } from "mobx-react"
import { clone, getSnapshot, applySnapshot } from "mobx-state-tree"

import WishListItemEdit from "./WishListItemEdit"

class WishListItemView extends Component {
    constructor() {
        super()
        this.state = { isEditing: false }
    }

    render() {
        const { item } = this.props
        return this.state.isEditing ? (
            this.renderEditable()
        ) : (
            <li className="item">
                {item.image && <img src={item.image} alt="Wish list item"/>}
                <h3>{item.name}</h3>
                <span>{item.price} €</span>
                    <span>
                        <button onClick={this.onToggleEdit}>✏</button>
                        <button onClick={item.remove}>❎</button>
                    </span>
            </li>
        )
    }

    renderEditable() {
        return (
            <li className="item">
                <WishListItemEdit item={this.state.clone} />
                <button onClick={this.onSaveEdit}>💾</button>
                <button onClick={this.onCancelEdit}>❎</button>
            </li>
        )
    }

    onToggleEdit = () => {
        this.setState({
            isEditing: true,
            clone: clone(this.props.item)
        })
    }

    onCancelEdit = () => {
        this.setState({ isEditing: false })
    }

    onSaveEdit = () => {
        applySnapshot(this.props.item, getSnapshot(this.state.clone))
        this.setState({
            isEditing: false,
            clone: null
        })
    }
}

export default observer(WishListItemView)
//com o observer, sempre que algum dado relevante para a renderização do componente é alterado, então o compoenente sofre o rerender
//assim o mobx é conectado com o react

//Reparar na linha 26
//<button onClick={item.remove}>❎</button>
//Não foi necessário fazer uma função para lidar com a remoção, pois já há o método remove() ligado nas actions  do model WhishList