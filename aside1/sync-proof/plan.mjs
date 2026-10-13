// Pure timing planner. No AI, media processing, retiming or side effects.
// All timestamps are seconds. Inputs are reviewed source/audio anchors.
export function buildProof(c) {
  const num = (v, name, min = 0) => {
    if (typeof v !== 'number' || !Number.isFinite(v) || v < min)
      throw new Error(`${name} must be a finite number >= ${min}`);
    return v;
  };
  const round = v => Math.round(v * 1e6) / 1e6;
  if (!c || typeof c !== 'object') throw new Error('Configuration required');
  for (const key of ['source', 'music'])
    if (typeof c[key] !== 'string' || !c[key].trim()) throw new Error(`${key} path required`);
  const duration = num(c.duration, 'duration', 0.1);
  if (duration > 12) throw new Error('This proof is limited to 12 seconds');
  const sourceDuration = num(c.source_duration, 'source_duration', 0.1);
  const musicDuration = num(c.music_duration, 'music_duration', 0.1);
  const musicStart = num(c.music_start ?? 0, 'music_start');
  const fps = num(c.fps ?? 60, 'fps', 1);
  if (!Number.isInteger(fps) || fps > 120) throw new Error('fps must be an integer <=120');
  if (musicStart + duration > musicDuration + 1e-6) throw new Error('Music excerpt exceeds file duration');
  const margin = num(c.minimum_context ?? 0.25, 'minimum_context');
  if (!Array.isArray(c.anchors) || !c.anchors.length) throw new Error('Confirmed anchors required');
  const segments = [], events = [];
  let outputStart = 0;
  for (let i = 0; i < c.anchors.length; i++) {
    const a = c.anchors[i];
    if (!a || typeof a !== 'object') throw new Error(`Anchor ${i + 1} required`);
    const outputEnd = num(a.output_end, `anchor ${i + 1} output_end`);
    const outputEvent = num(a.output_event, `anchor ${i + 1} output_event`);
    const sourceEvent = num(
      a.source_audio_event ?? a.source_event,
      `anchor ${i + 1} source_audio_event`,
    );
    const sourceVisualEvent = num(
      a.source_visual_event ?? sourceEvent,
      `anchor ${i + 1} source_visual_event`,
    );
    if (outputEnd <= outputStart || outputEnd > duration + 1e-6) throw new Error('Slot boundaries must increase within duration');
    if (outputEvent - outputStart < margin || outputEnd - outputEvent < margin)
      throw new Error(`Anchor ${i + 1} needs context before and after its event`);
    const sourceStart = sourceEvent - (outputEvent - outputStart);
    const sourceEnd = sourceStart + (outputEnd - outputStart);
    if (sourceStart < -1e-6 || sourceEnd > sourceDuration + 1e-6) throw new Error(`Anchor ${i + 1} exceeds source bounds`);
    if (sourceVisualEvent < sourceStart - 1e-6 || sourceVisualEvent > sourceEnd + 1e-6)
      throw new Error(`Anchor ${i + 1} visual event falls outside its source window`);
    if (segments.some(s => sourceStart < s.end - 1e-6 && sourceEnd > s.start + 1e-6))
      throw new Error('Selected source intervals overlap or repeat; choose different moments');
    const seg = {start: round(Math.max(0, sourceStart)), end: round(sourceEnd), speed: 1,
      label: `confirmed-event-${i + 1}`, motion: 'none', flash: false,
      ramp_in: 0, ramp_out: 0, ramp_hold: 0};
    const predictedAudio = outputStart + sourceEvent - seg.start;
    const predictedVisual = outputStart + sourceVisualEvent - seg.start;
    const error = predictedAudio - outputEvent;
    if (Math.abs(error) > 1e-5) throw new Error('Audio-anchor timing invariant failed');
    segments.push(seg);
    events.push({id: i + 1, source_event: sourceEvent,
      source_audio_event: sourceEvent, source_visual_event: sourceVisualEvent,
      output_event: outputEvent, predicted_audio_event: round(predictedAudio),
      predicted_visual_event: round(predictedVisual),
      music_event: round(musicStart + outputEvent),
      output_start: round(outputStart), output_end: outputEnd,
      planning_error_ms: round(error * 1000),
      visual_audio_offset_ms: round((sourceVisualEvent - sourceEvent) * 1000),
      confirmation: c.confirmation_source || 'reviewed source anchors; method not verified by planner'});
    outputStart = outputEnd;
  }
  if (Math.abs(outputStart - duration) > 1e-6) throw new Error('Last output_end must equal duration');

  const rawMarkers = c.music_cut_markers ?? [];
  if (!Array.isArray(rawMarkers)) throw new Error('music_cut_markers must be an array');
  const musicMarkers = rawMarkers.map((t, i) => num(t, `music_cut_markers[${i}]`));
  if (musicMarkers.some(t => t < musicStart - 1e-6 || t > musicStart + duration + 1e-6))
    throw new Error('A cut marker falls outside the selected music excerpt');
  for (let i = 1; i < musicMarkers.length; i++)
    if (musicMarkers[i] <= musicMarkers[i - 1]) throw new Error('Cut markers must increase');
  const cutMarkers = [
    {music_t: round(musicStart), output_t: 0, kind: 'excerpt_start'},
    ...musicMarkers.map(t => ({music_t: round(t),
      output_t: round(t - musicStart), kind: 'half_beat'})),
    {music_t: round(musicStart + duration), output_t: duration, kind: 'excerpt_end'},
  ].filter((m, i, all) => i === 0 || Math.abs(m.output_t - all[i - 1].output_t) > 1e-6);
  const maxGap = num(c.max_cut_gap ?? 0.5, 'max_cut_gap', 0.1);
  if (musicMarkers.length && cutMarkers.some((m, i) =>
      i > 0 && m.output_t - cutMarkers[i - 1].output_t > maxGap + 1e-6))
    throw new Error('Cut marker grid does not cover the full excerpt continuously');
  const maxAccentError = num(c.max_accent_grid_error ?? 0.05,
    'max_accent_grid_error', 0);
  if (musicMarkers.length) {
    for (const event of events) {
      const nearest = Math.min(...musicMarkers.map(t => Math.abs(t - event.music_event)));
      if (nearest > maxAccentError + 1e-6)
        throw new Error(`Event ${event.id} accent is too far from the half-beat grid`);
    }
    for (let i = 0; i < c.anchors.length - 1; i++) {
      const cutMusicT = musicStart + c.anchors[i].output_end;
      const nearest = Math.min(...musicMarkers.map(t => Math.abs(t - cutMusicT)));
      if (nearest > maxAccentError + 1e-6)
        throw new Error(`Anchor ${i + 1} cut does not map to the half-beat grid`);
    }
  }
  return {
    project: {name: 'aside_sync_proof', source: c.source, music: c.music, music_start: musicStart,
      music_gain_db: -6, target_lufs: -14, platform: 'youtube', aspect: 'source', fps,
      grade: 'none', vibe: 'clean', transition: {}, audio_mode: 'mix', sfx: false,
      captions_mode: 'off', title: {enabled: false}, outro: {enabled: false}, overlays: [], segments},
    timing: {status: 'planned only; rendered audio/visual sync not verified',
      duration, fps, frame_ms: round(1000 / fps),
      rules: ['1x speed', 'no crossfades', 'no ramps', 'no visual effects',
        'audio transient anchored to onset', 'continuous half-beat cut-marker grid'],
      cut_markers: cutMarkers, events}
  };
}
