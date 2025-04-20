const API_KEY = 'f1710233';
const BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;
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
  document.getElementById("authContainer").style.display = "none";
  document.getElementById("mainContainer").style.display = "block";
  fetchTrendingMovies();
}

function showSignup() {
  alert("✅ Signup successful! Welcome!");
  document.getElementById("authContainer").style.display = "none";
  document.getElementById("mainContainer").style.display = "block";
  fetchTrendingMovies();
}

async function fetchTrendingMovies() {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = `<p>🔥 Loading trending movies...</p>`;
  try {
    const response = await fetch(`${BASE_URL}&s=popular`);
    const data = await response.json();
    displayMovies(data);
  } catch (error) {
    resultsDiv.innerHTML = `<p>⚠️ Failed to load trending movies.</p>`;
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
    const response = await fetch(`${BASE_URL}&s=${encodeURIComponent(query)}`);
    const data = await response.json();
    displayMovies(data);
  } catch (error) {
    resultsDiv.innerHTML = `<p>⚠️ Search failed.</p>`;
  }
}

function displayMovies(data) {
  const resultsDiv = document.getElementById("results");
  if (data.Response === "True") {
    resultsDiv.innerHTML = data.Search.map(movie => {
      const poster = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/100x150?text=No+Image";
      const imdbLink = `https://www.imdb.com/title/${movie.imdbID}/`;
      return `
        <a class="movie-card" href="${imdbLink}" target="_blank">
          <img src="${poster}" alt="${movie.Title} Poster" />
          <div class="movie-info">
            <h2>${movie.Title}</h2>
            <p><strong>Year:</strong> ${movie.Year}</p>
            <p><strong>Type:</strong> ${movie.Type}</p>
          </div>
        </a>
      `;
    }).join('');
  } else {
    resultsDiv.innerHTML = `<p>🙁 No results found.</p>`;
  }
}
