// Carousel Logic
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
    showSlide(currentSlideIndex);
}

function currentSlide(index) {
    currentSlideIndex = index;
    showSlide(currentSlideIndex);
}

// Timer for carousel (every 4 seconds)
let slideInterval = setInterval(nextSlide, 4000);

// Pause on hover
const carousel = document.querySelector('.carousel-container');
if (carousel) {
    carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
    carousel.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 4000);
    });
}

// Navigation Transformation Logic
const navBar = document.querySelector('.nav-bar');
const navLinks = document.querySelectorAll('.nav-menu li a');

navLinks.forEach(link => {
    link.addEventListener('click', function () {
        // Remove active class from all
        navLinks.forEach(l => l.classList.remove('active-link'));
        // Add active class to clicked
        this.classList.add('active-link');
    });
});

// Product Grid Slider Logic
function scrollSlider(btn, direction) {
    const wrapper = btn.closest('.slider-wrapper');
    const grid = wrapper.querySelector('.product-grid');
    const card = grid.querySelector('.product-card');

    // Calculate scroll amount (card width + gap)
    const scrollAmount = card.offsetWidth + 20; // 20px is the gap
    grid.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
}

// Chat Widget Logic
let chatUser = { name: '', phone: '' };

function toggleChat() {
    const chatWidget = document.getElementById("chat-widget");
    chatWidget.classList.toggle("hidden");
}

function startChat(event) {
    event.preventDefault();
    chatUser.name = document.getElementById("chat-name").value;
    chatUser.phone = document.getElementById("chat-phone").value;

    // Lưu thông tin vào localStorage để không phải nhập lại lần sau
    localStorage.setItem('chatUserName', chatUser.name);
    localStorage.setItem('chatUserPhone', chatUser.phone);

    document.getElementById("chat-register-screen").classList.add("hidden");
    document.getElementById("chat-message-screen").classList.remove("hidden");

    const chatHistory = document.getElementById("chat-history");

    // Chỉ thêm lời chào nếu chưa có tin nhắn nào
    if (chatHistory.children.length === 0) {
        const botMsgDiv = document.createElement("div");
        botMsgDiv.className = "message bot-message";
        botMsgDiv.textContent = `Xin chào ${chatUser.name}! Vĩnh Cửu Sài Gòn có thể giúp gì cho bạn?`;
        chatHistory.appendChild(botMsgDiv);
    }
}

