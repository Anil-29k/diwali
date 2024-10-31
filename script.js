const mainDiya = document.getElementById("main-diya");
const extraDiyasContainer = document.getElementById("extra-diyas");
const overlay = document.getElementById("overlay");

const litDiyas = [];
let isDragging = false;

mainDiya.addEventListener("click", () => {
    mainDiya.src = "https://www.google.com/logos/fnbx/diwali/diya_loop_8.svg";
    mainDiya.classList.add("lit");
    overlay.style.display = "block";

    for (let i = 0; i < 10; i++) {
        const newDiya = document.createElement("img");
        newDiya.src = "https://www.google.com/logos/fnbx/diwali/unlit_diya.svg";
        newDiya.classList.add("diya");
        newDiya.style.position = "absolute";
        newDiya.style.left = `${Math.random() * 90}vw`;
        newDiya.style.top = `${Math.random() * 70 + 20}vh`;
        newDiya.dataset.lit = "false";
        extraDiyasContainer.appendChild(newDiya);
    }

    enableDragging();
});

function enableDragging() {
    mainDiya.addEventListener("mousedown", onMouseDown);
    mainDiya.addEventListener("touchstart", onTouchStart); 
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchmove", onTouchMove); 
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchend", onTouchEnd); 
}

function onMouseDown(event) {
    isDragging = true;
    mainDiya.style.pointerEvents = "none";
    document.body.style.cursor = "none";
    moveDiya(event);
}

function onTouchStart(event) {
    event.preventDefault(); 
    isDragging = true;
    mainDiya.style.pointerEvents = "none";
    document.body.style.cursor = "none";
    moveDiya(event.touches[0]); 
}

function onMouseMove(event) {
    if (isDragging) {
        moveDiya(event);
        checkNearbyDiyas(mainDiya);
    }
}

function onTouchMove(event) {
    if (isDragging) {
        moveDiya(event.touches[0]); 
        checkNearbyDiyas(mainDiya);
    }
}

function onMouseUp() {
    if (isDragging) {
        isDragging = false;
        mainDiya.style.pointerEvents = "auto";
        document.body.style.cursor = "default";
    }
}

function onTouchEnd() {
    if (isDragging) {
        isDragging = false;
        mainDiya.style.pointerEvents = "auto";
        document.body.style.cursor = "default";
    }
}

function moveDiya(event) {
    const x = event.clientX || event.pageX; 
    const y = event.clientY || event.pageY;
    mainDiya.style.position = "absolute";
    mainDiya.style.left = `${x}px`;
    mainDiya.style.top = `${y}px`;
}

function lightDiya(diya) {
    diya.src = "https://www.google.com/logos/fnbx/diwali/diya_loop_8.svg";
    diya.dataset.lit = "true";
    litDiyas.push(diya);
    checkAllDiyasLit();
    overlay.style.display = "none";
}

function checkAllDiyasLit() {
    const allDiyas = document.querySelectorAll(".diya");
    const allLit = Array.from(allDiyas).every(diya => diya.dataset.lit === "true");
    if (allLit) {
        alignDiyas();
    }
}

function alignDiyas() {
    const diyas = document.querySelectorAll(".diya");
    let leftPosition = 5;
    const totalDiyas = diyas.length;

    if (totalDiyas !== 10) {
        console.error("There should be exactly 10 extra diyas to align.");
        return;
    }

    for (let i = 0; i < 5; i++) {
        const diya = diyas[i];
        diya.style.position = "absolute";
        diya.style.left = `${leftPosition}vw`;
        diya.style.top = "80vh";
        leftPosition += 8;
    }

    mainDiya.style.position = "absolute";
    mainDiya.style.left = `${leftPosition}vw`;
    mainDiya.style.top = "70vh";
    leftPosition += 8;

    for (let i = 5; i < totalDiyas; i++) {
        const diya = diyas[i];
        diya.style.position = "absolute";
        diya.style.left = `${leftPosition}vw`;
        diya.style.top = "80vh";
        diya.style.transform = 'scaleX(-1)';
        leftPosition += 8;
    }

    disableDragging();
    startFireworks();
}

function startFireworks() {
    $('.fireworks').fireworks({
        sound: true,
        opacity: 0.9,
        width: '100%',
        height: '100%'
    });
}

function checkNearbyDiyas(draggedDiya) {
    const diyas = document.querySelectorAll(".diya");
    diyas.forEach(diya => {
        if (diya.dataset.lit === "false") {
            const distance = calculateDistance(draggedDiya, diya);
            if (distance < 50) {
                lightDiya(diya);
            }
        }
    });
}

function calculateDistance(diya1, diya2) {
    const rect1 = diya1.getBoundingClientRect();
    const rect2 = diya2.getBoundingClientRect();
    const dx = rect1.left - rect2.left;
    const dy = rect1.top - rect2.top;
    return Math.sqrt(dx * dx + dy * dy);
}

function disableDragging() {
    mainDiya.removeEventListener("mousedown", onMouseDown);
    mainDiya.removeEventListener("touchstart", onTouchStart); 
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("touchmove", onTouchMove); 
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("touchend", onTouchEnd); 
}