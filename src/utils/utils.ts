import { simulationConstants } from "./config";

class Particle {

  
  constructor(
    public x = 0,
    public y = 0,
    public color = "red",
    private radius = 50,
    public v = [Math.random(), Math.random()],
    public a = [0, 0],
    public maxV = Infinity,
    public mass = 0,
    public g = [0, 0]
  ){
    this.mass = 2*Math.PI*this.radius;
  }

  render(context: CanvasRenderingContext2D){
    context.beginPath();
    context.fillStyle = this.color;
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fill();
  }

  move(){
    this.v = [this.v[0] + this.a[0], this.v[1] + this.a[1]]
    this.v = [this.v[0] + this.g[0], this.v[1] + this.g[1]]
    //this.v = [this.v[0]/1.005, this.v[1]/1.005]
    const maxedValue = (v: number) => this.maxV * (v/Math.abs(v))
    this.v = [Math.abs(this.v[0]) > this.maxV ? maxedValue(this.v[0]) : this.v[0], Math.abs(this.v[1]) > this.maxV ? maxedValue(this.v[1]) : this.v[1]]
    this.x += this.v[0];
    this.y += this.v[1];
  }

  checkCollisions(objects: Particle[], context: CanvasRenderingContext2D){
    
    const loss = this.mass / 20;

    if(this.x >= (simulationConstants.WIDTH - 2 * this.radius) || this.x <= 2*this.radius){
      this.v = [(-1*this.v[0])/loss, this.v[1]]
    }

    if(this.y >= (simulationConstants.HEIGHT - 2 * this.radius) || this.y <= 2*this.radius){
      this.v = [this.v[0], (-1*this.v[1])/loss];
    }

    if(this.y >= (simulationConstants.HEIGHT - 2 * this.radius) && this.v[1] < 0){
     this.y = (simulationConstants.HEIGHT - 2 * this.radius);
     this.v = [this.v[0]/1.05, this.v[1]]
    }

    if(this.x >= (simulationConstants.WIDTH - 2 * this.radius) && this.v[0] < 0){
      this.x = (simulationConstants.WIDTH - 2 * this.radius);
    }

    if(this.x <= 2*this.radius && this.v[0] < 0){
      this.x = 2*this.radius;
    }

    if(this.y <= 2*this.radius && this.v[1] < 0){
      this.y = 2*this.radius;
    }

    const closeDistanceFactor = 1;

    objects.forEach((object) => {

        if(object === this) return false;
        const vector = [object.x - this.x, object.y - this.y];
        const normalized = Math.sqrt(vector[0]**2 + vector[1]**2)*(object.radius)
        //const normalized = Math.sqrt(vector[0]**2 + vector[1]**2)*20

        /*context.beginPath()
        context.moveTo(this.x, this.y);
        context.lineTo(object.x, object.y);
        context.strokeStyle = "#00000005"
        context.stroke();*/

        const distance = Math.abs(vector[0] ** 2 + vector[1] ** 2)
        this.a = [this.a[0] / 10 + (vector[0])/normalized, this.a[1]/10 + (vector[1])/normalized]

    })

    const closeObjects = objects.filter((object) => {
        if(object === this) return false;
        const vector = [object.x - this.x, object.y - this.y];

        /*context.beginPath()
        context.moveTo(this.x, this.y);
        context.lineTo(object.x, object.y);
        context.strokeStyle = "#00000005"
        context.stroke();*/

        const distance = Math.abs(vector[0] ** 2 + vector[1] ** 2)
        if(distance <= (this.radius + object.radius)**2 * closeDistanceFactor){
          return true
        } else {
        return false
      }
    })

    if(closeObjects.length > 0) {
      //if(Math.random() > 0.5)this.radius += 0.1
      //else (this.radius >= 0.1 ? this.radius -= 0.1 : this.radius)
      this.color = "blue"
    }
    else {
      this.color = `rgba(${this.v[0] * 50}, ${this.v[1] * 50}, ${this.radius})`
    }

    const scaleFactor = 1
    closeObjects.forEach((object) => {
      let dP = [(object.x - this.x), (object.y - this.y)]
      let magnitude = Math.sqrt(dP[0] ** 2 + dP[1] ** 2)
      dP = [dP[0] / magnitude, dP[1] / magnitude]

      dP = [dP[0] = scaleFactor, dP[1] * scaleFactor]

      object.v = [object.v[0] + dP[0], object.v[1] + dP[1]]
      this.v = [this.v[0] - dP[0], this.v[1] - dP[1]]

      const vector = [object.x - this.x, object.y - this.y];
      const distance = Math.sqrt(vector[0] ** 2 + vector[1] ** 2)
      const overlap = (distance - object.radius - this.radius) / 2
      this.x = this.x + (dP[0] * overlap)
      this.y = this.y + (dP[1] * overlap)
      object.x = object.x - (dP[0] * overlap)
      object.y = object.y - (dP[1] * overlap)
    })

  }

}

class Background {

  x = 0
  y = 0
  
  render(context: CanvasRenderingContext2D){
    context.beginPath()
    context.fillStyle = "rgba(255, 255, 255, .7)"
    context.rect(this.x, this.y, simulationConstants.WIDTH, simulationConstants.HEIGHT)
    context.fill()
  }

}

export {Particle, Background}
