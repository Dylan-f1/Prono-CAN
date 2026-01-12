import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Créer une instance axios avec configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Service d'authentification
export const authService = {
  // Inscription
  register: async (username, email, password) => {
    const response = await api.post('/auth/register', {
      username,
      email,
      password
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Connexion
  login: async (username, password) => {
    const response = await api.post('/auth/login', {
      username,
      password
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('matchPronos');
    localStorage.removeItem('playerPronos');
  },

  // Récupérer l'utilisateur connecté
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Service des pronos
export const pronoService = {
  // Récupérer tous les pronos de l'utilisateur
  getPronos: async () => {
    const response = await api.get('/pronos');
    return response.data;
  },

  // Sauvegarder les pronos des matchs
  saveMatchPronos: async (matchPronos) => {
    const response = await api.post('/pronos/matches', {
      matchPronos
    });
    return response.data;
  },

  // Sauvegarder les pronos des joueurs
  savePlayerPronos: async (playerPronos) => {
    const response = await api.post('/pronos/players', {
      playerPronos
    });
    return response.data;
  },

  // Supprimer tous les pronos
  deletePronos: async () => {
    const response = await api.delete('/pronos');
    return response.data;
  }
};

export default api;
