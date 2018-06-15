import _ from 'lodash';
import process from 'process';

const earcut = require('./src/earcut');

import("./earcut").then((module) => {
    const earcut_wasm = module.earcut_flat;

    const samples = {
        'typical OSM building': earcut.flatten(require('./test/fixtures/building.json')),
        'dude shape': earcut.flatten(require('./test/fixtures/dude.json')),
        'complex OSM water': earcut.flatten(require('./test/fixtures/water.json'))
    };

    const benchmark = require('benchmark');
    const Benchmark = benchmark.runInContext({ _, process });
    window.Benchmark = Benchmark;

    for (const name in samples) {
        const {vertices, holes} = samples[name];
        const verticesArray = Float64Array.from(vertices);
        const holesArray = Float32Array.from(holes);
        new Benchmark.Suite()
            .add(`JS ${name} (${vertices.length / 2} vertices):`, function () {
                earcut(vertices, holes);
            })
            .add(`WASM ${name} (${vertices.length / 2} vertices):`, function () {
                earcut_wasm(verticesArray, holesArray);
            })
            .on('cycle', (e) => console.log(String(e.target)))
            .run();
    }
});