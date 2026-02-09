import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../src/config/firebase';

/**
 * Script to remove brake pad thickness from Firebase
 * This will:
 * 1. Remove brake pad items from inspection_items collection
 * 2. Remove brake pad data from existing inspections
 */

async function removeBrakePadThickness() {
    console.log('='.repeat(80));
    console.log('REMOVING BRAKE PAD THICKNESS FROM FIREBASE');
    console.log('='.repeat(80));
    console.log('\n');

    let itemsDeleted = 0;
    let inspectionsUpdated = 0;

    try {
        // Step 1: Remove from inspection_items collection
        console.log('🔍 Step 1: Checking inspection_items collection...');
        console.log('-'.repeat(80));
        
        const inspectionItemsSnapshot = await getDocs(collection(db, 'inspection_items'));
        
        if (inspectionItemsSnapshot.empty) {
            console.log('  ℹ️  No inspection_items collection found\n');
        } else {
            for (const docSnapshot of inspectionItemsSnapshot.docs) {
                const data = docSnapshot.data();
                const key = data.key || '';
                const name = data.name || '';
                
                // Check if this is a brake pad item
                if (
                    key.toLowerCase().includes('brake') && key.toLowerCase().includes('pad') ||
                    name.toLowerCase().includes('brake') && name.toLowerCase().includes('pad')
                ) {
                    console.log(`  🗑️  Deleting: ${docSnapshot.id} - ${name}`);
                    await deleteDoc(doc(db, 'inspection_items', docSnapshot.id));
                    itemsDeleted++;
                }
            }
            
            if (itemsDeleted === 0) {
                console.log('  ✅ No brake pad items found in inspection_items collection\n');
            } else {
                console.log(`  ✅ Deleted ${itemsDeleted} brake pad items\n`);
            }
        }

        // Step 2: Remove from inspections collection
        console.log('📋 Step 2: Checking inspections collection...');
        console.log('-'.repeat(80));
        
        const inspectionsSnapshot = await getDocs(collection(db, 'inspections'));
        
        if (inspectionsSnapshot.empty) {
            console.log('  ℹ️  No inspections found\n');
        } else {
            for (const docSnapshot of inspectionsSnapshot.docs) {
                const data = docSnapshot.data();
                let needsUpdate = false;
                
                // Check results for brake pad data
                if (data.results) {
                    const updatedResults = { ...data.results };
                    
                    Object.keys(updatedResults).forEach(key => {
                        if (key.toLowerCase().includes('brake') && key.toLowerCase().includes('pad')) {
                            console.log(`  🗑️  Removing brake pad data from inspection: ${docSnapshot.id}`);
                            delete updatedResults[key];
                            needsUpdate = true;
                        }
                    });
                    
                    if (needsUpdate) {
                        await updateDoc(doc(db, 'inspections', docSnapshot.id), {
                            results: updatedResults
                        });
                        inspectionsUpdated++;
                    }
                }
                
                // Check items array for brake pad data
                if (data.items && Array.isArray(data.items)) {
                    const updatedItems = data.items.filter((item: any) => {
                        const key = item.key || item.inspectionItem || '';
                        return !(key.toString().toLowerCase().includes('brake') && key.toString().toLowerCase().includes('pad'));
                    });
                    
                    if (updatedItems.length !== data.items.length) {
                        console.log(`  🗑️  Removing brake pad items from inspection: ${docSnapshot.id}`);
                        await updateDoc(doc(db, 'inspections', docSnapshot.id), {
                            items: updatedItems
                        });
                        if (!needsUpdate) inspectionsUpdated++;
                    }
                }
            }
            
            if (inspectionsUpdated === 0) {
                console.log('  ✅ No brake pad data found in inspections\n');
            } else {
                console.log(`  ✅ Updated ${inspectionsUpdated} inspections\n`);
            }
        }

        console.log('='.repeat(80));
        console.log('✅ SUMMARY:');
        console.log(`  - Inspection items deleted: ${itemsDeleted}`);
        console.log(`  - Inspections updated: ${inspectionsUpdated}`);
        console.log('='.repeat(80));

    } catch (error) {
        console.error('❌ Error removing brake pad thickness:', error);
        throw error;
    }
}

// Run the script
removeBrakePadThickness()
    .then(() => {
        console.log('\n✅ Script completed successfully!');
        console.log('⚠️  Remember to restart your backend server and clear app cache');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Script failed:', error);
        process.exit(1);
    });
