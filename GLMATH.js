
var GLMatrix = (function() {

  function mat2(m1,m2,m3,m4){
    if(m1 === [] && m1.length==4){
      this.m = [m1[0],m1[1],m1[2],m1[3]];
    }else if(m1 == "identity"){
      this.m = [1.0,0.0,1.0,0.0];
    }else{
      this.m = [m1,m2,m3,m4];
    }
    this.matrix=true;
    this.rowLen=2;
    this.columnLen=2;
  }

  function mat3(m1,m2,m3,m4,m5,m6,m7,m8,m9){

    if((m1 === [] && m1.length == 3) || (m2 === [] && m2.length == 3)){
      this.m = [m1[0],m1[1],m1[2],m2[0],m2[1],m2[2],m3[0],m3[1],m3[2]];
    }else if(m1 == "identity"){
      this.m = [
        1.0,0.0,0.0,
        0.0,1.0,0.0,
        0.0,0.0,1.0
      ];
    }else{
      m = [m1,m2,m3,m4,m5,m6,m7,m8,m9];
    }
      this.matrix=true;
      this.rowLen=3;
      this.columnLen=3;
  }

  function mat4(m1,m2,m3,m4,m5,m6,m7,m8,m9,m10,m11,m12,m13,m14,m15,m16){
    if((m1 === [] && m1.length == 4) || (m2 === [] && m2.length == 4)){
      this.m = [
        m1[0],m1[1],m1[2],m1[3],
        m2[0],m2[1],m2[2],m2[3],
        m3[0],m3[1],m3[2],m3[3],
        m4[0],m4[1],m4[2],m4[3]
      ];
    }else if(m1 == "identity"){
      this.m = [
        1.0,0.0,0.0,0.0,
        0.0,1.0,0.0,0.0,
        0.0,0.0,1.0,0.0,
        0.0,0.0,0.0,1.0
      ];
    }else{
      this.m = [m1,m2,m3,m4,m5,m6,m7,m8,m9,m10,m11,m12,m13,m14,m15,m16];
    }
    this.matrix=true;
    this.rowLen=4;
    this.columnLen=4;
  }

  mat4.prototype.transpose = function () {
    return new GLMatrix.mat4(
        this.m[0],this.m[4],this.m[8],this.m[12],
        this.m[1],this.m[5],this.m[9],this.m[13],
        this.m[2],this.m[6],this.m[10],this.m[14],
        this.m[3],this.m[7],this.m[11],this.m[15]
      );
  };


  mat4.prototype.toShader = function () {
    return new Float32Array(this.transpose().m);
  };

  mat4.prototype.mult = function (other) {
    switch (other.rowLen) {
      case 2:
        result = [
          (other.m[0]*this.m[0]) + (other.m[1]*this.m[2]),(other.m[0]*this.m[1]) + (other.m[1]*this.m[3]),
          (other.m[2]*this.m[0]) + (other.m[3]*this.m[2]),(other.m[2]*this.m[1]) + (other.m[3]*this.m[3])
        ]
        break;
      case 3:
        result = [
          (other.m[0]*this.m[0]) + (other.m[1]*this.m[3]) + (other.m[2]*this.m[6]),
          (other.m[0]*this.m[1]) + (other.m[1]*this.m[4]) + (other.m[2]*this.m[7]),
          (other.m[0]*this.m[2]) + (other.m[1]*this.m[5]) + (other.m[2]*this.m[8]),
          (other.m[3]*this.m[0]) + (other.m[4]*this.m[3]) + (other.m[5]*this.m[6]),
          (other.m[3]*this.m[1]) + (other.m[4]*this.m[4]) + (other.m[5]*this.m[7]),
          (other.m[3]*this.m[2]) + (other.m[4]*this.m[5]) + (other.m[5]*this.m[8]),
          (other.m[6]*this.m[0]) + (other.m[7]*this.m[3]) + (other.m[8]*this.m[6]),
          (other.m[6]*this.m[1]) + (other.m[7]*this.m[4]) + (other.m[8]*this.m[7]),
          (other.m[6]*this.m[2]) + (other.m[7]*this.m[5]) + (other.m[8]*this.m[8])
        ]
        break;
      case 4:
        result = [
          (other.m[0]*this.m[0]) + (other.m[1]*this.m[4]) + (other.m[2]*this.m[8]) + (other.m[3]*this.m[12]),
          (other.m[0]*this.m[1]) + (other.m[1]*this.m[5]) + (other.m[2]*this.m[9]) + (other.m[3]*this.m[13]),
          (other.m[0]*this.m[2]) + (other.m[1]*this.m[6]) + (other.m[2]*this.m[10]) + (other.m[3]*this.m[14]),
          (other.m[0]*this.m[3]) + (other.m[1]*this.m[7]) + (other.m[2]*this.m[11]) + (other.m[3]*this.m[15]),
          (other.m[4]*this.m[0]) + (other.m[5]*this.m[4]) + (other.m[6]*this.m[8]) + (other.m[7]*this.m[12]),
          (other.m[4]*this.m[1]) + (other.m[5]*this.m[5]) + (other.m[6]*this.m[9]) + (other.m[7]*this.m[13]),
          (other.m[4]*this.m[2]) + (other.m[5]*this.m[6]) + (other.m[6]*this.m[10]) + (other.m[7]*this.m[14]),
          (other.m[4]*this.m[3]) + (other.m[5]*this.m[7]) + (other.m[6]*this.m[11]) + (other.m[7]*this.m[15]),
          (other.m[8]*this.m[0]) + (other.m[9]*this.m[4]) + (other.m[10]*this.m[8]) + (other.m[11]*this.m[12]),
          (other.m[8]*this.m[1]) + (other.m[9]*this.m[5]) + (other.m[10]*this.m[9]) + (other.m[11]*this.m[13]),
          (other.m[8]*this.m[2]) + (other.m[9]*this.m[6]) + (other.m[10]*this.m[10]) + (other.m[11]*this.m[14]),
          (other.m[8]*this.m[3]) + (other.m[9]*this.m[7]) + (other.m[10]*this.m[11]) + (other.m[11]*this.m[15]),
          (other.m[12]*this.m[0]) + (other.m[13]*this.m[4]) + (other.m[14]*this.m[8]) + (other.m[15]*this.m[12]),
          (other.m[12]*this.m[1]) + (other.m[13]*this.m[5]) + (other.m[14]*this.m[9]) + (other.m[15]*this.m[13]),
          (other.m[12]*this.m[2]) + (other.m[13]*this.m[6]) + (other.m[14]*this.m[10]) + (other.m[15]*this.m[14]),
          (other.m[12]*this.m[3]) + (other.m[13]*this.m[7]) + (other.m[14]*this.m[11]) + (other.m[15]*this.m[15])
        ]
        break;
      default:
        throw " Invalid Length of a Matrix";
    }
    this.m=result;
  };

  function mult(u,v){
    if(u.matrix != v.matrix || u.length != v.length){
      throw "Matrices cannot be multiplied" + u.length + v.length;
    }
    var result;
    switch (u.x) {
      case 2:
        result = [
          (u[0]*v[0]) + (u[1]*v[2]),(u[0]*v[1]) + (u[1]*v[3]),
          (u[2]*v[0]) + (u[3]*v[2]),(u[2]*v[1]) + (u[3]*v[3])
        ]
        break;
      case 3:
        result = [
          (u[0]*v[0]) + (u[1]*v[3]) + (u[2]*v[6]),(u[0]*v[1]) + (u[1]*v[4]) + (u[2]*v[7]),(u[0]*v[2]) + (u[1]*v[5]) + (u[2]*v[8]),
          (u[3]*v[0]) + (u[4]*v[3]) + (u[5]*v[6]),(u[3]*v[1]) + (u[4]*v[4]) + (u[5]*v[7]),(u[3]*v[2]) + (u[4]*v[5]) + (u[5]*v[8]),
          (u[6]*v[0]) + (u[7]*v[3]) + (u[8]*v[6]),(u[6]*v[1]) + (u[7]*v[4]) + (u[8]*v[7]),(u[6]*v[2]) + (u[7]*v[5]) + (u[8]*v[8])
        ]
        break;
      case 4:
        result = [
          (u[0]*v[0]) + (u[1]*v[4]) + (u[2]*v[8]) + (u[3]*v[12]),
          (u[0]*v[1]) + (u[1]*v[5]) + (u[2]*v[9]) + (u[3]*v[13]),
          (u[0]*v[2]) + (u[1]*v[6]) + (u[2]*v[10]) + (u[3]*v[14]),
          (u[0]*v[3]) + (u[1]*v[7]) + (u[2]*v[11]) + (u[3]*v[15]),
          (u[4]*v[0]) + (u[5]*v[4]) + (u[6]*v[8]) + (u[7]*v[12]),
          (u[4]*v[1]) + (u[5]*v[5]) + (u[6]*v[9]) + (u[7]*v[13]),
          (u[4]*v[2]) + (u[5]*v[6]) + (u[6]*v[10]) + (u[7]*v[14]),
          (u[4]*v[3]) + (u[5]*v[7]) + (u[6]*v[11]) + (u[7]*v[15]),
          (u[8]*v[0]) + (u[9]*v[4]) + (u[10]*v[8]) + (u[11]*v[12]),
          (u[8]*v[1]) + (u[9]*v[5]) + (u[10]*v[9]) + (u[11]*v[13]),
          (u[8]*v[2]) + (u[9]*v[6]) + (u[10]*v[10]) + (u[11]*v[14]),
          (u[8]*v[3]) + (u[9]*v[7]) + (u[10]*v[11]) + (u[11]*v[15]),
          (u[12]*v[0]) + (u[13]*v[4]) + (u[14]*v[8]) + (u[15]*v[12]),
          (u[12]*v[1]) + (u[13]*v[5]) + (u[14]*v[9]) + (u[15]*v[13]),
          (u[12]*v[2]) + (u[13]*v[6]) + (u[14]*v[10]) + (u[15]*v[14]),
          (u[12]*v[3]) + (u[13]*v[7]) + (u[14]*v[11]) + (u[15]*v[15])
        ]
        break;
      default:
        throw " Invalid Length of a Matrix";
    }

  }

  function printm(m){
    switch(m.rowLen) {
      case 2:
        console.log(m[0],m[1]);
        console.log(m[2],m[3]);
        break;
      case 3:
        console.log(m[0],m[1],m[2]);
        console.log(m[3],m[4],m[5]);
        console.log(m[6],m[7],m[8]);
        break;
      case 4:
        console.log(m[0],m[1],m[2],m[3]);
        console.log(m[4],m[5],m[6],m[7]);
        console.log(m[8],m[9],m[10],m[11]);
        console.log(m[12],m[13],m[14],m[15]);
        break;
      default:

    }
  }

  function intoShader(m){
    switch (m.rowLen) {
      case 2:
        return new Float32Array([
            m[0],m[1],
            m[2],m[3]
          ]);
        break;
      case 3:
        return new Float32Array([
            m[0],m[1],m[2],
            m[3],m[4],m[5],
            m[6],m[7],m[8]
          ]);
        break;
      case 4:
        return new Float32Array([
            m[0],m[1],m[2],m[3],
            m[4],m[5],m[6],m[7],
            m[8],m[9],m[10],m[11],
            m[12],m[13],m[14],m[15]
          ]);
        break;
      default:
        throw "Invalid Matrix to shader" + m.rowLen;
    }
  }

  return {
    "mat2":mat2,
    "mat3":mat3,
    "mat4":mat4,
    "add":add,
    "mult":mult,
    "intoShader":intoShader,
    "printm":printm,
  };
}());