async function sendMessageLive(event) {
    event.preventDefault();

    const inputField = document.getElementById("chat-input");
    const message = inputField.value.trim();
    if (!message) return;

    const chatHistory = document.getElementById("chat-history");
    const btnSend = document.getElementById("btn-send-msg");

    // Add user message to UI
    const userMsgDiv = document.createElement("div");
    userMsgDiv.className = "message user-message";
    userMsgDiv.textContent = message;
    chatHistory.appendChild(userMsgDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;

    inputField.value = "";
    btnSend.disabled = true;

    // Hiển thị hiệu ứng "Đang gõ..."
    const typingDiv = document.createElement("div");
    typingDiv.className = "message bot-message typing-indicator";
    typingDiv.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    chatHistory.appendChild(typingDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;

    try {
        const response = await fetch("https://duytrong.app.n8n.cloud/webhook/gach-bong-gio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: chatUser.name,
                phone: chatUser.phone,
                message: message
            })
        });

        let botResponseText = "Cảm ơn bạn, chúng tôi đã nhận được tin nhắn.";
        if (response.ok) {
            try {
                let data = await response.json();
                // Nếu n8n trả về mảng (do cấu trúc workflow), lấy item đầu tiên
                if (Array.isArray(data) && data.length > 0) data = data[0];

                if (data && data.reply) botResponseText = data.reply;
                else if (data && data.message) botResponseText = data.message;
                else if (typeof data === 'string') botResponseText = data;
            } catch (e) {
                // If not JSON
                const text = await response.text();
                if (text) botResponseText = text;
            }
        } else {
            botResponseText = "Xin lỗi, hiện tại hệ thống đang bận. Vui lòng thử lại sau.";
        }

        // Xóa hiệu ứng "Đang gõ..." trước khi hiển thị tin nhắn thật
        if (typingDiv && typingDiv.parentNode) {
            typingDiv.parentNode.removeChild(typingDiv);
        }

        // Add bot message
        const botMsgDiv = document.createElement("div");
        botMsgDiv.className = "message bot-message";

        if (typeof botResponseText === 'string') {
            // Replace literal \n with actual newline if API returns it
            botResponseText = botResponseText.replace(/\\n/g, '\n');
            botMsgDiv.innerHTML = marked.parse(botResponseText);
        } else {
            botMsgDiv.textContent = botResponseText;
        }

        chatHistory.appendChild(botMsgDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;

    } catch (error) {
        console.error("Error:", error);

        if (typingDiv && typingDiv.parentNode) {
            typingDiv.parentNode.removeChild(typingDiv);
        }

        const errorMsgDiv = document.createElement("div");
        errorMsgDiv.className = "message bot-message";
        errorMsgDiv.style.color = "red";
        errorMsgDiv.textContent = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.";
        chatHistory.appendChild(errorMsgDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    } finally {
        btnSend.disabled = false;
        inputField.focus();
    }
}

// Resizable Chat Widget Logic
document.addEventListener("DOMContentLoaded", () => {
    const chatWidget = document.getElementById("chat-widget");
    const resizers = document.querySelectorAll(".resizer");
    let isResizing = false;
    let currentResizer;
    let startX, startY, startWidth, startHeight;

    resizers.forEach(resizer => {
        resizer.addEventListener("mousedown", (e) => {
            isResizing = true;
            currentResizer = resizer;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseFloat(getComputedStyle(chatWidget, null).getPropertyValue("width"));
            startHeight = parseFloat(getComputedStyle(chatWidget, null).getPropertyValue("height"));

            // T?m th?i v� hi?u h�a transition �? resize kh�ng b? lag
            chatWidget.style.transition = "none";
            e.preventDefault();
        });
    });

    window.addEventListener("mousemove", (e) => {
        if (!isResizing) return;

        let newWidth = startWidth;
        let newHeight = startHeight;

        if (currentResizer.classList.contains("resizer-l") || currentResizer.classList.contains("resizer-tl")) {
            newWidth = startWidth - (e.clientX - startX);
        }
        if (currentResizer.classList.contains("resizer-t") || currentResizer.classList.contains("resizer-tl")) {
            newHeight = startHeight - (e.clientY - startY);
        }

        if (newWidth >= 280) chatWidget.style.width = newWidth + "px";
        if (newHeight >= 250) chatWidget.style.height = newHeight + "px";
    });

    window.addEventListener("mouseup", () => {
        if (isResizing) {
            isResizing = false;
            // Ph?c h?i l?i transition
            chatWidget.style.transition = "";
        }
    });
});




// Auto-load user from localStorage
document.addEventListener("DOMContentLoaded", () => {
    const savedName = localStorage.getItem('chatUserName');
    const savedPhone = localStorage.getItem('chatUserPhone');

    if (savedName && savedPhone) {
        chatUser.name = savedName;
        chatUser.phone = savedPhone;

        const registerScreen = document.getElementById("chat-register-screen");
        const messageScreen = document.getElementById("chat-message-screen");

        if (registerScreen && messageScreen) {
            registerScreen.classList.add("hidden");
            messageScreen.classList.remove("hidden");

            const chatHistory = document.getElementById("chat-history");
            if (chatHistory && chatHistory.children.length === 0) {
                const botMsgDiv = document.createElement("div");
                botMsgDiv.className = "message bot-message";
                botMsgDiv.innerHTML = marked.parse(`Xin chào trở lại, **${chatUser.name}**! Vĩnh Cửu Sài Gòn có thể giúp gì cho bạn?`);
                chatHistory.appendChild(botMsgDiv);
            }
        }
    }
});

// Vertical Nav Scroll Logic
document.addEventListener("DOMContentLoaded", () => {
    const verticalNav = document.querySelector('.vertical-nav');
    const mainNavBar = document.querySelector('.nav-bar');

    if (verticalNav && mainNavBar) {
        window.addEventListener('scroll', () => {
            const navBottom = mainNavBar.getBoundingClientRect().bottom;
            // Hiện thanh nav dọc khi thanh nav chính cuộn khuất khỏi màn hình
            if (navBottom < 0) {
                verticalNav.classList.add('show');
            } else {
                verticalNav.classList.remove('show');
            }
        });

        // Active link highlighting for vertical nav
        const verticalLinks = verticalNav.querySelectorAll('a');
        verticalLinks.forEach(link => {
            link.addEventListener('click', function () {
                verticalLinks.forEach(l => l.classList.remove('active-link'));
                this.classList.add('active-link');
            });
        });
    }
});
