import { simulationConstants } from "../utils/config";

export function createSlider(name: string, min = 0, max = 100, value = 0, property: keyof typeof simulationConstants){
  const container = document.createElement('div');
  container.classList.add('sliderContainer');
  const label = document.createElement('label');
  label.setAttribute('for', property);
  label.textContent = name;
  container.appendChild(label);
  const input = document.createElement('input');
  input.setAttribute("type", "range");
  input.setAttribute("min", String(min));
  input.setAttribute("max", String(max));
  input.setAttribute("value", String(value));
  input.setAttribute("id", property);
  input.classList.add('slider');

  input.oninput = (ev: any) => {
    const value = ev.target.valueAsNumber;
    (simulationConstants[property] as any) = value;
    if(property === "ZOOM" || property === "BOXSIZE") (window as any).camera.updateCenter();
  }

  container.appendChild(input);
  const configElement = document.querySelector<HTMLDivElement>('#configuration')!
  configElement.appendChild(container);
}


export function createCheckbox(name: string, value = true, property: keyof typeof simulationConstants){
  const container = document.createElement('div');
  container.classList.add('checkboxContainer');
  const label = document.createElement('label');
  label.setAttribute('for', property);
  label.textContent = name;
  container.appendChild(label);
  const input = document.createElement('input');
  input.setAttribute("type", "checkbox");
  input.checked = value;
  input.setAttribute("id", property);
  input.classList.add('checkbox');

  input.onchange = (ev: any) => {
    const value = (ev.target.checked as boolean);
    (simulationConstants[property] as boolean) = value;
  }

  container.appendChild(input);
  const configElement = document.querySelector<HTMLDivElement>('#configuration')!
  configElement.appendChild(container);
}

export function createButton(label: string, callback: () => void){
  const container = document.createElement('div');
  container.classList.add('buttonContainer');
  const input = document.createElement('button');
  input.setAttribute("type", "button");
  input.textContent = label;

  input.onclick = () => {
    callback();
  }

  container.appendChild(input);
  const configElement = document.querySelector<HTMLDivElement>('#configuration')!
  configElement.appendChild(container);
}
