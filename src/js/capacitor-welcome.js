import { SplashScreen } from '@capacitor/splash-screen';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Filesystem, Directory } from '@capacitor/filesystem';

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
      .section {
        margin-top: 30px;
        padding-top: 30px;
        border-top: 1px solid #eee;
      }
      .button-group {
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
        margin: 15px 0;
      }
      .file-list {
        margin: 15px 0;
        text-align: left;
        max-height: 200px;
        overflow-y: auto;
        border: 1px solid #ddd;
        padding: 10px;
        border-radius: 3px;
      }
      .file-item {
        padding: 5px 0;
        border-bottom: 1px solid #eee;
        font-size: 0.9em;
      }
      .file-item:last-child {
        border-bottom: none;
      }
      .file-name {
        font-weight: bold;
      }
      .file-size {
        color: #666;
        font-size: 0.85em;
      }
      .progress-bar {
        width: 100%;
        height: 20px;
        background-color: #eee;
        border-radius: 10px;
        margin: 10px 0;
        overflow: hidden;
        display: none;
      }
      .progress-bar.show {
        display: block;
      }
      .progress-fill {
        height: 100%;
        background-color: #73B5F6;
        transition: width 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 0.8em;
      }
      .error-message {
        color: #d32f2f;
        margin: 10px 0;
        padding: 10px;
        background-color: #ffebee;
        border-radius: 3px;
        display: none;
      }
      .error-message.show {
        display: block;
      }
      .button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
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
        
        <!-- Camera Section -->
        <div style="text-align: center; margin-top: 30px;">
          <button id="takePhotoBtn" class="button">Take Photo</button>
          <img id="imagePreview" alt="Captured photo" />
        </div>
        
        <!-- File Upload Section -->
        <div class="section">
          <h2 style="text-align: center; margin-bottom: 15px;">File Upload</h2>
          <div class="button-group">
            <button id="pickSingleFileBtn" class="button">Pick Single File</button>
            <button id="pickMultipleFilesBtn" class="button">Pick Multiple Files</button>
            <button id="uploadFilesBtn" class="button" disabled>Upload Files</button>
            <button id="clearFilesBtn" class="button">Clear</button>
          </div>
          <div id="fileList" class="file-list" style="display: none;"></div>
          <div id="progressBar" class="progress-bar">
            <div id="progressFill" class="progress-fill" style="width: 0%;">0%</div>
          </div>
          <div id="errorMessage" class="error-message"></div>
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
      
      // File upload UI elements
      const pickSingleFileBtn = this.shadowRoot.getElementById('pickSingleFileBtn');
      const pickMultipleFilesBtn = this.shadowRoot.getElementById('pickMultipleFilesBtn');
      const uploadFilesBtn = this.shadowRoot.getElementById('uploadFilesBtn');
      const clearFilesBtn = this.shadowRoot.getElementById('clearFilesBtn');
      const fileList = this.shadowRoot.getElementById('fileList');
      const progressBar = this.shadowRoot.getElementById('progressBar');
      const progressFill = this.shadowRoot.getElementById('progressFill');
      const errorMessage = this.shadowRoot.getElementById('errorMessage');
      
      // Store selected files
      let selectedFiles = [];
      
      // Safety check - ensure elements exist
      if (!takePhotoBtn || !imagePreview) {
        console.error('Camera UI elements not found!');
        return;
      }
      
      if (!pickSingleFileBtn || !pickMultipleFilesBtn || !uploadFilesBtn) {
        console.error('File upload UI elements not found!');
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
      
      // FILE UPLOAD FUNCTIONALITY
      // Single file picker
      pickSingleFileBtn.addEventListener('click', async () => {
        try {
          console.log('Picking single file...');
          // NATIVE: Opens native file picker on Android/iOS
          // WEB: Opens browser file picker
          const result = await FilePicker.pickFiles({
            multiple: false,
            // Allow all file types
            types: ['*/*'],
          });
          
          if (result.files && result.files.length > 0) {
            // Normalize file objects for consistent handling
            selectedFiles = result.files.map(file => {
              console.log('FilePicker returned file:', file);
              console.log('File type check:', {
                isFile: file instanceof File,
                isBlob: file instanceof Blob,
                hasPath: !!file.path,
                hasData: !!file.data,
                keys: Object.keys(file)
              });
              return file;
            });
            updateFileList();
            uploadFilesBtn.disabled = false;
            hideError();
            console.log('File selected:', selectedFiles[0]);
          }
        } catch (error) {
          console.error('Error picking file:', error);
          if (!error.message || !error.message.includes('cancel')) {
            showError('Error picking file: ' + (error.message || error));
          }
        }
      });
      
      // Multiple files picker
      pickMultipleFilesBtn.addEventListener('click', async () => {
        try {
          console.log('Picking multiple files...');
          // NATIVE: Opens native file picker with multi-select on Android/iOS
          // WEB: Opens browser file picker with multiple selection
          const result = await FilePicker.pickFiles({
            multiple: true,
            types: ['*/*'],
          });
          
          if (result.files && result.files.length > 0) {
            // Normalize file objects for consistent handling
            selectedFiles = result.files.map(file => {
              console.log('FilePicker returned file:', file);
              console.log('File type check:', {
                isFile: file instanceof File,
                isBlob: file instanceof Blob,
                hasPath: !!file.path,
                hasData: !!file.data,
                keys: Object.keys(file)
              });
              return file;
            });
            updateFileList();
            uploadFilesBtn.disabled = false;
            hideError();
            console.log('Files selected:', selectedFiles.length);
          }
        } catch (error) {
          console.error('Error picking files:', error);
          if (!error.message || !error.message.includes('cancel')) {
            showError('Error picking files: ' + (error.message || error));
          }
        }
      });
      
      // Clear files
      clearFilesBtn.addEventListener('click', () => {
        selectedFiles = [];
        updateFileList();
        uploadFilesBtn.disabled = true;
        hideProgress();
        hideError();
      });
      
      // Upload files
      uploadFilesBtn.addEventListener('click', async () => {
        if (selectedFiles.length === 0) {
          showError('No files selected');
          return;
        }
        
        await uploadFiles(selectedFiles);
      });
      
      // Update file list display
      function updateFileList() {
        if (selectedFiles.length === 0) {
          fileList.style.display = 'none';
          return;
        }
        
        fileList.style.display = 'block';
        fileList.innerHTML = selectedFiles.map((file, index) => {
          const size = formatFileSize(file.size || 0);
          return `
            <div class="file-item">
              <div class="file-name">${file.name || 'Unknown'}</div>
              <div class="file-size">${size} - ${file.mimeType || 'Unknown type'}</div>
            </div>
          `;
        }).join('');
      }
      
      // Format file size
      function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
      }
      
      // Show error message
      function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
      }
      
      // Hide error message
      function hideError() {
        errorMessage.classList.remove('show');
      }
      
      // Show progress bar
      function showProgress() {
        progressBar.classList.add('show');
        progressFill.style.width = '0%';
        progressFill.textContent = '0%';
      }
      
      // Update progress
      function updateProgress(percent) {
        const rounded = Math.round(percent);
        progressFill.style.width = rounded + '%';
        progressFill.textContent = rounded + '%';
      }
      
      // Hide progress bar
      function hideProgress() {
        progressBar.classList.remove('show');
      }
      
      // Upload files with progress tracking and retry logic
      async function uploadFiles(files, retryCount = 0) {
        const maxRetries = 3;
        // UPLOAD ENDPOINT CONFIGURATION
        // Current: Test endpoint (httpbin.org) - files are NOT saved, only for testing
        // Note: httpbin.org may have CORS or method restrictions in some browsers
        // Alternative test endpoints:
        // - https://httpbin.org/post (may have CORS issues)
        // - https://postman-echo.com/post (alternative test endpoint)
        // To use your own server, replace with your upload URL, e.g.:
        // const uploadUrl = 'https://your-server.com/api/upload';
        // const uploadUrl = 'http://localhost:3000/upload';
        const uploadUrl = 'https://httpbin.org/post'; // Test endpoint - replace with your actual upload URL
        
        console.log('Uploading to:', uploadUrl);
        
        try {
          showProgress();
          uploadFilesBtn.disabled = true;
          hideError();
          
          const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
          console.log(`Uploading ${files.length} file(s), total size: ${formatFileSize(totalSize)}`);
          
          // For each file, upload with progress tracking
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            console.log(`Uploading file ${i + 1}/${files.length}: ${file.name}`);
            
            try {
              await uploadSingleFile(file, uploadUrl, (progress) => {
                // Calculate overall progress across all files
                const fileProgress = (i / files.length) * 100 + (progress / files.length);
                updateProgress(fileProgress);
              });
              
              console.log(`✅ File ${i + 1} uploaded successfully: ${file.name}`);
            } catch (fileError) {
              console.error(`❌ Error uploading file ${file.name}:`, fileError);
              
              // Retry logic for individual file
              if (retryCount < maxRetries && isNetworkError(fileError)) {
                console.log(`Retrying upload for ${file.name} (attempt ${retryCount + 1}/${maxRetries})...`);
                await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
                await uploadSingleFile(file, uploadUrl, (progress) => {
                  const fileProgress = (i / files.length) * 100 + (progress / files.length);
                  updateProgress(fileProgress);
                });
              } else {
                throw new Error(`Failed to upload ${file.name}: ${fileError.message}`);
              }
            }
          }
          
          updateProgress(100);
          console.log('✅ All files uploaded successfully');
          alert(`Successfully uploaded ${files.length} file(s)`);
          
          // Clear files after successful upload
          setTimeout(() => {
            selectedFiles = [];
            updateFileList();
            uploadFilesBtn.disabled = true;
            hideProgress();
          }, 2000);
          
        } catch (error) {
          console.error('Upload error:', error);
          showError(`Upload failed: ${error.message}. ${retryCount < maxRetries ? 'Retrying...' : 'Please try again.'}`);
          
          // Retry entire upload if network error
          if (retryCount < maxRetries && isNetworkError(error)) {
            console.log(`Retrying upload (attempt ${retryCount + 1}/${maxRetries})...`);
            await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1))); // Exponential backoff
            await uploadFiles(files, retryCount + 1);
          } else {
            uploadFilesBtn.disabled = false;
            hideProgress();
          }
        }
      }
      
      // Upload single file with progress tracking
      async function uploadSingleFile(file, url, onProgress) {
        return new Promise(async (resolve, reject) => {
          try {
            console.log('Uploading file:', file);
            console.log('File structure:', {
              hasPath: !!file.path,
              hasData: !!file.data,
              isFile: file instanceof File,
              isBlob: file instanceof Blob,
              keys: Object.keys(file)
            });
            
            // NATIVE: Read file data from file path using Filesystem API
            // WEB: Use File API directly
            let fileBlob;
            let fileName = file.name || 'file';
            
            // Check if file is already a Blob or File object (Web platform)
            if (file instanceof Blob || file instanceof File) {
              fileBlob = file;
              fileName = file.name || fileName;
              console.log('File is already a Blob/File object');
            } else if (file.path) {
              // Native platform: file.path contains the file path
              // Read file using Filesystem API
              console.log('Reading native file from path:', file.path);
              try {
                const fileData = await Filesystem.readFile({
                  path: file.path,
                  directory: Directory.External,
                });
                
                // Convert base64 to blob
                const base64Data = fileData.data;
                const byteCharacters = atob(base64Data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                fileBlob = new Blob([byteArray], { type: file.mimeType || 'application/octet-stream' });
                console.log('Converted native file to Blob, size:', fileBlob.size);
              } catch (fsError) {
                console.error('Error reading file from filesystem:', fsError);
                // Try alternative: file might have data property
                if (file.data) {
                  throw new Error('Filesystem read failed, trying data property');
                } else {
                  throw fsError;
                }
              }
            } else if (file.data) {
              // FilePicker might return data directly (base64 or data URL)
              console.log('File has data property, type:', typeof file.data);
              if (typeof file.data === 'string') {
                if (file.data.startsWith('data:')) {
                  // Data URL
                  console.log('Converting data URL to Blob');
                  const response = await fetch(file.data);
                  fileBlob = await response.blob();
                } else {
                  // Base64 data
                  console.log('Converting base64 to Blob');
                  const byteCharacters = atob(file.data);
                  const byteNumbers = new Array(byteCharacters.length);
                  for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                  }
                  const byteArray = new Uint8Array(byteNumbers);
                  fileBlob = new Blob([byteArray], { type: file.mimeType || 'application/octet-stream' });
                }
              } else {
                throw new Error('File data is not a string');
              }
            } else {
              // Last resort: try to create blob from file object itself
              console.warn('File structure unexpected, attempting to create blob from object');
              // If file has a blob property, use it
              if (file.blob && file.blob instanceof Blob) {
                fileBlob = file.blob;
              } else {
                // Try to serialize and create blob (not ideal but works for text files)
                const fileContent = JSON.stringify(file);
                fileBlob = new Blob([fileContent], { type: file.mimeType || 'application/octet-stream' });
                console.warn('Created blob from file object serialization - may not work correctly');
              }
            }
            
            // Verify we have a valid Blob
            if (!fileBlob || !(fileBlob instanceof Blob)) {
              console.error('Failed to create Blob from file:', file);
              reject(new Error(`Failed to convert file to Blob. File structure: ${JSON.stringify(Object.keys(file))}`));
              return;
            }
            
            console.log('File blob created successfully, size:', fileBlob.size, 'type:', fileBlob.type);
            
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('file', fileBlob, fileName);
            
            // Upload using XHR for progress tracking
            const xhr = new XMLHttpRequest();
            uploadWithXHR(xhr, formData, url, onProgress, resolve, reject);
          } catch (error) {
            console.error('Error in uploadSingleFile:', error);
            reject(error);
          }
        });
      }
      
      // Helper function for XHR upload
      function uploadWithXHR(xhr, formData, url, onProgress, resolve, reject) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percent = (e.loaded / e.total) * 100;
            onProgress(percent);
          }
        });
        
        xhr.addEventListener('load', () => {
          console.log('Upload response status:', xhr.status);
          console.log('Upload response:', xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.response);
          } else {
            let errorMsg = `Upload failed with status ${xhr.status}`;
            if (xhr.status === 405) {
              errorMsg += ' (Method Not Allowed - server may not support POST or CORS issue)';
            }
            reject(new Error(errorMsg));
          }
        });
        
        xhr.addEventListener('error', (e) => {
          console.error('XHR error event:', e);
          reject(new Error('Network error during upload'));
        });
        
        xhr.addEventListener('abort', () => {
          reject(new Error('Upload aborted'));
        });
        
        // Handle CORS and method issues
        xhr.addEventListener('loadend', () => {
          if (xhr.status === 0) {
            reject(new Error('CORS error or network failure - check server CORS settings'));
          }
        });
        
        try {
          xhr.open('POST', url, true);
          // Note: Don't set Content-Type header - browser will set it with boundary for FormData
          xhr.send(formData);
        } catch (error) {
          console.error('Error sending XHR request:', error);
          reject(new Error('Failed to send upload request: ' + error.message));
        }
      }
      
      // Check if error is network-related (for retry logic)
      function isNetworkError(error) {
        const message = error.message || error.toString();
        return message.includes('Network') || 
               message.includes('network') || 
               message.includes('timeout') ||
               message.includes('Failed to fetch') ||
               message.includes('ECONNREFUSED');
      }
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

