var gl;

var modelMatrix;
var projectionMatrix;
var viewMatrix;

var model;
var view;
var projection;

var scale = 1;
var angle = 10;
var translate = 0.5;

var x=0,y=0,z=0;
var pitch=0,roll=0,yaw=0;

var direction = 1.0;


//var vertices = [];

var vertices = [
    vec4(-0.5, -0.5,  0.5, 1.0),
    vec4(-0.5,  0.5,  0.5, 1.0),
    vec4(0.5,  0.5,  0.5, 1.0),
    vec4(0.5, -0.5,  0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5,  0.5, -0.5, 1.0),
    vec4(0.5,  0.5, -0.5, 1.0),
    vec4( 0.5, -0.5, -0.5, 1.0)
];

function makeCube(){

  var s=0.5;

  //front
  vertices.push(vec4(s,s,s));
  vertices.push(vec4(-s,s,s));
  vertices.push(vec4(-s,-s,s));

  vertices.push(vec4(-s,-s,s));
  vertices.push(vec4(s,-s,s));
  vertices.push(vec4(s,s,s));

  //right side
  vertices.push(vec4(s,s,s));
  vertices.push(vec4(s,s,-s));
  vertices.push(vec4(s,-s,-s));

  vertices.push(vec4(s,-s,-s));
  vertices.push(vec4(s,-s,s));
  vertices.push(vec4(s,s,s));

  //left side
  vertices.push(vec4(-s,s,s));
  vertices.push(vec4(-s,s,-s));
  vertices.push(vec4(-s,-s,-s));

  vertices.push(vec4(-s,-s,-s));
  vertices.push(vec4(-s,-s,s));
  vertices.push(vec4(-s,s,s));

  //back
  vertices.push(vec4(s,s,-s));
  vertices.push(vec4(-s,s,-s));
  vertices.push(vec4(-s,-s,-s));

  vertices.push(vec4(-s,-s,-s));
  vertices.push(vec4(s,-s,-s));
  vertices.push(vec4(s,s,-s));

  //top
  vertices.push(vec4(s,s,s));
  vertices.push(vec4(-s,s,s));
  vertices.push(vec4(-s,s,-s));

  vertices.push(vec4(-s,s,-s));
  vertices.push(vec4(s,s,-s));
  vertices.push(vec4(s,s,s));


  //bottom
  vertices.push(vec4(s,-s,s));
  vertices.push(vec4(-s,-s,s));
  vertices.push(vec4(-s,-s,-s));

  vertices.push(vec4(-s,-s,-s));
  vertices.push(vec4(s,-s,s));
  vertices.push(vec4(s,-s,s));

}

var indices = [
    1,0,3,
    3,2,1,

    2,3,7,
    7,6,2,

    3,0,4,
    4,7,3,

    6,5,1,
    1,2,6,

    4,5,6,
    6,7,4,

    5,4,0,
    0,1,5
]


window.onload = function init(){

    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    var program = initalizeShaders(gl,"vertex-shader", "fragment-shader" );
    gl.useProgram( program );

  //  makeCube();

    var buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(vPosition);

    var elementBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);


    modelMatrix = mat4();
    //projection( fovy, aspect, near, far );
    //projectionMatrix = perspective(radians(45),canvas.clientWidth/canvas.clientHeight,0.1,50);
    //lookAt( eye, at, up );
    //viewMatrix = lookAt( vec3(4,3,3), vec3(0,0,0), vec3(0,1,0) );

  //  gl.uniformMatrix4fv( view, false, flatten(viewMatrix) );
  //  gl.uniformMatrix4fv( projection, false, flatten(projectionMatrix) );
    gl.uniformMatrix4fv( model, false, flatten(modelMatrix) );

    var colors = gl.getUniformLocation( program, "fColor" );
    gl.uniform4f( colors, 0.5,0.5,0.5,1.0);

    gl.enable(gl.DEPTH_TEST);

    window.onkeydown = handleKeyDown;

    render();
}


function handleKeyDown(event) {
    var key = String.fromCharCode(event.keyCode);
    console.log(key);
    switch(key){
        case 'A':
        case 'a':
            x=-.01;
            y=0;
            console.log(x);
        break;
        case 'W':
        case 'w':
            y=.01;
            x=0;
            console.log(y);
        break;
        case 'S':
        case 's':
            y=-.01;
            x=0;
            console.log(y);
        break;
        case 'D':
        case 'd':
            x=.01;
            y=0;
            console.log(x);
        break;
        case 'E':
        case 'e':
            scale=.99;
            console.log(scale);
        break;
        case 'Q':
        case 'q':
            scale=1.01;
            console.log(scale);
        break;
        case 'Z':
        case 'z':
            pitch=5;
            yaw=0;
            roll=0;
            direction = -1.0;
            //rotateMatrix = mult(rotateMatrix, rotated(pitch,vec4(0.0,0.0,-1.0)));
            console.log(pitch);
        break;
        case 'X':
        case 'x':
            yaw=0;
            pitch=0;
            //modelMatrix = mult(modelMatrix, rotate(25,vec4(1.0,0.0,0.0)));
            console.log(roll);
        break;
        case 'C':
        case 'c':
            pitch=5;
            direction = 1.0;
            //rotateMatrix = mult(rotateMatrix, rotated(pitch,vec4(0.0,0.0,1.0)));
            console.log(yaw);
        break;
        case ' ':
            yaw=0;
            roll=0;
            pitch=0;
            scale=1;
            x=0;
            y=0;
            z=0;
            console.log(key+yaw+roll+pitch+scale+x+y+z);
        break;
    }
}

function render() {
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //modelMatrix = translated(x,y,z);
    //modelMatrix = mult(modelMatrix, rotate(yaw,vec4(0.0,0.0,1.0)));
    //modelMatrix = mult(modelMatrix, rotate(pitch,vec4(0.0,1.0,0.0)));
    //modelMatrix = mult(modelMatrix, rotate(roll,vec4(1.0,0.0,0.0)));
    //modelMatrix = mult(modelMatrix, scalem( [scale, scale, scale] ));

    gl.uniformMatrix4fv(model, false, flatten(modelMatrix) );

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0);

     requestAnimFrame(render);
}
