import './style.css'
import { simulationConstants } from './utils/config';
import { init } from './utils/init';
import { Camera, Particle, Background } from './utils/3d';
import { difference, normalizeVector, scaleVector, sumVector, vectorLength } from './utils/helpers';
//import { Background, Particle } from './utils/utils';

const context = init();
const particles: Particle[] = [];
const camera = new Camera(
  [simulationConstants.WIDTH / 2,
  simulationConstants.HEIGHT / 2,
  400]
);
let clicking = false;
let prevMousePosition: (number | null)[] = [null, null];

function initParticle(){
  const particle_radius = 5;
  const position_x = simulationConstants.WIDTH / 2;
  const position_y = simulationConstants.HEIGHT / 2;
  const position_z = 0
  const particle1 = new Particle([position_x, position_y, position_z], particle_radius);
  const particle2 = new Particle([position_x + 100, position_y, position_z], particle_radius);
  particles.push(particle1)
  particles.push(particle2)
}

/*const particles: Particle[] = []

function initParticles(threshold: number = 0){
  const particles_radius = 5;
  let position_x = 2 * particles_radius + threshold;
  let position_y = 2 * particles_radius + threshold;

  for (let i = 0; i < 2; i++){
    if(position_x >= simulationConstants.WIDTH - 2 * particles_radius){
      position_x = 2 * particles_radius;
      position_y += 2 * particles_radius;
    }
    const particle = new Particle(position_x, position_y, "red", particles_radius);
    particles.push(particle);
    position_x += 2 * particles_radius;
  }
}

initParticles(0);


window.requestAnimationFrame(draw);

function drawBackground(){
  const background = new Background();
  background.render(context);
}

const gravity = .5;

function drawParticles(){

  particles.forEach(particle => {
    particle.render(context)
    //particle.g = [0, gravity]
    particle.maxV = 20;
    particle.checkCollisions(particles, context);
    particle.move();
  });

}

document.getElementById("canvas")?.addEventListener("mousemove", event => {
  const normalized = [((event.offsetX / simulationConstants.WIDTH)*2)-1, ((event.offsetY / simulationConstants.HEIGHT)*2)-1];
  particles.forEach((particle) => {
    particle.g = [normalized[0] * 0.5, normalized[1] * 0.5]
    particle.color = "purple"
  })
})

document.getElementById("canvas")?.addEventListener(("mouseleave"), () => {
  particles.forEach((particle) => {
    particle.g = [0, 0]
  })
})

document.getElementById("canvas")?.addEventListener("click", event => {
  const position = [event.offsetX, event.offsetY];
  particles.push(new Particle(position[0], position[1], "yellow", 15))
})*/

document.getElementById("canvas")?.addEventListener(("mousedown"), () => {
  clicking = true;
})

document.getElementById("canvas")?.addEventListener(("mouseup"), () => {
  clicking = false;
  prevMousePosition = [null, null]
})

document.getElementById("canvas")?.addEventListener(("mousemove"), (event) => {

  const mousePosition = [event.offsetX, event.offsetY];

  if(clicking){

    if(prevMousePosition.every(c => c !== null)){
      const changedPosition = difference(mousePosition, prevMousePosition as number[]);
      const newPosition = sumVector(camera.position, [...changedPosition, 0]);
      const center = [simulationConstants.WIDTH / 2, simulationConstants.HEIGHT / 2, 0];
      const delta = difference(newPosition, center)
      const scaledDelta = scaleVector(normalizeVector(delta), 400)
      const finalPosition = sumVector(scaledDelta, center);
      camera.position = finalPosition;
    }

    prevMousePosition = mousePosition;

  }

})

document.getElementById("canvas")?.addEventListener(("wheel"), (e) => {
  e.preventDefault()
  camera.position = [camera.position[0], camera.position[1], camera.position[2] + e.deltaY]
})

initParticle()

function drawParticles(){

  particles.forEach(particle => {
    particle.render(context, camera)
    //particle.g = [0, gravity]
    //particle.checkCollisions(particles, context);
    //particle.move();
  });

}

function drawBackground(){
  const background = new Background();
  background.render(context);
}

function draw(){
  drawBackground()
  drawParticles()
  window.requestAnimationFrame(draw);
}

draw()