var GLVectors = (function() {

  function vec(num,array){
    var result=array;
    result.num=num;

    switch (array.length) {
      case 0:

        break;
      case 1:
        break;
      case 2:

        break;
      case 3:

        break;
      default:

    }
  }

  vec.prototype.toString = function(){
    var string = "";
    for(var i=0;i<this.v.length;i++){
      string+= " " + this.v[i] + " ";
    }
    string += "\n";
  };

  function vec2(x,y){
    var result = [x,y];
    result.x=x;
    result.y=y;
    return result;
  }

  function vec3(x,y,z){
    var result = [x,y,z];
    result.x=x;
    result.y=y;
    result.z=z;
    return result;
  }

  function vec4(x,y,z,w){
    var result = [x,y,z,w];
    result.x=x;
    result.y=y;
    result.z=z;
    result.w=w;
    return result;
  }

  function print(array){
    console.info(array);

  }

  function add(v,u){
    if(u === v || v.length != y.length){
      throw "Cannot Add the two vectors" + v.Length + u.Length;
    }
    var result = [];
    for(var i=0;i<v.length;i++){
      result.push(v[i]+u[i]);
    }
    return result;
  }

  function subtract(v,u){
    if(u === v || v.length != u.length){
      throw "Cannot subtract the two vectors" + v.Length + u.Length;
    }
    var result = [];
    for(var i=0;i<v.length;i++){
      result.push(u[i]-v[i]);
    }
    return result;
  }

  function dotProduct(vec1,vec2){
    if(vec1.length!=vec2.length || vec1 === vec2) {
      throw "vector dotProdcut Invalid"
    }
    var result = 0.0;
    for(var i=0;i<vec1.length;++i){
      result += vec1[i] * vec2[i];
    }
    return result;
  }

  function mult(vec1,vec2){
    if(vec1.length!=vec2.length || vec1 === vec2) {
      throw "vector mult Invalid"
    }
    var result = [];
    for(var i=0;i<vec1.length;++i){
      result.push(vec1[i] * vec2[i]);
    }

    return result;
  }

  function length(u){

    var result = 0.0;
    for(var i = 0; i < u.length; i++) {
      result += Math.pow(u[i],2);
    }
    result=Math.sqrt(result);
    return result;
  }

  return {
    "vec2":vec2,
    "vec3":vec3,
    "vec4":vec4,
    "add":add,
    "subtract":subtract,
    "dot":dotProduct,
    "mult":mult,
    "length":length,
    "print":print
  };
}());


