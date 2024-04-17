export const id = "Move All 8px Left";
export const name = "Move All 8px Left";
export const accelerator = "CommandOrControl+Shift+Left";

const MIN_SCENE_X = 60;

export const run = async (store, vmActions) => {
    let scenes = store.getState().project.present.entities.scenes.entities;
    
    let minX = null;
    for (var id in scenes) {
        let sx = scenes[id].x;
        if (!minX) minX = sx;
        if (sx < minX) minX = sx;
    }

    let shift = Math.min(8, Math.max(0, minX - MIN_SCENE_X));

    for (var id in scenes) {
        let sx = scenes[id].x;
        let sy = scenes[id].y;
        store.dispatch(vmActions.moveScene({sceneId: id, x: sx - shift, y: sy}));
    }
}