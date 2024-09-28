const selectImage = document.querySelector('.select-image');
const inputFile = document.querySelector('#file');
const imgArea = document.querySelector('.img-area');

selectImage.addEventListener( 'click', function() {
    inputFile.click();
})
inputFile.addEventListener('change', function() {
    const image = this.files[0]
    console.log(image);
    const reader = new FileReader();
    reader.onload = ()=> {
        const allImg = imgArea.querySelectorAll('img');
        allImg.forEach(item=> item.remove());
        const imgUrl = reader.result;
        const img = document.createElement('img');
        img.src = imgUrl;
        imgArea.appendChild(img);
        imgArea.classList.add('active');
        imgArea.dataset.img = image.name;
    }
    reader.readAsDataURL(image);
})

document.querySelector('.navbar a').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default anchor behavior
    window.location.href = 'history.html'; // Redirect to the history page
});
