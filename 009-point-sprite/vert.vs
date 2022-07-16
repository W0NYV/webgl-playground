#version 300 es
precision mediump float;

in vec3 aVertexPosition;
in vec2 aVertexTexCoord;
in vec3 aVertexNormal;
in vec3 aVertexColor;

uniform mat4 mvpMatrix;
uniform float time;

out vec3 vNormal;
out vec2 vTexCoord;
out vec3 vColor;

const float PI = acos(-1.0);

void main(void){
    vNormal = aVertexNormal;
    vTexCoord = aVertexTexCoord;
    vColor = aVertexColor;
    gl_Position = mvpMatrix * vec4(aVertexPosition, 1.0);
    gl_PointSize = 30.0;
}