let currentPhotoIndex = 0;
let selectedPhotos = [];

function placePhoto(file) {
    const photoFrame = document.getElementById('photo-frame');
    const photo = photoFrame.querySelectorAll('.photo')[currentPhotoIndex];
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const scale = Math.max(photoFrame.offsetWidth / img.width, photoFrame.offsetHeight / img.height);
            const width = img.width * scale;
            const height = img.height * scale;
            photo.style.backgroundImage = `url('${e.target.result}')`;
            photo.style.backgroundSize = `${width}px ${height}px`;
            currentPhotoIndex++;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function selectPhoto() {
    const input = document.getElementById('fileInput');
    input.click();

    input.onchange = function (event) {
        const files = event.target.files;

        for (let i = 0; i < files.length; i++) {
            placePhoto(files[i]);
        }
    };
}

function downloadFrameAndPhotos() {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');

    const photoFrame = document.getElementById('photo-frame');
    const frameImage = new Image();
    frameImage.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='700'%3E%3Crect x='5' y='5' width='290' height='690' fill='none' stroke='%23ccc' stroke-width='10' rx='10'/%3E%3C/svg%3E";
    frameImage.onload = function () {
        ctx.drawImage(frameImage, 0, 0, 300, 700);

        const photos = photoFrame.querySelectorAll('.photo');

        for (let i = 0; i < photos.length; i++) {
            const photo = photos[i];
            const photoUrl = photo.style.backgroundImage.slice(4, -1).replace(/"/g, "");
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function () {
                ctx.drawImage(img, 5, 5 + i * (canvas.height / photos.length), 290, (canvas.height / photos.length) - 10);
                if (i === photos.length - 1) {
                    const link = document.createElement('a');
                    link.href = canvas.toDataURL('image/jpeg');
                    link.download = 'BSSM3CUT.jpg';
                    link.click();
                }
            };
            img.src = photoUrl;
        }
    };
}

function deletePhotos() {
    const photoFrame = document.getElementById('photo-frame');
    const photos = photoFrame.querySelectorAll('.photo');
    photos.forEach(photo => {
        photo.style.backgroundImage = '';
    });
    currentPhotoIndex = 0;
}
