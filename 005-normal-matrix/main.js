'use strict';

let render,
    beginTime,
    nowTime;

let gui;
let guiObj = {
    fixedLight: true
}

function draw(gl, vao, indicesLength, program) {

    let m = new matIV();
    let mMatrix = m.identity(m.create());
    let vMatrix = m.identity(m.create());
    let pMatrix = m.identity(m.create());
    let mvpMatrix = m.identity(m.create());
    let nMatrix = m.identity(m.create());

    m.translate(mMatrix, [0, -1, 0], mMatrix);
    m.rotate(mMatrix, nowTime, [0, 1, 0], mMatrix);
    m.lookAt([0.0, 0.0, 2.5], [0, 0, 0], [0, 1, 0], vMatrix);
    m.perspective(90, gl.canvas.width / gl.canvas.height, 0.1, 100, pMatrix);

    m.multiply(mMatrix, vMatrix, nMatrix);
    m.inverse(nMatrix, nMatrix);
    //m.transpose(nMatrix, nMatrix);

    m.multiply(pMatrix, vMatrix, mvpMatrix);
    m.multiply(mvpMatrix, mMatrix, mvpMatrix);


    let uniValues = [[nowTime], 
                     mvpMatrix,
                     nMatrix,
                     [-0.577, -0.577, -0.577],
                     guiObj.fixedLight];
    
    glMethods.setUniform(gl, uniValues, program.uniLocations, program.uniTypes);

    //深度テストの比較方法を指定
    gl.depthFunc(gl.LEQUAL);

    //カリングテストの有効化
    gl.enable(gl.CULL_FACE);

    //深度テストの有効化
    gl.enable(gl.DEPTH_TEST);

    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.bindVertexArray(vao);

    gl.drawElements(gl.TRIANGLES, indicesLength, gl.UNSIGNED_SHORT, 0);

    gl.bindVertexArray(null);

}

function init() {

    beginTime = Date.now();

    gui = new lil.GUI();
    gui.add(guiObj, 'fixedLight');

    const attLocations = ['aVertexPosition',
                          'aVertexNormal',                    
                          'aVertexTexCoord'];

    const uniLocations = [['time', 'uniform1fv'],
                          ['mvpMatrix', 'uniformMatrix4fv'],
                          ['nMatrix', 'uniformMatrix4fv'],
                          ['lightDirection', 'uniform3fv'],
                          ['fixedLight', 'uniform1i']];    

    const canvas = utils.getCanvas('webgl-canvas');
    utils.autoResizeCanvas(canvas);

    const gl = utils.getGLContext(canvas);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    glMethods.getShader(gl, ['./vert.vs', './frag.fs'], attLocations, uniLocations).then((program) => {

        //const buffers = glMethods.createBuffers(gl, program, vertAttributes, indices);
        glMethods.createBuffers4Json(gl, program, '../models/stanford-bunny.json').then((buffers) => {
            
            //キショコード
            function render() {
                requestAnimationFrame(render);
                nowTime = (Date.now() - beginTime) / 1000.0;
                draw(gl, buffers.vao, buffers.indices.length, program);
            }

            render();    
        });
    
    });
    
}

window.onload = init;
