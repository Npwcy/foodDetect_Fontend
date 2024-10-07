import _axios from "./src/v1/services/axios.js"

const selectImage = document.querySelector('.select-image');
const inputFile = document.querySelector('#file');
const imgArea = document.querySelector('.img-area');
const submitImage = document.querySelector('.submit');
let uploadImage;

selectImage.addEventListener('click', function() {
    inputFile.click();
});
inputFile.addEventListener('change', function() {
    const image = this.files[0];
    handleImageUpload(image);
    uploadImage = image;
});
imgArea.addEventListener('dragover', function(event) {
    event.preventDefault(); // Prevent default behavior
    imgArea.classList.add('drag-over'); // Optional: Add a class to change the style
});
    
imgArea.addEventListener('dragleave', function() {
    imgArea.classList.remove('drag-over'); // Remove class when dragging leaves
});
    
imgArea.addEventListener('drop', function(event) {
    event.preventDefault(); // Prevent default behavior
    imgArea.classList.remove('drag-over'); // Remove class on drop
    const image = event.dataTransfer.files[0]; // Get the first file dropped
    handleImageUpload(image);
});

function handleImageUpload(image) {
    if (image) {
        const reader = new FileReader();
        reader.onload = () => {
            const allImg = imgArea.querySelectorAll('img');
            allImg.forEach(item => item.remove());
            const imgUrl = reader.result;
            const img = document.createElement('img');
            img.src = imgUrl;
            imgArea.appendChild(img);
            imgArea.classList.add('active');
            imgArea.dataset.img = image.name;
        };
        reader.readAsDataURL(image);
    }
};

submitImage.addEventListener( 'click', async function() {
    let { result } = await predict(uploadImage)
    console.log(result);

    var popup = document.getElementById('myPopup');
    popup.style.display = 'block';
    
    // ปิด Popup เมื่อคลิกปุ่ม X
    var closeBtn = document.getElementsByClassName('close')[0];
    closeBtn.onclick = function () {
        popup.style.display = 'none';
    }

    // ปิด Popup เมื่อคลิกภายนอก Popup
    window.onclick = function (event) {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    }

    // change result text
    let f_type = document.querySelector("#f_type")
    let f_status = document.querySelector("#f_status")
    f_type.innerText = "Product Type : "
    f_status.innerText = "Status : "
    if(result.includes("fresh")){
        let list = result.split("fresh_")[1]
        f_status.innerText += " Fresh"
        list = list.split("_")
        // list[0] = list[0][0].toUpperCase() + list[0].slice(1)
        for(let l of list){
            f_type.innerText += " " + l 
        }
    }
    else if(result.includes('stale')){
        let list = result.split("stale_")[1]
        f_status.innerText += " Stale"
        list = list.split("_")
        list[0] = list[0][0].toUpperCase() + list[0].slice(1)
        for(let l of list){
            f_type.innerText += " " + l 
        }
        let f_name = f_type.innerText.split("Product Type : ")[1].toLowerCase()
        let date = new Date().toISOString().split('T')[0];
        let formData = new FormData()
        formData.append("name", f_name)
        formData.append("date", date)
        await _axios.post('/item/create', formData)
    }
})

document.querySelector('.navbar a').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default anchor behavior
    window.location.href = 'history.html'; // Redirect to the history page
});

/*
*   Image validator & fetch predict api function
*   @version 1.0
*   @author GooDu-Dev <https://github.com/GooDu-dev>
*/

/**
 * Checking that image is really [jpg, png, jpeg]
 * @param {file} file 
 * @returns Promise<string | null>
 */
function checkImage(file) {
    // you can modify from this function to check valid image
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = function () {
            const arr = (new Uint8Array(reader.result)).subarray(0, 4);
            let header = "";
            for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);
            }

            // Check for common image file signatures
            const imageSignatures = {
                jpg: "ffd8ffe0",
                png: "89504e47",
                jpeg: "ffd8"
            };

            for (const [ext, sig] of Object.entries(imageSignatures)) {
                if (header.startsWith(sig)) {
                    resolve(ext); // Return the image type
                }
            }
            resolve(null); // Not an image
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsArrayBuffer(file); // Read file as ArrayBuffer
    });
}

/**
 * Send post request to server
 * @param {file} img_file 
 * @returns {object}
 */
async function predict(img_file) {
    // please handle img before send to this function
    /*
    *   Things to handle
    *   1. img is not null | undefined
    *   2. img is sent as file
    *   3. img is image, not others type
    * 
    *   I wrote sample image validator above you can modify or use that
    */
    const formData = new FormData();
    formData.append('file', img_file);
    const response = await _axios.post('/predict/', formData);
    // If there is an error, return ""
    if (!response) {
        return "";
    }
    // if nothing wrong, return data from backend
    return response.data;
}
