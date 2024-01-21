'use client';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  // const [image, setImage] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [imageWidth, setImageWidth] = useState(600);
  const [photoPositionX, setPhotoPositionX] = useState(0);
  const [photoScaleFactor, setPhotoScaleFactor] = useState(0);
  const [photoPositionY, setPhotoPositionY] = useState(0);
  const [livePreviewImageData, setLivePreviewImageData] = useState<string | null>(null);

  useEffect(() => {
    if (photo) {
      const img = new Image();
      img.src = photo;
      img.onload = () => {
        setImageWidth(img.width);
        updateLivePreview();
      };
    }
  }, [photo,]);


  const previewRef = useRef(null);

  // const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const selectedImage = e.target.files && e.target.files[0];
  //   if (selectedImage) {
  //     setImage(URL.createObjectURL(selectedImage));
  //   }
  // };
  const updateLivePreview = () => {
    if (photo) {
      const img1 = new Image();
      img1.src = 'assets/brand-bg.png';

      const img2 = new Image();
      img2.src = photo;

      img1.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img1.width;
        canvas.height = img1.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          let scaleFactorImg2 = Math.min(img1.width / img2.width + (photoScaleFactor * .01), img1.height / img2.height + (photoScaleFactor * .01));
          // Draw the background image
          ctx.drawImage(img1, 0, 0, canvas.width, canvas.height);

          // Draw the centered profile image
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          // let offsetX = centerX - (img1.width / 2);
          // let offsetY = centerY - (img1.height / 2);
          // offsetY += (photoPositionY * canvas.height) / canvas.height;
          // offsetX += (photoPositionX * canvas.width) / imageWidth;

          let yImg2 = (img1.height - img2.height * scaleFactorImg2) / 2;
          let xImg2 = (img1.width - img2.width * scaleFactorImg2) / 2;

          // Draw the photo multiple times with different shadow settings
          for (let angle = 0; angle < 360; angle += 45) {
            const radians = (angle * Math.PI) / 180;
            const shadowOffsetX = Math.cos(radians) * 10; // Adjust the radius as needed
            const shadowOffsetY = Math.sin(radians) * 10; // Adjust the radius as needed

            ctx.shadowColor = '#fff'; // Set shadow color and opacity
            ctx.shadowBlur = 0; // Set shadow blur level
            ctx.shadowOffsetX = shadowOffsetX; // Set horizontal shadow offset based on angle
            ctx.shadowOffsetY = shadowOffsetY; // Set vertical shadow offset based on angle


            // Draw the photo with the current shadow settings and photo width shoud be 100%
            ctx.drawImage(img2, 0, -10, img2.width, img2.height, 0 + photoPositionX, 0 + photoPositionY, img2.width * scaleFactorImg2, img2.height * scaleFactorImg2);

          }

          const livePreviewDataUrl = canvas.toDataURL('image/png');
          setLivePreviewImageData(livePreviewDataUrl);
        }
      };
    }
  };



  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files && e.target.files[0];
    if (selectedImage) {
      setPhoto(URL.createObjectURL(selectedImage));
    }
  };


  const handleDownloadImage = () => {
    if (photo) {
      const img1 = new Image();
      img1.src = 'assets/brand-bg.png';

      const img2 = new Image();
      img2.src = photo;

      img1.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img1.width;
        canvas.height = img1.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          let scaleFactorImg2 = Math.min(img1.width / img2.width + (photoScaleFactor * .01), img1.height / img2.height + (photoScaleFactor * .01));
          // Draw the background image
          ctx.drawImage(img1, 0, 0, canvas.width, canvas.height);

          // Draw the centered profile image
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          // let offsetX = centerX - (img1.width / 2);
          // let offsetY = centerY - (img1.height / 2);
          // offsetY += (photoPositionY * canvas.height) / canvas.height;
          // offsetX += (photoPositionX * canvas.width) / imageWidth;

          let yImg2 = (img1.height - img2.height * scaleFactorImg2) / 2;
          let xImg2 = (img1.width - img2.width * scaleFactorImg2) / 2;

          // Draw the photo multiple times with different shadow settings
          for (let angle = 0; angle < 360; angle += 45) {
            const radians = (angle * Math.PI) / 180;
            const shadowOffsetX = Math.cos(radians) * 10; // Adjust the radius as needed
            const shadowOffsetY = Math.sin(radians) * 10; // Adjust the radius as needed

            ctx.shadowColor = '#fff'; // Set shadow color and opacity
            ctx.shadowBlur = 0; // Set shadow blur level
            ctx.shadowOffsetX = shadowOffsetX; // Set horizontal shadow offset based on angle
            ctx.shadowOffsetY = shadowOffsetY; // Set vertical shadow offset based on angle



            // Draw the photo with the current shadow settings and photo width shoud be 100%
            ctx.drawImage(img2, 0, 0, img2.width, img2.height, 0 + photoPositionX, 0 + photoPositionY, img2.width * scaleFactorImg2, img2.height * scaleFactorImg2);

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
          {photo && <img className={styles.inputImage} src={photo} alt="Selected Image" />}
          <label htmlFor="image">Select a photo</label>
          <input id="image" type="file" accept="image/*" onChange={handlePhotoChange} />
        </div>
        <div id="preview" ref={previewRef}>
          {photo && (
            <div>
              <p>Real-time Preview:</p>
              {livePreviewImageData && (
                <img src={livePreviewImageData} alt="Live Preview Image" style={{ maxWidth: '100%' }} />
              )}
            </div>
          )}
        </div>
      </div>
      {photo && (
        <div className={styles.controllers}>
          <div>
            <label>Photo Position X:</label>
            <input
              type="range"
              min="-200"
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
              min="-300"
              max={imageWidth}
              value={photoPositionY}
              onChange={(e) => {
                setPhotoPositionY(Number(e.target.value))
                updateLivePreview();
                console.log(Number(e.target.value))
              }}
            />
          </div>
          <div>
            <label>Photo scale:</label>
            <input
              type="range"
              min="-300"
              max="562"
              value={photoScaleFactor}
              onChange={(e) => {
                setPhotoScaleFactor(Number(e.target.value))
                updateLivePreview();
                console.log(Number(e.target.value))
              }}
            />
          </div>

          <button onClick={handleDownloadImage}>Download Merged Image</button>
        </div>
      )}



    </main>
  );
}
