#version 300 es
precision mediump float;

in vec3 vNormal;
in vec2 vTexCoord;

uniform vec3 lightDirection;
uniform sampler2D sampler;

out vec4 fragColor;

void main(void){

    vec3 L = normalize(lightDirection);
    vec3 N = normalize(vNormal);

    float lambertTerm = clamp(dot(N, -L), 0.0, 1.0);
    vec4 la = vec4(0.1);

    // vec4 destColor = vec4(vec3(vTexCoord.x, vTexCoord.y, 0.0), 1.0);
    // vec4 destColor = vec4(vec3(lambertTerm),1.0);
    vec4 destColor = texture(sampler, vec2(lambertTerm, 0.0));

    fragColor = destColor;
    
}