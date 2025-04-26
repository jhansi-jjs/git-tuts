const OMDB_API_KEY = 'f1710233';
const OMDB_BASE = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}`;
const TMDB_API_KEY = '8b91fdf62918ce4ebe2fbf8de7f7301c';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w200';

let generatedOTP = '';

function sendOTP() {
  const contact = document.getElementById('contactInput').value.trim();
  if (!contact) {
    alert("Please enter a valid phone number or email.");
    return;
  }
  generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
  alert(`Simulated OTP sent to ${contact}: ${generatedOTP}`);
  document.getElementById("otpInput").style.display = "block";
  document.getElementById("verifyBtn").style.display = "block";
}

function verifyOTP() {
  const otp = document.getElementById("otpInput").value.trim();
  if (otp === generatedOTP) {
    document.getElementById("otpContainer").style.display = "none";
    document.getElementById("authContainer").style.display = "block";
  } else {
    alert("Invalid OTP. Please try again.");
  }
}

function showLogin() {
  alert("✅ Login successful!");
  window.location.href = 'main.html';
}

function showSignup() {
  alert("✅ Signup successful! Welcome!");
  window.location.href = 'main.html';
}

function goBack() {
  document.getElementById("mainContainer").style.display = "block";
  document.getElementById("backBtn").style.display = "none";
}

async function fetchTrendingMovies() {
  const resultsDiv = document.getElementById("results");
  if (!resultsDiv) return; // Ensure we're on the correct page
  resultsDiv.innerHTML = `<p>🔥 Loading trending movies...</p>`;
  try {
    const languages = ['hi', 'te', 'en'];
    let allMovies = [];

    for (const lang of languages) {
      const res = await fetch(`${TMDB_BASE}/movie/popular?api_key=${TMDB_API_KEY}&language=${lang}-IN`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      allMovies.push(...data.results);
    }

    displayMovies(allMovies);
  } catch (error) {
    resultsDiv.innerHTML = `<p>⚠️ Failed to load trending movies. Please try again later.</p>`;
    console.error(error);
  }
}

async function searchMovie() {
  const query = document.getElementById("searchInput").value.trim();
  const resultsDiv = document.getElementById("results");

  if (!query) {
    resultsDiv.innerHTML = `<p>🔎 Please enter a movie name.</p>`;
    return;
  }

  resultsDiv.innerHTML = `<p>🔍 Searching for "${query}"...</p>`;

  try {
    const res = await fetch(`${TMDB_BASE}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    displayMovies(data.results);
  } catch (error) {
    resultsDiv.innerHTML = `<p>⚠️ Search failed. Please try again later.</p>`;
    console.error(error);
  }
}

async function displayMovies(movies) {
  const resultsDiv = document.getElementById("results");
  if (!movies || movies.length === 0) {
    resultsDiv.innerHTML = `<p>🙁 No results found.</p>`;
    return;
  }

  resultsDiv.innerHTML = '';

  for (const movie of movies) {
    const titleOptions = [
      movie.title,
      movie.original_title,
      movie.name,
      movie.original_name
    ];

    let omdbData = null;

    for (let title of titleOptions) {
      if (!title) continue;
      const year = movie.release_date ? movie.release_date.split('-')[0] : '';
      try {
        const res = await fetch(`${OMDB_BASE}&t=${encodeURIComponent(title)}&y=${year}`);
        if (!res.ok) continue;
        const data = await res.json();
        if (data.Response !== "False") {
          omdbData = data;
          break;
        }
      } catch (error) {
        console.error(`OMDB fetch error for ${title}:`, error);
      }
    }

    const imdbLink = omdbData?.imdbID ? `https://www.imdb.com/title/${omdbData.imdbID}/` : '#';
    const poster = movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : 'https://via.placeholder.com/100x150?text=No+Image';

    const card = document.createElement('a');
    card.href = imdbLink;
    card.target = '_blank';
    card.className = 'movie-card';
    card.onclick = () => {
      document.getElementById("mainContainer").style.display = "none";
      document.getElementById("backBtn").style.display = "block";
    };

    card.innerHTML = `
      <img src="${poster}" alt="${movie.title || 'Movie'}" />
      <div class="movie-info">
        <h2>${movie.title || 'Unknown Title'}</h2>
        <p><strong>Year:</strong> ${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
        <p><strong>IMDb:</strong> ${omdbData?.imdbRating || 'N/A'}</p>
      </div>
    `;

    resultsDiv.appendChild(card);
  }
}

// Auto-load trending movies on main page
if (window.location.pathname.includes('main.html')) {
  fetchTrendingMovies();
}