import type { Subgroup } from './groupAssignment'

export type VideoPlayerFeatures = {
  chapterMarkers: boolean
  chapterNavigation: boolean
  chapterLabels: boolean
  playbackSpeed: boolean
}

export type VideoPlayerContext = 'instruction' | 'control' | 'experimental'
export type ExperimentalSubgroup = Exclude<Subgroup, 'control'>

const SUBGROUP_PREVIEW_OVERRIDE: ExperimentalSubgroup = 'standard' // set to 'standard' for production

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

// SUBGROUP_PREVIEW_OVERRIDE initializes experimentalSubgroup
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
