'use client';
import styles from './page.module.css';
import { ChangeEvent, useState } from 'react';
import html2canvas from 'html2canvas';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [bg, setBg] = useState<string | null>(null);

  const [imageWidth, setImageWidth] = useState(600);
  // const [imageHeight, setImageHeight] = useState(500);

  const [bgPositionX, setBgPositionX] = useState(250);
  const [bgPositionY, setBgPositionY] = useState(350); // Set initial Y position to 250 for center bottom
  const [bgWidth, setBgWidth] = useState(300);
  // const [bgHeight, setBgHeight] = useState(300);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files && e.target.files[0];
    if (selectedImage) {
      setImage(URL.createObjectURL(selectedImage));
    }
  };

  const handleBgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files && e.target.files[0];
    if (selectedImage) {
      setBg(URL.createObjectURL(selectedImage));
    }
  };

  const handleDownloadImage = () => {
    if (image && bg) {
      const img1 = new Image();
      img1.src = image;

      const img2 = new Image();
      img2.src = bg;

      img1.onload = () => {
        const canvas = document.createElement('canvas');
      
        // const aspectRatio = img1.width / img1.height;
        // const desiredWidth = imageWidth; // Your desired canvas width
      
        canvas.width = 500;
        canvas.height = 500;
      
        const ctx = canvas.getContext('2d');
      
        if (ctx) {
          ctx.drawImage(img1, 0, 0, imageWidth, 0); // Adjust the size of the first image while maintaining the aspect ratio
          ctx.drawImage(img2, bgPositionX, bgPositionY, bgWidth, 0); // Adjust the position and size of the second image
      
          const a = document.createElement('a');
          // Convert the preview content to an image using html2canvas
          const previewElement = document.querySelector(`.${styles.preview}`) as HTMLElement;
          
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
          <label htmlFor="bg">Select a background image</label>
          <input id="bg" type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div>
          {bg && <img className={styles.inputImage} src={bg} alt="Selected Image" />}
          <label htmlFor="image">Select a photo</label>
          <input id="image" type="file" accept="image/*" onChange={handleBgChange} />
        </div>
      </div>
      {image && bg && (
        <div className={styles.controllers}>
          <div>
            <label>Photo Position X:</label>
            <input
              type="range"
              min="0"
              max="500"
              value={bgPositionX}
              onChange={(e) => setBgPositionX(Number(e.target.value))}
            />
          </div>
          <div>
            <label>Photo Position Y:</label>
            <input
              type="range"
              min="0"
              max="500"
              value={bgPositionY}
              onChange={(e) => setBgPositionY(Number(e.target.value))}
            />
          </div>
          <div>
            <label>Photo Size:</label>
            <input
              type="range"
              min="50"
              max="800"
              value={bgWidth}
              onChange={(e) => setBgWidth(Number(e.target.value))}
            />
          </div>
          <button onClick={handleDownloadImage}>Download Merged Image</button>
        </div>
      )}
      <div className={styles.preview}>
        {image && bg && (
          <div style={{ position: 'relative', width: '500px', height: '500px',objectFit:'cover' }}>
            <img
              className={styles.backgroundImage}
              src={image}
              alt="Selected Image"
              style={{ width: '100%', height: '100%',objectFit:'cover' }}
            />
            <img
              className={styles.centeredImage}
              src={bg}
              alt="Selected Image"
              style={{
                filter: 'drop-shadow(10px 10px 1px rgb(249, 255, 249))',
                top: `${bgPositionY}px`,
                left: `${bgPositionX}px`,
                width: `${bgWidth}px`,
                // height: `${bgHeight}px`,
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}
