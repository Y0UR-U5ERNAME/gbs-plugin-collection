export const id = "Move To Top Left";
export const name = "Move To Top Left";
export const accelerator = "";

const MIN_SCENE_X = 60;
const MIN_SCENE_Y = 30;

export const run = async (store, vmActions) => {
    let scenes = store.getState().project.present.entities.scenes.entities;
    
    let minX = null;
    let minY = null
    for (var id in scenes) {
        let sx = scenes[id].x;
        let sy = scenes[id].y;
        if (!minX) minX = sx;
        if (!minY) minY = sy;
        if (sx < minX) minX = sx;
        if (sy < minY) minY = sy;
    }
    
    for (var id in scenes) {
        let sx = scenes[id].x;
        let sy = scenes[id].y;
        store.dispatch(vmActions.moveScene({sceneId: id, x: sx - minX + MIN_SCENE_X, y: sy - minY + MIN_SCENE_Y}));
    }
}