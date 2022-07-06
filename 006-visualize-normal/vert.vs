#version 300 es
precision mediump float;

in vec3 aVertexPosition;
in vec2 aVertexTexCoord;
in vec3 aVertexNormal;

uniform mat4 mvpMatrix;
uniform float time;
uniform bool isEdge;

out vec3 vNormal;
out vec2 vTexCoord;

const float PI = acos(-1.0);

void main(void){

    if(!isEdge) {
        vNormal = aVertexNormal;
        vTexCoord = aVertexTexCoord;

    } 

    // float t;

    // if(mod(time*2.0, PI*2.0) > PI) {
    //     t = abs(sin(mod(time*2.0, PI*2.0)))*0.5;
    // } else {
    //     t = 0.0;
    // }

    // gl_Position = mvpMatrix * vec4(aVertexPosition+(aVertexNormal*t), 1.0);
    gl_Position = mvpMatrix * vec4(aVertexPosition, 1.0);
    gl_PointSize = 5.0;
}