import type { Subgroup } from './groupAssignment'

export type VideoPlayerFeatures = {
  /* Segment the progress bar at the chapter timestamps. */
  chapterMarkers: boolean
  /* Clicking a segment jumps to the start of that chapter. */
  chapterNavigation: boolean
  chapterLabels: boolean
  playbackSpeed: boolean
}

/* Where a player is embedded. Only 'experimental' is ever enhanced. */
export type VideoPlayerContext = 'instruction' | 'control' | 'experimental'

export type ExperimentalSubgroup = Exclude<Subgroup, 'control'>

/*
  Preview switch for development. Set to 'enhanced-player' to see the enhanced
  player on the experimental-group pages without a backend subgroup assignment.
  Must be 'standard' when the study runs.
*/
const SUBGROUP_PREVIEW_OVERRIDE: ExperimentalSubgroup = 'standard' // set to 'standard' for production, or 'enhanced-player' for development preview

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

export function setStudySubgroup(subgroup: Subgroup): void {
  setExperimentalSubgroup(subgroup === 'control' ? 'standard' : subgroup)
}

export function resetStudySubgroup(): void {
  setExperimentalSubgroup(SUBGROUP_PREVIEW_OVERRIDE)
}

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
