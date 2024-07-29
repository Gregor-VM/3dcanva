import './style.css'
import { simulationConstants } from './utils/config';
import { init } from './init';
import { Camera, Particle, Background } from './utils/3d';
import { chunckCube, difference, getCubeLines, getCubePoints, isParticleInCube } from './utils/helpers';

const context = init();
let particles: Particle[] = [
];
const camera = new Camera(
  [simulationConstants.BOXSIZE / 2,
  simulationConstants.BOXSIZE / 2,
  simulationConstants.ZOOM]
);
(window as any).camera = camera;
let clicking = false;
let prevMousePosition: (number | null)[] = [null, null];
let isPaused = false;
let fps = 0;
let fpsAvg = 0;

function initParticles(){
  fps = 0; fpsAvg = 0;
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
  simulationConstants.ZOOM = camera.position[2] + (e.deltaY * sensibilityFactor);
})

window.addEventListener(("keydown"), (e) => {
  if(e.code === "Space"){
    e.preventDefault()
    isPaused = !isPaused;
  }
})

initParticles();
(window as any).initParticles = initParticles;

function drawParticles(){

  const dividedParticles: Particle[][] = [];
  for (let i=0;i<64;i++) dividedParticles.push([]);

  const boxSize = simulationConstants.BOXSIZE;
  const dividedPoints = chunckCube([0, 0, 0], boxSize, 1);

  particles.forEach(particle => {
    dividedPoints.forEach((points, i) => {
      if(isParticleInCube(points, particle.position)){
        dividedParticles[i].push(particle)
      }
    })
  })

  dividedParticles.forEach(chunck => {
    chunck.forEach(particle => {
      if(simulationConstants.COLLISIONS_ON) {
        particle.checkParticlesCollisions(chunck);
      }
    })
  })

  const gravity_constant = simulationConstants.GRAVITY_CONSTANT/100;
  const gravity_mass_contribution = (100 - simulationConstants.GRAVITY_MASS_CONTIBUTION);
  const gravity_distance_contribution = simulationConstants.GRAVITY_DISTANCE_CONTRIBUTION / 100;

  particles.forEach(particle => {
    particle.render(context, camera)
    if(!isPaused){
      if(!simulationConstants.DISABLED_BORDERS) particle.checkBorderCollisions();
      if(simulationConstants.GRAVITY_ON) particle.gravityChecks(particles, gravity_constant, gravity_mass_contribution, gravity_distance_contribution);
      particle.move();
    }
  });


  // THIS CODE IS FOR FIXING THE VIEW TO A PARTICLE
  //camera.center = particles[0].position;
  //camera.position = [particles[0].position[0], particles[0].position[1], camera.position[2]]

}

function drawLines(){
  
  const boxSize = simulationConstants.BOXSIZE;
  const mainCube = getCubePoints([0, 0, 0], boxSize)
  let lines = [
    ...(getCubeLines(mainCube, boxSize))
  ]

  if(simulationConstants.SHOW_CHUNCKS){
    const dividedPoints = chunckCube([0, 0, 0], boxSize, 1);
    const dividedLines = dividedPoints.map( (points: number[][]) => getCubeLines(points, boxSize/4, "rgba(255, 255, 255, 0.01)"))
    lines = [...lines, ...(dividedLines.flat())]
  }

  
  lines.forEach(line => {
    line.render(context, camera)
  });

}

function drawBackground(){
  const background = new Background();
  background.render(context);
}

setInterval(() => {
  if(simulationConstants.SHOW_FPS){
    fpsAvg = (fpsAvg + fps) / 2;
    fps = 0;
  }
}, 1000);

function fpsCounter(){
  fps += 1;
  context.font = "15px serif";
  context.fillText(String(Math.round(fpsAvg)) + " FPS", 5, 15);
}

function draw(){

  drawBackground()
  drawParticles()
  if(!simulationConstants.DISABLED_BORDERS) drawLines()

  if(simulationConstants.SHOW_FPS) fpsCounter()
  if(!simulationConstants.SHOW_FPS) {
    fps = 0;
    fpsAvg = 0
  }

  window.requestAnimationFrame(draw);
}

draw()
