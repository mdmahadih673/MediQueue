import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../lib/firebase';

const MAX_IMAGE_SIZE = 900;
const JPEG_QUALITY = 0.86;

const loadImage = (file: File): Promise<HTMLImageElement> => (
  new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = URL.createObjectURL(file);
  })
);

const resizeImage = async (file: File): Promise<Blob> => {
  const image = await loadImage(file);
  const scale = Math.min(1, MAX_IMAGE_SIZE / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) return file;

  context.drawImage(image, 0, 0, width, height);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob || file), 'image/jpeg', JPEG_QUALITY);
  });
};

export const uploadProfilePhoto = async (uid: string, file: File): Promise<string> => {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.');
  }

  const blob = await resizeImage(file);
  const photoRef = ref(storage, `profile-photos/${uid}/${Date.now()}.jpg`);
  await uploadBytes(photoRef, blob, {
    contentType: 'image/jpeg',
    customMetadata: {
      originalName: file.name,
    },
  });

  return getDownloadURL(photoRef);
};
