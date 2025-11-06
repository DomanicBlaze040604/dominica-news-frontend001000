import apiClient from './client';

export const uploadsApi = {
  // Upload a file
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post('/api/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }) as Promise<{ success: boolean; url: string }>;
  },

  // Upload multiple files
  uploadMultiple: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    return apiClient.post('/api/uploads/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }) as Promise<{ success: boolean; urls: string[] }>;
  },
};

export default uploadsApi;
