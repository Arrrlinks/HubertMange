document.addEventListener('DOMContentLoaded', function() {
    const stripe = Stripe('pk_test_51RdnhG4Fm3XwChmZoeocEbsMPpw8nMdyPWAxm93ULrt3XHD6eN1VetQDuzZyrF5fPjJFiwADAJqCyEYINJKKuRIS008lqzJqCp');
    const elements = stripe.elements();

    const cardNumber = elements.create('cardNumber');
    cardNumber.mount('#card-number');

    const cardExpiry = elements.create('cardExpiry');
    cardExpiry.mount('#card-expiry');

    const cardCvc = elements.create('cardCvc');
    cardCvc.mount('#card-cvc');

    const form = document.getElementById('payment-form');
    const submitButton = document.getElementById('submit-button');
    const buttonText = document.getElementById('button-text');
    const spinner = document.getElementById('spinner');
    const successMessage = document.getElementById('payment-success');

    // Helpers pour afficher les erreurs
    function showError(id, message) {
        document.getElementById(id).textContent = message || '';
    }
    function clearErrors() {
        showError('card-number-error', '');
        showError('card-expiry-error', '');
        showError('card-cvc-error', '');
        showError('card-name-error', '');
    }

    // Gestion des erreurs Stripe en direct
    cardNumber.on('change', function(event) {
        showError('card-number-error', event.error ? event.error.message : '');
    });
    cardExpiry.on('change', function(event) {
        showError('card-expiry-error', event.error ? event.error.message : '');
    });
    cardCvc.on('change', function(event) {
        showError('card-cvc-error', event.error ? event.error.message : '');
    });

    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        clearErrors();
        successMessage.classList.add('hidden');
        submitButton.disabled = true;
        spinner.classList.remove('hidden');
        buttonText.textContent = 'Traitement...';

        const cardName = document.getElementById('card-name').value.trim();
        if (!cardName) {
            showError('card-name-error', 'Veuillez saisir le nom du titulaire.');
            submitButton.disabled = false;
            spinner.classList.add('hidden');
            buttonText.textContent = 'Payer';
            return;
        }

        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardNumber,
            billing_details: {
                name: cardName,
            },
        });

        if (error) {
            showError('card-number-error', error.message);
            submitButton.disabled = false;
            spinner.classList.add('hidden');
            buttonText.textContent = 'Payer';
        } else {
            form.reset();
            successMessage.textContent = '✅ Paiement enregistré avec succès !';
            successMessage.classList.remove('hidden');
            submitButton.disabled = false;
            spinner.classList.add('hidden');
            buttonText.textContent = 'Payer';
        }
    });
});
