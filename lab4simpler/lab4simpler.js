// Name:


var gl;
var numVertices;
var numTriangles;
var normals;
var viewMatrix;
var viewMatrixLoc

var modelMatrix;
var modelMatrixLoc;

var projectionMatrix;
var projectionMatrixLoc;

var light1=true;
var light2=false;

var program;
var canvas;


var eyex=-14;
var eyey=10;
var eyez=-5;

var fov=65;
var near=-100;
var far=100;



var light1Object = {
  lightON:true,
  lightPos:GLVectors.vec3(0.0,0.0,10),
  ambienIntense:GLVectors.vec3(0.1,0.8,0.8),
  diffuseIntense:GLVectors.vec3(1.0,0.8,0.0),
  specularIntense:GLVectors.vec3(1.0,0.8,0.0),
}

var objectMat = {
  ambientMat:GLVectors.vec3(0.1,0.8,0.8),
  diffuseMat:GLVectors.vec3(0.0,1.0,0.8),
  specularMat:GLVectors.vec3(0.0,1.0,0.8),
}


function initGL(){
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.enable(gl.DEPTH_TEST);
    gl.viewport( 0, 0, 512, 512 );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    numVertices = 2440;
    numTriangles = 4871;
    vertices = getVertices(); // vertices and faces are defined in object.js
    indexList = getFaces();
    console.log(vertices);
    console.log(indexList);


console.log(lookAt(vec3(0,0,100),vec3(0,0,0),vec3(0,1,0)));

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexList), gl.STATIC_DRAW);

    var verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var vertexPosition = gl.getAttribLocation(program,"vertexPosition");
    gl.vertexAttribPointer( vertexPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vertexPosition );

    // Insert your code here
    normals=getNormals();

    console.log(normals);
    console.log(light1Object);

    var normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

    var normalPosition = gl.getAttribLocation(program,"nv");
    gl.vertexAttribPointer( normalPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( normalPosition );
    console.log(normalPosition);


    //lookAt( eye, at, up );
    console.log(eyex,eyey,eyez);
    console.log(lookAt(vec3(0.0,0.0,80.0), vec3(0,0,0), vec3(0,1,0)));
    viewMatrix = GLView.lookAt(GLVectors.vec3(eyex,eyey,eyez), GLVectors.vec3(0,0,0), GLVectors.vec3(0,1,0) );
    viewMatrixLoc=gl.getUniformLocation(program,"view");
    gl.uniformMatrix4fv(viewMatrixLoc,false,viewMatrix.toShader());

    console.log(viewMatrix);

    //projectionMatrix = GLView.persp(45,canvas.clientWidth/canvas.clientHeight,0.1,15);
    //projectionMatrix = perspective(radians(45),canvas.clientWidth/canvas.clientHeight,0.5,5);
    projectionMatrix = GLView.ortho(-60.0, 60.0, -60.0, 60.0, -60.0, 60.0);
    console.log("MyProj");
    //GLMatrix.printm(projectionMatrix);
    //projectionMatrix = ortho(-10.0, 10.0, -10.0, 10.0, -10.0, 10.0);
    //console.log("thereProj");
    //printm(projectionMatrix);
    projectionMatrixLoc = gl.getUniformLocation(program,"projection");
    gl.uniformMatrix4fv(projectionMatrixLoc,false,projectionMatrix.toShader());
    //gl.uniformMatrix4fv(projectionMatrixLoc,false,flatten(projectionMatrix));
    console.log(projectionMatrix);

    modelMatrix = new GLMatrix.mat4("identity");
    modelMatrixLoc = gl.getUniformLocation(program,"model");
    gl.uniformMatrix4fv(modelMatrixLoc,false,modelMatrix.toShader());

    console.log(modelMatrix);

    document.getElementById("slidex").onchange = function(){
      eyex=event.srcElement.value;
      console.log(eyex);
    }

    document.getElementById("slidey").onchange = function(){
      eyey=event.srcElement.value;
      console.log(eyey);
    }


    document.getElementById("slidez").onchange = function(){
      eyez=event.srcElement.value;
      console.log(eyez);
    }

    document.getElementById("fov").onchange = function(){
      fov=event.srcElement.value;
      console.log(fov);
    }

    document.getElementById("near").onchange = function(){
      near=event.srcElement.value;
      console.log(near);
    }


    document.getElementById("far").onchange = function(){
      far=event.srcElement.value;
      console.log(far);
    }


    //console.log(light1Object.ambienIntense,GLVectors.mult(light1Object.ambienIntense,objectMat.ambientMat));
    //light properties

    var lightPosLoc = gl.getUniformLocation(program,"lightPos");
    gl.uniform3f(lightPosLoc,light1Object.lightPos.x,light1Object.lightPos.y,light1Object.lightPos.z);

  //  var camPosLoc = gl.getUniformLocation(program,"camPos");
  //  gl.uniform4f(camPosLoc,1.0,1.0,1.0,1.0);

  //  var normalMatLoc = gl.getUniformLocation(program,"normalMat");
  //  gl.uniformMatrix3fv(normalMatLoc,false,flatten(normalMatrix));

    //components are the intensities of the colors of the object
    var AmbIntenseLoc = gl.getUniformLocation(program,"Ia");
    console.log(light1Object.ambienIntense,objectMat.ambientMat);
    gl.uniform3f(AmbIntenseLoc,light1Object.ambienIntense[0],light1Object.ambienIntense[1],light1Object.ambienIntense[2],light1Object.ambienIntense[3]);

    var matAmbLoc = gl.getUniformLocation(program,"ka");
    gl.uniform3f(matAmbLoc,objectMat.ambientMat[0],objectMat.ambientMat[1],objectMat.ambientMat[2],objectMat.ambientMat[3]);

    console.log(light1Object.diffuseIntense,objectMat.diffuseMat);
    var DiffuseIntenseLoc = gl.getUniformLocation(program,"Id");
    gl.uniform3f(DiffuseIntenseLoc,light1Object.diffuseIntense[0],light1Object.diffuseIntense[1],light1Object.diffuseIntense[2],light1Object.diffuseIntense[3]);

    var matDiffuseLoc = gl.getUniformLocation(program,"kd");
    gl.uniform3f(matDiffuseLoc,objectMat.diffuseMat[0],objectMat.diffuseMat[1],objectMat.diffuseMat[2],objectMat.diffuseMat[3]);

    console.log(light1Object.specularIntense,objectMat.specularMat);
    var SpecularIntenseLoc = gl.getUniformLocation(program,"Is");
    gl.uniform3f(SpecularIntenseLoc,light1Object.specularIntense[0],light1Object.specularIntense[1],light1Object.specularIntense[2],light1Object.specularIntense[3]);

    var matSpecularLoc = gl.getUniformLocation(program,"ks");
    gl.uniform3f(matSpecularLoc,objectMat.specularMat[0],objectMat.specularMat[1],objectMat.specularMat[2],objectMat.specularMat[3]);

    var matShineLoc = gl.getUniformLocation(program,"alpha");
    gl.uniform1f(matShineLoc,64);

    drawObject();

};


