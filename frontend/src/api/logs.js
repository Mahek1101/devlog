import API from './auth';

export const createLog  = (data)    => API.post('/logs/', data);
export const getMyLogs  = ()        => API.get('/logs/mine');
export const updateLog  = (id, data)=> API.put(`/logs/${id}`, data);
export const deleteLog  = (id)      => API.delete(`/logs/${id}`);
