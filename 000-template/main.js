'use strict';

let gl,
    program,
    vao,
    indexBuffer,
    indices;

function getShader() {

    return new Promise((resolve) => {
        oProgram.loadShader([
            './vert.vs',
            './frag.fs',
        ])
        .then((shaders) => {
            const vs = oProgram.createShader(gl, shaders[0], gl.VERTEX_SHADER);
            const fs = oProgram.createShader(gl, shaders[1], gl.FRAGMENT_SHADER);

            program = oProgram.createProgram(gl, vs, fs);

            program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');

            resolve();

        });
    });

}

function initBuffers() {
    
    const vertices = [
        -0.5, 0.5, 0,
        -0.5, -0.5, 0,
        0.5, -0.5, 0,
        0.5, 0.5, 0
    ];

    indices = [0, 1, 2, 0, 2, 3];

    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const squareVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(program.aVertexPosition);
    gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    
    indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

}

function draw() {
    
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.bindVertexArray(vao);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    gl.bindVertexArray(null);

}

function init() {

    const canvas = oUtils.getCanvas('webgl-canvas');
    oUtils.autoResizeCanvas(canvas);

    gl = oUtils.getGLContext(canvas);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    getShader().then(() => {
        initBuffers();
        draw();
    })
    
}

window.onload = init;