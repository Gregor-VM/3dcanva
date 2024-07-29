function scaleVector(vector, scalar){
  return vector.map(component => component * scalar);
}

function sumVector(vector1, vector2){
  const sum_vector = []
  for (let i = 0; i < vector1.length; i++){
    sum_vector.push(
      vector1[i] + vector2[i]
    )
  }
  return sum_vector;
}

function difference(vector1, vector2){
  return sumVector(vector1, scaleVector(vector2, -1));
}

function dotProduct(vector1, vector2){
  let result = 0;
  for (let i=0;i<vector1.length;i++){
    result += vector1[i] * vector2[i]
  }
  return result;
}

onmessage = data => {
  const [particles, gravity_distance_contribution, gravity_mass_contribution, gravity_constant, frame] = data.data;

  // gravityCheck

  /*particle.a = [
    particle.a[0] < 0.1 ? 0 : particle.a[0],
    particle.a[1] < 0.1 ? 0 : particle.a[1],
    particle.a[2] < 0.1 ? 0 : particle.a[2],
  ]*/

  const accelarations = [];

  particles.forEach(((particle, index) => {
    
    particles.forEach((object, i) => {
      if(i === index) return false;
      
      const vector = difference(object.position, particle.position);
      const normalized = dotProduct(vector, vector)**gravity_distance_contribution;
      const scaledValue = normalized*(object.radius*gravity_mass_contribution);
      particle.a = scaleVector(particle.a, gravity_constant);
      const vectorNormalized = scaleVector(vector, 1/scaledValue);
      particle.a = sumVector(particle.a, vectorNormalized);
      //postMessage([index, particle.a]);
      accelarations.push([index, particle.a]);
    });

  }));

  postMessage({accelarations, frame});

}
