export interface SynopticStation {
  id: string;
  name: string;
  code: string;
  lat: number;
  lon: number;
  state: string;
}

export const INDIAN_SYNOPTIC_STATIONS: SynopticStation[] = [
  { id: 'st_delhi', name: 'NEW DELHI', code: 'DEL', lat: 28.6139, lon: 77.2090, state: 'Delhi' },
  { id: 'st_srinagar', name: 'SRINAGAR', code: 'SXR', lat: 34.0837, lon: 74.7973, state: 'J&K' },
  { id: 'st_shimla', name: 'SHIMLA', code: 'SLV', lat: 31.1048, lon: 77.1734, state: 'Himachal' },
  { id: 'st_dehradun', name: 'DEHRADUN', code: 'DED', lat: 30.3165, lon: 78.0322, state: 'Uttarakhand' },
  { id: 'st_chandigarh', name: 'CHANDIGARH', code: 'IXC', lat: 30.7333, lon: 76.7794, state: 'Punjab' },
  { id: 'st_amritsar', name: 'AMRITSAR', code: 'ATQ', lat: 31.6340, lon: 74.8723, state: 'Punjab' },
  { id: 'st_jaipur', name: 'JAIPUR', code: 'JAI', lat: 26.9124, lon: 75.7873, state: 'Rajasthan' },
  { id: 'st_jodhpur', name: 'JODHPUR', code: 'JDH', lat: 26.2389, lon: 73.0243, state: 'Rajasthan' },
  { id: 'st_bikaner', name: 'BIKANER', code: 'BKN', lat: 28.0229, lon: 73.3119, state: 'Rajasthan' },
  { id: 'st_lucknow', name: 'LUCKNOW', code: 'LKO', lat: 26.8467, lon: 80.9462, state: 'UP' },
  { id: 'st_kanpur', name: 'KANPUR', code: 'KNU', lat: 26.4499, lon: 80.3319, state: 'UP' },
  { id: 'st_varanasi', name: 'VARANASI', code: 'VNS', lat: 25.3176, lon: 82.9739, state: 'UP' },
  { id: 'st_patna', name: 'PATNA', code: 'PAT', lat: 25.5941, lon: 85.1376, state: 'Bihar' },
  { id: 'st_kolkata', name: 'KOLKATA', code: 'CCU', lat: 22.5726, lon: 88.3639, state: 'WB' },
  { id: 'st_siliguri', name: 'SILIGURI', code: 'IXB', lat: 26.7271, lon: 88.3953, state: 'WB' },
  { id: 'st_guwahati', name: 'GUWAHATI', code: 'GAU', lat: 26.1445, lon: 91.7362, state: 'Assam' },
  { id: 'st_dibrugarh', name: 'DIBRUGARH', code: 'DIB', lat: 27.4728, lon: 94.9120, state: 'Assam' },
  { id: 'st_shillong', name: 'SHILLONG', code: 'SHL', lat: 25.5788, lon: 91.8933, state: 'Meghalaya' },
  { id: 'st_agartala', name: 'AGARTALA', code: 'IXA', lat: 23.8315, lon: 91.2868, state: 'Tripura' },
  { id: 'st_bhubaneswar', name: 'BHUBANESWAR', code: 'BBI', lat: 20.2961, lon: 85.8245, state: 'Odisha' },
  { id: 'st_puri', name: 'PURI', code: 'PUR', lat: 19.8135, lon: 85.8312, state: 'Odisha' },
  { id: 'st_ranchi', name: 'RANCHI', code: 'IXR', lat: 23.3441, lon: 85.3096, state: 'Jharkhand' },
  { id: 'st_raipur', name: 'RAIPUR', code: 'RPR', lat: 21.2514, lon: 81.6296, state: 'Chhattisgarh' },
  { id: 'st_bhopal', name: 'BHOPAL', code: 'BHO', lat: 23.2599, lon: 77.4126, state: 'MP' },
  { id: 'st_indore', name: 'INDORE', code: 'IDR', lat: 22.7196, lon: 75.8577, state: 'MP' },
  { id: 'st_jabalpur', name: 'JABALPUR', code: 'JLR', lat: 23.1815, lon: 79.9864, state: 'MP' },
  { id: 'st_gwalior', name: 'GWALIOR', code: 'GWL', lat: 26.2183, lon: 78.1828, state: 'MP' },
  { id: 'st_nagpur', name: 'NAGPUR', code: 'NAG', lat: 21.1458, lon: 79.0882, state: 'Maharashtra' },
  { id: 'st_mumbai', name: 'MUMBAI', code: 'BOM', lat: 19.0760, lon: 72.8777, state: 'Maharashtra' },
  { id: 'st_pune', name: 'PUNE', code: 'PNQ', lat: 18.5204, lon: 73.8567, state: 'Maharashtra' },
  { id: 'st_ahmedabad', name: 'AHMEDABAD', code: 'AMD', lat: 23.0225, lon: 72.5714, state: 'Gujarat' },
  { id: 'st_surat', name: 'SURAT', code: 'STV', lat: 21.1702, lon: 72.8311, state: 'Gujarat' },
  { id: 'st_rajkot', name: 'RAJKOT', code: 'RAJ', lat: 22.3039, lon: 70.8022, state: 'Gujarat' },
  { id: 'st_hyderabad', name: 'HYDERABAD', code: 'HYD', lat: 17.3850, lon: 78.4867, state: 'Telangana' },
  { id: 'st_visakhapatnam', name: 'VISAKHAPATNAM', code: 'VTZ', lat: 17.6868, lon: 83.2185, state: 'AP' },
  { id: 'st_vijayawada', name: 'VIJAYAWADA', code: 'VGA', lat: 16.5062, lon: 80.6480, state: 'AP' },
  { id: 'st_bengaluru', name: 'BENGALURU', code: 'BLR', lat: 12.9716, lon: 77.5946, state: 'Karnataka' },
  { id: 'st_chennai', name: 'CHENNAI', code: 'MAA', lat: 13.0827, lon: 80.2707, state: 'TN' },
  { id: 'st_madurai', name: 'MADURAI', code: 'IXM', lat: 9.9252, lon: 78.1198, state: 'TN' },
  { id: 'st_coimbatore', name: 'COIMBATORE', code: 'CJB', lat: 11.0168, lon: 76.9558, state: 'TN' },
  { id: 'st_kochi', name: 'KOCHI', code: 'COK', lat: 9.9312, lon: 76.2673, state: 'Kerala' },
  { id: 'st_thiruvananthapuram', name: 'TRIVANDRUM', code: 'TRV', lat: 8.5241, lon: 76.9366, state: 'Kerala' },
  { id: 'st_panaji', name: 'GOA', code: 'GOI', lat: 15.4909, lon: 73.8278, state: 'Goa' },
  { id: 'st_leh', name: 'LEH', code: 'IXL', lat: 34.1526, lon: 77.5771, state: 'Ladakh' }
];
