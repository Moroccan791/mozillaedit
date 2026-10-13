import json, os
proj_path = r'projects\YTDown.com_YouTube_Media_2Ywo4r3D9DM_Ranked-but-it-s-a-1v9_002_720p\montage_6.json'
if os.path.exists(proj_path):
    proj = json.load(open(proj_path))
    print('Segments:', len(proj['segments']))
    print('Total duration:', proj.get('total_duration', 'N/A'))
    print('Vibe:', proj.get('vibe'))
    print('Captions mode:', proj.get('captions_mode'))
    for i, seg in enumerate(proj['segments'][:6]):
        s = seg.get('start', '?')
        e = seg.get('end', '?')
        lbl = seg.get('label', '?')
        print(f'  Segment {i}: {s}-{e} label={lbl}')
else:
    print('Project not found')