import axios from 'axios';

const baseUrl = 'http://localhost:5000';

export const makeAppointment = async (appointmentData) => {
  console.log('Making appointment = = = = =>', appointmentData);

  try {
    const url =`${baseUrl}/appointments`
    const response = await axios.post(url, appointmentData);
    console.log('Appointment created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

export const getAllTodayAppointment =async()=>{
    try {
        const url =`${baseUrl}/appointments`
        const response = await axios.get(url);
        console.log('Appointment created:', response.data);
        return response.data;
    } catch (error) {
        console.log('Error while fetching appointments', error)
    }
    
}

/** Add user */
export const addUserToPortal = async(userData)=>{
    try {
        const url =`${baseUrl}/users`
        const response = await axios.post(url, userData);
        console.log('Appointment created:', response.data);
        return response.data;
    } catch (error) {
        console.log('Error while fetching appointments', error)
    }
}