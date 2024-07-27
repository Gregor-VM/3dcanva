import { simulationConstants } from "../utils/config";
import { createButton, createCheckbox, createSlider } from "./helpers";

export function initConfiguration(){

    createSlider('boxSize', 'Box Size', 1, 10000, simulationConstants.BOXSIZE, 'BOXSIZE')
    createSlider('zoom', 'Zoom', 1, 40000, simulationConstants.ZOOM, 'ZOOM')
    createSlider('particles', 'Particles Number', 1, 500, simulationConstants.PARTICLES_NUMBER, 'PARTICLES_NUMBER')
    createSlider('loss', 'Collision Loss', 0, 100, simulationConstants.COLLISION_LOSS, 'COLLISION_LOSS')
    createSlider('borderLoss', 'Boder Collision Loss', 0, 100, simulationConstants.BORDER_COLLISION_LOSS, 'BORDER_COLLISION_LOSS')
    createSlider('gravity', 'Gravity Constant', 0, 100, simulationConstants.GRAVITY_CONSTANT, 'GRAVITY_CONSTANT')
    createSlider('gravityMass', 'Gravity Mass Contribution', 1, 99, simulationConstants.GRAVITY_MASS_CONTIBUTION, 'GRAVITY_MASS_CONTIBUTION')
    createCheckbox('gravity_on', 'Enabled Gravity', simulationConstants.GRAVITY_ON, 'GRAVITY_ON')
    createCheckbox('collision_on', 'Enabled Collisions', simulationConstants.COLLISIONS_ON, 'COLLISIONS_ON')
    createButton('Reset', () => {
      (window as any).initParticles()
    })

}
