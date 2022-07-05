'use strict';

let render,
    beginTime,
    nowTime;

function createBuffers(gl, program, vertAttributes, indices) {

    let buffers = {};

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const vertexBuffers = [];

    for(let i = 0; i < vertAttributes.length; i++) {
        vertexBuffers.push(gl.createBuffer());
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers[i]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertAttributes[i][0]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(program.attLocations[i]);
        gl.vertexAttribPointer(program.attLocations[i], vertAttributes[i][1], gl.FLOAT, false, 0, 0);
    }

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    buffers.vao = vao;
    buffers.indexBuffer = indexBuffer;

    return buffers;

}

function setUniform(gl, value, uniLocations, uniTypes) {

    value.forEach((v, index) => {
        
        const type = uniTypes[index];
        
        if(type.includes('Matrix') === true) {
            gl[type](uniLocations[index], false, v);
        } else {
            gl[type](uniLocations[index], v);
        }
        
    });

}

function draw(gl, vao, indicesLength, program) {

    let m = new matIV();
    let mMatrix = m.identity(m.create());
    let vMatrix = m.identity(m.create());
    let pMatrix = m.identity(m.create());
    let mvpMatrix = m.identity(m.create());

    m.rotate(mMatrix, nowTime, [0, 1, 0], mMatrix);

    m.lookAt([0.0, 0.0, 3.0], [0, 0, 0], [0, 1, 0], vMatrix);
    m.perspective(90, gl.canvas.width / gl.canvas.height, 0.1, 100, pMatrix);

    m.multiply(pMatrix, vMatrix, mvpMatrix);
    m.multiply(mvpMatrix, mMatrix, mvpMatrix);


    let uniValues = [[1.0], mvpMatrix];
    
    setUniform(gl, uniValues, program.uniLocations, program.uniTypes);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.bindVertexArray(vao);

    gl.drawElements(gl.TRIANGLES, indicesLength, gl.UNSIGNED_SHORT, 0);

    gl.bindVertexArray(null);

}

function init() {

    beginTime = Date.now();

    const vertices = [
        -0.5, 0.5, 0,
        -0.5, -0.5, 0,
        0.5, -0.5, 0,
        0.5, 0.5, 0
    ];

    const colors = [
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
        1.0, 1.0, 1.0
    ];

    const vertAttributes = [[vertices, 3], [colors, 3]];

    const indices = [0, 1, 2, 0, 2, 3];

    const attLocations = ['aVertexPosition',
                          'aVertexColor'];

    const uniLocations = [['test', 'uniform1fv'],
                          ['mvpMatrix', 'uniformMatrix4fv']];    

    const canvas = oUtils.getCanvas('webgl-canvas');
    oUtils.autoResizeCanvas(canvas);

    const gl = oUtils.getGLContext(canvas);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    oProgram.getShader(gl, ['./vert.vs', './frag.fs'], attLocations, uniLocations).then((program) => {

        const buffers = createBuffers(gl, program, vertAttributes, indices);

        //キショコード
        function render() {
            requestAnimationFrame(render);
            nowTime = (Date.now() - beginTime) / 1000.0;
            draw(gl, buffers.vao, indices.length, program);
        }

        render();        
    })
    
}

window.onload = init;
