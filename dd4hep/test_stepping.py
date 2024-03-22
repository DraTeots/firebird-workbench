# ==========================================================================
#  AIDA Detector description implementation
# --------------------------------------------------------------------------
# Copyright (C) Organisation europeenne pour la Recherche nucleaire (CERN)
# All rights reserved.
#
# For the licensing terms see $DD4hepINSTALL/LICENSE.
# For the list of contributors see $DD4hepINSTALL/doc/CREDITS.
#
# ==========================================================================
#
from __future__ import absolute_import, unicode_literals
import logging
#
logging.basicConfig(format='%(levelname)s: %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)
#
#
"""
   dd4hep simulation example setup using the python configuration
"""


def run():
    import os
    import DDG4
    from DDG4 import OutputLevel as Output
    from g4units import GeV, keV

    # ddsim --compactFile=/home/romanov/eic/hrepic/epic/install/share/epic/epic.xml -N=2 --random.seed 1 --enableGun --gun.energy 2*GeV --gun.thetaMin 0*deg --gun.thetaMax 90*deg --gun.distribution uniform --outputFile test.edm4hep.root

    kernel = DDG4.Kernel()

    kernel.loadGeometry(str("file:/home/romanov/eic/hrepic/epic/install/share/epic/epic.xml"))

    DDG4.importConstants(kernel.detectorDescription(), debug=False)
    geant4 = DDG4.Geant4(kernel, tracker='Geant4TrackerCombineAction')
    geant4.printDetectors()
    # Configure UI
    geant4.setupUI(typ="tcsh", vis=False, macro=None, ui=False)

    # Configure field
    geant4.setupTrackingField(prt=True)
    # Configure Event actions
    prt = DDG4.EventAction(kernel, 'Geant4ParticlePrint/ParticlePrint')
    prt.OutputLevel = Output.DEBUG
    prt.OutputType = 3  # Print both: table and tree
    kernel.eventAction().adopt(prt)

    generator_output_level = Output.INFO

    # Configure G4 geometry setup
    seq, act = geant4.addDetectorConstruction("Geant4DetectorGeometryConstruction/ConstructGeo")
    act.DebugMaterials = True
    act.DebugElements = False
    act.DebugVolumes = True
    act.DebugShapes = True
    act.DebugSurfaces = True

    # Setup particle gun
    gun = geant4.setupGun("Gun", particle='gamma', energy=1 * GeV, multiplicity=1)
    gun.direction = (0.0, 0.0, 1.0)
    gun.OutputLevel = generator_output_level
    kernel.NumEvents = 2
    # Instantiate the stepping action
    stepping = DDG4.SteppingAction(kernel, 'TestSteppingAction/MyStepper')
    stepping.OutputFileName = "one_event.csv"
    kernel.steppingAction().add(stepping)

    # And handle the simulation particles.
    part = DDG4.GeneratorAction(kernel, "Geant4ParticleHandler/ParticleHandler")
    kernel.generatorAction().adopt(part)
    part.SaveProcesses = ['conv', 'Decay']
    part.MinimalKineticEnergy = 1 * keV
    part.KeepAllParticles = False
    part.PrintEndTracking = True
    part.enableUI()

    # Now build the physics list:
    phys = geant4.setupPhysics('QGSP_BERT')
    phys.dump()
    # Start the engine...
    geant4.execute()


if __name__ == "__main__":
    run()
