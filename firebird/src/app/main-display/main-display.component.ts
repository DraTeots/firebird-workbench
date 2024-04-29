// import { Component } from '@angular/core';
//
// @Component({
//   selector: 'app-main-display',
//   standalone: true,
//   imports: [],
//   templateUrl: './main-display.component.html',
//   styleUrl: './main-display.component.scss'
// })
// export class MainDisplayComponent {
//
// }


import { Component, OnInit } from '@angular/core';
import { EventDisplayService } from 'phoenix-ui-components';
import { wildCardCheck } from '../utils/wildcard';
import { Configuration, PhoenixLoader, PresetView, ClippingSetting, PhoenixMenuNode } from 'phoenix-event-display';

import { PhoenixUIModule } from 'phoenix-ui-components';
// import { openFile } from 'jsroot/io';
// import { build } from 'jsroot/geom';
import { openFile } from 'jsroot';
import { build } from 'jsroot/geom';
import {TGeoManager} from 'jsroot/geom'
import jsroot from 'jsroot';

@Component({
  selector: 'app-test-experiment',
  templateUrl: './main-display.component.html',
  imports: [PhoenixUIModule],
  standalone: true,
  styleUrls: ['./main-display.component.scss']
})
export class MainDisplayComponent implements OnInit {

  /** The root Phoenix menu node. */
  phoenixMenuRoot = new PhoenixMenuNode("Phoenix Menu");

  /** is geometry loaded */
  loaded: boolean = false;

  /** loading progress */
  loadingProgress: number = 0;

  constructor(private eventDisplay: EventDisplayService) { }

  /// Prints geometry structure
  printNodeRecursive(node: any, maxLevel=0, level=0, path="") {
    const nodeName = node.fName;
    const volume = node.fVolume;
    const subNodes = volume.fNodes;
    const nodeFullPath = path + "/" + nodeName
    let processedNodes = 1;
    console.log(`${String(maxLevel).padStart(2, ' ')} ${nodeFullPath}`);

    if(!volume || !subNodes || level>=maxLevel) return processedNodes;

    for (let i = 0; i < volume.fNodes.arr.length; i++) {
      const childNode = node.fVolume.fNodes.arr[i];
      if(childNode) {
        processedNodes += this.printNodeRecursive(childNode, maxLevel, level + 1, nodeFullPath);
      }
    }
    return processedNodes;
  }

  private printVolumeRecursive(node: any, maxLevel=0, level=0, path="") {
    let volume = node._typename === "TGeoManager"? node.fMasterVolume : node.fVolume;

    const nodeName = node.fName;
    const volumeName = volume.fName;

    // console.log(path + "/" + volumeName);

    if(level>=maxLevel) return;

    if (volume.fNodes) {
      for (const childNode of volume.fNodes.arr) {
        this.printVolumeRecursive(childNode, maxLevel, level + 1, path + "/" + volumeName);
      }
    }
  }


  async loadEicGeometry() {
    let url: string = 'assets/epic_pid_only.root';
    let objectName = 'default';

    console.log(`Loading file ${url}`)

    console.time('Open root file');
    const file = await openFile(url);

    console.log(file);
    console.timeEnd('Open root file');

    console.time('Reading geometry from file');

    const obj = await file.readObject(objectName);
    console.timeEnd('Reading geometry from file');
    console.log(obj);

    console.time('Go over all nodes');
    //this.printVolumeRecursive(obj, 10);
    this.printNodeRecursive(obj.fNodes.arr[0], 2);
    console.timeEnd('Go over all nodes');


    console.time('Build geometry');
    let geo = build(obj, { numfaces: 500000000, numnodes: 5000000, dflt_colors: true, vislevel: 10, doubleside:true, transparency:true});
    console.timeEnd('Build geometry');
    console.log(geo);

    console.time('Convert to JSon geometry')
    let json = geo.toJSON();
    console.timeEnd('Convert to JSon geometry')
    console.log(json);
    return json;
  }



  ngOnInit() {

    // Create the event display configuration
    const configuration: Configuration = {
      eventDataLoader: new PhoenixLoader(),
      presetViews: [
        // simple preset views, looking at point 0,0,0 and with no clipping
        new PresetView('Left View', [0, 0, -12000], [0, 0, 0], 'left-cube'),
        new PresetView('Center View', [-500, 12000, 0], [0, 0, 0], 'top-cube'),
        // more fancy view, looking at point 0,0,5000 and with some clipping
        new PresetView('Right View', [0, 0, 12000], [0, 0, 5000], 'right-cube', ClippingSetting.On, 90, 90)
      ],
      // default view with x, y, z of the camera and then x, y, z of the point it looks at
      defaultView: [4000, 0, 4000, 0, 0 ,0],
      phoenixMenuRoot: this.phoenixMenuRoot,
      // Event data to load by default
      defaultEventFile: {
        // (Assuming the file exists in the `src/assets` directory of the app)
        //eventFile: 'assets/herwig_18x275_5evt.json',
        eventFile: 'assets/herwig_5x41_5evt_showers.json',
        eventType: 'json'   // or zip
      },
    }

    // Initialize the event display
    this.eventDisplay.init(configuration);

    let jsonGeometry;
    this.loadEicGeometry().then(jsonGeom => {
      this.eventDisplay.loadJSONGeometry(jsonGeom,
        'Full detector', 'Central detector', 10, false)
        .catch(err => {
          console.log("Error loading geometry");
          console.log(err);
        }
      );
    });

    // Load detector geometry (assuming the file exists in the `src/assets` directory of the app)
    //this.eventDisplay.loadGLTFGeometry('assets/epic_full.gltf', 'Full detector', 'Central detector', 10);
    //this.eventDisplay.loadGLTFGeometry('assets/epic_full_colors_vl3.gltf', 'Full detector', 'Central detector', 10);
    //this.eventDisplay.loadGLTFGeometry('assets/DRICH.gltf', 'Full detector', 'Central detector', 10);
    //this.eventDisplay.getThreeManager().getObjectByName()
    // this.eventDisplay.loadRootGeometry()

  //   let name: string
  //     menuNodeName?: string,
  //     scale?: number,
  //     doubleSided?: boolean,
  //     initiallyVisible: boolean = true,
  // ) {
  //     this.loadingManager.addLoadableItem('root_geom');
  //     // See https://github.com/root-project/jsroot/blob/19ce116b68701ab45e0a092c673119bf97ede0c2/modules/core.mjs#L241.
  //     jsrootSettings.UseStamp = false;
  //

  //
  //     //await this.loadJSONGeometry(
  //       build(obj, { dflt_colors: true }).toJSON(),
  //     //   name,
  //     //   menuNodeName,
  //     //   scale,
  //     //   doubleSided,
  //     //   initiallyVisible,
  //     // );
  //
  //     this.loadingManager.itemLoaded('root_geom');

    this.eventDisplay
      .getLoadingManager()
      .addProgressListener((progress) => (this.loadingProgress = progress));

    document.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter') {
        // do something..
      }
      if ((e as KeyboardEvent).key === 'q') {
        const name = `event_5x41_${Math.floor(Math.random() * 20)}`
        console.log(name); // This will log a random index from 0 to 3
        this.eventDisplay.loadEvent(name);
        this.eventDisplay.animateEventWithCollision(1500);
      }
      console.log((e as KeyboardEvent).key);
    });

    // Load the default configuration
    this.eventDisplay.getLoadingManager().addLoadListenerWithCheck(() => {
      console.log('Loading default configuration.');
      this.loaded = true;

    });

  }

}
