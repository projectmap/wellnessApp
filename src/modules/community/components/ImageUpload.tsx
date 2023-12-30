import Image from 'next/image';
import React, { useState, useEffect } from 'react';

const UploadAndDisplayImage = () => {
  const [images, setImages] = useState([] as any);
  const [imageURLS, setImageURLs] = useState([]);
  useEffect(() => {
    if (images.length < 1) return;
    const newImageUrls: any = [];
    images?.forEach((image: any) => newImageUrls.push(URL.createObjectURL(image)));
    setImageURLs(newImageUrls);
  }, [images]);

  function onImageChange(e: any) {
    setImages([...e.target.files]);
  }

  return (
    <>
      <input type="file" multiple accept="image/*" onChange={onImageChange} />
      {imageURLS.map((imageSrc, i) => (
        <Image src={imageSrc} layout="fill" alt="i" key={i} />
      ))}
    </>
  );
};

export default UploadAndDisplayImage;
