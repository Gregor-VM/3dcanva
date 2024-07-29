import { initConfiguration } from "./configuration/init";
import { simulationConstants } from "./utils/config";

export function init(){
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
      <div class="container">
          <div class="configuration" id="configuration">

          </div>
          <canvas height="${simulationConstants.HEIGHT}" 
            width="${simulationConstants.WIDTH}" 
            id="canvas"> 
          </canvas> 
          <small>Press "Space" to pause</small>
      </div>
    `

    const canvas = (document.getElementById("canvas") as HTMLCanvasElement);
    const context = (canvas.getContext("2d") as CanvasRenderingContext2D);

  initConfiguration()

  return context;
}
