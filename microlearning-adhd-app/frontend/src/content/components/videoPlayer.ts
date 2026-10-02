export const videoPlayerCopy = {
  unsupported: 'Ihr Browser unterstützt das Video-Element nicht.',
  speedOption: (rate: number) => `${rate.toString().replace('.', ',')}×`,
  normalSpeedSuffix: 'Normal',
  chapter: 'Kapitel',
} as const
