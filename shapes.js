function subtractVerts(vert1,vert2){
  var result=[
    vert2.x-vert1.x,
    vert2.y-vert1.y,
    vert2.z-vert1.z
  ];
  return result;
}

function crossProduct(vec1,vec2){
  var result = [
    vec1[1]*vec2[2] - vec1[2]*vec2[1],
    vec1[2]*vec2[0] - vec1[0]*vec2[2],
    vec1[0]*vec2[1] - vec1[1]*vec2[0]
  ]

  return result;
}

function computeNormal(vert1,vert2,vert3){
  var normal=crossProduct(subtractVerts(vert1,vert2),subtractVerts(vert1,vert3));
  return normal;
}

function computeNormals(normals){
  for(var i=0;i<indices.length;i+=3){
    normals.push(computeNormal(vertices[indices[i]],vertices[indices[i+1]],vertices[indices[i+2]]));
  }
}

function midPoint(u,v){
  var point = [];
  for(var i=0;i<u.length;i++){
    point.push((u[i]+v[i])/2);
  }
  return point;
}

function dotLength(a){
  var sum = 0.0;
  for(var i = 0; i < a.length-1; ++i){
      sum += a[i] * a[i];
  }
  return Math.sqrt(sum);
}

function length(a){
  return Math.sqrt(Math.pow(a[1],2)+Math.pow(a[2],2)+Math.pow(a[3],2));
}

function normalization(a){
  var len=length(a);

  if(!Number.isFinite(len) ) {
      throw "normalize: vector " + a + " has zero length";
  }

  for(var i=0;i<a.length-1;i++){
    a[i]/=len;
  }
  return a;

}

function divideTriangle(v1,v2,v3,count){
  if(count>0){
    var v1v2 = normalization(midPoint(v1,v2));
    var v1v3 = normalization(midPoint(v1,v3));
    var v2v3 = normalization(midPoint(v2,v3));

    divideTriangle(v1,v1v2,v1v3,count-1);
    divideTriangle(v1v2,v2,v2v3,count-1);
    divideTriangle(v2v3,v3,v1v3,count-1);
    divideTriangle(v1v2,v2v3,v1v3,count-1);
  }else{
    triangle(v1,v2,v3);
  }
}

function triangle(v1,v2,v3){
  console.log(v1);
  console.log(v2);
  console.log(v3);
  shapevert.push(v1);
  shapevert.push(v2);
  shapevert.push(v3);

  /*normals.push(v1[1],v1[2],v1[3],0.0);
  normals.push(v2[1],v2[2],v2[3],0.0);
  normals.push(v3[1],v3[2],v3[3],0.0);*/

  normals.push(v1);
  normals.push(v2);
  normals.push(v3);

  console.log("triangle shape: " + shapevert.length);

  console.log("triangle normal: " + normals.length);
}

function findEqualdistantpoints(startpoint){
  //need to change
  //var point1 = [0.0,1.0,0.0];

  /*return [
    [1.0, 0.0, -1.0,1],
    [1.0, 0.0, 1.0, 1],
    [-1.0, 0.0, 1.0, 1],
    [-1.0, 0.0, -1.0,1]
];*/
/*  return [
    [0.0,0.0,-1.0,1.0],
    [0.0,(2*Math.sqrt(2))/3,1/3,1.0],
    [-Math.sqrt(6)/3,-Math.sqrt(2)/3,1/3,1.0],
    [Math.sqrt(6)/3,-Math.sqrt(2)/3,1/3,1.0]
  ];*/
}

var points = findEqualdistantpoints();

function createSphere(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}
