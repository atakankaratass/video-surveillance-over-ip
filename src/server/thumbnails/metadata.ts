export interface ThumbnailEntry {
  timeSeconds: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ThumbnailMetadata {
  imageUrl: string;
  entries: ThumbnailEntry[];
}

export interface BuildSpriteMetadataOptions {
  imageUrl: string;
  frameWidth: number;
  frameHeight: number;
  entryTimesSeconds: number[];
}

export function buildSpriteMetadata(
  options: BuildSpriteMetadataOptions,
): ThumbnailMetadata {
  return {
    imageUrl: options.imageUrl,
    entries: options.entryTimesSeconds.map((timeSeconds, index) => ({
      timeSeconds,
      x: index * options.frameWidth,
      y: 0,
      width: options.frameWidth,
      height: options.frameHeight,
    })),
  };
}

export function findClosestThumbnailEntry(
  entries: ThumbnailEntry[],
  targetTimeSeconds: number,
): ThumbnailEntry | null {
  if (entries.length === 0) {
    return null;
  }

  let closestEntry = entries[0] ?? null;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const entry of entries) {
    const distance = Math.abs(entry.timeSeconds - targetTimeSeconds);

    if (distance < closestDistance) {
      closestEntry = entry;
      closestDistance = distance;
    }
  }

  return closestEntry;
}