var GLMath = (function() {


  function crossProduct(vec1,vec2){
    if((vec1 === !vec2 || !vec1 === vec2) && vec1.length == vec2.length && (vec1.length < 3 || vec2.length < 3) ){
      throw "crossProduct(): trying to take the crossProduct of variables that are not the same length and same type";
    }
    return result = GLVectors.vec3(
      vec1[1]*vec2[2] - vec1[2]*vec2[1],
      vec1[2]*vec2[0] - vec1[0]*vec2[2],
      vec1[0]*vec2[1] - vec1[1]*vec2[0]
    )
  };

  function dotProduct(vec1,vec2){
      if((vec1 === !vec2 || !vec1 === vec2) && vec1.length == vec2.length && (vec1.length < 3 || vec2.length < 3) ){
        throw "dotProduct(): trying to take the dotProduct of variables that are not the same length and same type";
      }
    return (vec1[0]*vec2[0]+vec1[1]*vec2[1]+vec1[2]*vec2[2]);
  }

  function negate(u){
    var result = [];
    for(var i = 0;i < u.length;++i){
        result.push( -u[i] );
    }
    return result;
  }

  function translate(x,y,z){

    if(x === [] && x.length == 3){
      return new GLMatrix.mat4(
        1.0,0.0,0.0,x[0],
        0.0,1.0,0.0,x[1],
        0.0,0.0,1.0,x[2],
        0.0,0.0,0.0,1.0
      );
    }
      return new GLMatrix.mat4(
        1.0,0.0,0.0,x,
        0.0,1.0,0.0,y,
        0.0,0.0,1.0,z,
        0.0,0.0,0.0,1.0
      );
  }

  function translateX(x){
    return new GLMatrix.mat4(
      1.0,0.0,0.0,x,
      0.0,1.0,0.0,0.0,
      0.0,0.0,1.0,0.0,
      0.0,0.0,0.0,1.0
    );
  }

  function translateY(y){
    return new GLMatrix.mat4(
      1.0,0.0,0.0,0.0,
      0.0,1.0,0.0,y,
      0.0,0.0,1.0,0.0,
      0.0,0.0,0.0,1.0
    );
  }

  function translateZ(z){
    return new GLMatrix.mat4(
      1.0,0.0,0.0,0.0,
      0.0,1.0,0.0,0.0,
      0.0,0.0,1.0,z,
      0.0,0.0,0.0,1.0
    );
  }

  function rotate(){

  }

  function rotateX(angle,clockwise,rad){
    var c = cosine(angle,rad);
    var s = sine(angle,rad);
    if(clockwise){
      return new GLMatrix.mat4(
        1.0,0.0,0.0,0.0,
        0.0,c,-s,0.0,
        0.0,s,c,0.0,
        0.0,0.0,0.0,1.0
      );
    }else{
      return new GLMatrix.mat4(
        1.0,0.0,0.0,0.0,
        0.0,c,s,0.0,
        0.0,-s,c,0.0,
        0.0,0.0,0.0,1.0
      );
    }
  }

  function rotateY(angle,clockwise,rad){
    var c = cosine(angle,rad);
    var s = sine(angle,rad);
    if(clockwise){
      return new GLMatrix.mat4(
        c,0.0,s,0.0,
        0.0,1.0,0.0,0.0,
        -s,0.0,c,0.0,
        0.0,0.0,0.0,1.0
      );
    }else{
      return new GLMatrix.mat4(
        c,0.0,-s,0.0,
        0.0,1.0,0.0,0.0,
        s,0.0,c,0.0,
        0.0,0.0,0.0,1.0
      );
    }
  }

  function rotateZ(angle,clockwise,rad){
    var c = cosine(angle,rad);
    var s = sine(angle,rad);
    if(clockwise){
      return new GLMatrix.mat4(
        c,-s,0.0,0.0,
        s,c,0.0,0.0,
        0.0,0.0,1.0,0.0,
        0.0,0.0,0.0,1.0
      );
    }else{
      return new GLMatrix.mat4(
        c,-s,0.0,0.0,
        s,c,0.0,0.0,
        0.0,0.0,1.0,0.0,
        0.0,0.0,0.0,1.0
      );
    }
  }

  function scale(x,y,z){
    if(x===[] && x.length > 3){
      return new GLMatrix.mat4(
        x,0.0,0.0,0.0,
        0.0,y,0.0,0.0,
        0.0,0.0,z,0.0,
        0.0,0.0,0.0,1.0
      );
    }else if(x === 1){
      return new GLMatrix.mat4(
        x[0],0.0,0.0,0.0,
        0.0,y[1],0.0,0.0,
        0.0,0.0,z[2],0.0,
        0.0,0.0,0.0,1.0
      );
    }else{
      throw "Values not defined" + x;
    }
  }

  function scaleX(x){
    return new GLMatrix.mat4(
      x,0.0,0.0,0.0,
      0.0,1.0,0.0,0.0,
      0.0,0.0,1.0,0.0,
      0.0,0.0,0.0,1.0
    );
  }

  function scaleY(y){
    return new GLMatrix.mat4(
      1.0,0.0,0.0,0.0,
      0.0,y,0.0,0.0,
      0.0,0.0,1.0,0.0,
      0.0,0.0,0.0,1.0
    );
  }

  function scaleZ(z){
    return new GLMatrix.mat4(
      1.0,0.0,0.0,0.0,
      0.0,1.0,0.0,0.0,
      0.0,0.0,z,0.0,
      0.0,0.0,0.0,1.0
    );
  }

  function orthogonal(){

  }

  function transpose(m){

    if(!m.matrix){
      throw "Not a Matrix";
    }
    switch (m.rowLen) {
      case 2:
        return GLMatrix.mat2(
          m[0],m[2],
          m[1],m[3]
        );
        break;
      case 3:
        return GLMatrix.mat3(
          m[0],m[3],m[6],
          m[1],m[4],m[7],
          m[2],m[5],m[8]
        );
        break;
      case 4:
        return GLMatrix.mat4(
          m[0],m[4],m[8],m[12],
          m[1],m[5],m[9],m[13],
          m[2],m[6],m[10],m[14],
          m[3],m[7],m[11],m[15]
        );
        break;
      default:
        throw "invalid width of matrix " + m.rowLen;
    }
  }

  function normalize(v,exclude){
    if(v.length == 4 && exclude){
      var last = v.pop();
    }

    var len = GLVectors.length(v);

    if ( len == 0) {
        throw "normalize: vector " + v + " has zero length";
    }

    for(var i=0; i<v.length; ++i){
        v[i]/=len;
    }

    if(exclude) {
        v.push( last );
    }

    return v;

  }

  function normalMatrix(){

  }

  function determinant(){

  }

  function determinant2(){

  }

  function determinant3(){

  }

  function determinant4(){

  }

  function inverse(){

  }

  function inverse2(){

  }

  function inverse3(){

  }

  function inverse4(){

  }

  function RadTODeg(theta){
      return (theta *(180/Math.pi));
  }

  /*function DegTORad(theta){
    return (theta *(Math.pi/180));
  }*/

  function DegTORad( theta ) {
      return theta * Math.PI / 180.0;
  }

  function print(u){
    console.info(u);
  }

  function length(){

  }

  function equal(){

  }

  function cosine(theta,rad){
    if(!rad){
      return Math.cos(DegTORad(theta));
    }else{
      return Math.cos(theta);
    }
  }

  function sine(theta,rad){
    if(!rad){
      return Math.sin(DegTORad(theta));
    }else{
      return Math.sin(theta);
    }
  }

  function cotangent(theta,rad){
    if(!rad){
      return (1/Math.tan(DegTORad(theta)));
    }else{
      return (1/Math.tan(theta));
    }
  }



  return {
    "cross":crossProduct,
    "dot":dotProduct,
    "negate":negate,
    "trans":translate,
    "transX":translateX,
    "transY":translateY,
    "transZ":translateZ,
    "rot":rotate,
    "rotX":rotateX,
    "rotY":rotateY,
    "rotZ":rotateZ,
    "scale":scale,
    "scaleX":scaleX,
    "scaleY":scaleY,
    "scaleZ":scaleZ,
    "ortho":orthogonal,
    "transpose":transpose,
    "normalize":normalize,
    "normalMatrix":normalMatrix,
    "det":determinant,
    "det2":determinant2,
    "det3":determinant3,
    "det4":determinant4,
    "inverse":inverse,
    "inverse2":inverse2,
    "inverse3":inverse3,
    "inverse4":inverse4,
    "equal":equal,
    "cos":cosine,
    "sin":sine,
    "cot":cotangent,
    "radians":DegTORad,
  };
}());


