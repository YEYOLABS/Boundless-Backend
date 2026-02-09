import { updateDocument, queryDocumentsByFilters } from '../src/helpers/api';
import type { Filter } from '../src/helpers/api';

const vehiclePlateOrder = [
    { plate: 'CFM82160', sortOrder: 1 },
    { plate: 'CFM84543', sortOrder: 2 },
    { plate: 'CFM82152', sortOrder: 3 },
    { plate: 'CFM80581', sortOrder: 4 },
    { plate: 'CFM71365', sortOrder: 5 },
    { plate: 'CFM41869', sortOrder: 6 },
    { plate: 'CFM92343', sortOrder: 7 },
    { plate: 'CFM92350', sortOrder: 8 },
    { plate: 'CFM74490', sortOrder: 9 },
    { plate: 'CFM86383', sortOrder: 10 },
    { plate: 'CFM67197', sortOrder: 11 },
    { plate: 'CFM70894', sortOrder: 12 },
    { plate: 'CFM67364', sortOrder: 13 },
    { plate: 'CFM70901', sortOrder: 14 },
    { plate: 'CFM94784', sortOrder: 15 },
    { plate: 'CFM15654', sortOrder: 16 },
    { plate: 'CFM68711', sortOrder: 17 },
    { plate: 'CFM68413', sortOrder: 18 }
];

async function updateVehiclesSortOrder() {
    console.log('Starting vehicle sort order migration...');
    
    for (const vehicleData of vehiclePlateOrder) {
        try {
            // Query vehicles by licenceNumber (plate)
            const filters: Filter[] = [
                { field: 'licenceNumber', op: '==', value: vehicleData.plate }
            ];
            
            const results = await queryDocumentsByFilters('vehicles', filters) as any[];
            
            if (results.length === 0) {
                console.log(`⚠ No vehicle found with plate: ${vehicleData.plate}`);
                continue;
            }
            
            const vehicle = results[0];
            await updateDocument('vehicles', vehicle.id, { sortOrder: vehicleData.sortOrder });
            console.log(`✓ Updated ${vehicleData.plate} (ID: ${vehicle.id}) with sortOrder: ${vehicleData.sortOrder}`);
        } catch (error) {
            console.error(`✗ Failed to update ${vehicleData.plate}:`, error);
        }
    }
    
    console.log('Migration complete!');
    process.exit(0);
}

// Run the migration
updateVehiclesSortOrder().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
