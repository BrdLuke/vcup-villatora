document.addEventListener("DOMContentLoaded", () => {
    
    
    const btn = document.querySelector('.menu-btn');
    const menu = document.querySelector('.mobile-menu');

    if (btn && menu) {
        const links = menu.querySelectorAll('a');
        btn.addEventListener('click', () => menu.classList.toggle('hidden'));
        links.forEach(link => {
            link.addEventListener('click', () => menu.classList.add('hidden'));
        });
    }

    
    fetch('./loader.html')
        .then(response => {
            if (!response.ok) throw new Error("Loader non trovato");
            return response.text();
        })
        .then(html => {
            document.body.insertAdjacentHTML('afterbegin', html);
            const loader = document.getElementById('global-loader');
            
            window.addEventListener('load', () => {
                hideLoader(loader);
            });

            if (document.readyState === 'complete') {
                hideLoader(loader);
            }

            setupLinkTransitions(loader);
        })
        .catch(err => console.warn("Nota sul loader:", err.message));
    
    
    checkRegistrationDeadline();
});

function hideLoader(loader) {
    if (!loader) return;
    loader.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 500);
}

function setupLinkTransitions(loader) {
    if (!loader) return;
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        
        if (
            href && 
            !href.startsWith('#') && 
            !href.startsWith('mailto:') && 
            !href.startsWith('tel:') && 
            link.getAttribute('target') !== '_blank' &&
            !link.hasAttribute('download')
        ) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                loader.classList.remove('hidden');
                setTimeout(() => {
                    loader.classList.remove('opacity-0', 'pointer-events-none');
                }, 10);

                setTimeout(() => {
                    window.location.href = href;
                }, 300); 
            });
        }
    });
}

function checkRegistrationDeadline() {
    
    const deadline = new Date('2026-07-01T00:00:00').getTime();
    
    const dDays = document.getElementById('countdown-days');
    const dHours = document.getElementById('countdown-hours');
    const dMins = document.getElementById('countdown-minutes');
    const dSecs = document.getElementById('countdown-seconds');
    const countdownContainer = document.getElementById('countdown-container');

    
    function handleExpiration() {
        
        if (countdownContainer) {
            countdownContainer.classList.add('hidden');
        }

        const btnIscrizione = document.getElementById('iscrizione-btn');
        const btnDistintaPDF = document.getElementById('distinta-btn');
        const infoIscrizione = document.getElementById('iscrizione-info-text');

        
        if (btnIscrizione && btnIscrizione.parentNode) {
            const newBtn = btnIscrizione.cloneNode(true);
            btnIscrizione.parentNode.replaceChild(newBtn, btnIscrizione);
            
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
            newBtn.removeAttribute('href');
            newBtn.className = "w-full sm:w-auto bg-gray-800 text-gray-500 border border-gray-700 px-8 py-4 rounded-xl font-bold cursor-not-allowed text-center inline-block";
            newBtn.innerHTML = `<i class="fa-solid fa-lock mr-2"></i> Iscrizioni Chiuse`;
        }

        
        if (infoIscrizione) {
            infoIscrizione.innerHTML = "<b>Il termine ultimo per le iscrizioni (30/06/2026) è superato.</b>";
            infoIscrizione.className = "text-sm text-red-500 mt-2.5 text-center block w-full";
        }

        
        if (btnDistintaPDF) {
            btnDistintaPDF.classList.add('hidden');
        }
    }

    
    const now = new Date().getTime();
    if (deadline - now <= 0) {
        handleExpiration();
        return;
    }

    function updateTimer() {
        const today = new Date().getTime();
        const timeLeft = deadline - today;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleExpiration();
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        if (dDays) dDays.innerText = days < 10 ? '0' + days : days;
        if (dHours) dHours.innerText = hours < 10 ? '0' + hours : hours;
        if (dMins) dMins.innerText = minutes < 10 ? '0' + minutes : minutes;
        if (dSecs) dSecs.innerText = seconds < 10 ? '0' + seconds : seconds;
    }

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
}