import axiosClient from './axiosClient';

export const taxationApi = {
  /**
   * Fetch property tax demand and assessment details for a parcel
   */
  getTaxationByUlpin: (ulpin) => axiosClient.get(`/parcels/${ulpin}/taxation`),

  /**
   * Pay property tax dues
   */
  payTax: (ulpin, paymentDetails) => axiosClient.post(`/parcels/${ulpin}/taxation/pay`, paymentDetails),
};

export default taxationApi;
