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
          // PERMISSION HANDLING: Check and request permissions before accessing camera
          // This handles first-time, denied, and revoked permission scenarios
          
          // PERMISSION HANDLING: Check and request permissions before accessing camera
          // This handles first-time ('prompt'), denied, and revoked permission scenarios
          
          // PERMISSION HANDLING: Check and request permissions before accessing camera
          // Check current permission status
          // NATIVE: Returns 'granted', 'denied', or 'prompt' for camera and photos permissions
          // WEB: May return 'prompt' or 'granted' depending on browser state
          const permissions = await Camera.checkPermissions();
          console.log('Current permissions:', JSON.stringify(permissions, null, 2));
          
          // Determine which permissions we need based on source
          // For CameraSource.Prompt, we need both camera and photos permissions
          // 'prompt' means permissions haven't been requested yet (first-time)
          // 'denied' means user previously denied permissions
          const needsCamera = permissions.camera !== 'granted';
          const needsPhotos = permissions.photos !== 'granted';
          
          console.log('Permission status - camera:', permissions.camera, ', photos:', permissions.photos);
          console.log('Needs camera permission:', needsCamera, ', needs photos permission:', needsPhotos);
          
          // FIRST-TIME PERMISSION: Request permissions if not granted
          // NATIVE: Shows system permission dialog
          // WEB: Shows browser permission prompt
          if (needsCamera || needsPhotos) {
            console.log('⚠️ Requesting camera permissions... (current status - camera:', permissions.camera, ', photos:', permissions.photos, ')');
            
            // Request permissions explicitly
            // This will show the native Android permission dialog on first use
            const requestedPermissions = await Camera.requestPermissions({
              permissions: ['camera', 'photos']
            });
            
            console.log('✅ Permission request result:', JSON.stringify(requestedPermissions, null, 2));
            
            // Check if permissions were granted after request
            if (requestedPermissions.camera === 'denied' || requestedPermissions.photos === 'denied') {
              // DENIED PERMISSION: User denied the permission request
              console.error('❌ Permissions denied by user');
              alert('Camera and photo library permissions are required to take photos. Please grant permissions in your device settings.');
              return;
            }
            
            // Verify permissions are now granted
            if (requestedPermissions.camera !== 'granted' || requestedPermissions.photos !== 'granted') {
              console.warn('⚠️ Permissions not fully granted after request:', requestedPermissions);
              // Still proceed - getPhoto() will handle it or show error
            } else {
              console.log('✅ Permissions granted successfully');
            }
          } else {
            console.log('✅ Permissions already granted - skipping request');
          }
          
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
          // ERROR HANDLING: Distinguish between different error types
          // NATIVE: Errors can include permission denials, camera unavailable, user cancellation, etc.
          // WEB: Errors can include user cancellation, permission issues, etc.
          console.error('Error taking photo:', error);
          
          // Check if error is related to permissions
          const errorMessage = error.message || error.toString();
          if (errorMessage.includes('permission') || errorMessage.includes('Permission')) {
            // DENIED or REVOKED PERMISSION: Provide specific guidance
            alert('Camera access was denied. Please grant camera and photo library permissions in your device settings to use this feature.');
          } else if (errorMessage.includes('cancel') || errorMessage.includes('Cancel')) {
            // User cancelled - no need to show error
            console.log('User cancelled photo capture');
          } else {
            // Other errors (camera unavailable, etc.)
            alert('Error taking photo: ' + errorMessage);
          }
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

