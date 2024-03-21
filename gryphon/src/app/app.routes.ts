import { Routes } from '@angular/router';
import { TestExperimentComponent } from './test-experiment/test-experiment.component';

export const routes: Routes = [
    { path: '', component: TestExperimentComponent, pathMatch: 'full' }
];
