const generateForm = document.querySelector(".generator-form");
const imageGallery = document.querySelector(".image-gallary");

const OPENAI_API_KEY = "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";

const updateImagecard = (imgDataArray) => {
  imgDataArray.forEach((imgObject, index) => {
    const imgCard = imageGallery.querySelectorAll(".img-card")[index];
    const imgELement = imgCard.querySelector("img");

    const aiGenerateImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
    imgELement.src = aiGenerateImg;

    imgELement.onload = () => {
      imgCard.classList.remove("loading");
    };
  });
};

const generateAiImages = async (userPrompt, userImgQuantity) => {
  try {
    // Send a request to the OpenAI API to generate images based on user inputs
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Organization": "org-nKS2d7bZskAUyvb6flOGoaBb"
        },
        body: JSON.stringify({
          prompt: userPrompt,
          n: parseInt(userImgQuantity),
          size: "512x512",
          response_format: "b64_json",
          model: "dall-e-2"
        }),
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Failed to load image. Status: ${response.status}, Error: ${errorMessage}`
      );
    }

    const { data } = await response.json();
    updateImagecard([...data]);
  } catch (error) {
      console.error(error.message);
  }
};

const handleFormSubmission = (e) => {
  e.preventDefault();

  const userPrompt = e.srcElement[0].value;
  const userImgQuantity = e.srcElement[1].value;

  const imageCardMarkup = Array.from(
    { length: userImgQuantity },
    () =>
      `<div class="img-card loading">
        <img src="/images/loader.svg" alt="image">
        <a href="#" class="download-btn">
            <img src="/images/download.svg" alt="download icon">
        </a>
    </div>`
  ).join("");

  imageGallery.innerHTML = imageCardMarkup;
  generateAiImages(userPrompt, userImgQuantity);
};

generateForm.addEventListener("submit", handleFormSubmission);
