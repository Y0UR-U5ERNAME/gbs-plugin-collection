export const id = "Snap to 16px";
export const name = "Snap to 16px";
export const accelerator = "CommandOrControl+Shift+2";

const MIN_SCENE_X = 60;
const MIN_SCENE_Y = 30;

export const run = async (store, vmActions) => {
    let scenes = store.getState().project.present.entities.scenes.entities;
    
    for (var id in scenes) {
        let sx = scenes[id].x;
        let sy = scenes[id].y;
        store.dispatch(vmActions.moveScene({sceneId: id, x: Math.round((sx - MIN_SCENE_X) / 16) * 16 + MIN_SCENE_X, y: Math.round((sy - MIN_SCENE_Y) / 16) * 16 + MIN_SCENE_Y}));
    }
}