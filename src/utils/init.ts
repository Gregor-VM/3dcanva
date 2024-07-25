import { simulationConstants } from "./config";

export function init(){
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
      <div>
          <canvas height="${simulationConstants.HEIGHT}" 
            width="${simulationConstants.WIDTH}" 
            id="canvas"> 
          </canvas> 
      </div>
    `

    const canvas = (document.getElementById("canvas") as HTMLCanvasElement);
    const context = (canvas.getContext("2d") as CanvasRenderingContext2D);

  return context;
}
