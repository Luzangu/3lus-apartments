/* ── EMAILJS ── */
const EMAILJS = {
    publicKey:  'YOUR_PUBLIC_KEY',
    serviceId:  'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID',
};
if (typeof emailjs !== 'undefined') emailjs.init(EMAILJS.publicKey);

/* ── MOBILE MENU ── */
document.getElementById('burger').addEventListener('click', () => {
    document.getElementById('mobMenu').classList.add('open');
    document.body.style.overflow = 'hidden';
});
document.getElementById('mobX').addEventListener('click', closeMob);
function closeMob() {
    document.getElementById('mobMenu').classList.remove('open');
    document.body.style.overflow = '';
}

/* ── HERO SLIDESHOW ── */
const slides = document.querySelectorAll('.hs');
const sdots  = document.querySelectorAll('.sdot');
let cur = 0, timer;
function goSlide(n) {
    slides[cur].classList.remove('active');
    sdots[cur].classList.remove('active');
    cur = n;
    slides[cur].classList.add('active');
    sdots[cur].classList.add('active');
    clearInterval(timer);
    timer = setInterval(() => goSlide((cur + 1) % slides.length), 5500);
}
timer = setInterval(() => goSlide((cur + 1) % slides.length), 5500);

/* ── SCROLL REVEAL ── */
const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
    });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

/* ── GALLERY DRAG SCROLL ── */
const scroll = document.getElementById('galleryScroll');
let isDown = false, startX, scrollLeft;
scroll.addEventListener('mousedown',  e => { isDown = true; startX = e.pageX - scroll.offsetLeft; scrollLeft = scroll.scrollLeft; scroll.style.cursor = 'grabbing'; });
scroll.addEventListener('mouseleave', () => { isDown = false; scroll.style.cursor = 'grab'; });
scroll.addEventListener('mouseup',    () => { isDown = false; scroll.style.cursor = 'grab'; });
scroll.addEventListener('mousemove',  e => { if (!isDown) return; e.preventDefault(); const x = e.pageX - scroll.offsetLeft; scroll.scrollLeft = scrollLeft - (x - startX) * 1.4; });

/* ── GALLERY LIGHTBOX ── */
const media = [
    { src: 'images/sitting-room.mp4', type: 'video', label: 'Sitting Room' },
    { src: 'images/bedroom-1.jpg',    type: 'image', label: 'Bedroom 1' },
    { src: 'images/kitchen.jpg',      type: 'image', label: 'Kitchen' },
    { src: 'images/bedroom-2.mp4',    type: 'video', label: 'Bedroom 2' },
    { src: 'images/bathroom-1.mp4',   type: 'video', label: 'Bathroom 1' },
    { src: 'images/bathroom-2.mp4',   type: 'video', label: 'Bathroom 2' },
    { src: 'images/yard.mp4',         type: 'video', label: 'Yard' },
];
let li = 0;

document.querySelectorAll('.gcard').forEach(el => {
    el.addEventListener('click', () => openLb(+el.dataset.i));
});

function setLbMedia(item) {
    const c = document.getElementById('lbMedia');
    if (item.type === 'video') {
        c.innerHTML = `<video autoplay muted loop playsinline controls><source src="${item.src}" type="video/mp4"></video>`;
    } else {
        c.innerHTML = `<img src="${item.src}" alt="${item.label}">`;
    }
}
function openLb(i) {
    li = i;
    setLbMedia(media[li]);
    document.getElementById('lbC').textContent = `${li + 1} / ${media.length}`;
    document.getElementById('lb').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeLb() {
    document.getElementById('lb').classList.remove('open');
    document.body.style.overflow = '';
    document.getElementById('lbMedia').innerHTML = '';
}
function lbMove(d) {
    li = (li + d + media.length) % media.length;
    setLbMedia(media[li]);
    document.getElementById('lbC').textContent = `${li + 1} / ${media.length}`;
}
document.addEventListener('keydown', e => {
    if (!document.getElementById('lb').classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') lbMove(-1);
    if (e.key === 'ArrowRight') lbMove(1);
});

/* ── FORM ── */
if (document.getElementById('bookForm')) document.getElementById('bookForm').addEventListener('submit', async e => {
    e.preventDefault();
    const req = ['fullName', 'phone', 'email'];
    let ok = true;
    req.forEach(id => { const el = document.getElementById(id); if (!el.value.trim()) { el.focus(); ok = false; } });
    if (!ok) return;

    const btn = document.getElementById('submitBtn');
    btn.disabled = true; btn.classList.add('loading');
    document.getElementById('fOk').style.display = 'none';
    document.getElementById('fErr').style.display = 'none';

    const data = {
        fullName: document.getElementById('fullName').value.trim(),
        phone:    document.getElementById('phone').value.trim(),
        email:    document.getElementById('email').value.trim(),
        stayType: document.getElementById('stayType').value,
        guests:   document.getElementById('guests').value,
        checkIn:  document.getElementById('checkIn').value  || 'Not specified',
        checkOut: document.getElementById('checkOut').value || 'Not specified',
        message:  document.getElementById('message').value.trim() || 'No message',
        timestamp: new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lusaka', dateStyle: 'full', timeStyle: 'short' }),
    };

    try {
        await emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, data);
        document.getElementById('cName').textContent = data.fullName;
        document.getElementById('fOk').style.display = 'block';
        document.getElementById('bookForm').reset();
        document.getElementById('fOk').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (err) {
        console.error(err);
        document.getElementById('fErr').style.display = 'block';
    }
    btn.disabled = false; btn.classList.remove('loading');
});
