
#include "FirebirdActsJanaProcessor.h"

FirebirdActsJanaProcessor::FirebirdActsJanaProcessor() {
    SetTypeName(NAME_OF_THIS); // Provide JANA with this class's name
}
    
void FirebirdActsJanaProcessor::Init() {
    auto app = GetApplication();
    m_lock = app->GetService<JGlobalRootLock>();

    /// Set parameters to control which JFactories you use
    app->SetDefaultParameter("tracking_alg", m_tracking_alg);

    /// Set up histograms
    m_lock->acquire_write_lock();
    
    if( dest_file == nullptr ){
        dest_file = new TFile("FirebirdActsJanaProcessor.root", "recreate");  /// TODO: Acquire dest_file via either a JService or a JParameter
    }
    dest_dir = dest_file->mkdir("FirebirdActsJana"); // Create a subdir inside dest_file for these results
    h1d_pt_reco = new TH1D("pt_reco", "reco pt", 100,0,10);
    h1d_pt_reco->SetDirectory(dest_dir);
    m_lock->release_lock();
}

void FirebirdActsJanaProcessor::Process(const std::shared_ptr<const JEvent>& event) {

    /// Acquire any results you need for your analysis
    //auto reco_tracks = event->Get<RecoTrack>(m_tracking_alg);

    m_lock->acquire_write_lock();
    /// Inside the global root lock, update histograms
    // for (auto reco_track : reco_tracks) {
    //    h1d_pt_reco->Fill(reco_track->p.Pt());
    // }
    m_lock->release_lock();
}

void FirebirdActsJanaProcessor::Finish() {
    // TODO: If we did not create this file then we should not delete it
    dest_file->Write();
    delete dest_file;
    dest_file = nullptr;
};