function getNormals(){
var n=[];
  for(var i=0;i<indexList.length;i+=3){
    //console.log(vertices[indexList[i]].slice(0,3));
    n.push(GLMath.cross(GLVectors.subtract(vertices[indexList[i]].slice(0,3),vertices[indexList[i+1]].slice(0,3)),GLVectors.subtract(vertices[indexList[i]].slice(0,3),vertices[indexList[i+2]].slice(0,3))));
  }
  return n;
}


function  Orthographic(left,right,far){

}



function Orthographic(){
  projectionMatrix = GLView.ortho(-100.0, 100.0, -100.0, 100.0, -100.0, 100.0);
  var projectionMatrixLoc=gl.getUniformLocation(program,"projection");
  gl.uniformMatrix4fv(projectionMatrixLoc,false,projectionMatrix.toShader());

  console.log(projectionMatrix);


  console.log(projectionMatrix);
}

function Perspective(){
  //projectionMatrix = GLView.persp(65,canvas.clientWidth/canvas.clientHeight,-10,-80);
  projectionMatrix = perspective(65,canvas.clientWidth/canvas.clientHeight,near,far);
  var projectionMatrixLoc=gl.getUniformLocation(program,"projection");
  //gl.uniformMatrix4fv(projectionMatrixLoc,false,projectionMatrix.toShader());
  gl.uniformMatrix4fv(projectionMatrixLoc,false,flatten(projectionMatrix));
  //console.log(1.0 / Math.tan((65 *Math.pi/180)/ 2 ));
  console.log(GLView.persp(65,canvas.clientWidth/canvas.clientHeight,-40,40));
  console.log(projectionMatrix);
}

function Light1(){
  if(light1){
    light1=!light1;
  }
  var light1loc=gl.getUniformLocation("light1");
  gl.uniform1f(light1loc,light1);
}

function Light2(){
  if(light2){
    light2=!light2;
  }
  var light2loc=gl.getUniformLocation("light2");
  gl.uniform1f(light2loc,light2);
}

function drawObject() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.drawElements( gl.TRIANGLES, 3 * numTriangles, gl.UNSIGNED_SHORT, 0 );
    viewMatrix = GLView.lookAt(GLVectors.vec3(eyex,eyey,eyez), GLVectors.vec3(0,0,0), GLVectors.vec3(0,1,0) );
    viewMatrixLoc=gl.getUniformLocation(program,"view");
    gl.uniformMatrix4fv(viewMatrixLoc,false,viewMatrix.toShader());
    //projectionMatrix = perspective(fov,canvas.clientWidth/canvas.clientHeight,near,far);
    //var projectionMatrixLoc=gl.getUniformLocation(program,"projection");
    //gl.uniformMatrix4fv(projectionMatrixLoc,false,projectionMatrix.toShader());
    //gl.uniformMatrix4fv(projectionMatrixLoc,false,flatten(projectionMatrix));
    requestAnimFrame(drawObject);
}








function calculatenorm(){

  for (var i = 0; i < indexlist.length; i+=3) {
    normals.push()
    n1 = cross(subtract(p0-p1))
    normals.push()
    n2 = cross(subtract(p0-p1))
  }



}
