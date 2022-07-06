#version 300 es
precision mediump float;

in vec3 vNormal;
in vec2 vTexCoord;

uniform vec3 lightDirection;
uniform bool isEdge;

out vec4 fragColor;

void main(void){

    vec4 destColor;

    if(isEdge) {
        destColor = vec4(0.0, 0.7, 1.0, 1.0);

    } else {
        vec3 L = normalize(lightDirection);
        vec3 N = normalize(vNormal);

        float lambertTerm = dot(N, -L);
        vec4 la = vec4(0.1);

        //vec4 destColor = la + vec4(vec3(lambertTerm),1.0) * vec4(vec3(vTexCoord.x, vTexCoord.y, 0.0), 1.0);
        destColor = la + vec4(vec3(lambertTerm),1.0);
        //vec4 destColor = vec4(vNormal, 1.0);
    }


    fragColor = destColor;
    
}