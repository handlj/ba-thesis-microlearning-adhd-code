/*
  Which optional features the video player exposes, per place it is used.

  The base player — play/pause, scrubbing, volume, fullscreen — is identical
  everywhere in the study, so the two current arms watch their videos under the
  same conditions and the interaction measures stay comparable.

  Everything below is reserved for a subgroup of the experimental group that
  does not exist yet: chapter markers in the progress bar, jumping to a chapter,
  the current-chapter label, and the playback speed menu. They are implemented
  and switched off, so adding the subgroup later is a change to this file alone
  and touches neither the player nor the pages that embed it.
*/

export type VideoPlayerFeatures = {
  /* Segment the progress bar at the chapter timestamps. */
  chapterMarkers: boolean
  /* Clicking a segment jumps to the start of that chapter. */
  chapterNavigation: boolean
  /* Name the chapter under the progress bar, and in the scrubber tooltip. */
  chapterLabels: boolean
  /* Offer the playback speed menu. */
  playbackSpeed: boolean
}

/* Where a player is embedded. Only 'experimental' is ever enhanced. */
export type VideoPlayerContext = 'instruction' | 'control' | 'experimental'

/*
  The experimental group's video-player subgroup.

  'standard' is every participant today. 'enhanced-player' is the planned
  subgroup; when the backend starts assigning it, report it through
  setExperimentalSubgroup() and nothing else needs to change.
*/
export type ExperimentalSubgroup = 'standard' | 'enhanced-player'

/*
  Preview switch for development. Set to 'enhanced-player' to see the enhanced
  player on the experimental-group pages without a backend subgroup assignment.
  Must be 'standard' when the study runs.
*/
const SUBGROUP_PREVIEW_OVERRIDE: ExperimentalSubgroup = 'standard'

const BASE_FEATURES: VideoPlayerFeatures = {
  chapterMarkers: false,
  chapterNavigation: false,
  chapterLabels: false,
  playbackSpeed: false,
}

const ENHANCED_FEATURES: VideoPlayerFeatures = {
  chapterMarkers: true,
  chapterNavigation: true,
  chapterLabels: true,
  playbackSpeed: true,
}

/*
  Set once per session, the way the app config is (see utils/config.ts). Stays
  'standard' until the backend reports a subgroup with the group assignment.
*/
let experimentalSubgroup: ExperimentalSubgroup = SUBGROUP_PREVIEW_OVERRIDE

export function setExperimentalSubgroup(subgroup: ExperimentalSubgroup): void {
  experimentalSubgroup = subgroup
}

export function getExperimentalSubgroup(): ExperimentalSubgroup {
  return experimentalSubgroup
}

export function getVideoPlayerFeatures(context: VideoPlayerContext): VideoPlayerFeatures {
  if (context === 'experimental' && experimentalSubgroup === 'enhanced-player') {
    return ENHANCED_FEATURES
  }

  return BASE_FEATURES
}
