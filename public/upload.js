let selectedFile = null;
let jdEnabled = false;
let onboardingData = null;

const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const fileName = document.getElementById('fileName');
const analyzeBtn = document.getElementById('analyzeBtn');
const toggle = document.getElementById('toggle');
const jdToggle = document.getElementById('jdToggle');
const jdInput = document.getElementById('jdInput');

async function initUploadPage() {
  const profile = await getProfile();
  onboardingData = profile;
  
  const contextRole = document.getElementById('contextRole');
  const contextStatus = document.getElementById('contextStatus');
  const contextExperience = document.getElementById('contextExperience');
  
  contextRole.textContent = profile?.target_role || 'General readiness';
  contextStatus.textContent = profile?.current_status || 'Not specified';
  contextExperience.textContent = formatExperience(profile?.years_experience);
}

dropzone.addEventListener('click', () => {
  fileInput.click();
});

dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', () => {
  dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('dragover');
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFile(files[0]);
  }
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    handleFile(e.target.files[0]);
  }
});

function handleFile(file) {
  const validTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (!validTypes.includes(file.type)) {
    alert('Please upload a PDF, DOC, or DOCX file.');
    return;
  }
  
  selectedFile = file;
  fileName.textContent = file.name;
  dropzone.classList.add('has-file');
  analyzeBtn.disabled = false;
}

jdToggle.addEventListener('click', () => {
  jdEnabled = !jdEnabled;
  toggle.classList.toggle('active', jdEnabled);
  jdInput.classList.toggle('visible', jdEnabled);
});

analyzeBtn.addEventListener('click', async () => {
  if (!selectedFile) return;
  
  analyzeBtn.disabled = true;
  analyzeBtn.textContent = 'Uploading...';
  
  const formData = new FormData();
  formData.append('cv', selectedFile);
  
  if (jdEnabled) {
    const jdText = document.getElementById('jdTextarea').value.trim();
    if (jdText) {
      formData.append('job_description', jdText);
    }
  }
  
  if (onboardingData) {
    if (onboardingData.current_status) {
      formData.append('current_status', onboardingData.current_status);
    }
    if (onboardingData.target_role) {
      formData.append('target_role', onboardingData.target_role);
    }
    if (onboardingData.years_experience !== null && onboardingData.years_experience !== undefined) {
      formData.append('years_experience', String(onboardingData.years_experience));
    }
  }
  
  try {
    const response = await fetch('/api/cv/upload', {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const result = await response.json();
    
    if (result.jobId) {
      window.location.href = `/processing?jobId=${result.jobId}`;
    } else {
      throw new Error('No job ID returned');
    }
  } catch (error) {
    console.error('Upload error:', error);
    alert('Failed to upload CV. Please try again.');
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = 'Analyze my CV';
  }
});

initUploadPage();
