#version 300 es
precision mediump float;

in vec3 aVertexPosition;
in vec2 aVertexTexCoord;
in vec3 aVertexNormal;

uniform mat4 mvpMatrix;
uniform float time;

out vec3 vNormal;
out vec2 vTexCoord;

const float PI = acos(-1.0);

void main(void){
    vNormal = aVertexNormal;
    vTexCoord = aVertexTexCoord;
    gl_Position = mvpMatrix * vec4(aVertexPosition, 1.0);
}