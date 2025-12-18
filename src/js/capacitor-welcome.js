import { SplashScreen } from '@capacitor/splash-screen';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';

window.customElements.define(
  'capacitor-welcome',
  class extends HTMLElement {
    constructor() {
      super();

      SplashScreen.hide();

      const root = this.attachShadow({ mode: 'open' });

      root.innerHTML = `
    <style>
      :host {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        display: block;
        width: 100%;
        height: 100%;
      }
      h1, h2, h3, h4, h5 {
        text-transform: uppercase;
      }
      .button {
        display: inline-block;
        padding: 10px;
        background-color: #73B5F6;
        color: #fff;
        font-size: 0.9em;
        border: 0;
        border-radius: 3px;
        text-decoration: none;
        cursor: pointer;
      }
      main {
        padding: 15px;
      }
      main hr { height: 1px; background-color: #eee; border: 0; }
      main h1 {
        font-size: 1.4em;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      main h2 {
        font-size: 1.1em;
      }
      main h3 {
        font-size: 0.9em;
      }
      main p {
        color: #333;
      }
      main pre {
        white-space: pre-line;
      }
      #imagePreview {
        max-width: 100%;
        max-height: 400px;
        margin-top: 15px;
        border: 1px solid #ddd;
        display: none;
      }
      #imagePreview.show {
        display: block;
      }
    </style>
    <div>
      <capacitor-welcome-titlebar>
        <h1>Hello World</h1>
      </capacitor-welcome-titlebar>
      <main>
        <h1 style="text-align: center; font-size: 3em; margin: 50px 0;">Hello World</h1>
        <p style="text-align: center; font-size: 1.2em;">
          Welcome to Capacitor App!
        </p>
        <div style="text-align: center; margin-top: 30px;">
          <button id="takePhotoBtn" class="button">Take Photo</button>
          <img id="imagePreview" alt="Captured photo" />
        </div>
      </main>
    </div>
    `;
    }

    connectedCallback() {
      console.log('Hello World!');
      
      // Get references to UI elements
      const takePhotoBtn = this.shadowRoot.getElementById('takePhotoBtn');
      const imagePreview = this.shadowRoot.getElementById('imagePreview');
      
      // Safety check - ensure elements exist
      if (!takePhotoBtn || !imagePreview) {
        console.error('Camera UI elements not found!');
        return;
      }
      
      console.log('Camera button found, adding click handler');
      
      // Add click handler for camera button
      takePhotoBtn.addEventListener('click', async () => {
        try {
          // NATIVE BEHAVIOR: On Android/iOS, this opens the native camera app
          // WEB BEHAVIOR: On web, this uses the browser's file picker API
          const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            // NATIVE: Prompt shows dialog to choose between Camera or Gallery
            // WEB: Opens file picker dialog (no camera option on web)
            source: CameraSource.Prompt, // Prompt allows user to choose Camera or Gallery
            resultType: CameraResultType.DataUrl, // Returns base64 data URL
          });
          
          // Display the captured image
          // NATIVE: Image is captured from device camera/gallery
          // WEB: Image is selected from file system
          imagePreview.src = image.dataUrl;
          imagePreview.classList.add('show');
          
          // Log image metadata
          // NATIVE: These properties come from native camera API
          // WEB: These properties come from browser File API
          console.log('Image captured successfully');
          console.log('Format:', image.format); // e.g., 'jpeg', 'png'
          console.log('Width:', image.width); // Image width in pixels (if available)
          console.log('Height:', image.height); // Image height in pixels (if available)
          console.log('Data URL length:', image.dataUrl ? image.dataUrl.length : 'N/A'); // Approximate size indicator
          
          // Note: Exact file size in bytes is not directly available from Camera API
          // To get actual file size, you would need to convert dataUrl to Blob
          if (image.dataUrl) {
            // Calculate approximate size from base64 data URL
            // Base64 encoding adds ~33% overhead, so we can estimate
            const base64Length = image.dataUrl.length;
            const sizeEstimate = Math.round((base64Length * 3) / 4);
            console.log('Estimated size (bytes):', sizeEstimate);
          }
          
        } catch (error) {
          // NATIVE: Errors can include permission denials, camera unavailable, etc.
          // WEB: Errors can include user cancellation, permission issues, etc.
          console.error('Error taking photo:', error);
          alert('Error taking photo: ' + error.message);
        }
      });
    }
  },
);

window.customElements.define(
  'capacitor-welcome-titlebar',
  class extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `
    <style>
      :host {
        position: relative;
        display: block;
        padding: 15px 15px 15px 15px;
        text-align: center;
        background-color: #73B5F6;
      }
      ::slotted(h1) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 0.9em;
        font-weight: 600;
        color: #fff;
      }
    </style>
    <slot></slot>
    `;
    }
  },
);

