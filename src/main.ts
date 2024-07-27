import './style.css'
import { simulationConstants } from './utils/config';
import { init } from './init';
import { Camera, Particle, Background } from './utils/3d';
import { difference, getCubeLines } from './utils/helpers';

const context = init();
let particles: Particle[] = [];
const camera = new Camera(
  [simulationConstants.BOXSIZE / 2,
  simulationConstants.BOXSIZE / 2,
  simulationConstants.ZOOM]
);
(window as any).camera = camera;
let clicking = false;
let prevMousePosition: (number | null)[] = [null, null];
let isPaused = false;

function initParticles(){
  particles = [];
  const boxSize = simulationConstants.BOXSIZE;
  const particle_radius = 5;

  for (let i=0;i<simulationConstants.PARTICLES_NUMBER;i++){
    const particle = new Particle([Math.random() * boxSize, Math.random() * boxSize, Math.random() * boxSize], particle_radius, [Math.random(), Math.random(), Math.random()]);
    particles.push(particle)
  }
}

document.getElementById("canvas")?.addEventListener(("mousedown"), () => {
  clicking = true;
})

document.getElementById("canvas")?.addEventListener(("mouseup"), () => {
  clicking = false;
  prevMousePosition = [null, null]
})

document.getElementById("canvas")?.addEventListener(("mousemove"), (event) => {

  const sensibilityFactor = 1/20;
  const mousePosition = [event.offsetX, event.offsetY];

  if(clicking){

    if(prevMousePosition.every(c => c !== null)){
      const changedPosition = difference(prevMousePosition as number[], mousePosition);

      camera.angles = [
        camera.angles[0] + changedPosition[1]*sensibilityFactor,
        camera.angles[1] + changedPosition[0]*-1*sensibilityFactor,
        0
      ]

    }

    prevMousePosition = mousePosition;

  }

})

document.getElementById("canvas")?.addEventListener(("wheel"), (e) => {
  e.preventDefault()
  const sensibilityFactor = 10
  camera.position = [camera.position[0], camera.position[1], camera.position[2] + (e.deltaY * sensibilityFactor)]
})

window.addEventListener(("keydown"), (e) => {
  e.preventDefault()
  if(e.code === "Space"){
    isPaused = !isPaused;
  }
})

initParticles();
(window as any).initParticles = initParticles;

function drawParticles(){


  //camera.updateCenter()

  particles.forEach(particle => {
    particle.render(context, camera)
    if(!isPaused){
      particle.checkCollisions(particles);
      if(simulationConstants.GRAVITY_ON) particle.gravityChecks(particles);
      particle.move();
    }
  });

  //camera.center = particles[0].position;
  //camera.position = [particles[0].position[0], particles[0].position[1], camera.position[2]]

}

function drawLines(){
  
  const boxSize = simulationConstants.BOXSIZE;
  const lines = [
    ...(getCubeLines(
      [[0, 0, 0],
      [boxSize, 0, 0],
      [0, boxSize, 0],
      [0, 0, boxSize],
      [boxSize, boxSize, 0],
      [0, boxSize, boxSize],
      [boxSize, 0, boxSize],
      [boxSize, boxSize, boxSize]], boxSize
    ))
  ]

  lines.forEach(line => {
    line.render(context, camera)
  });

}

function drawBackground(){
  const background = new Background();
  background.render(context);
}

function draw(){
  drawBackground()
  drawParticles()
  drawLines()
  window.requestAnimationFrame(draw);
}

draw()
