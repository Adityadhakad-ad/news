const API_KEY = "ae4c776814214951bc9b5ba0a6dda530";
const API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;

let articles = [];
let currentIndex = 0;

const loading = document.getElementById("loading");
const error = document.getElementById("error");
const errorMessage = document.getElementById("error-message");
const newsContainer = document.getElementById("news-container");
const newsImage = document.getElementById("news-image");
const newsTitle = document.getElementById("news-title");
const newsDescription = document.getElementById("news-description");
const source = document.getElementById("source");
const published = document.getElementById("published");
const author = document.getElementById("author");
const readMore = document.getElementById("read-more");
const currentIndexElement = document.getElementById("current-index");
const totalNews = document.getElementById("total-news");
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");
const retryButton = document.getElementById("retry-btn");

async function loadNews() {
    loading.classList.remove("hidden");
    error.classList.add("hidden");
    newsContainer.classList.add("hidden");

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (data.status !== "ok") {
            throw new Error(data.message || "News API error");
        }

        articles = (data.articles || []).filter(
            article => article.title && article.title !== "[Removed]"
        );

        if (articles.length === 0) {
            throw new Error("No news articles were found.");
        }

        currentIndex = 0;
        totalNews.textContent = articles.length;
        displayArticle();

        loading.classList.add("hidden");
        newsContainer.classList.remove("hidden");
    } catch (err) {
        console.error(err);
        loading.classList.add("hidden");
        error.classList.remove("hidden");
        errorMessage.textContent = err.message || "Unable to fetch news.";
    }
}

function displayArticle() {
    const article = articles[currentIndex];

    newsImage.src = article.urlToImage || "https://placehold.co/900x500/171922/ffffff?text=No+Image";
    newsImage.alt = article.title || "News article";
    newsTitle.textContent = article.title;
    newsDescription.textContent = article.description || "No description is available for this article.";
    source.textContent = article.source?.name || "News";

    if (article.publishedAt) {
        const date = new Date(article.publishedAt);
        published.textContent = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    }

    author.textContent = article.author || "News Desk";
    readMore.href = article.url;
    currentIndexElement.textContent = currentIndex + 1;

    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === articles.length - 1;
}

prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        displayArticle();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});

nextButton.addEventListener("click", () => {
    if (currentIndex < articles.length - 1) {
        currentIndex++;
        displayArticle();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});

retryButton.addEventListener("click", loadNews);

loadNews();
