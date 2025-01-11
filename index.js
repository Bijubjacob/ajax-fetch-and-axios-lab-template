// The breed selection input element.
const breedSelect = document.getElementById('breedSelect');
// The information section div element.
const infoDump = document.getElementById('infoDump');
// The progress bar div element.
const progressBar = document.getElementById('progressBar');
// The get favourites button element.
const getFavouritesBtn = document.getElementById('getFavouritesBtn');

// Step 0: Store your API key here for reference and easy access.
const API_KEY = 'live_PTBsZu7ulArXcFor0bDlKJCM1Os7Dhqfjh75emz56pmECuK4m3fCyH3C1sDuMwko';

/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */

async function initialLoad() {
    const res = await fetch('https://api.thecatapi.com/v1/breeds/abys', {
        method: 'GET',
        headers: {
            'x-api-key': API_KEY
        },
        mode: 'no-cors'
    });
    const data = await res.json();

    for (let i = 0; i < data.length; i++) {
        let option = document.createElement("OPTION");
        option.id = data[i].id;
        option.value = data[i].id;
        option.text = data[i].name;

        breedSelect.appendChild(option);
    }
    if (breedSelect.firstChild) {
        breedSelect.selectedIndex = 0
        breedSelect.dispatchEvent(new Event('change'))
    }
}

initialLoad();

/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */

document.addEventListener("DOMContentLoaded", () => {
    initialLoad();  // Initial load of breeds and images

    breedSelect.addEventListener("change", async (e) => {
        clearCarousel();  // Clear existing carousel items before fetching new ones
        const breedId = e.target.value;  // Get selected breed ID
        await handleBreedSelection(breedId);  // Fetch and display breed info and images
    });

    // Function to handle breed selection
    async function handleBreedSelection(breedId) {
        try {
            // Clear existing carousel items before fetching new ones
            clearCarousel();

            // Fetch breed details using fetch()
            const breedRes = await fetch(`https://api.thecatapi.com/v1/breeds/${breedId}`, {
                method: 'GET',
                headers: {
                    'x-api-key': API_KEY
                }
            });
            const breedData = await breedRes.json();
            displayBreedInfo(breedData);  // Display breed info

            // Fetch breed images using fetch()
            const imgRes = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&limit=5`, {
                method: 'GET',
                headers: {
                    'x-api-key': API_KEY
                }
            });
            const imgData = await imgRes.json();

            // Check if image data exists
            if (imgData.length > 0) {
                imgData.forEach(image => {
                    const carItem = createCarouselItem(image.url, image.id);
                    appendCarousel(carItem);
                });
            } else {
                console.log("No images found for this breed.");
                infoDump.innerText = "No images found for this breed.";
            }

            startCarousel();  // Start the carousel after images are added
        } catch (error) {
            console.error("Error fetching breed or images", error);
            infoDump.innerText = "Oops! Something went wrong.";
        }
    }


    // Function to display breed info
    function displayBreedInfo(breedInfo) {
        infoDump.innerText = breedInfo.description || 'No description available.';
    }
});


function clearCarousel() {
    const carouselInner = document.getElementById('carouselInner');

    if (carouselInner) {
        while (carouselInner.firstChild) {
            carouselInner.removeChild(carouselInner.firstChild);
        }
    } else {
        console.error("Carousel inner element not found!");
    }

    infoDump.innerText = '';  // Reset the breed information
}

/**
 * Function to display breed information
 */
function displayBreedInfo(breedInfo) {
    try {
        const description = breedInfo.description || 'No description available for this breed.';
        infoDump.innerText = description;
    } catch (e) {
        infoDump.innerText = 'No information available!';
    }
}

/**
 * Function to create carousel items (assuming the Carousel.js functions are now replaced with basic JS)
 */
function createCarouselItem(imageUrl, imgId) {
    // Create the image element
    const img = document.createElement('img');
    img.src = imageUrl;  // Ensure the image URL is correct
    img.alt = 'Cat Image';  // Alt text for accessibility
    img.className = 'carousel-img';  // Add a class for styling
    img.dataset.id = imgId;  // Store the image ID for future use
    img.addEventListener('click', () => favourite(imgId)); // Add like functionality

    // Create a new carousel item div
    const div = document.createElement('div');
    div.className = 'carousel-item';

    // Append the image to the carousel item div
    div.appendChild(img);

    return div;
}

/**
 * Function to append to the carousel
 */
export function appendCarousel(carItem) {
    const carouselInner = document.getElementById('carouselInner');

    if (carouselInner) {
        carouselInner.appendChild(carItem);  // Append if carouselInner exists
    } else {
        console.error("Error: carouselInner element not found!");
    }
}

/**
 * Function to start the carousel
 */
function startCarousel() {
    const carousel = new bootstrap.Carousel('#carouselExampleControls', {
        interval: 3000, // Set an interval to auto-slide
        ride: 'carousel'
    });
    carousel.cycle(); // Start the carousel
}

/**
 * 6. Implement progress bar with fetch
 */
function updateProgress(event) {
    if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

/**
 * 8. Implement the favourite functionality using fetch()
 */
// The favourite function, as implemented in your code.
export async function favourite(imgId) {
    const userId = "user312jacob"; // Or dynamically get user ID

    // Check if the image is already liked
    const likedPics = await getLikedPics();

    let alreadyLiked = false;
    for (let i = 0; i < likedPics.length; i++) {
        if (likedPics[i].image_id === imgId) {
            await deleteFavourite(likedPics[i].id); // Delete if already liked
            alreadyLiked = true;
            break;
        }
    }

    if (!alreadyLiked) {
        await addFavourite(imgId, userId); // Add to favourites
    }
}

/**
 * Function to get liked pictures
 */
async function getLikedPics() {
    const res = await fetch(`https://api.thecatapi.com/v1/favourites?sub_id=user312jacob`, {
        headers: { 'x-api-key': API_KEY }
    });
    const data = await res.json();
    return data;
}

/**
 * Function to add an image to favourites
 */
async function addFavourite(imgId, userId) {
    const body = JSON.stringify({
        image_id: imgId,
        sub_id: userId
    });

    try {
        const res = await fetch('https://api.thecatapi.com/v1/favourites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: body
        });
        const data = await res.json();
        console.log('Successfully liked the image!', data);
    } catch (error) {
        console.log('Error adding to favourites:', error);
    }
}

/**
 * Function to delete a favourite
 */
async function deleteFavourite(favId) {
    try {
        const res = await fetch(`https://api.thecatapi.com/v1/favourites/${favId}`, {
            method: 'DELETE',
            headers: {
                'x-api-key': API_KEY
            }
        });
        console.log('Successfully removed from favourites', res);
    } catch (error) {
        console.log('Error removing from favourites:', error);
    }
}

/**
 * Function to handle the get favourites button
 */
getFavouritesBtn.addEventListener('click', async () => {
    clearCarousel();

    const data = await getLikedPics();
    data.forEach(item => {
        const carItem = createCarouselItem(item.image.url, ' cat', item.image_id);
        appendCarousel(carItem);
    });

    startCarousel();
    infoDump.innerText = 'These are your liked pictures!';
});


/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */