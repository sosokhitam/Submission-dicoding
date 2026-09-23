const BASE_URL = import.meta.env.VITE_FORUM_API_BASE_URL || 'https://forum-api.dicoding.dev/v1';
const TOKEN_KEY = import.meta.env.VITE_FORUM_TOKEN_KEY || 'forum-access-token';

function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function putAccessToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function removeAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function fetchWithAuth(url, options = {}) {
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${getAccessToken()}`,
  };
  return fetch(url, { ...options, headers });
}

async function handleResponse(response) {
  const json = await response.json();
  if (json.status !== 'success') {
    throw new Error(json.message || 'Terjadi kesalahan pada server');
  }
  return json.data;
}

async function register({ name, email, password }) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await handleResponse(response);
  return data.user;
}

async function login({ email, password }) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse(response);
  return data.token;
}

async function getOwnProfile() {
  const response = await fetchWithAuth(`${BASE_URL}/users/me`);
  const data = await handleResponse(response);
  return data.user;
}

async function getAllUsers() {
  const response = await fetch(`${BASE_URL}/users`);
  const data = await handleResponse(response);
  return data.users;
}

async function getThreads() {
  const response = await fetch(`${BASE_URL}/threads`);
  const data = await handleResponse(response);
  return data.threads;
}

async function getThreadDetail(id) {
  const response = await fetch(`${BASE_URL}/threads/${id}`);
  const data = await handleResponse(response);
  return data.detailThread;
}

async function createThread({ title, body, category = 'general' }) {
  const response = await fetchWithAuth(`${BASE_URL}/threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body, category }),
  });
  const data = await handleResponse(response);
  return data.thread;
}

async function createComment(threadId, content) {
  const response = await fetchWithAuth(`${BASE_URL}/threads/${threadId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  const data = await handleResponse(response);
  return data.comment;
}

async function voteThread(threadId, voteType) {
  const response = await fetchWithAuth(`${BASE_URL}/threads/${threadId}/${voteType}`, {
    method: 'POST',
  });
  await handleResponse(response);
}

async function voteComment(threadId, commentId, voteType) {
  const response = await fetchWithAuth(
    `${BASE_URL}/threads/${threadId}/comments/${commentId}/${voteType}`,
    { method: 'POST' },
  );
  await handleResponse(response);
}

async function getLeaderboards() {
  const response = await fetch(`${BASE_URL}/leaderboards`);
  const data = await handleResponse(response);
  return data.leaderboards;
}

const api = {
  getAccessToken,
  putAccessToken,
  removeAccessToken,
  register,
  login,
  getOwnProfile,
  getAllUsers,
  getThreads,
  getThreadDetail,
  createThread,
  createComment,
  voteThread,
  voteComment,
  getLeaderboards,
};

export default api;
