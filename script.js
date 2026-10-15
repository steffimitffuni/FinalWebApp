// Lilo's interactive website
// Topics demonstrated: function expressions, arrow functions, callbacks,
// event listeners, this, call(), apply(), bind(), closures, IIFE and DOM methods.
//
// Sources:
// - FreeAPI random dog: https://freeapi.app/
// - Dog CEO API (breed list and breed photos): https://dog.ceo/dog-api/documentation/
// - Supabase REST API: https://supabase.com/docs/guides/api
// - fetch() and async/await: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// - jQuery slideToggle, fadeIn/fadeOut and animate: https://api.jquery.com/
 
// 1. Function expression: the function is stored in a variable.
const showMessage = function (text, element) {
    element.textContent = text;
};
 
// 2. Arrow function stored as a function reference.
const getElement = (id) => document.getElementById(id);
 
// 3. Closure: this function remembers its own count between calls.
function createFactCounter() {
    let count = 0;
    const facts = [
        "Lilo's name has four letters: L, I, L and O.",
        "Lilo was named after the character in Lilo and Stitch",
        "Lilo was found abandoned on a street in Hungary and found a new home with my sister during lockdown 2021."
    ];
 
    return function () {
        const fact = facts[count % facts.length];
        count++;
        return fact;
    };
}
 
const nextFact = createFactCounter();
 
getElement("factButton").addEventListener("click", function () {
    showMessage(nextFact(), getElement("factText"));
});
 
// 4. Callback: handleFormSubmit is passed to addEventListener and called on submit.
 
getElement("signupForm").addEventListener("submit", handleFormSubmit);
 
const SUPABASE_URL = "https://kyseloveffphvjdnyphn.supabase.co";
const SUPABASE_KEY = "sb_publishable__zOeLViD-5M9K7MOGwugeQ_ARiuzL_F";
 
async function handleFormSubmit(event) {
    event.preventDefault();
 
    const email = getElement("email").value.trim();
    const wantsUpdates = getElement("dogUpdates").checked;
    const message = getElement("message");
 
    if (!email) {
        showMessage("Please enter your email address.", message);
        return;
    }
 
    showMessage("Signing you up...", message);
 
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/lilo_signups`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                    "Prefer": "return=minimal"
                },
                body: JSON.stringify({
                    email: email,
                    wants_updates: wantsUpdates
                })
            }
        );
 
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Supabase error:", errorText);
            throw new Error("Signup failed");
        }
 
        showMessage(
            "Thanks for signing up for Lilo updates! 🐾",
            message
        );
 
        getElement("signupForm").reset();
 
    } catch (error) {
        console.error(error);
        showMessage(
            "Sorry, signup failed. Please try again.",
            message
        );
    }
}
 
// 5. DOM form handling and conditional logic.
getElement("walkForm").addEventListener("submit", (event) => {
    event.preventDefault();
 
    const input = getElement("walks");
    const walks = Number(input.value);
    const message = getElement("walkMessage");
 
    if (!input.value || !Number.isInteger(walks) || walks < 1 || walks > 20) {
        showMessage("Please enter a whole number between 1 and 20.", message);
    } else if (walks <= 2) {
        showMessage("That sounds a little low. Lilo wants to go outside!", message);
    } else if (walks <= 4) {
        showMessage("That sounds like a great amount of walks. Lilo would love that!", message);
    } else {
        showMessage("That's too many walks! Lilo needs to rest!", message);
    }
});
 
// 6. Event delegation: one callback handles clicks on both answer buttons.
getElement("interactive").addEventListener("click", (event) => {
    const button = event.target.closest(".answer-button");
    if (!button) return;
 
    const answer = button.dataset.answer;
    const message = getElement("quizMessage");
 
    if (answer === "no") {
        showMessage("Correct! Lilo doesn't get along with other dogs.", message);
    } else {
        showMessage("Not quite! Lilo doesn't get along with other dogs.", message);
    }
});
 
// 7. Function declaration used as a form callback.
function handleFriendSubmit(event) {
    event.preventDefault();
 
    const name = getElement("friendName").value.trim();
    if (!name) {
        showMessage("Please enter a name!", getElement("friendMessage"));
        return;
    }
 
    showMessage(`${name} sounds like a great name for Lilo's best friend!`, getElement("friendMessage"));
}
 
