/* =========================================================
   VIJAY OFFSET PRESS — SPIN & WIN 2026
   Canvas Wheel Physics, Audio Synthesis & Claim Logic
   ========================================================= */

// 8 Segments with Exact Brand Palette (Matching vijay-offset-press.netlify.app)
const SECTORS = [
    {
        label: "5% OFF",
        subtext: "प्रिंटिंग छूट",
        color: "#C0392B",
        textColor: "#FFFFFF",
        type: "discount",
        weight: 20,
        desc: "आपको मिला है प्रिंटिंग बिल पर 5% की सीधी छूट।"
    },
    {
        label: "10% OFF",
        subtext: "बिल डिस्काउंट",
        color: "#1A3A6B", // Navy Mid
        textColor: "#FFFFFF",
        type: "discount",
        weight: 8,
        desc: "आपके ₹500+ के प्रिंटिंग ऑर्डर पर 10% डिस्काउंट लागू होगा।"
    },
    {
        label: "₹50 CASHBACK",
        subtext: "सीधा कैशबैक",
        color: "#27AE60", // Emerald Dark
        textColor: "#FFFFFF",
        type: "cashback",
        weight: 5,
        desc: "आपको मिला है ₹50 का सीधा बिल कैशबैक डिस्काउंट।"
    },
    {
        label: "छठ पूजा",
        subtext: "शुभकामनाएँ",
        color: "#D4922A", // Amber Dark
        textColor: "#FFFFFF",
        type: "blessing",
        weight: 25,
        desc: "छठ पूजा की हार्दिक शुभकामनाएँ! विजय ऑफसेट प्रेस परिवार की ओर से बधाई।"
    },
    {
        label: "₹100 CASHBACK",
        subtext: "बड़ा कैशबैक",
        color: "#132B50", // Navy Light
        textColor: "#FFFFFF",
        type: "cashback",
        weight: 2,
        desc: "बधाई हो! आपको मिला है ₹100 का बंपर कैशबैक डिस्काउंट।"
    },
    {
        label: "NEXT VISIT",
        subtext: "10% OFF",
        color: "#1E824C", // Deep Emerald
        textColor: "#FFFFFF",
        type: "next_visit",
        weight: 22,
        desc: "अगली विज़िट पर आपके प्रिंटिंग ऑर्डर पर 10% डिस्काउंट लागू होगा।"
    },
    {
        label: "TRY AGAIN",
        subtext: "धन्यवाद",
        color: "#4A4A5A", // Brand Text Muted
        textColor: "#FFFFFF",
        type: "try_again",
        weight: 15,
        desc: "इस बार लकी व्हील मिस हो गया। विजय ऑफसेट प्रेस में पधारने के लिए धन्यवाद।"
    },
    {
        label: "SURPRISE GIFT",
        subtext: "विशेष उपहार",
        color: "#F0A83C", // Amber Primary
        textColor: "#0B1D3A",
        type: "gift",
        weight: 3,
        desc: "आपने जीता है विशेष सरप्राइज गिफ्ट! काउंटर पर कूपन दिखाकर प्राप्त करें।"
    }
];

// Canvas & Animation State
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const wheelCenterBtn = document.getElementById("wheelCenterBtn");
const wheelPointer = document.getElementById("wheelPointer");
const spinHint = document.getElementById("spinHint");

// Modal Elements
const winModal = document.getElementById("winModal");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalCloseActionBtn = document.getElementById("modalCloseActionBtn");
const modalPrizeTitle = document.getElementById("modalPrizeTitle");
const modalPrizeDesc = document.getElementById("modalPrizeDesc");
const modalIcon = document.getElementById("modalIcon");
const couponCodeSpan = document.getElementById("couponCode");
const copyCouponBtn = document.getElementById("copyCouponBtn");
const claimWhatsappBtn = document.getElementById("claimWhatsappBtn");
const custNameInput = document.getElementById("custName");
const billAmountInput = document.getElementById("billAmount");

const totalSectors = SECTORS.length;
const arc = (2 * Math.PI) / totalSectors;
let currentAngle = 0;
let isSpinning = false;
let audioCtx = null;
let lastSectorIndex = -1;

// Web Audio API tick generator
function playTickSound() {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = "triangle";
        osc.frequency.setValueAtTime(500, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.04);
        
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);

        // Pointer mechanical wiggle
        wheelPointer.classList.remove("pointer-tick");
        void wheelPointer.offsetWidth; // trigger reflow
        wheelPointer.classList.add("pointer-tick");
    } catch (e) {
        // Audio might be blocked until user interacts, safely fallback
    }
}

// Draw Wheel onto Canvas (Clean, Crisp Corporate Style)
function drawWheel() {
    const size = canvas.width;
    const center = size / 2;
    const radius = center - 8;

    ctx.clearRect(0, 0, size, size);

    // Draw slices
    for (let i = 0; i < totalSectors; i++) {
        const sectorAngle = currentAngle + i * arc;
        const item = SECTORS[i];

        // Slice background
        ctx.beginPath();
        ctx.fillStyle = item.color;
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, sectorAngle, sectorAngle + arc);
        ctx.lineTo(center, center);
        ctx.fill();

        // Slice borders
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.stroke();

        // Outer dot
        const dotAngle = sectorAngle + arc / 2;
        const dotX = center + (radius - 14) * Math.cos(dotAngle);
        const dotY = center + (radius - 14) * Math.sin(dotAngle);
        ctx.beginPath();
        ctx.arc(dotX, dotY, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();

        // Text rendering along radius
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(sectorAngle + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = item.textColor;

        // Primary Label (crisp, solid typography without blurry shadows)
        ctx.font = "bold 20px 'Poppins', 'Hind', sans-serif";
        ctx.fillText(item.label, radius - 28, 2);

        // Subtext
        ctx.font = "600 12px 'Hind', sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.fillText(item.subtext, radius - 28, 22);

        ctx.restore();
    }

    // Outer solid amber ring (Matching original brand amber)
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#F0A83C";
    ctx.stroke();
}

// Calculate which sector the top pointer points to
// Pointer is at the top (angle = 3*PI/2 or -PI/2)
function getSelectedSector(angle) {
    const pointerAngle = (3 * Math.PI) / 2;
    // Normalize relative angle
    let normalized = (pointerAngle - (angle % (2 * Math.PI))) % (2 * Math.PI);
    if (normalized < 0) {
        normalized += 2 * Math.PI;
    }
    const index = Math.floor(normalized / arc) % totalSectors;
    return { index, sector: SECTORS[index] };
}

// Generate unique branded Coupon Code
function generateCouponCode() {
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `VOP-CHHATH-${randomChars}`;
}

// Subtle Confetti Celebration (Single tasteful burst in brand colors)
function triggerConfetti() {
    if (typeof confetti === "function") {
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#F0A83C', '#2ECC71', '#F7C97E', '#FFFFFF']
        });
    }
}

// Profit-protection weighted random selector
function pickWeightedSectorIndex() {
    // Check if custom weights exist in localStorage, otherwise use defaults
    const customWeights = JSON.parse(localStorage.getItem("vop_custom_weights") || "null");
    const weights = customWeights || SECTORS.map(s => s.weight || 10);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    
    let rand = Math.random() * totalWeight;
    for (let i = 0; i < weights.length; i++) {
        if (rand < weights[i]) {
            return i;
        }
        rand -= weights[i];
    }
    return 3; // Fallback to Chhath Puja blessing
}

