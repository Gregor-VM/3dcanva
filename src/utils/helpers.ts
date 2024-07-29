import { Line } from "./3d";
import { simulationConstants } from "./config";

export function vectorLength(vector: number[]){
  let sum = 0;
  vector.map(component => component ** 2).forEach(value => {
    sum += value
  });
  return Math.sqrt(sum)
}

export function normalizeVector(vector: number[]){
  return scaleVector(vector, 1/vectorLength(vector))
}

export function scaleVector(vector: number[], scalar: number){
  return vector.map(component => component * scalar);
}

export function sumVector(vector1: number[], vector2: number[]){
  const sum_vector = []
  for (let i = 0; i < vector1.length; i++){
    sum_vector.push(
      vector1[i] + vector2[i]
    )
  }
  return sum_vector;
}

export function difference(vector1: number[], vector2: number[]){
  return sumVector(vector1, scaleVector(vector2, -1));
}

export function dotProduct(vector1: number[], vector2: number[]){
  let result = 0;
  for (let i=0;i<vector1.length;i++){
    result += vector1[i] * vector2[i]
  }
  return result;
}

export function rotateVector(vector: number[], angles: number[] = [0, 0, 0], center = [simulationConstants.WIDTH/2, simulationConstants.HEIGHT/2, 0]){

  // This is to transform the current vector, so the origin
  // (0, 0, 0) will be at the center so that the rotation 
  // is applied as expected
  vector = difference(vector, center)

  const matrix_rotation_x = [
    [1, 0, 0],
    [0, Math.cos(angles[0]), -1*Math.sin(angles[0])],
    [0, Math.sin(angles[0]), Math.cos(angles[0])]
  ]

  vector = transform(matrix_rotation_x, vector);

  const matrix_rotation_y = [
    [Math.cos(angles[1]), 0, Math.sin(angles[1])],
    [0, 1, 0],
    [-1*Math.sin(angles[1]), 0, Math.cos(angles[1])]
  ]

  vector = transform(matrix_rotation_y, vector);

  const matrix_rotation_z = [
    [Math.cos(angles[2]), -1*Math.sin(angles[2]), 0],
    [Math.sin(angles[2]), Math.cos(angles[2]), 0],
    [0, 0, 1]
  ]

  vector = transform(matrix_rotation_z, vector);

  // This transform the vector back to normal
  // center will be at the actual (0, 0, 0) instead of
  // the center vector passed in this function
  vector = sumVector(vector, center)

  return vector;

}

export function transform(matrix: number[][], vector: number[]){
  const transformedVector: number[] = [];
  for (let i=0;i<matrix.length;i++){
    transformedVector.push(dotProduct(matrix[i], vector))
  }
  return transformedVector;
}

export function getCubeLines(points: number[][], boxSize: number, color = "rgba(0, 0, 0, .2)"){
  const checkedPoints = new Set();
  const lines: Line[] = [];
  points.forEach(point => {
    if(!checkedPoints.has(point)){
      points.forEach(p => {
        if(p === point) return null;
        if(checkedPoints.has(p)) return null;
        if(vectorLength(difference(point, p)) === boxSize){
          lines.push(new Line(point, p, color))
        }
      })
    }
  })
  return lines;
}

export function getCubePoints(origin = [0, 0, 0], boxSize: number){

  return [origin,
      [origin[0] + boxSize, origin[1], origin[2]],
      [origin[0], origin[1] + boxSize, origin[2]],
      [origin[0], origin[1], origin[2] + boxSize],
      [origin[0] + boxSize, origin[1] + boxSize, origin[2]],
      [origin[0], origin[1] + boxSize, origin[2] + boxSize],
      [origin[0] + boxSize, origin[1], origin[2] + boxSize],
      [origin[0] + boxSize, origin[1] + boxSize, origin[2] + boxSize]]
  
}

export function divideCube(origin = [0, 0, 0], boxSize: number){
  const cubeCenter = boxSize / 2;
  const cubesOrigins = getCubePoints(origin, cubeCenter);
  return cubesOrigins.map(cubeOrigin => {
    return getCubePoints(cubeOrigin, cubeCenter);
  });
}

export function chunckCube(origin = [0, 0, 0], boxSize: number, iterations: number, chunckedCube: number[][][][] = []): number[][][]{
  const firstChunck = divideCube(origin, boxSize);
  if(iterations === 0) chunckedCube.push(divideCube(origin, boxSize))
  if(iterations > 0) {
    iterations -= 1;
    firstChunck.forEach((points) => {
      chunckCube(points[0], boxSize/2, iterations, chunckedCube);
    })

  }
  return chunckedCube.flat()
}

export function isParticleInCube (points: number[][], position: number[]){

  let minX = Math.min(...points.map(vertex => vertex[0]));
  let minY = Math.min(...points.map(vertex => vertex[1]));
  let minZ = Math.min(...points.map(vertex => vertex[2]));
  let maxX = Math.max(...points.map(vertex => vertex[0]));
  let maxY = Math.max(...points.map(vertex => vertex[1]));
  let maxZ = Math.max(...points.map(vertex => vertex[2]));

  return (
    position[0] >= minX && position[0] <= maxX &&
    position[1] >= minY && position[1] <= maxY &&
    position[2] >= minZ && position[2] <= maxZ
  );

}


