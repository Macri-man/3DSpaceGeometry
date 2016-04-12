

var tansx=0,transy=0,transz=0;
var rotx=0,roty=0,rotz=0;


var vertices = [
  vec2(.5,-.5),
  vec2(-.5,-.5),
  vec2(0,1),
];

var model;
var color;

window.onload = function init(){

    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    var program = initShaders(gl,"vertex-shader", "fragment-shader" );
    gl.useProgram( program );

  //  makeCube();

    var buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vPosition);

    modelMatrix = new GLMatrix.mat4("identity");
    console.log(modelMatrix);
    model=gl.getUniformLocation(program,"model");
    gl.uniformMatrix4fv( model, false, modelMatrix.toShader() );

    var colors = gl.getUniformLocation( program, "fColor" );
    gl.uniform4f( colors, 0.5,0.5,0.5,1.0);


    //window.onkeydown = handleKeyDown;


    document.getElementById("transx").onchange = function(){
      tranx=event.srcElement.value;
      console.log("transx",tranx);
      modelMatrix.mult(GLMath.transX(parseFloat(tranx)));
      gl.uniformMatrix4fv( model, false, modelMatrix.toShader() );
      console.log(modelMatrix);

    }

    document.getElementById("transy").onchange = function(){
      trany=event.srcElement.value;
      console.log("transy",trany);
      modelMatrix.mult(GLMath.transY(parseFloat(trany)));
      gl.uniformMatrix4fv( model, false, modelMatrix.toShader() );
      console.log(modelMatrix);

    }


  /*  document.getElementById("transz").onchange = function(){
      tranz=event.srcElement.value;
      console.log("transz",tranz);
      console.log(Number.isInteger(tranz),Number.isInteger(parseFloat(tranz)),parseFloat(tranz));
      modelMatrix.mult(GLMath.transZ(parseFloat(tranz)));
      gl.uniformMatrix4fv( model, false, modelMatrix.toShader() );
      console.log(modelMatrix);

    }*/

    document.getElementById("rotx").onchange = function(){
      rotx=event.srcElement.value;
      console.log("rotx",rotx);
      modelMatrix.mult(GLMath.rotX(parseFloat(rotx)));
      gl.uniformMatrix4fv( model, false, modelMatrix.toShader() );
      console.log(modelMatrix);

    }

    document.getElementById("roty").onchange = function(){
      roty=event.srcElement.value;
      console.log("roty",roty);
      modelMatrix.mult(GLMath.rotY(parseFloat(roty)));
      gl.uniformMatrix4fv( model, false, modelMatrix.toShader() );
      console.log(modelMatrix);

    }

    document.getElementById("rotz").onchange = function(){
      rotz=event.srcElement.value;
      console.log("rotz",rotz);

      modelMatrix.mult(GLMath.rotZ(parseFloat(rotz)));
      gl.uniformMatrix4fv( model, false, modelMatrix.toShader() );
      console.log(modelMatrix);
    }

    render();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 3 );
    requestAnimFrame(render);
}
