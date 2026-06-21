import axiosClient from '../app/providers/client'
export const getOtp = async()=>{
    return await axiosClient.get();

}

export const login = async(payload,signal)=>{
    return await axiosClient.post('/api/auth/login',{...payload}, signal);

}


export const register = async(payload,signal)=>{
    return await axiosClient.post('/api/auth/register',{...payload}, signal);
}
