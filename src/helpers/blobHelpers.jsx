import React from 'react';
import BlobImage from '../components/media/BlobImage';

export const VIEWER_WINDOW_NAME = 'viewer';

export const DERIVATIVE_THUMBNAIL = 'Thumbnail';
export const DERIVATIVE_SMALL = 'Small';
export const DERIVATIVE_MEDIUM = 'Medium';
export const DERIVATIVE_ORIGINAL_JPEG = 'OriginalJpeg';
export const DERIVATIVE_ORIGINAL = '';

export const getImageViewerPath = (config, imagePath) => {
  const {
    basename,
  } = config;

  return `${basename ? basename : ''}/view/${imagePath}`;
};

export const getDerivativePath = (csid, derivative) => {
  const derivativePath = derivative ? `/derivatives/${derivative}` : '';

  return `blobs/${csid}${derivativePath}/content`;
};

export const derivativeImage = (blobCsid, derivative) =>
  (blobCsid ? <BlobImage csid={blobCsid} derivative={derivative} /> : null);

export const thumbnailImage = blobCsid => derivativeImage(blobCsid, DERIVATIVE_THUMBNAIL);

export const smallImage = blobCsid => derivativeImage(blobCsid, DERIVATIVE_SMALL);

export const mediumImage = blobCsid => derivativeImage(blobCsid, DERIVATIVE_MEDIUM);

export const originalJpegImage = blobCsid => derivativeImage(blobCsid, DERIVATIVE_ORIGINAL_JPEG);

export const originalImage = blobCsid => derivativeImage(blobCsid, DERIVATIVE_ORIGINAL);
