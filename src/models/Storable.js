import { types, flow, getSnapshot, onSnapshot } from "mobx-state-tree";

export function createStorable(collection, attribute) {
  return types.model({}).actions(self => ({
    save: flow(function* save() {
      try {
        yield window.fetch(`http://localhost:3001/${collection}/${self[attribute]}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(getSnapshot(self))
        })
      } catch (e) {
        console.error("Uh oh, failed to save: ", e);
      }
    }),
    afterCreate() {
      //Desta forma, não preciso ficar invocando a função de salvar dentro dos componentes, pois sempre que uma nova instância de User é criada, o Hook afterCreate é invocado. Além da utilidade, também pode evitar problemas com a invocação de vários fetchs em componentes diferentes.
      onSnapshot(self, self.save);
    }
  }))
}