getElement("friendForm").addEventListener("submit", handleFriendSubmit);
 
// 10. this, call(), apply() and bind() demonstration.
const liloProfile = {
    name: "Lilo",
    introduce(prefix, punctuation) {
        return `${prefix} ${this.name}${punctuation}`;
    }
};
 
const otherDog = { name: "Lilo's best friend" };
 
// call(): pass arguments one by one and choose the value of this.
const callExample = liloProfile.introduce.call(otherDog, "Meet", "!");
 
// apply(): pass arguments in an array and choose the value of this.
const applyExample = liloProfile.introduce.apply(liloProfile, ["Hello, this is", "."]);
 
// bind(): create a new function with this fixed for later.
const boundIntroduction = liloProfile.introduce.bind(liloProfile, "Say hi to");
 
// 11. IIFE: runs once immediately to set up the page.
(function initialisePage() {
    getElement("photoCaption").dataset.alternate = "false";
    console.info("Lilo's page is ready.");
})();
 
// 12. Function reference: pass the function itself, not the result of calling it.
getElement("resetButton").addEventListener("click", resetInteractiveAnswers);
 
function resetInteractiveAnswers() {
    getElement("walkForm").reset();
    getElement("friendForm").reset();
    [
        "walkMessage",
        "quizMessage",
        "friendMessage"
    ].forEach((id) => {
        getElement(id).textContent = "";
    });
}
// 11. API 
 
getElement("dogButton").addEventListener("click", async () => {
    const button = getElement("dogButton");
    const message = getElement("dogMessage");
    const details = getElement("dogDetails");
 
    message.textContent = "Finding a dog...";
    button.disabled = true;
 
    try {
        const response = await fetch(
            "https://api.freeapi.app/api/v1/public/dogs/dog/random",
            {
                method: "GET",
                headers: {
                    accept: "application/json"
                }
            }
        );
 
        if (!response.ok) {
            throw new Error("The API request failed.");
        }
 
        const result = await response.json();
 
        // The dog information is inside result.data
        const dog = result.data;
 
        if (!result.success || !dog) {
            throw new Error("Dog information was not returned.");
        }
 
        // Display the dog's information
        getElement("dogName").textContent = dog.name;
        getElement("randomDog").src = dog.image.url;
        // Accessibility: describe the photo with the dog's name instead of a general text
        getElement("randomDog").alt = "Photo of a " + dog.name;
        getElement("dogBreed").textContent =
            dog.breed_group || "Not available";
        getElement("dogTemperament").textContent =
            dog.temperament || "Not available";
        getElement("dogLifespan").textContent =
            dog.life_span || "Not available";
        getElement("dogWeight").textContent =
            dog.weight.metric
                ? dog.weight.metric + " kg"
                : "Not available";
 
        details.hidden = false;
        message.textContent = "Meet " + dog.name + "! 🐾";
 
    } catch (error) {
        message.textContent =
            "Sorry, we couldn't load a dog. Please try again.";
 
        console.error("Error fetching dog:", error);
 
    } finally {
        button.disabled = false;
    }
});
 
// 13. API with form data: the breed and number of photos the user chooses
// are used to build the Dog CEO API address.
 
// Turns "germanshepherd" into "Germanshepherd" for display
const capitalise = (text) => text.charAt(0).toUpperCase() + text.slice(1);
 
