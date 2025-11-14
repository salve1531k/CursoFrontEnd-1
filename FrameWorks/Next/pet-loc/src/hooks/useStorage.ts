import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export function useStorage() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, path: string): Promise<string> => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      setProgress(100);
      return downloadURL;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (path: string) => {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const uploadMultipleFiles = async (files: File[], basePath: string): Promise<string[]> => {
    const urls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const path = `${basePath}/${Date.now()}_${file.name}`;
      const url = await uploadFile(file, path);
      urls.push(url);
      setProgress(((i + 1) / files.length) * 100);
    }

    return urls;
  };

  return {
    uploadFile,
    deleteFile,
    uploadMultipleFiles,
    uploading,
    progress,
    error
  };
}
