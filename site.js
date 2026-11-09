document.addEventListener('DOMContentLoaded', () => {
  const productSelect = document.querySelector('#product');
  const quantityInput = document.querySelector('#quantity');
  const totalOutput = document.querySelector('#order-total');
  const orderForm = document.querySelector('#order-form');

  const updateOrderTotal = () => {
    if (!productSelect || !quantityInput || !totalOutput) return;
    const selectedOption = productSelect.selectedOptions[0];
    const price = Number(selectedOption?.dataset.price || 0);
    const quantity = Math.max(1, Number(quantityInput.value) || 1);
    totalOutput.textContent = price
      ? `R ${(price * quantity).toLocaleString('en-ZA')}`
      : 'Choose a product';
  };

  productSelect?.addEventListener('change', updateOrderTotal);
  quantityInput?.addEventListener('input', updateOrderTotal);

  orderForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!orderForm.reportValidity()) return;

    const data = new FormData(orderForm);
    const quantity = Number(data.get('Quantity'));
    const selectedOption = productSelect.selectedOptions[0];
    const total = Number(selectedOption.dataset.price) * quantity;
    const subject = `Order request - ${data.get('Product')}`;
    const body = [
      'Upper Life order request',
      '',
      `Product: ${data.get('Product')}`,
      `Size: ${data.get('Size')}`,
      `Quantity: ${quantity}`,
      `Colour preference: ${data.get('Colour preference') || 'No preference'}`,
      `Estimated item total: R ${total.toLocaleString('en-ZA')}`,
      '',
      `Name: ${data.get('Full name')}`,
      `Email: ${data.get('Email')}`,
      `Phone: ${data.get('Phone')}`,
      '',
      `Delivery address: ${data.get('Street address')}, ${data.get('City')}, ${data.get('Postal code')}, ${data.get('Country')}`,
      `Order notes: ${data.get('Order notes') || 'None'}`,
      '',
      'Please confirm availability, delivery fee, and payment instructions.'
    ].join('\n');
    const mailto = `mailto:hello@upperlife.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;

    const status = document.querySelector('#form-status');
    if (status) status.textContent = 'Your email app should open with the order request ready to send.';
  });

  const images = Array.from(document.querySelectorAll('main img'));
  if (!images.length) return;

  const lightbox = document.createElement('dialog');
  lightbox.className = 'image-lightbox';
  lightbox.setAttribute('aria-label', 'Image viewer');
  lightbox.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Close image viewer">&times;</button>
    <img class="lightbox-image" alt="" />
    <p class="lightbox-caption"></p>
  `;
  document.body.append(lightbox);

  const lightboxImage = lightbox.querySelector('.lightbox-image');
  const caption = lightbox.querySelector('.lightbox-caption');
  const closeButton = lightbox.querySelector('.lightbox-close');

  images.forEach((image) => {
    image.classList.add('zoomable-image');
    image.setAttribute('tabindex', '0');
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', `View full image: ${image.alt || 'photo'}`);

    const openImage = () => {
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt || 'Full-size photo';
      caption.textContent = image.alt || '';
      lightbox.showModal();
      closeButton.focus();
    };

    image.addEventListener('click', openImage);
    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openImage();
      }
    });
  });

  closeButton.addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener('close', () => {
    lightboxImage.removeAttribute('src');
  });
});
