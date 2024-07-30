import { simulationConstants } from "../utils/config";
import { createButton, createCheckbox, createSlider } from "./helpers";

export function initConfiguration(){

    createSlider('Box Size', 1, 10000, simulationConstants.BOXSIZE, 'BOXSIZE')
    createSlider('Zoom', 1, 40000, simulationConstants.ZOOM, 'ZOOM')
    createSlider('Particles Number', 1, 300, simulationConstants.PARTICLES_NUMBER, 'PARTICLES_NUMBER')
    createSlider('Collision Loss', 0, 100, simulationConstants.COLLISION_LOSS, 'COLLISION_LOSS')
    createSlider('Boder Collision Loss', 0, 100, simulationConstants.BORDER_COLLISION_LOSS, 'BORDER_COLLISION_LOSS')
    createSlider('Gravity Constant', 0, 100, simulationConstants.GRAVITY_CONSTANT, 'GRAVITY_CONSTANT')
    createSlider('Gravity Distance Contribution', 50, 100, simulationConstants.GRAVITY_DISTANCE_CONTRIBUTION, 'GRAVITY_DISTANCE_CONTRIBUTION')
    createSlider('Gravity Mass Contribution', 1, 99, simulationConstants.GRAVITY_MASS_CONTIBUTION, 'GRAVITY_MASS_CONTIBUTION')
    createSlider('Gravity Approximation (Barnes-Hut)', 0, 100, simulationConstants.GRAVITY_APPROXIMATION, 'GRAVITY_APPROXIMATION');
    createCheckbox('Enabled Gravity', simulationConstants.GRAVITY_ON, 'GRAVITY_ON')
    createCheckbox('Enabled Collisions', simulationConstants.COLLISIONS_ON, 'COLLISIONS_ON')
    createCheckbox('Disable Borders', simulationConstants.DISABLED_BORDERS, 'DISABLED_BORDERS')
    createCheckbox('Show FPS', simulationConstants.SHOW_FPS, 'SHOW_FPS')
    createCheckbox('Show Chuncks', simulationConstants.SHOW_CHUNCKS, 'SHOW_CHUNCKS')
    createCheckbox('Highlight Collisions', simulationConstants.HIGHLIGHT_COLLISIONS, 'HIGHLIGHT_COLLISIONS')
    createButton('Reset', () => {
      (window as any).initParticles()
    })

}
