function toggleFaq(button) {
    const content = button.nextElementSibling;
    const icon = button.querySelector('.material-symbols-outlined');

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
    } else {
        content.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
    }
}

// Simple scroll reveal effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('py-2');
        nav.classList.remove('h-20');
        nav.classList.add('h-16');
    } else {
        nav.classList.remove('py-2');
        nav.classList.add('h-20');
        nav.classList.remove('h-16');
    }
});
