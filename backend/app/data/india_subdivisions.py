"""
India Meteorological Department (IMD) 36 Meteorological Subdivisions
With centroid coordinates, bounding polygons, and regional vulnerability profiles.
"""

from typing import List, Dict, Any

IMD_SUBDIVISIONS: List[Dict[str, Any]] = [
    {
        "id": "sub_01",
        "code": "ANI",
        "name": "Andaman & Nicobar Islands",
        "zone": "Island",
        "lat": 11.667,
        "lon": 92.735,
        "bounds": [[6.5, 92.0], [13.7, 94.0]],
        "vulnerable_to": ["Cyclones", "Heavy Rainfall", "Monsoon Surge"],
        "coordinates": [
            [92.5, 6.7], [93.9, 7.0], [93.8, 13.5], [92.6, 13.6], [92.5, 6.7]
        ]
    },
    {
        "id": "sub_02",
        "code": "ARP",
        "name": "Arunachal Pradesh",
        "zone": "Northeast",
        "lat": 28.218,
        "lon": 94.727,
        "bounds": [[26.6, 91.5], [29.5, 97.4]],
        "vulnerable_to": ["Cloudbursts", "Flash Floods", "Orographic Rain"],
        "coordinates": [
            [91.5, 27.0], [93.5, 28.5], [96.5, 29.3], [97.3, 28.0], [95.5, 27.1], [91.5, 27.0]
        ]
    },
    {
        "id": "sub_03",
        "code": "ASM",
        "name": "Assam & Meghalaya",
        "zone": "Northeast",
        "lat": 26.200,
        "lon": 92.937,
        "bounds": [[24.5, 89.8], [28.0, 96.0]],
        "vulnerable_to": ["Brahmaputra Floods", "Heavy Monsoon Rain", "Landslides"],
        "coordinates": [
            [89.9, 25.5], [91.5, 26.8], [95.0, 27.8], [94.5, 26.2], [92.0, 25.1], [89.9, 25.5]
        ]
    },
    {
        "id": "sub_04",
        "code": "NMMT",
        "name": "Nagaland, Manipur, Mizoram & Tripura",
        "zone": "Northeast",
        "lat": 24.500,
        "lon": 93.500,
        "bounds": [[21.9, 91.2], [27.0, 95.2]],
        "vulnerable_to": ["Heavy Rainfall", "Flash Floods", "Landslides"],
        "coordinates": [
            [91.3, 23.5], [93.2, 26.8], [95.0, 26.5], [93.8, 22.0], [92.1, 22.5], [91.3, 23.5]
        ]
    },
    {
        "id": "sub_05",
        "code": "SHWB",
        "name": "Sub-Himalayan West Bengal & Sikkim",
        "zone": "East",
        "lat": 26.800,
        "lon": 88.500,
        "bounds": [[25.5, 87.9], [28.1, 89.9]],
        "vulnerable_to": ["Break Monsoon Torrential Rain", "Landslides", "Floods"],
        "coordinates": [
            [88.0, 26.0], [88.1, 28.0], [89.0, 28.0], [89.8, 26.5], [88.5, 25.6], [88.0, 26.0]
        ]
    },
    {
        "id": "sub_06",
        "code": "GWB",
        "name": "Gangetic West Bengal",
        "zone": "East",
        "lat": 22.800,
        "lon": 87.800,
        "bounds": [[21.5, 86.5], [24.5, 89.0]],
        "vulnerable_to": ["Monsoon Depressions", "Nor'westers (Kalbaishakhi)", "Cyclonic Storms"],
        "coordinates": [
            [86.7, 21.6], [86.9, 24.1], [88.8, 24.3], [88.9, 21.7], [86.7, 21.6]
        ]
    },
    {
        "id": "sub_07",
        "code": "ODS",
        "name": "Odisha",
        "zone": "East",
        "lat": 20.500,
        "lon": 84.500,
        "bounds": [[17.8, 81.3], [22.6, 87.5]],
        "vulnerable_to": ["Monsoon Depressions", "Tropical Cyclones", "Extreme Rainfall"],
        "coordinates": [
            [81.5, 18.2], [82.5, 22.2], [86.5, 22.4], [87.1, 21.4], [85.0, 19.3], [81.5, 18.2]
        ]
    },
    {
        "id": "sub_08",
        "code": "JHK",
        "name": "Jharkhand",
        "zone": "East",
        "lat": 23.600,
        "lon": 85.300,
        "bounds": [[21.9, 83.3], [25.3, 87.9]],
        "vulnerable_to": ["Depression Track Incursions", "Thunderstorms", "Heatwaves"],
        "coordinates": [
            [83.5, 22.0], [83.6, 24.5], [87.5, 25.2], [86.9, 22.3], [83.5, 22.0]
        ]
    },
    {
        "id": "sub_09",
        "code": "BHR",
        "name": "Bihar",
        "zone": "East",
        "lat": 25.800,
        "lon": 85.800,
        "bounds": [[24.3, 83.3], [27.5, 88.3]],
        "vulnerable_to": ["Break Monsoon Downpours", "Kosi Floods", "Lightning Storms"],
        "coordinates": [
            [83.4, 24.7], [84.1, 27.4], [88.1, 26.5], [87.8, 24.4], [83.4, 24.7]
        ]
    },
    {
        "id": "sub_10",
        "code": "EUP",
        "name": "East Uttar Pradesh",
        "zone": "North",
        "lat": 26.500,
        "lon": 82.500,
        "bounds": [[24.0, 80.5], [28.5, 84.5]],
        "vulnerable_to": ["Trough Shift Errors", "Monsoon Floods", "Heatwaves"],
        "coordinates": [
            [80.6, 24.5], [81.0, 28.0], [84.2, 27.5], [83.9, 24.1], [80.6, 24.5]
        ]
    },
    {
        "id": "sub_11",
        "code": "WUP",
        "name": "West Uttar Pradesh",
        "zone": "North",
        "lat": 28.000,
        "lon": 78.500,
        "bounds": [[26.0, 77.0], [30.0, 80.5]],
        "vulnerable_to": ["Western Disturbance Interaction", "Dust Storms", "Heatwaves"],
        "coordinates": [
            [77.2, 26.8], [77.5, 29.8], [80.4, 28.6], [79.8, 26.1], [77.2, 26.8]
        ]
    },
    {
        "id": "sub_12",
        "code": "UTK",
        "name": "Uttarakhand",
        "zone": "North",
        "lat": 30.200,
        "lon": 79.200,
        "bounds": [[28.7, 77.6], [31.5, 81.1]],
        "vulnerable_to": ["Cloudbursts", "Orographic Rain Amplification", "Landslides"],
        "coordinates": [
            [77.8, 29.5], [78.2, 31.4], [80.8, 30.8], [80.3, 28.9], [77.8, 29.5]
        ]
    },
    {
        "id": "sub_13",
        "code": "HCD",
        "name": "Haryana, Chandigarh & Delhi",
        "zone": "North",
        "lat": 29.200,
        "lon": 76.800,
        "bounds": [[27.6, 74.4], [30.9, 77.6]],
        "vulnerable_to": ["Urban Floods", "WD-Monsoon Interaction", "Fog & Heatwaves"],
        "coordinates": [
            [74.6, 28.2], [75.2, 30.7], [77.4, 30.4], [77.3, 27.9], [74.6, 28.2]
        ]
    },
    {
        "id": "sub_14",
        "code": "PNB",
        "name": "Punjab",
        "zone": "North",
        "lat": 31.000,
        "lon": 75.400,
        "bounds": [[29.5, 73.8], [32.5, 76.9]],
        "vulnerable_to": ["Western Disturbances", "Pre-monsoon Squalls", "Coldwaves"],
        "coordinates": [
            [74.0, 29.8], [74.5, 32.3], [76.5, 32.1], [76.4, 30.1], [74.0, 29.8]
        ]
    },
    {
        "id": "sub_15",
        "code": "HMP",
        "name": "Himachal Pradesh",
        "zone": "North",
        "lat": 31.800,
        "lon": 77.200,
        "bounds": [[30.3, 75.6], [33.3, 79.0]],
        "vulnerable_to": ["Heavy Snowfall", "Cloudbursts", "Glacial Lake Outbursts"],
        "coordinates": [
            [75.8, 31.0], [76.5, 33.1], [78.8, 32.4], [78.1, 30.6], [75.8, 31.0]
        ]
    },
    {
        "id": "sub_16",
        "code": "JKL",
        "name": "Jammu & Kashmir and Ladakh",
        "zone": "North",
        "lat": 34.000,
        "lon": 76.500,
        "bounds": [[32.2, 73.4], [37.1, 80.3]],
        "vulnerable_to": ["Western Disturbances", "Snowstorms", "Avalanches"],
        "coordinates": [
            [73.8, 33.2], [74.5, 36.8], [78.5, 35.5], [79.5, 32.5], [75.0, 32.5], [73.8, 33.2]
        ]
    },
    {
        "id": "sub_17",
        "code": "WRJ",
        "name": "West Rajasthan",
        "zone": "Northwest",
        "lat": 26.900,
        "lon": 72.000,
        "bounds": [[24.5, 69.5], [30.2, 74.5]],
        "vulnerable_to": ["Extreme Heatwaves", "Desert Cyclogenesis Errors", "Dust Storms"],
        "coordinates": [
            [69.7, 25.0], [70.2, 29.8], [74.2, 29.5], [73.8, 25.2], [69.7, 25.0]
        ]
    },
    {
        "id": "sub_18",
        "code": "ERJ",
        "name": "East Rajasthan",
        "zone": "Northwest",
        "lat": 25.800,
        "lon": 75.800,
        "bounds": [[23.5, 73.0], [28.2, 78.2]],
        "vulnerable_to": ["Flash Floods", "Heatwaves", "Monsoon Trough Errors"],
        "coordinates": [
            [73.2, 24.0], [74.0, 27.9], [77.8, 27.5], [76.8, 23.8], [73.2, 24.0]
        ]
    },
    {
        "id": "sub_19",
        "code": "WMP",
        "name": "West Madhya Pradesh",
        "zone": "Central",
        "lat": 23.500,
        "lon": 76.500,
        "bounds": [[21.1, 74.0], [26.9, 79.0]],
        "vulnerable_to": ["Depression Crossing Heavy Rain", "Heatwaves", "Thunderstorms"],
        "coordinates": [
            [74.2, 21.5], [75.0, 26.5], [78.6, 26.2], [77.8, 21.4], [74.2, 21.5]
        ]
    },
    {
        "id": "sub_20",
        "code": "EMP",
        "name": "East Madhya Pradesh",
        "zone": "Central",
        "lat": 23.200,
        "lon": 80.800,
        "bounds": [[21.5, 78.5], [25.3, 82.8]],
        "vulnerable_to": ["Monsoon Depressions", "Lightning", "Floods"],
        "coordinates": [
            [78.8, 21.7], [79.2, 25.1], [82.5, 24.8], [82.0, 21.8], [78.8, 21.7]
        ]
    },
    {
        "id": "sub_21",
        "code": "GJR",
        "name": "Gujarat Region",
        "zone": "West",
        "lat": 22.500,
        "lon": 72.800,
        "bounds": [[20.1, 71.5], [24.7, 74.5]],
        "vulnerable_to": ["Mid-Tropospheric Cyclones", "Heavy Monsoon Rain", "Floods"],
        "coordinates": [
            [71.8, 20.5], [72.2, 24.4], [74.2, 24.0], [73.8, 20.3], [71.8, 20.5]
        ]
    },
    {
        "id": "sub_22",
        "code": "SAU",
        "name": "Saurashtra & Kutch",
        "zone": "West",
        "lat": 22.300,
        "lon": 70.300,
        "bounds": [[20.7, 68.1], [24.7, 72.2]],
        "vulnerable_to": ["Arabian Sea Cyclones", "Coastal Surges", "Flash Floods"],
        "coordinates": [
            [68.3, 22.8], [70.0, 24.4], [72.0, 23.1], [71.5, 20.9], [69.2, 21.4], [68.3, 22.8]
        ]
    },
    {
        "id": "sub_23",
        "code": "KNG",
        "name": "Konkan & Goa",
        "zone": "West",
        "lat": 17.500,
        "lon": 73.400,
        "bounds": [[14.9, 72.6], [20.2, 73.9]],
        "vulnerable_to": ["Offshore Trough Deluges", "Urban Mumbai Floods", "Cyclonic Landfall"],
        "coordinates": [
            [72.7, 15.0], [72.8, 20.0], [73.8, 19.8], [74.2, 15.3], [72.7, 15.0]
        ]
    },
    {
        "id": "sub_24",
        "code": "MDM",
        "name": "Madhya Maharashtra",
        "zone": "West",
        "lat": 18.500,
        "lon": 74.800,
        "bounds": [[15.7, 73.5], [22.0, 76.5]],
        "vulnerable_to": ["Ghat Heavy Rainfall", "Drought / Rain-Shadow", "Hailstorms"],
        "coordinates": [
            [73.6, 16.0], [74.1, 21.8], [76.2, 21.3], [75.5, 16.1], [73.6, 16.0]
        ]
    },
    {
        "id": "sub_25",
        "code": "MRT",
        "name": "Marathwada",
        "zone": "West",
        "lat": 19.200,
        "lon": 76.300,
        "bounds": [[17.6, 74.5], [20.7, 78.2]],
        "vulnerable_to": ["Monsoon Breaks", "Severe Convective Storms", "Drought"],
        "coordinates": [
            [74.7, 18.0], [75.1, 20.5], [77.9, 20.1], [77.5, 17.8], [74.7, 18.0]
        ]
    },
    {
        "id": "sub_26",
        "code": "VID",
        "name": "Vidarbha",
        "zone": "Central",
        "lat": 21.000,
        "lon": 79.200,
        "bounds": [[19.5, 75.9], [21.8, 80.9]],
        "vulnerable_to": ["Severe Heatwaves", "Depression Heavy Rain", "Hailstorms"],
        "coordinates": [
            [76.2, 19.8], [77.1, 21.7], [80.7, 21.5], [80.2, 19.7], [76.2, 19.8]
        ]
    },
    {
        "id": "sub_27",
        "code": "CHG",
        "name": "Chhattisgarh",
        "zone": "Central",
        "lat": 21.500,
        "lon": 82.000,
        "bounds": [[17.8, 80.2], [24.1, 84.4]],
        "vulnerable_to": ["Monsoon Depression Path", "Mahanadi Floods", "Lightning"],
        "coordinates": [
            [80.4, 18.1], [81.2, 23.9], [84.1, 23.5], [83.2, 18.5], [80.4, 18.1]
        ]
    },
    {
        "id": "sub_28",
        "code": "CAP",
        "name": "Coastal Andhra Pradesh & Yanam",
        "zone": "South",
        "lat": 16.500,
        "lon": 81.500,
        "bounds": [[13.5, 79.8], [19.2, 85.0]],
        "vulnerable_to": ["Bay of Bengal Cyclones", "Storm Surges", "Gale Winds"],
        "coordinates": [
            [80.0, 13.8], [81.5, 17.5], [84.8, 19.1], [84.2, 18.2], [80.4, 14.1], [80.0, 13.8]
        ]
    },
    {
        "id": "sub_29",
        "code": "TEL",
        "name": "Telangana",
        "zone": "South",
        "lat": 17.800,
        "lon": 79.100,
        "bounds": [[15.8, 77.2], [19.9, 81.8]],
        "vulnerable_to": ["Urban Flash Floods (Hyderabad)", "Heatwaves", "Monsoon Lows"],
        "coordinates": [
            [77.4, 16.2], [78.2, 19.7], [81.5, 19.2], [81.1, 16.8], [77.4, 16.2]
        ]
    },
    {
        "id": "sub_30",
        "code": "RYL",
        "name": "Rayalaseema",
        "zone": "South",
        "lat": 14.800,
        "lon": 78.200,
        "bounds": [[12.6, 76.8], [16.3, 80.0]],
        "vulnerable_to": ["Northeast Monsoon Cyclonic Rain", "Dry Spells", "Heat"],
        "coordinates": [
            [77.0, 13.0], [77.4, 16.1], [79.8, 15.9], [79.5, 13.1], [77.0, 13.0]
        ]
    },
    {
        "id": "sub_31",
        "code": "TNP",
        "name": "Tamil Nadu, Puducherry & Karaikal",
        "zone": "South",
        "lat": 11.100,
        "lon": 78.800,
        "bounds": [[8.1, 76.2], [13.6, 80.4]],
        "vulnerable_to": ["Northeast Monsoon Deluges", "Cyclones", "Chennai Urban Floods"],
        "coordinates": [
            [76.8, 8.4], [77.2, 13.4], [80.2, 13.3], [79.8, 9.5], [77.6, 8.3], [76.8, 8.4]
        ]
    },
    {
        "id": "sub_32",
        "code": "CKA",
        "name": "Coastal Karnataka",
        "zone": "South",
        "lat": 13.800,
        "lon": 74.800,
        "bounds": [[12.5, 74.0], [15.1, 75.3]],
        "vulnerable_to": ["Extremely Heavy Monsoon Rainfall", "Landslides", "Coastal Inundation"],
        "coordinates": [
            [74.2, 12.7], [74.3, 14.9], [75.2, 14.8], [75.1, 12.8], [74.2, 12.7]
        ]
    },
    {
        "id": "sub_33",
        "code": "NIK",
        "name": "North Interior Karnataka",
        "zone": "South",
        "lat": 16.000,
        "lon": 75.900,
        "bounds": [[14.3, 74.5], [17.8, 77.7]],
        "vulnerable_to": ["Drought", "Erratic Monsoon Pulses", "Heatwaves"],
        "coordinates": [
            [74.8, 14.6], [75.2, 17.6], [77.5, 17.4], [76.9, 14.8], [74.8, 14.6]
        ]
    },
    {
        "id": "sub_34",
        "code": "SIK",
        "name": "South Interior Karnataka",
        "zone": "South",
        "lat": 13.200,
        "lon": 76.500,
        "bounds": [[11.6, 75.1], [14.5, 78.4]],
        "vulnerable_to": ["Bengaluru Convective Storms", "Monsoon Deficits", "Pre-monsoon Squalls"],
        "coordinates": [
            [75.3, 12.0], [75.8, 14.3], [78.2, 14.1], [77.8, 11.8], [75.3, 12.0]
        ]
    },
    {
        "id": "sub_35",
        "code": "KRL",
        "name": "Kerala & Mahe",
        "zone": "South",
        "lat": 10.400,
        "lon": 76.300,
        "bounds": [[8.3, 74.9], [12.8, 77.4]],
        "vulnerable_to": ["Monsoon Onset Deluges", "Western Ghats Landslides", "Reservoir Overtopping"],
        "coordinates": [
            [75.1, 8.5], [75.3, 12.5], [76.8, 12.3], [77.2, 8.8], [75.1, 8.5]
        ]
    },
    {
        "id": "sub_36",
        "code": "LAK",
        "name": "Lakshadweep",
        "zone": "Island",
        "lat": 10.570,
        "lon": 72.636,
        "bounds": [[8.2, 71.5], [12.4, 74.2]],
        "vulnerable_to": ["Arabian Sea Cyclogenesis", "Monsoon Surges", "Sea-level Swells"],
        "coordinates": [
            [72.0, 8.5], [72.2, 12.0], [73.8, 11.8], [73.5, 8.6], [72.0, 8.5]
        ]
    }
]

def get_subdivision_by_id(sub_id: str) -> Dict[str, Any]:
    for sub in IMD_SUBDIVISIONS:
        if sub["id"] == sub_id:
            return sub
    return IMD_SUBDIVISIONS[0]

def get_all_subdivisions() -> List[Dict[str, Any]]:
    return IMD_SUBDIVISIONS
