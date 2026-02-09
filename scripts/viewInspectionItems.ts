import { collection, getDocs } from 'firebase/firestore';
import { db } from '../src/config/firebase';

/**
 * Script to view all inspection items from Firebase
 * This helps identify if brake pad thickness is stored in the database
 */

async function viewInspectionItems() {
    console.log('='.repeat(80));
    console.log('FIREBASE INSPECTION ITEMS');
    console.log('='.repeat(80));
    console.log('\n');

    try {
        // Check for inspection_items collection
        console.log('🔍 INSPECTION ITEMS COLLECTION:');
        console.log('-'.repeat(80));
        const inspectionItemsSnapshot = await getDocs(collection(db, 'inspection_items'));
        
        if (inspectionItemsSnapshot.empty) {
            console.log('  ❌ No inspection_items collection found\n');
        } else {
            console.log(`  ✅ Found ${inspectionItemsSnapshot.size} inspection items\n`);
            inspectionItemsSnapshot.forEach((doc) => {
                const data = doc.data();
                console.log(`\n  Item ID: ${doc.id}`);
                console.log(`  ├─ Key: ${data.key || 'N/A'}`);
                console.log(`  ├─ Name: ${data.name || 'N/A'}`);
                console.log(`  ├─ Input Type: ${data.inputType || 'N/A'}`);
                console.log(`  ├─ Type: ${data.type || 'N/A'}`);
                console.log(`  ├─ Fields: ${data.fields ? JSON.stringify(data.fields) : 'N/A'}`);
                console.log(`  └─ Mandatory: ${data.mandatory || false}`);
                
                // Highlight brake pad items
                if (data.key && data.key.toLowerCase().includes('brake') && data.key.toLowerCase().includes('pad')) {
                    console.log(`  ⚠️  BRAKE PAD ITEM FOUND!`);
                }
            });
        }

        console.log('\n');
        console.log('='.repeat(80));

        // Check for inspections collection
        console.log('📋 INSPECTIONS COLLECTION:');
        console.log('-'.repeat(80));
        const inspectionsSnapshot = await getDocs(collection(db, 'inspections'));
        
        if (inspectionsSnapshot.empty) {
            console.log('  No inspections found\n');
        } else {
            console.log(`  Found ${inspectionsSnapshot.size} inspections\n`);
            
            // Show first 3 inspections as examples
            let count = 0;
            inspectionsSnapshot.forEach((doc) => {
                if (count < 3) {
                    const data = doc.data();
                    console.log(`\n  Inspection ID: ${doc.id}`);
                    console.log(`  ├─ Type: ${data.type || 'N/A'}`);
                    console.log(`  ├─ Vehicle ID: ${data.vehicleId || 'N/A'}`);
                    console.log(`  ├─ Date: ${data.date || 'N/A'}`);
                    console.log(`  └─ Results: ${data.results ? Object.keys(data.results).join(', ') : 'N/A'}`);
                    
                    // Check if results contain brake pad data
                    if (data.results) {
                        Object.keys(data.results).forEach(key => {
                            if (key.toLowerCase().includes('brake') && key.toLowerCase().includes('pad')) {
                                console.log(`  ⚠️  BRAKE PAD DATA FOUND IN RESULTS: ${key}`);
                            }
                        });
                    }
                    count++;
                }
            });
            
            if (inspectionsSnapshot.size > 3) {
                console.log(`\n  ... and ${inspectionsSnapshot.size - 3} more inspections`);
            }
        }

        console.log('\n');
        console.log('='.repeat(80));
        console.log('✅ Database query completed successfully!');
        console.log('='.repeat(80));

    } catch (error) {
        console.error('❌ Error querying database:', error);
        throw error;
    }
}

// Run the script
viewInspectionItems()
    .then(() => {
        console.log('\n✅ Script completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Script failed:', error);
        process.exit(1);
    });
