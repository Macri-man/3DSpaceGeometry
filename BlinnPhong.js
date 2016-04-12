var gl;

var normalsArray = [];
var shapevert = [];

function subtractVerts(vert1,vert2){
  var result=[vert2.x-vert1.x,vert2.y-vert1.y,vert2.z-vert1.z];
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

function computeNormals(){
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

function Vectorlength(a){
  return Math.sqrt(Math.pow(a[1],2)+Math.pow(a[2],2)+Math.pow(a[3],2));
}

function normalization(a){
  var len=dotLength(a);

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
  //console.log(v1);
  //console.log(v2);
  //console.log(v3);
  shapevert.push(v1);
  shapevert.push(v2);
  shapevert.push(v3);

  /*normals.push(v1[1],v1[2],v1[3],0.0);
  normals.push(v2[1],v2[2],v2[3],0.0);
  normals.push(v3[1],v3[2],v3[3],0.0);*/

  normalsArray.push(v1);
  normalsArray.push(v2);
  normalsArray.push(v3);

  console.log("Normals : " +v1);

  console.log("triangle shape: " + shapevert.length);

  console.log("triangle normal: " + normalsArray.length);
}


function findEqualdistantpoints(){
  //need to change
  //var point1 = [0.0,1.0,0.0];

/*   return = [
                    vec4( 1, 0,  0, 1), //p1
                    vec4(  -1/2,  Math.sqrt(3)/2,0, 1), //p3
                    vec4( -1/2,  -Math.sqrt(3)/2, 0, 1), //p5
                    vec4(  0, 0, -1, 1)
                  ];*/
                  /*

                  var vertices = [ vec4(   0,  .2,   0, 1),     // p0
							   vec4( -Math.sqrt(3)*.1, -.1, .1, 1),     // p1
							   vec4( Math.sqrt(3)*.1, -.1, .1, 1),     // p2
							   vec4(   0, -.1, -.2, 1) ];  // p3*/
  return [
    [0.0,0.0,-1.0,1.0],
    [0.0,(2*Math.sqrt(2))/3,1/3,1.0],
    [-Math.sqrt(6)/3,-Math.sqrt(2)/3,1/3,1.0],
    [Math.sqrt(6)/3,-Math.sqrt(2)/3,1/3,1.0]
  ];
}

var points = findEqualdistantpoints();

function createSphere(a, b, c, d, n) {
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}

var modelMatrix;
var projectionMatrix;
var viewMatrix;
var normalMatrix;

var model;
var view;
var projection;

var scale = 1;
var angle = 10;
var translate = 0.5;

var x=0,y=0,z=0;
var pitch=0,roll=0,yaw=0;

var program;
var fcolor;

var near = -10;
var far = 10;
var radius = 1.5;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var left = -3.0;
var right = 3.0;
var ytop =3.0;
var bottom = -3.0;


window.onload = function init(){

    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    program = initShaders( gl, "vertex-shader", "fragment-shader");
    gl.useProgram( program );

    createSphere(points[0],points[1],points[2],points[3],1);

    var buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(shapevert), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
      //console.log(vPosition);
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vPosition);

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var normalLoc = gl.getAttribLocation( program, "Normal" );
    //console.log(normalLoc);
    gl.vertexAttribPointer( normalLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( normalLoc);

    model = gl.getUniformLocation( program, "model" );
    view = gl.getUniformLocation( program, "view" );
    projection = gl.getUniformLocation( program, "projection" );
    //modelMatrix = mat4();
    //projection( fovy, aspect, near, far );
    //projectionMatrix = perspective(radians(45),canvas.clientWidth/canvas.clientHeight,0.1,20);
    //lookAt( eye, at, up );
    //viewMatrix = lookAt(vec3(1,1,16), vec3(0,0,0), vec3(0,1,0)  );
    var at = vec3(0.0, 0.0, 0.0);
    var up = vec3(0.0, 1.0, 0.0);
    var eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
       radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
       console.log(radius*Math.sin(theta)*Math.cos(phi));
       console.log(radius*Math.sin(theta)*Math.sin(phi));
       console.log(radius*Math.cos(theta));

   //viewMatrix = lookAt(eye, at , up);
   projectionMatrix = ortho(left, right, bottom, ytop, near, far);
   modelMatrix = mat4();
   viewMatrix = lookAt(vec3(4,3,3), vec3(0,0,0), vec3(0,1,0)  );
   //projectionMatrix = perspective(radians(45),canvas.clientWidth/canvas.clientHeight,0.1,20);
   normalMatrix = mat4(
     modelMatrix[0][0], modelMatrix[0][1], modelMatrix[0][2],
     modelMatrix[1][0], modelMatrix[1][1], modelMatrix[1][2],
     modelMatrix[2][0], modelMatrix[2][1], modelMatrix[2][2]
   );


   printm(projectionMatrix);
   printm(normalMatrix);



  gl.uniformMatrix4fv( view, false, flatten(viewMatrix) );
    gl.uniformMatrix4fv( projection, false, flatten(projectionMatrix) );
    gl.uniformMatrix4fv( model, false, flatten(modelMatrix) );

    var lightPosLoc = gl.getUniformLocation(program,"lightPos");
    gl.uniform4f(lightPosLoc,1.0,2.0,3.0,0.0);

    var camPosLoc = gl.getUniformLocation(program,"camPos");
    gl.uniform4f(camPosLoc,1.0,1.0,1.0,1.0);

    var normalMatLoc = gl.getUniformLocation(program,"normalMat");
    gl.uniformMatrix3fv(normalMatLoc,false,flatten(normalMatrix));

    //components are the intensities of the colors of the object
    var AmbIntenseLoc = gl.getUniformLocation(program,"AmbIntense");
    gl.uniform4f(AmbIntenseLoc,1.0,0.0,0.0,1.0);

    var DiffuseIntenseLoc = gl.getUniformLocation(program,"DiffuseIntense");
    gl.uniform4f(DiffuseIntenseLoc,0.2,0.2,1.0,1.0);

    var SpecularIntenseLoc = gl.getUniformLocation(program,"SpecularIntense");
    gl.uniform4f(SpecularIntenseLoc,0.5,1.0,0.5,1.0);

    var matAmbLoc = gl.getUniformLocation(program,"matAmb");
    gl.uniform4f(matAmbLoc,0.5,0.0,0.5,1.0);

    var matDiffuseLoc = gl.getUniformLocation(program,"matDiffuse");
    gl.uniform4f(matDiffuseLoc,1.0,0.0,0.8,1.0);

    var matSpecularLoc = gl.getUniformLocation(program,"matSpecular");
    gl.uniform4f(matSpecularLoc,0.0,0.0,1.0,1.0);

    var matShineLoc = gl.getUniformLocation(program,"matShine");
    gl.uniform1f(matShineLoc,100);

    var emission = gl.getUniformLocation(program,"emit");
    gl.uniform1f(emission,64);



    var angleXloc = gl.getUniformLocation(program,"angleX");
    gl.uniform1f(angleXloc,yaw);

    var angleYloc = gl.getUniformLocation(program,"angleY");
    gl.uniform1f(angleYloc,pitch);

    var angleZloc = gl.getUniformLocation(program,"angleZ");
    gl.uniform1f(angleZloc,roll);

    var xLoc= gl.getUniformLocation(program,"x");
    gl.uniform1f(xLoc,x);

    var yLoc= gl.getUniformLocation(program,"y");
    gl.uniform1f(yLoc,y);

    var zLoc= gl.getUniformLocation(program,"z");
    gl.uniform1f(zLoc,z);

    var scaleLoc= gl.getUniformLocation(program,"scale");
    gl.uniform1f(scaleLoc,scale);

    gl.enable(gl.DEPTH_TEST);

    window.onkeydown = handleKeyDown;

    render();
}

function rotX(angleX){
  yaw+=angleX;
  var angleXloc = gl.getUniformLocation(program,"angleX");
  gl.uniform1f(angleXloc,yaw);

}

function rotY(angleY){
  pitch+=angleY;
  var angleYloc = gl.getUniformLocation(program,"angleY");
  gl.uniform1f(angleYloc,pitch);

}

function rotZ(angleZ){
  roll+=angleZ;
  var angleZloc = gl.getUniformLocation(program,"angleZ");
  gl.uniform1f(angleZloc,roll);

}

function translateX(amount){
  x+=amount;
  var xLoc= gl.getUniformLocation(program,"x");
  gl.uniform1f(xLoc,x);
}

function translateY(amount){
  y+=amount;
  var yLoc= gl.getUniformLocation(program,"y");
  gl.uniform1f(yLoc,y);
}

function translateZ(amount){
  z+=amount;
  var zLoc= gl.getUniformLocation(program,"z");
  gl.uniform1f(zLoc,z);
}

function Scale(amount){
  scale+=amount;
  var scaleLoc= gl.getUniformLocation(program,"scale");
  gl.uniform1f(scaleLoc,scale);
}

function scaleDown(amount){
  scale=amount;
  var scaleLoc= gl.getUniformLocation(program,"scale");
  gl.uniform1f(scaleLoc,scale);
}

function changeColor(r,g,b){
  fcolor = gl.getUniformLocation(program,"fColor");
  gl.uniform4f(fcolor,r,g,b,1.0);
}


function handleKeyDown(event) {

    var key = String.fromCharCode(event.keyCode);
    switch(key){
        case 'A':
        case 'a':
            modelMatrix = mult(modelMatrix,translated(-0.5,0.0,0.0));
          //  translateX(-0.01);
        break;
        case 'W':
        case 'w':
            modelMatrix = mult(modelMatrix,translated(0.0,0.5,0.0));
        //    translateY(0.01);
        break;
        case 'S':
        case 's':
            modelMatrix = mult(modelMatrix,translated(0.0,-0.5,0.0));
        //  translateY(-0.01);
        break;
        case 'D':
        case 'd':
           modelMatrix = mult(modelMatrix,translated(0.5,0.0,0.0));
        //  translateX(0.01);
        break;
        case 'E':
        case 'e':
            modelMatrix = mult(modelMatrix, scalem( [1.5, 1.5, 1.5] ));
        //  Scale(-0.1);
        break;
        case 'Q':
        case 'q':
            modelMatrix = mult(modelMatrix, scalem( [0.5, 0.5, 0.5] ));
          //Scale(0.1);
        break;
        case 'Z':
        case 'z':
            modelMatrix = mult(modelMatrix,rotateX(10));
          //rotX(0.1);
          console.log(yaw);
        break;
        case 'X':
        case 'x':
            modelMatrix = mult(modelMatrix,rotateY(10));
          //rotY(0.1);
          console.log(pitch);
        break;
        case 'C':
        case 'c':
            modelMatrix = mult(modelMatrix,rotateZ(10));
          //rotZ(0.1);
          console.log(roll);
        break;
    }
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    console.log(shapevert.length);
    gl.uniformMatrix4fv( model, false, flatten(modelMatrix) );

    //printm(modelMatrix);
    /*modelMatrix = mult(modelMatrix,translate(x,y,z));

    modelMatrix = mult(modelMatrix,rotate(roll,vec3(1.0,0.0,0.0)));
    modelMatrix = mult(modelMatrix,rotate(pitch,vec3(0.0,1.0,0.0)));
    modelMatrix = mult(modelMatrix,rotate(yaw,vec3(0.0,0.0,1.0)));

    modelMatrix = mult(modelMatrix, scalem( [0.5, 0.5, 0.5] ));*/
    //changeColor(0.0,0.0,1.0);
    //gl.uniformMatrix4fv( model, false, flatten(modelMatrix) );
    /*changeColor(0.0,0.0,0.2);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);
    changeColor(0.0,0.0,0.3);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 6);
    changeColor(0.0,0.0,0.4);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 12);
    changeColor(0.0,0.0,0.5);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 18);
    changeColor(0.0,0.0,0.6);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 24);
    changeColor(0.0,0.0,0.7);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 30);*/
    /*for(var i=0;i<shapevert.length;i+=3){
      gl.drawArrays(gl.TRIANGLES,0,i);
    }*/
    gl.drawArrays(gl.TRIANGLES,0,shapevert.length);


    requestAnimFrame(render);
}
