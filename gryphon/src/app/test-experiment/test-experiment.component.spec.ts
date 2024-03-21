import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestExperimentComponent } from './test-experiment.component';

describe('TestExperimentComponent', () => {
  let component: TestExperimentComponent;
  let fixture: ComponentFixture<TestExperimentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestExperimentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestExperimentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
