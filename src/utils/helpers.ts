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
