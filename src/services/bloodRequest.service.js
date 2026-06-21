import axiosClient from '../app/providers/client';

export const createBloodRequest = async (payload, signal) => {
    return await axiosClient.post('/api/requests', { ...payload }, signal);
}

export const getBloodRequests = async (signal) => {
    return await axiosClient.get('/api/requests', signal);
}

export const acceptBloodRequest = async (id, payload ,signal) => {
    return await axiosClient.patch(`/api/requests/${id}/accept`, { ...payload }, signal);
}

export const getBloodRequestById = async (id, signal) => { 
     return await axiosClient.get(`/api/requests/${id}`, signal);
 }
