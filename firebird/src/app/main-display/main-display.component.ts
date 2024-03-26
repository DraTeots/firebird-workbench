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
import { Configuration, PhoenixLoader, PresetView, ClippingSetting, PhoenixMenuNode } from 'phoenix-event-display';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PhoenixUIModule } from 'phoenix-ui-components';

@Component({
  selector: 'app-test-experiment',
  templateUrl: './main-display.component.html',
  imports: [PhoenixUIModule, PhoenixUIModule],
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
        eventFile: 'assets/test_event.json',
        eventType: 'json'
      },
    }

    // Initialize the event display
    this.eventDisplay.init(configuration);

    // Load detector geometry (assuming the file exists in the `src/assets` directory of the app)
    this.eventDisplay.loadGLTFGeometry('assets/DRICH.gltf', 'Detector');

    this.eventDisplay
      .getLoadingManager()
      .addProgressListener((progress) => (this.loadingProgress = progress));

    // Load the default configuration
    this.eventDisplay.getLoadingManager().addLoadListenerWithCheck(() => {
      console.log('Loading default configuration.');
      this.loaded = true;
    });

  }

}
