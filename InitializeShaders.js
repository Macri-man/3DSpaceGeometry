var gl;

function initialShaders(g,vertexShader,fragmentShader,boolean){
  gl=g;
  if(boolean){
    getShadersFromIDS(vertexShader,fragmentShader);
  }else{
    getShadersFromFiles(vertexShader,fragmentShader);
  }
}

function getShadersFromFiles() {
  return 0;
}

function getShadersFromIDS(vertexShader,fragmentShader){
  var vertexElem = document.getElementById(vertexShader);
  var fragmentElem =  document.getElementById(fragmentShader);

  var vertShader;
  var fragShader;

  if(!vertexElem){
      throw  vertexElem + "Not an element that can be loaded";
      return -1;
  }else{
      vertShader = createShader(vertexElem.text,gl.VERTEX_SHADER);
  }

  if(!fragmentElem){
    throw  fragmentElem + "Not an element that can be loaded";
    return -1;
  }else{
      fragShader = createShader(fragmentElem.text,gl.FRAGMENT_SHADER);
  }
  return createProgram(vertShader,fragShader);
}


function createProgram(vertexShader,fragmentShader){
  var program = gl.createProgram();
  gl.attachShader(program,vertexShader);
  gl.attachShader(program,fragmentShader);

  gl.linkProgram(program);

  if ( !gl.getProgramParameter( program, gl.LINK_STATUS) ) {
    var info = gl.getProgramInfoLog(program);
    throw "Could not create shader program WebGL program. \n\n" + info;
  }

  return program;

}

function createShader(sourceCode, type) {
  var shader = gl.createShader(type);
  gl.shaderSource( shader, sourceCode );
  gl.compileShader( shader );

  if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
    var info = gl.getShaderInfoLog( shader );
    throw "Could not compile shader " + sourceCode + "\n\nWebGL program." + info;
  }

  return shader;
}
