export const id = "Move All 8px Right";
export const name = "Move All 8px Right";
export const accelerator = "CommandOrControl+Shift+Right";

export const run = async (store, vmActions) => {
    let scenes = store.getState().project.present.entities.scenes.entities;

    for (var id in scenes) {
        let sx = scenes[id].x;
        let sy = scenes[id].y;
        store.dispatch(vmActions.moveScene({sceneId: id, x: sx + 8, y: sy}));
    }
}