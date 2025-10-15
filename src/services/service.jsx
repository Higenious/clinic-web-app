import axios from 'axios';

 const baseUrl = import.meta.env.VITE_API_URL || "https://api.medipanels.com/api";
//const baseUrl ="https://api.medipanels.com/api";

//let cachedCommonMedicines = null;

export const login = async (payload) => {
  console.log('Attempting login with payload:', payload);

  try {
    const url = `${baseUrl}/login`;
    const response = await axios.post(url, payload);
    console.log('Login successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error.response ? error.response.data : { message: 'Network error or server unavailable.' };
  }
};

/** Malke appoitnmemnt 
 * remove messageType hardcoaded
*/
export const makeAppointment = async (appointmentData) => {
  try {
    const url = `${baseUrl}/doctor/appointment`;
    const payload = {
      ...appointmentData,
      messageType: "sms",
    };
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};


export const cancelAppointment = async(appointmentId) => {
  try {
    const url = `${baseUrl}/doctor/appointment/cancel/${appointmentId}`;
    console.log('url for cancel appointment : : : ->', url);
    const response = await axios.put(url);
    return response.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

export const getAllTodayAppointment = async (doctorId, hospitalId) => {
  try {
    console.log('===========>',doctorId, hospitalId);
    const url = `${baseUrl}/doctor/getTodayAppointment/${doctorId}/${hospitalId}`;
    console.log('get today appoitnment',url);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log('Error while fetching appointments', error);
  }
};

export const finzalizeAppointment= async (appointmentId, payload) => {
  try {
    console.log('finzalize appoitnment===========>',appointmentId,payload);
    const url = `${baseUrl}/doctor/appointment/finalize/${appointmentId}`;
    console.log('finzalizeAppointment',url);
    const response = await axios.put(url, payload);
    return response.data;
  } catch (error) {
    console.log('Error while finzalizeAppointment', error);
  }
};

export const addUserToPortal = async (userData) => {
  try {
    const url = `${baseUrl}/users`;
    const response = await axios.post(url, userData);
    return response.data;
  } catch (error) {
    console.log('Error while adding user', error);
  }
};


/** Get Medicines by doctor and hosptitalId */
export const getMedicinesList = async (doctorId, hospitalId)  => {
  console.log('Attempting getMedicinesList:', doctorId, hospitalId);

  try {
    const url = `${baseUrl}/doctor/medicines/${doctorId}/${hospitalId}`;
    console.log('get Medicines =====>', url);
    const response = await axios.get(url);
    console.log('medicines list:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during fetching medicines:', error);
    throw error.response ? error.response.data : { message: 'Network error or server unavailable.' };
  }
};


/** Get All doctors list  */
export const getDoctorList = async ( hospitalId)  => {
  console.log('Attempting Get All doctors list:', hospitalId);

  try {
    const url = `${baseUrl}/admin/doctors/${hospitalId}`;
    console.log('get doctor list =====>', url);
    const response = await axios.get(url);
    console.log('doctor list:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during fetching doctor list:', error);
    throw error.response ? error.response.data : { message: 'Network error or server unavailable.' };
  }
};


/** Register doctor */
export const registerDoctor = async (payload) => {
  console.log('adding doctor with payload:', payload);

  try {
    const url = `${baseUrl}/doctor/register`;
    const response = await axios.post(url, payload);
    console.log('doctor register successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during register doctor:', error);
    throw error.response ? error.response.data : { message: 'Network error or server unavailable.' };
  }
};

/** Create Hospital list */
export const registerHospital = async (payload) => {
  console.log('adding hospital with payload:', payload);

  try {
    const url = `${baseUrl}/admin/create-hospital`;
    const response = await axios.post(url, payload);
    console.log('hospital register successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during register hospital:', error);
    throw error.response ? error.response.data : { message: 'Network error or server unavailable.' };
  }
};

/** Add Medicines list by Hospital */
export const addMedicinesByHospital = async (payload) => {
  console.log('adding Medicines with payload:', payload);

  try {
    const url = `${baseUrl}/doctor/medicines`;
    const response = await axios.post(url, payload);
    console.log('add Medicines successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during add Medicines:', error);
    throw error.response ? error.response.data : { message: 'Network error or server unavailable.' };
  }
};



/** get patient record by mobile and doctor Id */
export const getPatiendByMobile = async (mobile, doctorId) => {
  console.log('getPatiendByMobile:', mobile, doctorId);

  try {
    const url = `${baseUrl}/admin/patient/${doctorId}/${mobile}`;
    const response = await axios.get(url);
    console.log('getPatiendByMobile:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during getPatiendByMobile', error);
    throw error.response ? error.response.data : { message: 'Network error or server unavailable.' };
  }
};



/** get all commmont medicines */
export const getAllCommonMedicines = async () => {
  try {
    const url = `${baseUrl}/doctor/medicines`;
    const response = await axios.get(url);
    //cachedCommonMedicines = response.data;
    return response.data;
  } catch (error) {
    console.error('Error during fetching all Medicines:', error);
    throw error.response ? error.response.data : { message: 'Network error or server unavailable.' };
  }
};

/** Add medicines by admin */
export const addCommonMedicines = async (payload) => {
  console.log('add Medicines list');

  try {
    const url = `${baseUrl}/doctor/medicines`;
    const response = await axios.post(url, payload);
    console.log(' add Medicines list', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during add Medicines:', error);
    throw error.response ? error.response.data : { message: 'Network error or server unavailable.' };
  }
};


export const forgotPassword = async ({ mobile }) => {
  // Mock API
  if (mobile === "9999999999") return { success: true };
  return { success: false };
};