export const config = {
  WIDTH: 800,
  HEIGHT: 600,
  BOXSIZE: 1000,
  ZOOM: 4000,
  BORDER_COLLISION_LOSS: 25,
  COLLISION_LOSS: 0,
  GRAVITY_CONSTANT: 10,
  GRAVITY_MASS_CONTIBUTION: 99,
  GRAVITY_DISTANCE_CONTRIBUTION: 50,
  GRAVITY_ON: false,
  COLLISIONS_ON: false,
  PARTICLES_NUMBER: 300,
  SHOW_FPS: true,
  DISABLED_BORDERS: false
}

class Configurations {

  constructor(
    public WIDTH = config.WIDTH,
    public HEIGHT = config.HEIGHT,
    public BOXSIZE = config.BOXSIZE,
    public ZOOM = config.ZOOM,
    public COLLISION_LOSS = config.COLLISION_LOSS,
    public BORDER_COLLISION_LOSS = config.BORDER_COLLISION_LOSS,
    public GRAVITY_CONSTANT = config.GRAVITY_CONSTANT,
    public GRAVITY_MASS_CONTIBUTION = config.GRAVITY_MASS_CONTIBUTION,
    public GRAVITY_ON = config.GRAVITY_ON,
    public COLLISIONS_ON = config.COLLISIONS_ON,
    public PARTICLES_NUMBER = config.PARTICLES_NUMBER,
    public GRAVITY_DISTANCE_CONTRIBUTION = config.GRAVITY_DISTANCE_CONTRIBUTION,
    public SHOW_FPS = config.SHOW_FPS,
    public DISABLED_BORDERS = config.DISABLED_BORDERS
  ){}

}

export const simulationConstants = new Configurations() 
