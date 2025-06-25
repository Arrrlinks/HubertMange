document.addEventListener('DOMContentLoaded', async function() {
    const stripe = Stripe('pk_test_51RdnhG4Fm3XwChmZoeocEbsMPpw8nMdyPWAxm93ULrt3XHD6eN1VetQDuzZyrF5fPjJFiwADAJqCyEYINJKKuRIS008lqzJqCp');
    const elements = stripe.elements();

    const cardElement = elements.create('card');
    cardElement.mount('#card-number');

    const form = document.getElementById('payment-form');
    const submitButton = document.getElementById('submit-button');
    const buttonText = document.getElementById('button-text');
    const spinner = document.getElementById('spinner');
    const successMessage = document.getElementById('payment-success');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        submitButton.disabled = true;
        spinner.classList.remove('hidden');
        buttonText.textContent = 'Traitement...';

        const response = await fetch('http://localhost:9000/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 1000, currency: 'usd' })
        });
        const { clientSecret, error } = await response.json();
        if (error) {
            successMessage.textContent = error;
            successMessage.classList.remove('hidden');
            submitButton.disabled = false;
            spinner.classList.add('hidden');
            buttonText.textContent = 'Payer';
            return;
        }

        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: document.getElementById('card-name').value,
                },
            }
        });

        if (stripeError) {
            successMessage.textContent = stripeError.message;
            successMessage.classList.remove('hidden');
        } else if (paymentIntent.status === 'succeeded') {
            successMessage.textContent = '✅ Paiement réussi !';
            successMessage.classList.remove('hidden');
        }
        submitButton.disabled = false;
        spinner.classList.add('hidden');
        buttonText.textContent = 'Payer';
    });
});