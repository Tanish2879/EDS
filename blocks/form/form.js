export default function decorate(block) {

    block.id = 'form-block';
  // 1. Identify the two columns from the da.live structure
  const row = block.firstElementChild;
  if (!row || row.children.length < 2) return;

  row.classList.add('form-row-wrapper');

  const imageCol = row.children[0];
  const formCol = row.children[1];

  imageCol.classList.add('form-image-col');
  formCol.classList.add('form-content-col');

  // 2. Inject Form HTML
  formCol.innerHTML = `
    <div class="form-header">
      <h2>BE THE FIRST TO KNOW</h2>
      <p>Leave your details and we'll tell you when reservations open,<br>before anyone else hears about it.</p>
    </div>
    <form id="reservation-form" novalidate>
      <div class="form-row split">
        <div class="input-group">
          <input type="text" id="firstName" name="firstName" placeholder="First Name*" required>
          <span class="error-msg" id="err-firstName"></span>
        </div>
        <div class="input-group">
          <input type="text" id="lastName" name="lastName" placeholder="Last Name*" required>
          <span class="error-msg" id="err-lastName"></span>
        </div>
      </div>
      <div class="form-row">
        <div class="input-group">
          <input type="email" id="email" name="email" placeholder="Email Address*" required>
          <span class="error-msg" id="err-email"></span>
        </div>
      </div>
      <div class="form-row mobile-row">
        <div class="input-group country-code">
          <input type="text" value="+91" disabled>
        </div>
        <div class="input-group mobile-input">
          <input type="tel" id="mobile" name="mobile" placeholder="Mobile Number*" required maxlength="10">
          <span class="error-msg" id="err-mobile"></span>
        </div>
      </div>
      <div class="form-row checkbox-row">
        <label class="checkbox-label">
          <input type="checkbox" id="terms" name="terms" required>
          <span class="terms-text">I agree to JSW Motors storing my details and contacting me about the launch, reservations and related updates over email, SMS, WhatsApp and phone, as in the Privacy Notice.</span>
        </label>
        <span class="error-msg" id="err-terms"></span>
      </div>
      <button type="submit" class="btn-get-otp">GET OTP</button>
    </form>
    <div class="form-disclaimer">
      <p>JSW Motors is the Data Fiduciary for the personal data you share here. We process it only for the purpose above under the Digital Personal Data Protection Act, 2023. Your consent is optional and you can withdraw it or ask us to erase your data at any time by writing to our team - matter to subject of availability. Unresolved concerns can be raised with the Data Protection Board of India. Read the full Privacy Notice.</p>
    </div>
  `;

  const form = formCol.querySelector('#reservation-form');

  // Real-time digit restriction on mobile field
  const mobileInput = form.querySelector('#mobile');
  mobileInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
  });

  // Validation Logic
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const showError = (id, message) => {
      const errSpan = formCol.querySelector(`#err-${id}`);
      if (errSpan) {
        errSpan.textContent = message;
        errSpan.style.display = 'block';
      }
      isValid = false;
    };

    formCol.querySelectorAll('.error-msg').forEach((span) => {
      span.textContent = '';
      span.style.display = 'none';
    });

    const nameRegex = /^[A-Za-z]{3,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const mobileRegex = /^\d{10}$/;

    if (!nameRegex.test(form.firstName.value.trim())) {
      showError('firstName', 'Must contain at least 3 alphabets.');
    }

    if (!nameRegex.test(form.lastName.value.trim())) {
      showError('lastName', 'Must contain at least 3 alphabets.');
    }

    if (!emailRegex.test(form.email.value.trim())) {
      showError('email', 'Please enter a valid email address.');
    }

    if (!mobileRegex.test(form.mobile.value.trim())) {
      showError('mobile', 'Please enter a valid 10-digit mobile number.');
    }

    if (!form.terms.checked) {
      showError('terms', 'You must agree to the terms to proceed.');
    }

    if (isValid) {
      const btn = form.querySelector('.btn-get-otp');
      btn.textContent = 'SENDING...';
      btn.disabled = true;
    }
  });
}