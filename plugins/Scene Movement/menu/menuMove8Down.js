export const id = "Move Selected 8px Down";
export const name = "Move Selected 8px Down";
export const accelerator = "CommandOrControl+Down";

export const run = async (store, vmActions) => {
    let action = x => {return {type: "electron/showErrorBox", payload: x}};
    let scenes = store.getState().project.present.entities.scenes.entities;
    let id = store.getState().editor.scene;

    if (!id) {
        store.dispatch(action({title: "No selected scene", content: "You must select a scene first before running this."}));
        return;
    }

    let sx = scenes[id].x;
    let sy = scenes[id].y;
    store.dispatch(vmActions.moveScene({sceneId: id, x: sx, y: sy + 8}));
}