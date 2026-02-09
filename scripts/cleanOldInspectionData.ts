import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../src/config/firebase';

/**
 * Script to clean brake pad thickness data from existing saved inspections
 * This removes the data from inspection records that were created before the feature was removed
 */

async function cleanOldInspectionData() {
    console.log('='.repeat(80));
    console.log('CLEANING OLD INSPECTION DATA');
    console.log('='.repeat(80));
    console.log('\n');

    try {
        let inspectionsUpdated = 0;
        let itemsRemoved = 0;

        // Get all inspections
        console.log('🔍 Checking inspections collection...');
        console.log('-'.repeat(80));
        
        const inspectionsSnapshot = await getDocs(collection(db, 'inspections'));
        
        if (inspectionsSnapshot.empty) {
            console.log('  ℹ️  No inspections found\n');
        } else {
            console.log(`  Found ${inspectionsSnapshot.size} inspections\n`);
            
            for (const docSnapshot of inspectionsSnapshot.docs) {
                const data = docSnapshot.data();
                let needsUpdate = false;
                let updatedData: any = {};
                
                // Check and clean results object
                if (data.results && typeof data.results === 'object') {
                    const updatedResults = { ...data.results };
                    const keysToRemove: string[] = [];
                    
                    Object.keys(updatedResults).forEach(key => {
                        const lowerKey = key.toLowerCase();
                        if (
                            (lowerKey.includes('brake') && lowerKey.includes('pad')) ||
                            (lowerKey.includes('brake') && lowerKey.includes('disk') && lowerKey.includes('thickness')) ||
                            (lowerKey.includes('brake') && lowerKey.includes('disc') && lowerKey.includes('thickness'))
                        ) {
                            keysToRemove.push(key);
                            itemsRemoved++;
                        }
                    });
                    
                    if (keysToRemove.length > 0) {
                        console.log(`  🗑️  Inspection ${docSnapshot.id}: Removing ${keysToRemove.length} brake measurement(s)`);
                        keysToRemove.forEach(key => {
                            console.log(`      - ${key}`);
                            delete updatedResults[key];
                        });
                        updatedData.results = updatedResults;
                        needsUpdate = true;
                    }
                }
                
                // Check and clean items array
                if (data.items && Array.isArray(data.items)) {
                    const originalLength = data.items.length;
                    const updatedItems = data.items.filter((item: any) => {
                        const key = (item.key || item.inspectionItem || '').toString().toLowerCase();
                        const name = (item.name || item.label || '').toString().toLowerCase();
                        return !(
                            (key.includes('brake') && key.includes('pad')) ||
                            (key.includes('brake') && key.includes('disk') && key.includes('thickness')) ||
                            (key.includes('brake') && key.includes('disc') && key.includes('thickness')) ||
                            (name.includes('brake') && name.includes('pad')) ||
                            (name.includes('brake') && name.includes('disk') && name.includes('thickness')) ||
                            (name.includes('brake') && name.includes('disc') && name.includes('thickness'))
                        );
                    });
                    
                    if (updatedItems.length !== originalLength) {
                        const removed = originalLength - updatedItems.length;
                        console.log(`  🗑️  Inspection ${docSnapshot.id}: Removing ${removed} brake item(s) from items array`);
                        updatedData.items = updatedItems;
                        itemsRemoved += removed;
                        needsUpdate = true;
                    }
                }
                
                // Update the document if needed
                if (needsUpdate) {
                    await updateDoc(doc(db, 'inspections', docSnapshot.id), updatedData);
                    inspectionsUpdated++;
                }
            }
            
            if (inspectionsUpdated === 0) {
                console.log('\n  ✅ No brake pad/disk data found in inspections\n');
            } else {
                console.log(`\n  ✅ Updated ${inspectionsUpdated} inspection(s)\n`);
                console.log(`  ✅ Removed ${itemsRemoved} brake measurement item(s)\n`);
            }
        }

        console.log('='.repeat(80));
        console.log('✅ SUMMARY:');
        console.log(`  - Inspections updated: ${inspectionsUpdated}`);
        console.log(`  - Items removed: ${itemsRemoved}`);
        console.log('='.repeat(80));

    } catch (error) {
        console.error('❌ Error cleaning inspection data:', error);
        throw error;
    }
}

// Run the script
cleanOldInspectionData()
    .then(() => {
        console.log('\n✅ Script completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Script failed:', error);
        process.exit(1);
    });
