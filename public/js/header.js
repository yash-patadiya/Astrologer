// Hamburger Menu
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navbar = document.getElementById('navbar');

hamburger.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

document.addEventListener('click', function(event) {
    if (!navbar.contains(event.target) && !hamburger.contains(event.target)) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Custom Cursor Tail
const cursor = document.querySelector('.cursor');
let mouseX = 0, mouseY = 0, lastX = 0, lastY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    const distance = Math.sqrt((mouseX - lastX) ** 2 + (mouseY - lastY) ** 2);
    if (distance > 10) {
        cursor.style.left = (mouseX - 15) + 'px';
        cursor.style.top = (mouseY - 15) + 'px';
        lastX = mouseX;
        lastY = mouseY;

        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const trail = document.createElement('div');
                trail.className = 'cursor-trail';
                trail.style.left = (mouseX - 8) + 'px';
                trail.style.top = (mouseY - 8) + 'px';
                const planets = ['planet-mercury', 'planet-venus', 'planet-mars', 'planet-jupiter'];
                trail.classList.add(planets[Math.floor(Math.random() * planets.length)]);
                document.body.appendChild(trail);
                setTimeout(() => trail.remove(), 1000);
            }, i * 30);
        }
    }
});

// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / totalHeight) * 100;
    document.getElementById('scroll-progress').style.width = scrolled + '%';
    clearTimeout(window.progressFadeTimeout);
    document.getElementById('scroll-progress').style.opacity = '1';
    window.progressFadeTimeout = setTimeout(() => {
        document.getElementById('scroll-progress').style.opacity = '0.5';
    }, 600);
});

// Change planet color based on scroll position
window.addEventListener('scroll', () => {
    const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if (scrollPercentage > 0 && scrollPercentage <= 20) cursor.className = 'cursor planet-mercury';
    else if (scrollPercentage > 20 && scrollPercentage <= 40) cursor.className = 'cursor planet-venus';
    else if (scrollPercentage > 40 && scrollPercentage <= 60) cursor.className = 'cursor planet-mars';
    else if (scrollPercentage > 60 && scrollPercentage <= 80) cursor.className = 'cursor planet-jupiter';
    else cursor.className = 'cursor planet-saturn';
});