var GLView = (function() {

  function perspective(fov,aspect,near,far){
    //var f=GLMath.cot(fov/2);
    //console.log(fov * Math.PI / 180.0);
    //console.log(GLMath.radians(fov));
    var f = 1.0 / Math.tan(GLMath.radians(fov)/ 2 );
    return new GLMatrix.mat4(
      f/aspect,0.0,0.0,0.0,
      0.0,f,0.0,0.0,
      0.0,0.0,-(near+far)/(far-near),-(2*near*far)/(far-near),
      0.0,0.0,-1.0,0.0
    );
  }

  function orthographic(left,right,bottom,top,near,far){
    if(left == right || bottom == top || near == far){
      throw "left/right, bottom/top, and near/far should not be equal";
    }

    var sx= 2/(right-left);
    var sy= 2/(top-bottom);
    var sz= -2/(far-near);
    var tx= -(left+right)/(right-left);
    var ty= -(top+bottom)/(top-bottom);
    var tz= -(far+near)/(far-near);

    return new GLMatrix.mat4(
      sx,0.0,0.0,tx,
      0.0,sy,0.0,ty,
      0.0,0.0,sz,tz,
      0.0,0.0,0.0,1.0
    );
  }

  function frustrum(){



    gl.uniform1f(topLoc,-10*Math.tan(45));
    gl.uniform1f(leftLoc,-10*Math.tan(45));
    gl.uniform1f(rightLoc,-10*Math.tan(45));



  }

  function lookAt(eye,at,up){
    var n = GLMath.normalize(GLVectors.subtract(eye,at));
    var u = GLMath.normalize(GLMath.cross(up,n));
    var v = GLMath.normalize(GLMath.cross(n,u));

    return new GLMatrix.mat4(
      u[0],u[1],u[2],-GLMath.dot(u,eye),
      v[0],v[1],v[2],-GLMath.dot(v,eye),
      n[0],n[1],n[2],-GLMath.dot(n,eye),
      0.0,0.0,0.0,1.0
    );
  }

  return {
    "persp":perspective,
    "ortho":orthographic,
    "frustrum":frustrum,
    "lookAt":lookAt,
  };
}());


var GLQuadternion = (function() {

  function lookAt(){

  }




  return {

  };
}());




function testGLVECTOR(){

}
