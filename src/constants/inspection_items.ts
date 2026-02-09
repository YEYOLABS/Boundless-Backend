export const inspection_types = [
    {
        type: 'daily',
        label: 'Daily Inspection',
        deadline: '08:00',
        items: [
            {
                key: 'odometer_reading',
                name: 'Odometer Reading',
                inputType: 'number',
                mandatory: true,
                photoRequired: true,
                safetyCritical: true
            },
            {
                key: 'pa_system',
                name: 'PA System & Microphone Working',
                inputType: 'switch',
                mandatory: true
            },
            {
                key: 'aircon',
                name: 'Aircon Working',
                inputType: 'switch',
                mandatory: true
            },
            {
                key: 'fridge',
                name: 'Fridge Working',
                inputType: 'switch',
                mandatory: true
            },
            {
                key: 'wifi',
                name: 'WiFi Working',
                inputType: 'switch',
                mandatory: true
            },
            {
                key: 'internal_lights',
                name: 'All Internal Lights Working',
                inputType: 'switch',
                mandatory: true
            },
            {
                key: 'interior_cleanliness',
                name: 'Bus Interior Clean',
                inputType: 'switch',
                mandatory: true
            },
            {
                key: 'drinking_water',
                name: 'Drinking Water Sufficient',
                inputType: 'switch',
                mandatory: true
            },
            {
                key: 'sanitiser',
                name: 'Sanitiser Sprayed',
                inputType: 'switch',
                mandatory: true
            },
            {
                key: 'oil_level',
                name: 'Oil Level Checked',
                inputType: 'switch',
                mandatory: true,
                photoRequired: true,
                safetyCritical: true
            },
            {
                key: 'anti_freeze',
                name: 'Anti-freeze Level Checked',
                inputType: 'switch',
                mandatory: true
            },
            {
                key: 'brake_fluid',
                name: 'Brake Fluid Level Checked',
                inputType: 'switch',
                mandatory: true,
                safetyCritical: true
            },
            {
                key: 'power_steering_fluid',
                name: 'Power Steering Fluid Level Checked',
                inputType: 'switch',
                mandatory: true
            },
            {
                key: 'outside_lights',
                name: 'All Outside Lights Working',
                inputType: 'switch',
                mandatory: true,
                safetyCritical: true
            },
            {
                key: 'exceptions',
                name: 'Other Exceptions',
                inputType: 'text',
                mandatory: false
            },
            {
                key: 'trailer_lights',
                name: 'Trailer Lights Checked',
                inputType: 'switch',
                conditional: 'trailer_required'
            },
            {
                key: 'trailer_tyres_visual',
                name: 'Trailer Tyres Visual Inspection',
                inputType: 'switch',
                conditional: 'trailer_required'
            }
        ]
    },

    {
        type: 'pre_tour',
        label: 'Pre-Tour Inspection',
        deadline: '08:00',
        canSetRed: true,
        items: [
            {
                key: 'odometer_reading',
                name: 'Odometer Reading',
                inputType: 'number',
                mandatory: true,
                photoRequired: true,
                safetyCritical: true
            },
            {
                key: 'fire_extinguisher',
                name: 'Fire Extinguisher Sealed & Gauge Green',
                inputType: 'switch',
                mandatory: true,
                safetyCritical: true
            },
            {
                key: 'seatbelts',
                name: 'All Seatbelts Working',
                inputType: 'switch',
                mandatory: true,
                safetyCritical: true
            },
            {
                key: 'doors',
                name: 'Doors Closing & Locking Properly',
                inputType: 'switch',
                mandatory: true
            },
            {
                key: 'reverse_camera',
                name: 'Reverse Camera Working',
                inputType: 'switch',
                mandatory: true
            },
            {
                key: 'mirrors',
                name: 'Side Mirrors Working',
                inputType: 'switch',
                mandatory: true
            },
            {
                key: 'windscreen',
                name: 'Windscreen Clean, No Running Cracks',
                inputType: 'switch',
                mandatory: true,
                safetyCritical: true
            },
            {
                key: 'tyre_pressures',
                name: 'Tyre Pressures Correct',
                inputType: 'switch',
                mandatory: true,
                safetyCritical: true
            },
            {
                key: 'tyre_tread_depth',
                name: 'Tyre Tread Depth (mm)',
                inputType: 'number_group',
                mandatory: true,
                safetyCritical: true,
                fields: [
                    'left_front',
                    'right_front',
                    'left_rear_inner',
                    'left_rear_outer',
                    'right_rear_inner',
                    'right_rear_outer'
                ]
            },
            {
                key: 'trailer_tread_depth',
                name: 'Trailer Tyre Tread Depth (mm)',
                inputType: 'number_group',
                conditional: 'trailer_required',
                fields: ['left', 'right']
            }
        ]
    },

    {
        type: 'post_tour',
        label: 'Post-Tour Inspection',
        items: [
            {
                key: 'odometer_reading',
                name: 'Odometer Reading',
                inputType: 'number',
                mandatory: true,
                photoRequired: true
            },
            {
                key: 'fuel_level',
                name: 'Fuel Level',
                inputType: 'photo',
                mandatory: true
            },
            {
                key: 'tyre_tread_depth',
                name: 'Tyre Tread Depth (mm)',
                inputType: 'number_group',
                mandatory: true,
                fields: [
                    'left_front',
                    'right_front',
                    'left_rear_inner',
                    'left_rear_outer',
                    'right_rear_inner',
                    'right_rear_outer'
                ]
            },
            {
                key: 'trailer_checks',
                name: 'Trailer Lights, Padlocks & Tyres Checked',
                inputType: 'switch',
                conditional: 'trailer_required'
            }
        ]
    },
    {
        type: 'evening',
        label: 'Evening Inspection',
        items: [
            {
                key: 'odometer_reading',
                name: 'Odometer Reading',
                inputType: 'number',
                mandatory: true,
                photoRequired: true
            },
            {
                key: 'outside_lights',
                name: 'All Outside Lights Working',
                inputType: 'switch',
                mandatory: true,
                safetyCritical: true
            },
            {
                key: 'windscreen',
                name: 'Windscreen Condition',
                inputType: 'switch',
                mandatory: true
            },
            {
                key: 'tyres_condition',
                name: 'Tyres Visual Condition',
                inputType: 'switch',
                mandatory: true
            },
            {
                key: 'interior_cleaned',
                name: 'Vehicle Cleaned (Interior)',
                inputType: 'switch',
                mandatory: true
            },
            {
                key: 'seats_clean',
                name: 'Seats Clean',
                inputType: 'switch',
                mandatory: true
            },
            {
                key: 'parcel_shelves_clean',
                name: 'Parcel Shelves & Vents Clean',
                inputType: 'switch',
                mandatory: true
            },
            {
                key: 'lost_items',
                name: 'Lost Items Found',
                inputType: 'switch',
                mandatory: true
            },
            {
                key: 'exceptions',
                name: 'Other Exceptions',
                inputType: 'text',
                mandatory: false
            },
            {
                key: 'trailer_lights',
                name: 'Trailer Lights Checked',
                inputType: 'switch',
                conditional: 'trailer_required'
            }
        ]
    }

];
