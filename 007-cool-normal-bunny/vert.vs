#version 300 es
precision mediump float;

in vec3 aVertexPosition;
in float aVertexEnd;
in float aVertexIndex;

uniform mat4 mvpMatrix;
uniform float time;

out float vEnd;
out float vt;

#define smootherstep(t) ( t * t * t * ( t * ( t * 6.0 - 15.0 ) + 10.0 ) )

const float PI = acos(-1.0);

void main(void){

    float rt = smootherstep(fract(time*2.0));

    float size = 2.0;

    vt = rt;

    vEnd = aVertexEnd;

    vec3 v = aVertexPosition + aVertexPosition * sin(time*4.0 + aVertexIndex)*0.1;
    v += (normalize(aVertexPosition)*aVertexEnd*size*rt);

    gl_Position = mvpMatrix * vec4(v, 1.0);

    if(aVertexEnd == 0.0) {
        gl_PointSize = 1.5;
    } else {
        gl_PointSize = (3.0*aVertexEnd*(1.0-rt));
    }
}