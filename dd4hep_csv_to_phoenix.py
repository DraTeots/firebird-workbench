# Grouping data by run_number, event_number, and track_id to aggregate points for each track
grouped = data.groupby(['run_number', 'event_number', 'track_id'])

# Preparing a new JSON structure to accommodate the changes
event_data_updated = {}

for (run_number, event_number, track_id), group in grouped:
    # Creating an event key if it doesn't exist
    event_key = f"Run{run_number}_Event{event_number}"
    if event_key not in event_data_updated:
        event_data_updated[event_key] = {
            "event number": event_number,
            "run number": run_number,
            "Tracks": {"TestTracks": []}
        }

    # Aggregating all points for the current track
    track_points = group[['point_x', 'point_y', 'point_z']].values.tolist()

    # Building the track object
    track = {
        "pos": track_points,
        "dparams": [0.0, 0.0, group['particle_pdg_code'].iloc[0], 1.5, group['particle_charge'].iloc[0]],
        "color": "0xFFFFFF",  # Placeholder value, adjust as needed
        "chi2": 0.0,
        "dof": 0.0,
        "label": f"{group['particle_pdg_code'].iloc[0]}/{group['particle_charge'].iloc[0]}"
    }

    # Adding the track to the event's collection
    event_data_updated[event_key]["Tracks"]["TestTracks"].append(track)

# Show a small part of the updated structure for verification
str(event_data_updated)[:500]