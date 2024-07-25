import { simulationConstants } from "./config";
import { difference, vectorLength } from "./helpers";

export class Particle {

  constructor(
    public position = [0, 0, 0],
    public radius = 50,
    public color = "red",
    public v = [0, 0],
    public a = [0, 0]
  ){}

  render(context: CanvasRenderingContext2D, camera: Camera){
    context.beginPath();
    context.fillStyle = this.color;

    const distance = vectorLength(difference(
      [0, 0, camera.position[2]], 
      [0, 0, this.position[2]]
    ))

    context.arc(
      (simulationConstants.WIDTH / 2) + (this.position[0] - camera.position[0]) / (camera.pov*distance),
      (simulationConstants.HEIGHT / 2) + (this.position[1] - camera.position[1]) / (camera.pov*distance),
      this.radius/(distance*camera.pov), 0, 2 * Math.PI);

    context.fill();
  }

}

export class Camera{

  constructor(
    public position = [0, 0, 0],
    public pov = 0.001
  ){}

}


export class Background {

  x = 0
  y = 0
  
  render(context: CanvasRenderingContext2D){
    context.beginPath()
    context.fillStyle = "rgba(255, 255, 255, .7)"
    context.rect(this.x, this.y, simulationConstants.WIDTH, simulationConstants.HEIGHT)
    context.fill()
  }

}
