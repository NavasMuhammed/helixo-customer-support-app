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
  const [livePreviewImageData, setLivePreviewImageData] = useState<string | null>(null);


  const previewRef = useRef(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files && e.target.files[0];
    if (selectedImage) {
      setImage(URL.createObjectURL(selectedImage));
    }
  };
  const updateLivePreview = () => {
    if (image && photo) {
      const img1 = new Image();
      img1.src = image;

      const img2 = new Image();
      img2.src = photo;

      img1.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img1.width;
        canvas.height = img1.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          // Draw the background image
          ctx.drawImage(img1, 0, 0, canvas.width, canvas.height);

          // Draw the centered profile image
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          let offsetX = centerX - (img2.width / 2);
          let offsetY = centerY - (img2.height / 2);

          offsetX += (photoPositionX * canvas.width) / imageWidth;
          offsetY += (photoPositionY * canvas.height) / canvas.height;

          // Draw the photo multiple times with different shadow settings
          for (let angle = 0; angle < 360; angle += 45) {
            const radians = (angle * Math.PI) / 180;
            const shadowOffsetX = Math.cos(radians) * 10; // Adjust the radius as needed
            const shadowOffsetY = Math.sin(radians) * 10; // Adjust the radius as needed

            ctx.shadowColor = '#fff'; // Set shadow color and opacity
            ctx.shadowBlur = 0; // Set shadow blur level
            ctx.shadowOffsetX = shadowOffsetX; // Set horizontal shadow offset based on angle
            ctx.shadowOffsetY = shadowOffsetY; // Set vertical shadow offset based on angle

            // Draw the photo with the current shadow settings
            ctx.drawImage(img2, offsetX, offsetY, img2.width, img2.height);
          }

          const livePreviewDataUrl = canvas.toDataURL('image/png');
          setLivePreviewImageData(livePreviewDataUrl);
        }
      };
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
        canvas.width = img1.width;
        canvas.height = img1.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          // Draw the background image
          ctx.drawImage(img1, 0, 0, canvas.width, canvas.height);

          // Draw the centered profile image
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          let offsetX = centerX - (img2.width / 2);
          let offsetY = centerY - (img2.height / 2);

          offsetX += (photoPositionX * canvas.width) / imageWidth;
          offsetY += (photoPositionY * canvas.height) / canvas.height;

          // Draw the photo multiple times with different shadow settings
          for (let angle = 0; angle < 360; angle += 45) {
            const radians = (angle * Math.PI) / 180;
            const shadowOffsetX = Math.cos(radians) * 10; // Adjust the radius as needed
            const shadowOffsetY = Math.sin(radians) * 10; // Adjust the radius as needed

            ctx.shadowColor = '#fff'; // Set shadow color and opacity
            ctx.shadowBlur = 0; // Set shadow blur level
            ctx.shadowOffsetX = shadowOffsetX; // Set horizontal shadow offset based on angle
            ctx.shadowOffsetY = shadowOffsetY; // Set vertical shadow offset based on angle

            // Draw the photo with the current shadow settings
            ctx.drawImage(img2, offsetX, offsetY, img2.width, img2.height);
          }

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
                updateLivePreview();
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
                updateLivePreview();
                console.log(Number(e.target.value))
              }}
            />
          </div>

          <button onClick={handleDownloadImage}>Download Merged Image</button>
        </div>
      )}

      <div id="preview" ref={previewRef}>
        {image && photo && (
          <div>
            <p>Real-time Preview:</p>
            {livePreviewImageData && (
              <img src={livePreviewImageData} alt="Live Preview Image" style={{ maxWidth: '100%' }} />
            )}
          </div>
        )}
      </div>

    </main>
  );
}
