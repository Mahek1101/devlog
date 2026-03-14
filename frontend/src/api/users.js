import API from './auth';

export const getProfile    = (username) => API.get(`/users/${username}`);
export const getUserLogs   = (username) => API.get(`/users/${username}/logs`);
export const followUser    = (username) => API.post(`/users/${username}/follow`);
export const unfollowUser  = (username) => API.delete(`/users/${username}/follow`);
export const searchUsers   = (q)        => API.get(`/users/search/users?q=${q}`);
export const getFeed       = ()         => API.get('/feed/');