// First API call: fill the <select> with all breeds when the page loads
async function loadBreeds() {
    const select = getElement("breedSelect");
 
    try {
        const response = await fetch("https://dog.ceo/api/breeds/list/all");
 
        if (!response.ok) {
            throw new Error("The breed list could not be loaded.");
        }
 
        const result = await response.json();
 
        // result.message is an object like { beagle: [], poodle: ["toy", ...] }.
        // Object.keys() gives us just the breed names.
        const breeds = Object.keys(result.message);
 
        select.innerHTML = '<option value="">Choose a breed</option>';
 
        breeds.forEach((breed) => {
            const option = document.createElement("option");
            option.value = breed;
            option.textContent = capitalise(breed);
            select.appendChild(option);
        });
 
    } catch (error) {
        console.error("Error loading breeds:", error);
        select.innerHTML = '<option value="">Breeds could not be loaded</option>';
        showMessage("Sorry, the breed list could not be loaded. Please reload the page.", getElement("breedMessage"));
    }
}
 
loadBreeds();
 
// Second API call: show photos of the chosen breed
getElement("breedForm").addEventListener("submit", async (event) => {
    event.preventDefault();
 
    const breed = getElement("breedSelect").value;
    const photoCount = document.querySelector('input[name="photoCount"]:checked').value;
    const message = getElement("breedMessage");
    const gallery = getElement("breedGallery");
    const button = getElement("breedButton");
 
    if (!breed) {
        showMessage("Please choose a breed first.", message);
        return;
    }
 
    showMessage("Loading photos...", message);
    gallery.innerHTML = "";
    button.disabled = true;
 
    try {
        const response = await fetch(
            `https://dog.ceo/api/breed/${breed}/images/random/${photoCount}`
        );
 
        if (!response.ok) {
            throw new Error("The photos could not be loaded.");
        }
 
        const result = await response.json();
 
        // result.message is a list of image addresses
        result.message.forEach((imageUrl, index) => {
            const item = document.createElement("li");
            const image = document.createElement("img");
            image.src = imageUrl;
            image.alt = `${capitalise(breed)} photo ${index + 1}`;
            item.appendChild(image);
            gallery.appendChild(item);
        });
 
        showMessage(`Here are ${result.message.length} ${capitalise(breed)} photo(s)! 🐾`, message);
 
    } catch (error) {
        console.error("Error fetching breed photos:", error);
        showMessage("Sorry, we couldn't load the photos. Please try again.", message);
 
    } finally {
        button.disabled = false;
    }
});
 
$(document).ready(function () {
 
    // Add a button below the About Lilo heading
    // aria-expanded and aria-controls tell screen readers whether the facts are open
    $("#about h2").after(
        '<button type="button" id="toggleAbout" aria-expanded="true" aria-controls="aboutContent">Hide Lilo facts ▲</button>'
    );
 
    // Put the existing content into a container
    $("#about").children()
        .not("h2, #toggleAbout")
        .wrapAll('<div id="aboutContent"></div>');
 
    // Open and close the content
    $("#toggleAbout").on("click", function () {
 
        $("#aboutContent").slideToggle(400);
 
        if ($(this).text().includes("Hide")) {
            $(this).text("Show Lilo facts ▼");
            $(this).attr("aria-expanded", "false");
        } else {
            $(this).text("Hide Lilo facts ▲");
            $(this).attr("aria-expanded", "true");
        }
 
    });
 
});
// 
$(document).ready(function () {
 
    // Create the floating button
    $("body").append(
        '<button type="button" id="backToLilo">Back to Lilo</button>'
    );
 
    // The position and style of the button are now in style.css (#backToLilo)
 
    // Show or hide the button while scrolling
    $(window).on("scroll", function () {
 
        if ($(window).scrollTop() > 300) {
            $("#backToLilo").fadeIn(400);
        } else {
            $("#backToLilo").fadeOut(400);
        }
 
    });
 
    // Scroll to Lilo's photo
    $("#backToLilo").on("click", function () {
 
        $("html, body").animate({
            scrollTop: $("#lilo").offset().top
        }, 600);
 
    });
 
});
 