// Spin Physics Routine
function startSpin() {
    if (isSpinning) return;

    // Check if user already spun (Terms: "प्रत्येक ग्राहक को केवल एक बार Spin")
    const existingClaim = localStorage.getItem("vop_chhath_2026_claim");
    if (existingClaim) {
        const savedData = JSON.parse(existingClaim);
        showWinModal(savedData, true);
        return;
    }

    isSpinning = true;
    spinBtn.disabled = true;
    wheelCenterBtn.style.pointerEvents = "none";
    spinHint.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> पहिया घूम रहा है... आपकी किस्मत चमक रही है!`;

    // Initialize audio context on user gesture
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    // 1. Pick target slice based on profit-protection weights
    const winningIndex = pickWeightedSectorIndex();

    // 2. Dynamic multi-rotation physics (6 to 9 full spins)
    const minSpins = 6;
    const maxSpins = 9;
    const extraRotations = (minSpins + Math.floor(Math.random() * (maxSpins - minSpins + 1))) * (2 * Math.PI);
    
    // Pointer is at the top (angle = 1.5 * PI)
    const pointerAngle = (3 * Math.PI) / 2;
    // Slight random offset inside the sector (20% to 80% width) for organic look
    const offsetRatio = 0.2 + Math.random() * 0.6;
    const targetSliceAngle = pointerAngle - (winningIndex + offsetRatio) * arc;

    // Calculate final angle ensuring forward spin progression
    const normalizedCurrent = currentAngle % (2 * Math.PI);
    let angleToTarget = (targetSliceAngle - normalizedCurrent) % (2 * Math.PI);
    if (angleToTarget <= 0) {
        angleToTarget += (2 * Math.PI);
    }
    const targetAngle = currentAngle + extraRotations + angleToTarget;
    
    const startTime = performance.now();
    const duration = 5600; // 5.6 seconds smooth deceleration
    const startAngle = currentAngle;
    const angleDelta = targetAngle - startAngle;

    function cubicEaseOut(t) {
        return --t * t * t + 1;
    }

    function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = cubicEaseOut(progress);

        currentAngle = startAngle + angleDelta * ease;
        drawWheel();

        // Sector crossing sound
        const currentSector = getSelectedSector(currentAngle).index;
        if (currentSector !== lastSectorIndex) {
            playTickSound();
            lastSectorIndex = currentSector;
        }

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            spinBtn.disabled = false;
            wheelCenterBtn.style.pointerEvents = "auto";
            
            // Final result matches chosen winningIndex 100%
            const result = getSelectedSector(currentAngle);
            handleResult(result.sector, result.index);
        }
    }

    requestAnimationFrame(animate);
}

// Handle Win Result
function handleResult(sector, index) {
    const coupon = generateCouponCode();
    const claimData = {
        prizeName: sector.label + (sector.subtext ? ` (${sector.subtext})` : ""),
        desc: sector.desc,
        couponCode: coupon,
        timestamp: new Date().toLocaleString("hi-IN"),
        sectorIndex: index,
        type: sector.type
    };

    // Store in localStorage to enforce one-spin rule
    localStorage.setItem("vop_chhath_2026_claim", JSON.stringify(claimData));

    // Highlight winning card in prizes list
    document.querySelectorAll(".prize-card").forEach((card) => {
        card.classList.remove("active-win");
        if (parseInt(card.dataset.index) === index) {
            card.classList.add("active-win");
        }
    });

    if (sector.type !== "try_again") {
        triggerConfetti();
    }

    setTimeout(() => {
        showWinModal(claimData, false);
    }, 400);
}

// Open Win Modal Dialog
function showWinModal(data, isAlreadyClaimed = false) {
    modalPrizeTitle.innerText = data.prizeName;
    modalPrizeDesc.innerText = data.desc;
    couponCodeSpan.innerText = data.couponCode;

    if (data.type === "try_again") {
        modalIcon.innerHTML = `<i class="fa-solid fa-arrows-rotate"></i>`;
        modalIcon.style.background = "#546E7A";
    } else if (data.type === "blessing") {
        modalIcon.innerHTML = `<i class="fa-solid fa-sun"></i>`;
        modalIcon.style.background = "linear-gradient(135deg, #FF9100, #FF3D00)";
    } else {
        modalIcon.innerHTML = `<i class="fa-solid fa-trophy"></i>`;
        modalIcon.style.background = "linear-gradient(135deg, #FFB300, #FF5722)";
    }

    if (isAlreadyClaimed) {
        spinHint.innerHTML = `<i class="fa-solid fa-info-circle"></i> आप पहले ही स्पिन कर चुके हैं! कूपन: <strong>${data.couponCode}</strong>`;
    }

    winModal.classList.add("open");
}

// Close Modal Dialog
function closeModal() {
    winModal.classList.remove("open");
}

// WhatsApp Claim Message Generator
function claimOnWhatsApp() {
    const saved = localStorage.getItem("vop_chhath_2026_claim");
    if (!saved) return;
    const data = JSON.parse(saved);

    const name = custNameInput.value.trim() || "ग्राहक";
    const bill = billAmountInput.value.trim() ? `₹${billAmountInput.value.trim()}` : "₹500+";

    const message = 
`नमस्कार Vijay Offset Press! 🌞
मैंने छठ पूजा 2026 Spin & Win में भाग लिया है।

👤 ग्राहक का नाम: ${name}
💰 अनुमानित बिल राशि: ${bill}
🎁 जीता गया ऑफर: ${data.prizeName}
🎟️ कूपन कोड: ${data.couponCode}
📅 समय: ${data.timestamp}

कृपया मेरे इस प्रिंटिंग आर्डर पर मेरा ऑफर लागू करें! धन्यवाद।`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919931043211?text=${encoded}`;
    window.open(whatsappUrl, "_blank");
}

// Copy Coupon to Clipboard
function copyCoupon() {
    const text = couponCodeSpan.innerText;
    navigator.clipboard.writeText(text).then(() => {
        copyCouponBtn.innerHTML = `<i class="fa-solid fa-check"></i>`;
        setTimeout(() => {
            copyCouponBtn.innerHTML = `<i class="fa-regular fa-copy"></i>`;
        }, 2000);
    });
}

// Event Listeners
spinBtn.addEventListener("click", startSpin);
wheelCenterBtn.addEventListener("click", startSpin);
canvas.addEventListener("click", startSpin);

modalCloseBtn.addEventListener("click", closeModal);
modalCloseActionBtn.addEventListener("click", closeModal);
winModal.addEventListener("click", (e) => {
    if (e.target === winModal) closeModal();
});

claimWhatsappBtn.addEventListener("click", claimOnWhatsApp);
copyCouponBtn.addEventListener("click", copyCoupon);

// Secret Staff Admin Trigger (Invisible to customers — 5 quick taps on footer copyright text)
const SHOP_ADMIN_PIN = "1973";
const secretAdminTrigger = document.getElementById("secretAdminTrigger");
let secretTapCount = 0;
let secretTapTimer = null;

if (secretAdminTrigger) {
    secretAdminTrigger.addEventListener("click", () => {
        secretTapCount++;
        clearTimeout(secretTapTimer);
        secretTapTimer = setTimeout(() => {
            secretTapCount = 0;
        }, 1500);

        if (secretTapCount >= 5) {
            secretTapCount = 0;
            openAdminMenu();
        }
    });
}

function openAdminMenu() {
    const inputPin = prompt("🔑 विजय ऑफसेट प्रेस — स्टाफ सुरक्षा पिन दर्ज करें:");
    if (inputPin === null) return;

    if (inputPin.trim() === SHOP_ADMIN_PIN) {
        const choice = prompt(
            "प्रेस स्टाफ एडमिन मेन्यू:\n" +
            "1. नए ग्राहक के लिए स्पिन रीसेट करें (Reset Customer Spin)\n" +
            "2. प्रॉफिट सुरक्षा सेटिंग्स देखें (Check Profit Margins & %)\n\n" +
            "विकल्प संख्या (1 या 2) दर्ज करें:", 
            "1"
        );

        if (choice === "1") {
            localStorage.removeItem("vop_chhath_2026_claim");
            document.querySelectorAll(".prize-card").forEach(c => c.classList.remove("active-win"));
            spinHint.innerHTML = `<i class="fa-solid fa-hand-point-up"></i> ऊपर दिए गए बटन को दबाएँ और अपना लकी ऑफर जीतें!`;
            alert("✅ सफलतापूर्वक रीसेट हो गया! अब नया ग्राहक स्पिन कर सकता है।");
        } else if (choice === "2") {
            let info = "📊 वर्तमान विनिंग पर्सेंटेज (Profit Protection Rates):\n\n";
            SECTORS.forEach((s, idx) => {
                info += `${idx + 1}. ${s.label}: ${s.weight}% सम्भावना\n`;
            });
            info += "\n💡 ₹100 कैशबैक केवल 2% है, और 62% ग्राहकों को ₹0 आज खर्च वाले ऑफर्स (Next Visit, शुभकामनाएँ, Try Again) मिलते हैं।";
            alert(info);
        }
    } else {
        alert("❌ गलत पिन (Wrong PIN)! केवल अधिकृत स्टाफ ही इसे खोल सकता है।");
    }
}

// Check initial storage state on page load
window.addEventListener("DOMContentLoaded", () => {
    drawWheel();
    const existing = localStorage.getItem("vop_chhath_2026_claim");
    if (existing) {
        const data = JSON.parse(existing);
        spinHint.innerHTML = `<i class="fa-solid fa-award"></i> आपका लकी ऑफर: <strong>${data.prizeName}</strong> (कूपन: ${data.couponCode})`;
        if (data.sectorIndex !== undefined) {
            const card = document.querySelector(`.prize-card[data-index="${data.sectorIndex}"]`);
            if (card) card.classList.add("active-win");
        }
    }
});

