'use client';
import styles from './page.module.css';
import { ChangeEvent, useState } from 'react';
import html2canvas from 'html2canvas';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  // const [imageWidth, setImageWidth] = useState(600);
  const [imageWidth, setImageWidth] = useState(600);


  const [photoPositionX, setPhotoPositionX] = useState(150);
  const [photoPositionY, setPhotoPositionY] = useState(150); // Set initial Y position to 250 for center bottom
  const [photoWidth, setPhotoWidth] = useState(300);
  // const [bgHeight, setBgHeight] = useState(300);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files && e.target.files[0];
    debugger
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

        canvas.width = imageWidth; // Set the desired canvas width
        canvas.height = canvas.width * (img1.height / img1.width);


        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(img1, 0, 0, canvas.width, canvas.height); // Adjust the size of the first image while maintaining the aspect ratio
          ctx.drawImage(img2, photoPositionX, photoPositionY, 0, 0); // Adjust the position and size of the second image

          const a = document.createElement('a');
          // Convert the preview content to an image using html2canvas
          const previewElement = document.getElementById('preview') as HTMLElement;

          html2canvas(previewElement).then((canvas) => {
            a.href = canvas.toDataURL('image/png');
            a.download = 'merged_image.png';
            a.click();
          });
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
              max="500"
              value={photoPositionX}
              onChange={(e) => setPhotoPositionX(Number(e.target.value))}
            />
          </div>
          <div>
            <label>Photo Position Y:</label>
            <input
              type="range"
              min="0"
              max="500"
              value={photoPositionY}
              onChange={(e) => setPhotoPositionY(Number(e.target.value))}
            />
          </div>
          <div>
            <label>Photo Size:</label>
            <input
              type="range"
              min="50"
              max="800"
              value={photoWidth}
              onChange={(e) => setPhotoWidth(Number(e.target.value))}
            />
          </div>
          <div>
            <label>Background Size:</label>
            <input
              type="range"
              min="50"
              max="800"
              value={imageWidth}
              onChange={(e) => setImageWidth(Number(e.target.value))}
            />
          </div>
          <button onClick={handleDownloadImage}>Download Merged Image</button>
        </div>
      )}
      <div id='preview'  >
        {image && photo && (
          <div style={{ position: 'relative', objectFit: 'cover' }}>
            <img
              className={styles.backgroundImage}
              src={image}
              alt="Selected Image"
              style={{ width: `${imageWidth}px`, objectFit: 'cover' }}
            />
            <img
              className={styles.centeredImage}
              src={photo}
              alt="Selected Image"
              style={{
                filter: 'drop-shadow(10px 10px 1px rgb(249, 255, 249))',
                top: `${photoPositionY}px`,
                left: `${photoPositionX}px`,
                width: `${photoWidth}px`,
                // height: `${bgHeight}px`,
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}
