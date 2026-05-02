import {
  findClosestThumbnailEntry,
  type ThumbnailEntry,
  type ThumbnailMetadata,
} from "../server/thumbnails/metadata";

export type ThumbnailPreviewMetadata = ThumbnailMetadata;

export type ThumbnailPreviewState =
  | { visible: false }
  | ({
      visible: true;
      imageUrl: string;
    } & ThumbnailEntry);

export function getThumbnailPreviewState(
  metadata: ThumbnailPreviewMetadata | null,
  hoverPercentage: number,
  rangeStart: number,
  rangeEnd: number,
): ThumbnailPreviewState {
  if (!metadata || metadata.entries.length === 0 || rangeEnd <= rangeStart) {
    return { visible: false };
  }

  const safePercentage = Math.min(100, Math.max(0, hoverPercentage));
  const targetTimeSeconds =
    rangeStart + ((rangeEnd - rangeStart) * safePercentage) / 100;
  const entry = findClosestThumbnailEntry(metadata.entries, targetTimeSeconds);

  if (!entry) {
    return { visible: false };
  }

  return {
    visible: true,
    imageUrl: metadata.imageUrl,
    ...entry,
  };
}

export async function loadThumbnailMetadata(
  fetchFn: typeof fetch,
  metadataUrl = "/dash/thumbnails/metadata.json",
): Promise<ThumbnailPreviewMetadata | null> {
  const response = await fetchFn(metadataUrl);

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as ThumbnailPreviewMetadata;
}
