const form = document.getElementById('upload-form');
const fileInput = document.getElementById('file');
const changeFileBtn = document.getElementById('changeFileBtn');
const submitButton = document.getElementById('submit-button');

changeFileBtn.addEventListener('click', function(event) {
    event.preventDefault(); 
    fileInput.click();
});

fileInput.addEventListener('change', function() {
    displayFileName();
});


function handleFormSubmission() {
    const loadingAnimationElement = document.getElementById('loading-animation');
    const captionElement = document.getElementById('caption');

    loadingAnimationElement.style.display = 'block';

    fetch(form.action, {
        method: form.method,
        body: new FormData(form),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            captionElement.textContent = data.caption;
            captionElement.style.display = data.display_style;
            loadingAnimationElement.style.display = 'none';
            const captionText = document.getElementById('caption');
            captionText.style.display = "";
        })
        .catch(error => {
            console.error('Error:', error);
            loadingAnimationElement.style.display = 'none';
        });
}

// Add an event listener for the form submission
form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    handleFormSubmission();
});

// Add an event listener for the submit button
submitButton.addEventListener('click', function () {
    handleFormSubmission();
});

var label = "Choose Image..";
var fileUploaded = false;

document.getElementById("drag-and-drop-text").innerHTML = label;
const changeText = document.getElementById('changeFileBtn');
changeText.style.display = "none";

function displayFileName() {
    const fileInput = document.getElementById('file');
    const fileLabel = document.getElementById('file-label');
    const dragText = document.getElementById('drag-and-drop-text');
    
    const submitButton = document.getElementById('submit-button');

    const fileName = fileInput.files[0].name;
    fileUploaded = true;
    fileLabel.querySelector('span').textContent = fileName;

    // Display the image preview and button
    const previewImage = document.getElementById('preview');
    previewImage.style.display = "none";

    // Show the submit button
    submitButton.style.display = "inline-block";
    changeText.style.display = "";
 

    // Get the file input value and set it as the background image for file-label
    const imageUrl = URL.createObjectURL(fileInput.files[0]);
    fileLabel.style.backgroundImage = `url(${imageUrl})`;
    fileLabel.style.backgroundSize = 'cover';


    // Get the dimensions of the image and set the width and height of the file-label element
    const img = new Image();
    img.src = imageUrl;
    img.onload = function () {
        const maxWidth = 450; // Set your maximum width here
        const maxHeight = 400; // Set your maximum height here
    
        // Calculate new dimensions while maintaining aspect ratio
        let newWidth = img.width;
        let newHeight = img.height;
    
        if (newWidth > maxWidth) {
            newWidth = maxWidth;
            newHeight = (newWidth / img.width) * img.height;
        }
    
        if (newHeight > maxHeight) {
            newHeight = maxHeight;
            newWidth = (newHeight / img.height) * img.width;
        }
    
        fileLabel.style.width = newWidth + 'px';
        fileLabel.style.height = newHeight + 'px';
    };

    document.getElementById("drag-and-drop-text").innerHTML = label;

    previewImage.style.display = "none";
    const previewButton = document.getElementById('submit-button');
    previewButton.style.display = "";
    dragText.style.display = "none";
  

    

}


form.addEventListener('dragover', function (e) {
    e.preventDefault();
    form.classList.add('dragover');
});

form.addEventListener('dragleave', function () {
    form.classList.remove('dragover');
});

form.addEventListener('drop', function (e) {
    e.preventDefault();
    form.classList.remove('dragover');

    const fileInput = document.getElementById('file');
    fileInput.files = e.dataTransfer.files;
    displayFileName();
});

const imageFiles = ['1000268201_693b08cb0e.jpg',
    '1001773457_577c3a7d70.jpg',
    '1002674143_1b742ab4b8.jpg',
    '1003163366_44323f5815.jpg',
    '1007129816_e794419615.jpg',
    '1007320043_627395c3d8.jpg',
    '1009434119_febe49276a.jpg',
    '1012212859_01547e3f17.jpg',
    '1015118661_980735411b.jpg',
    '1015584366_dfcec3c85a.jpg',
    '101654506_8eb26cfb60.jpg',
    '101669240_b2d3e7f17b.jpg',
    '1016887272_03199f49c4.jpg',
    '1019077836_6fc9b15408.jpg',
    '1019604187_d087bf9a5f.jpg',
    '1020651753_06077ec457.jpg',
    '1022454332_6af2c1449a.jpg',
    '1022454428_b6b660a67b.jpg',
    '1022975728_75515238d8.jpg'];



const imageCaptions = [
    'A child in a pink dress is climbing up a set of stairs in an entry way.',
    'A black dog and a spotted dog are fighting.',
    'A little girl covered in paint sits in front of a painted rainbow with her hands in a bowl.',
    'A man lays on a bench while his dog sits by him.',
    'A man in an orange hat starring at something.',
    'A child playing on a rope net.',
    'A black and white dog is running in a grassy garden surrounded by a white fence.',
    'A dog shakes its head near the shore  with a red ball next to it.',
    'A boy smiles in front of a stony wall in a city.',
    'A black dog leaps over a log.',
    'A brown and white dog is running through the snow.',
    'A man in a hat is displaying pictures next to a skier in a blue hat.',
    'A collage of one person climbing a cliff.',
    'A brown dog chases the water from a sprinkler on a lawn.',
    'A dog prepares to catch a thrown object in a field with nearby cars.',
    'A black and white dog jumping in the air to get a toy.',
    'A child and a woman are at waters edge in a big city.',
    'A couple and an infant being held by the male sitting next to a pond with a near by stroller.',
    'A black dog running in the surf.',
    'A man drilling a hole in the ice.'
]

// Function to preload images
function preloadImages() {
    imageFiles.forEach((imageFile) => {
        const img = new Image();
        img.src = `examples/${imageFile}`; 
    });
}

// Function to display images and captions in a slideshow
function startSlideshow() {
    const slideshow = document.getElementById('slideshow');
    let currentIndex = 0;

    function showNextImage() {
        slideshow.innerHTML = `<img src="examples/${imageFiles[currentIndex]}" alt="${imageCaptions[currentIndex]}">
                                   <div class="caption">${imageCaptions[currentIndex]}</div>`;
        currentIndex = (currentIndex + 1) % imageFiles.length;
    }

    showNextImage();

    setInterval(showNextImage, 5000);
}

window.onload = function () {
    preloadImages();
    startSlideshow();
};
