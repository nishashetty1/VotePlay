export const validateImageFile = (file) => {
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File size should be less than 5MB");
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Please upload a valid image file (JPG, PNG, or WebP)");
  }

  return true;
};

export const createFormData = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return formData;
};