export const id = "Move All 8px Up";
export const name = "Move All 8px Up";
export const accelerator = "CommandOrControl+Shift+Up";

const MIN_SCENE_Y = 30;

export const run = async (store, vmActions) => {
    let scenes = store.getState().project.present.entities.scenes.entities;
    
    let minY = null;
    for (var id in scenes) {
        let sy = scenes[id].y;
        if (!minY) minY = sy;
        if (sy < minY) minY = sy;
    }

    let shift = Math.min(8, Math.max(0, minY - MIN_SCENE_Y));

    for (var id in scenes) {
        let sx = scenes[id].x;
        let sy = scenes[id].y;
        store.dispatch(vmActions.moveScene({sceneId: id, x: sx, y: sy - shift}));
    }
}