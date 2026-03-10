// ============================================================
// FIREBASE-AUTH.JS — Real Phone OTP Authentication
// ============================================================
// Uses Firebase Phone Authentication with invisible reCAPTCHA
// Sends real SMS to any Indian (+91) phone number
// ============================================================

let firebaseApp = null;
let firebaseAuth = null;
let recaptchaVerifier = null;
let confirmationResult = null;

function isFirebaseConfigured() {
  return APP_CONFIG.features.realOTP &&
    APP_CONFIG.firebase.apiKey !== 'PASTE_YOUR_FIREBASE_API_KEY_HERE';
}

function initFirebase() {
  if (!isFirebaseConfigured()) return false;
  try {
    if (!firebase.apps?.length) {
      firebaseApp = firebase.initializeApp(APP_CONFIG.firebase);
    } else {
      firebaseApp = firebase.apps[0];
    }
    firebaseAuth = firebase.auth();
    firebaseAuth.useDeviceLanguage();
    return true;
  } catch (e) {
    console.error('Firebase init failed:', e);
    return false;
  }
}

function setupRecaptcha(containerId = 'recaptcha-container') {
  if (!firebaseAuth) return false;
  try {
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }
    recaptchaVerifier = new firebase.auth.RecaptchaVerifier(containerId, {
      size: 'invisible',
      callback: () => { /* auto-triggered */ },
      'expired-callback': () => {
        showToast('⚠️ reCAPTCHA expired, please try again');
        recaptchaVerifier = null;
      }
    });
    recaptchaVerifier.render();
    return true;
  } catch (e) {
    console.error('Recaptcha setup failed:', e);
    return false;
  }
}

async function sendRealOTP(phoneNumber) {
  // phoneNumber should be like "9876543210" (10 digits)
  if (!isFirebaseConfigured()) {
    // Demo fallback
    return { success: true, demo: true };
  }

  if (!firebaseAuth) {
    const ok = initFirebase();
    if (!ok) return { success: false, error: 'Firebase not initialized' };
  }

  setupRecaptcha('recaptcha-container');

  const fullPhone = '+91' + phoneNumber.replace(/\D/g, '');
  if (fullPhone.length !== 13) {
    return { success: false, error: 'Enter a valid 10-digit Indian mobile number' };
  }

  try {
    confirmationResult = await firebaseAuth.signInWithPhoneNumber(fullPhone, recaptchaVerifier);
    return { success: true, demo: false };
  } catch (err) {
    console.error('sendOTP error:', err);
    const messages = {
      'auth/invalid-phone-number':        '❌ Invalid phone number. Use 10-digit Indian number.',
      'auth/too-many-requests':           '⏳ Too many attempts. Try again after 1 hour.',
      'auth/quota-exceeded':              '📵 SMS quota exceeded for today. Try tomorrow.',
      'auth/captcha-check-failed':        '🤖 reCAPTCHA check failed. Reload and try again.',
      'auth/missing-phone-number':        '❌ Phone number is required.',
      'auth/network-request-failed':      '🌐 No internet connection.',
    };
    return { success: false, error: messages[err.code] || ('Error: ' + err.message) };
  }
}

async function verifyRealOTP(otp) {
  if (!isFirebaseConfigured()) {
    // Demo mode fallback
    return { success: otp === '123456', demo: true,
      error: otp !== '123456' ? '❌ Demo OTP is 123456' : null };
  }

  if (!confirmationResult) {
    return { success: false, error: 'Please request OTP first' };
  }

  try {
    const result = await confirmationResult.confirm(otp);
    const user = result.user;
    return {
      success: true,
      uid: user.uid,
      phone: user.phoneNumber,
      demo: false,
    };
  } catch (err) {
    console.error('verifyOTP error:', err);
    const messages = {
      'auth/invalid-verification-code': '❌ Wrong OTP. Check the SMS and try again.',
      'auth/code-expired':              '⏰ OTP expired. Please request a new one.',
      'auth/session-expired':           '⏰ Session expired. Please request a new OTP.',
    };
    return { success: false, error: messages[err.code] || '❌ Verification failed' };
  }
}

function signOutUser() {
  if (firebaseAuth) firebaseAuth.signOut();
  localStorage.removeItem('sfa_farmer');
  STATE.farmer = null;
  navigate('splash');
  showToast('👋 Logged out successfully');
}
