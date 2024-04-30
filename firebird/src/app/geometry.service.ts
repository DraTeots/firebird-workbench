import { Injectable } from '@angular/core';
import { openFile } from 'jsroot';
import { findGeoManager } from './utils/cern-root.utils';
import { build } from 'jsroot/geom';


@Injectable({
  providedIn: 'root'
})
export class GeometryService {

  constructor() { }

  async loadEicGeometry() {
    //let url: string = 'assets/epic_pid_only.root';
    let url: string = 'https://eic.github.io/epic/artifacts/tgeo/epic_dirc_only.root';
    let objectName = 'default';

    console.log(`Loading file ${url}`)

    console.time('Open root file');
    const file = await openFile(url);
    console.log(file);

    console.timeEnd('Open root file');

    console.time('Reading geometry from file');
    const obj = await findGeoManager(file) // await file.readObject(objectName);
    console.timeEnd('Reading geometry from file');
    console.log(obj);
    //
    // console.time('Go over all nodes');
    // //this.printVolumeRecursive(obj, 10);
    // //this.printNodeRecursive(obj.fNodes.arr[0], 2);
    // console.timeEnd('Go over all nodes');
    //
    //
    console.time('Build geometry');
    let geo = build(obj, { numfaces: 500000000, numnodes: 5000000, dflt_colors: true, vislevel: 10, doubleside:true, transparency:false});
    console.timeEnd('Build geometry');
    console.log(geo);
    //
    console.time('Convert to JSon geometry')
    let json = geo.toJSON();
    console.timeEnd('Convert to JSon geometry')
    console.log(json);
    // return json;
    return json;
  }
}
