import { simulationConstants } from "./config";
import { difference, dotProduct, normalizeVector, rotateVector, scaleVector, sumVector, vectorLength } from "./helpers";

export class Particle {

  constructor(
    public position = [0, 0, 0],
    public radius = 50,
    public v = [0, 0, 0],
    public a = [0, 0, 0],
    public color = "red",
    public maxV = Infinity
  ){}

  getMass(){
    return this.radius **2 * Math.PI
  }

  render(context: CanvasRenderingContext2D, camera: Camera){
    context.beginPath();
    context.fillStyle = this.color;

    const currentPosition = rotateVector(this.position, camera.angles, camera.center)

    const distance = vectorLength(difference(
      camera.position, currentPosition
    ))

    const center = [simulationConstants.WIDTH / 2, simulationConstants.HEIGHT / 2, 0]
    const vector = sumVector(scaleVector(difference(currentPosition, camera.position), 1/(camera.pov*distance)), center);

    context.arc(
      vector[0],
      vector[1],
      this.radius/(distance*camera.pov), 0, 2 * Math.PI);

    context.fill();
  }

  move(){
    this.v = sumVector(this.v, this.a);
    const maxedValue = (v: number) => this.maxV * (v/Math.abs(v))
    this.v = this.v.map(v => v > this.maxV ? maxedValue(v) : v)
    this.position = sumVector(this.position, this.v)
  }

  checkBorderCollisions(){
    const boxSize = simulationConstants.BOXSIZE;
    const borderLoss = (100 - simulationConstants.BORDER_COLLISION_LOSS) / 100;

    this.position.forEach((pos, i) => {
      if(pos >= (boxSize - this.radius) || pos <= (0 + this.radius)){
        this.v[i] = -1*this.v[i]*borderLoss
        if(pos >= (boxSize - this.radius)) this.position[i] = boxSize - this.radius;
        if(pos <= (0 + this.radius)) this.position[i] = this.radius
      }
    })
  }

  checkParticlesCollisions(objects: Particle[]){

    const closeObjects = objects.filter((object) => {
        if(object === this) return false;
        const vector = difference(object.position, this.position);
        const distance = Math.abs(dotProduct(vector, vector));
        if(distance <= (this.radius + object.radius)**2){
          return true
        } else {
        return false
      }
    })

    if(closeObjects.length > 0) {
      this.color = "blue"
    }
    else {
      const normalize = (v: number) => {
        return Math.min(150 + 7.75*v, 255);
      }
      this.color = `rgb(${normalize(this.v[0])}, ${normalize(this.v[1])}, ${normalize(this.v[2])})`
      //this.color = "red"
    }

    const loss = (100 - simulationConstants.COLLISION_LOSS) / 100;

    closeObjects.forEach((object) => {
      let dP = difference(object.position, this.position);
      let magnitude = vectorLength(dP)
      dP = scaleVector(dP, 1/magnitude)

      dP = scaleVector(dP, loss)

      object.v = sumVector(object.v, dP)
      this.v = difference(this.v, dP);

      const vector = difference(object.position, this.position);
      const distance = vectorLength(vector);
      const overlap = (distance - object.radius - this.radius)
      const dPOverlap = scaleVector(dP, overlap);
      this.position = sumVector(this.position, dPOverlap);
      object.position = difference(object.position, dPOverlap);
    })

  }

  checkCollisions(objects: Particle[]){
    if(simulationConstants.COLLISIONS_ON) this.checkParticlesCollisions(objects);
    this.checkBorderCollisions();
  }

  gravityChecks(objects: Particle[]){
    objects.forEach((object) => {
      if(object === this) return false;
      const gravity_constant = simulationConstants.GRAVITY_CONSTANT/100;
      const gravity_mass_contribution = (100 - simulationConstants.GRAVITY_MASS_CONTIBUTION);
      const vector = difference(object.position, this.position);
      const normalized = vectorLength(vector)*(object.radius*gravity_mass_contribution);
      this.a = scaleVector(this.a, gravity_constant);
      const vectorNormalized = scaleVector(vector, 1/normalized);
      this.a = sumVector(this.a, vectorNormalized);
    })
  }

}

export class Camera{

  public initVector: number[] = [];

  constructor(
    public position = [0, 0, 0],
    public pov = 0.001,
    public angles = [0, 0, 0],
    /*public center = [
      simulationConstants.WIDTH / 2,
      simulationConstants.HEIGHT / 2,
      0
    ]*/
    public center = [
      simulationConstants.BOXSIZE / 2,
      simulationConstants.BOXSIZE / 2,
      simulationConstants.BOXSIZE / 2
    ]
  ){
    this.getInitVector()
  }

  getInitVector(){
    const delta = difference(this.position, this.center)
    const scaledDelta = normalizeVector(delta)
    this.initVector = scaledDelta;
  }

  updateCenter(){
    this.position = [
      simulationConstants.BOXSIZE / 2,
      simulationConstants.BOXSIZE / 2,
      simulationConstants.ZOOM
    ]
    this.center = [
      simulationConstants.BOXSIZE / 2,
      simulationConstants.BOXSIZE / 2,
      simulationConstants.BOXSIZE / 2
    ]
  }

}


export class Background {

  x = 0
  y = 0
  
  render(context: CanvasRenderingContext2D){
    context.beginPath()
    context.fillStyle = "#2c3e50"
    context.rect(this.x, this.y, simulationConstants.WIDTH, simulationConstants.HEIGHT)
    context.fill()
  }

}


export class Line {

  constructor(
    public from = [0, 0, 0],
    public to = [0, 0, 0],
    public color = "red",
  ){}

  render(context: CanvasRenderingContext2D, camera: Camera){

    const from = rotateVector(this.from, camera.angles, camera.center);
    const to = rotateVector(this.to, camera.angles, camera.center)

    const distanceFrom = vectorLength(difference(
      camera.position, from
    ))

    const distanceTo = vectorLength(difference(
      camera.position, to
    ))


    context.beginPath()
    const viewCenter = [simulationConstants.WIDTH / 2, simulationConstants.HEIGHT / 2, 0]
    const center = viewCenter;
    const vectorFrom = sumVector(scaleVector(difference(from, camera.position), 1/(camera.pov*distanceFrom)), center);
    const vectorTo = sumVector(scaleVector(difference(to, camera.position), 1/(camera.pov*distanceTo)), center);

    context.moveTo(vectorFrom[0], vectorFrom[1]);
    context.lineTo(vectorTo[0], vectorTo[1]);
    context.strokeStyle = this.color;
    context.stroke();

    context.fill();
  }

}
