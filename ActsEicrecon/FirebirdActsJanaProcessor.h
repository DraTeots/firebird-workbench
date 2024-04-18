
#include <JANA/JEventProcessor.h>
#include <JANA/Services/JGlobalRootLock.h>
#include <TH1D.h>
#include <TFile.h>

class FirebirdActsJanaProcessor: public JEventProcessor {

private:
    std::string m_tracking_alg = "genfit";
    std::shared_ptr<JGlobalRootLock> m_lock;
    TH1D* h1d_pt_reco = nullptr;
    TDirectory* dest_file = nullptr;
    TDirectory* dest_dir=nullptr; // Virtual subfolder inside dest_file used for this specific processor

public:
    FirebirdActsJanaProcessor();
    
    void Init() override;

    void Process(const std::shared_ptr<const JEvent>& event) override;

    void Finish() override;
};

