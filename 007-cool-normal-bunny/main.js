'use strict';

let render,
    beginTime,
    nowTime;

function draw(gl, objects, program) {
    
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    let m = new matIV();
    let vMatrix = m.identity(m.create());
    let pMatrix = m.identity(m.create());
    
    m.lookAt([0.0, Math.sin(nowTime/2.0), 0.5 + Math.abs(Math.cos(nowTime/6.0))*2.0], [0, 0, 0], [0, 1, 0], vMatrix);
    m.perspective(90, gl.canvas.width / gl.canvas.height, 0.1, 100, pMatrix);

    for(let i = 0; i < objects.length; i++) {
        let mMatrix = m.identity(m.create());
        let mvpMatrix = m.identity(m.create());
        // let nMatrix = m.identity(m.create());

        m.translate(mMatrix, [0, -1, 0], mMatrix);
        // m.rotate(mMatrix, nowTime, [1, 0, 0], mMatrix);
        m.rotate(mMatrix, nowTime/8.0, [0, 1, 0], mMatrix);

        // m.multiply(mMatrix, vMatrix, nMatrix);
        // m.inverse(nMatrix, nMatrix);
        //m.transpose(nMatrix, nMatrix);

        m.multiply(pMatrix, vMatrix, mvpMatrix);
        m.multiply(mvpMatrix, mMatrix, mvpMatrix);

        let uniValues = [[nowTime], 
                         mvpMatrix,
                         [-0.577, -0.577, -0.577]];

        glMethods.setUniform(gl, uniValues, program.uniLocations, program.uniTypes);

        gl.bindVertexArray(objects[i].vao);



        gl.drawElements(gl.POINTS, objects[i].indices.length, gl.UNSIGNED_SHORT, 0);

        gl.bindVertexArray(null);
    }

}

function init() {

    beginTime = Date.now();

    let objects = [];

    const attLocations = ['aVertexPosition',
                          'aVertexEnd',
                          'aVertexIndex'];

    const uniLocations = [['time', 'uniform1fv'],
                          ['mvpMatrix', 'uniformMatrix4fv'],
                          ['lightDirection', 'uniform3fv']];    

    const canvas = utils.getCanvas('webgl-canvas');
    utils.autoResizeCanvas(canvas);

    const gl = utils.getGLContext(canvas);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //深度テストの比較方法を指定
    gl.depthFunc(gl.LEQUAL);

    //カリングテストの有効化
    gl.enable(gl.CULL_FACE);

    //深度テストの有効化
    gl.enable(gl.DEPTH_TEST);

    glMethods.getNormalVectors4Json('../models/stanford-bunny.json', 0.0125).then((norVecs) => {
        const nVertAttributes = [[norVecs.p, 3], [norVecs.e, 1], [norVecs.i, 1]];
        const nIndices = norVecs.i;

        glMethods.getShader(gl, ['./vert.vs', './frag.fs'], attLocations, uniLocations).then((program) => {
        
            const nBuffers = glMethods.createBuffers(gl, program, nVertAttributes, nIndices);
            objects.push(nBuffers);
    
            function render() {
                requestAnimationFrame(render);
                nowTime = (Date.now() - beginTime) / 1000.0;
                draw(gl, objects, program);
            }
    
            render();    
    
        });
    });
    
}

window.onload = init;
