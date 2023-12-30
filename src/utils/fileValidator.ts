export const allowedExtensions = ['jpg', 'jpeg', 'png'];

export const checkIfFileContainsOtherThanImage = (extension: string) => {
  return !allowedExtensions.includes(extension);
};

export const getImageExtensionFileOnlyAndCheckIfFileisOtherThanImage = (fileList: File[]) => {
  const filteredFile = [];
  let containsInvalidFormatFile = false;
  for (const file of fileList) {
    const extension = file?.name?.split('.')?.pop()?.toLowerCase();
    if (extension && checkIfFileContainsOtherThanImage(extension)) {
      containsInvalidFormatFile = true;
    } else {
      filteredFile.push(file);
    }
  }

  return { filteredFile, containsInvalidFormatFile };
};
