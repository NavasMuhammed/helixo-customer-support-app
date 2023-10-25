'use client';


import styles from './page.module.css';
import { ChangeEvent, useState, useRef } from 'react';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [imageWidth, setImageWidth] = useState(600);
  const [photoPositionX, setPhotoPositionX] = useState(0);
  const [photoPositionY, setPhotoPositionY] = useState(0);
  const [photoWidth, setPhotoWidth] = useState(300);

  const previewRef = useRef(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files && e.target.files[0];
    if (selectedImage) {
      setImage(URL.createObjectURL(selectedImage));
    }
  };

  const handleBgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files && e.target.files[0];
    if (selectedImage) {
      setPhoto(URL.createObjectURL(selectedImage));
    }
  };

  const handleDownloadImage = () => {
    if (image && photo) {
      const img1 = new Image();
      img1.src = image;

      const img2 = new Image();
      img2.src = photo;

      img1.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1000;
        canvas.height = 562;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(img1, 0, 0, canvas.width, canvas.height);

          // Calculate the position and size for the shadowed image
          const scaledPhotoWidth = (photoWidth * canvas.width) / imageWidth;
          const scaledPhotoHeight = (img2.height * scaledPhotoWidth) / img2.width;
          const scaledPhotoX = (photoPositionX * canvas.width) / imageWidth;
          const scaledPhotoY = (photoPositionY * canvas.height) / canvas.height;

          // Apply the shadow effect to the shadowed image
          ctx.shadowColor = 'white';
          ctx.shadowBlur = 20;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          // Draw the shadowed image onto the canvas
          ctx.drawImage(img2, scaledPhotoX, scaledPhotoY, scaledPhotoWidth, scaledPhotoHeight);

          // ctx.drawImage(img2, photoPositionX, photoPositionY, 0, 0);
          // ctx.drawImage(img1, 0, 0, canvas.width, canvas.height); // Adjust the size of the first image while maintaining the aspect ratio

          const a = document.createElement('a');
          a.href = canvas.toDataURL('image/png');
          a.download = 'merged_image.png';
          a.click();
        }
      };
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.inputWindow}>
        <div>
          {image && <img className={styles.inputImage} src={image} alt="Selected Image" />}
          <label htmlFor="photo">Select a background image</label>
          <input id="photo" type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div>
          {photo && <img className={styles.inputImage} src={photo} alt="Selected Image" />}
          <label htmlFor="image">Select a photo</label>
          <input id="image" type="file" accept="image/*" onChange={handleBgChange} />
        </div>
      </div>
      {image && photo && (
        <div className={styles.controllers}>
          <div>
            <label>Photo Position X:</label>
            <input
              type="range"
              min="0"
              max={imageWidth}
              value={photoPositionX}
              onChange={(e) => {
                setPhotoPositionX(Number(e.target.value))
                console.log(Number(e.target.value))
              }}
            />
          </div>
          <div>
            <label>Photo Position Y:</label>
            <input
              type="range"
              min="0"
              max="562"
              value={photoPositionY}
              onChange={(e) => {
                setPhotoPositionY(Number(e.target.value))
                console.log(Number(e.target.value))
              }}
            />
          </div>
          <div>
            <label>Photo Size:</label>
            <input
              type="range"
              min="50"
              max={imageWidth}
              value={photoWidth}
              onChange={(e) => setPhotoWidth(Number(e.target.value))}
            />
          </div>
          <button onClick={handleDownloadImage}>Download Merged Image</button>
        </div>
      )}
      <div id="preview" ref={previewRef}>
        {image && photo && (
          <div style={{ position: 'relative', objectFit: 'cover', width: imageWidth + 'px' }}>
            <img
              className={styles.backgroundImage}
              src={image}
              alt="Selected Image"
              style={{ width: '100%' }}
            />
            <img
              className={styles.centeredImage}
              src={photo}
              alt="Selected Image"
              style={{
                top: `${photoPositionY}px`,
                left: `${photoPositionX}px`,
                width: `${photoWidth}px`,
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}
