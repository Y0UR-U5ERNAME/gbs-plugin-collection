export const id = "Move All 8px Down";
export const name = "Move All 8px Down";
export const accelerator = "CommandOrControl+Shift+Down";

export const run = async (store, vmActions) => {
    let scenes = store.getState().project.present.entities.scenes.entities;

    for (var id in scenes) {
        let sx = scenes[id].x;
        let sy = scenes[id].y;
        store.dispatch(vmActions.moveScene({sceneId: id, x: sx, y: sy + 8}));
    }
}