import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

async function deleteSampleTours() {
    try {
        console.log('Fetching tours with "BR" prefix...');
        const toursRef = collection(db, 'tours');
        const snapshot = await getDocs(toursRef);

        const toDelete = snapshot.docs.filter(d => {
            const data = d.data();
            return data.tour_reference && data.tour_reference.startsWith('BR');
        });

        console.log(`Found ${toDelete.length} tours to delete.`);

        for (const tourDoc of toDelete) {
            const data = tourDoc.data();
            console.log(`Deleting tour: ${data.tour_reference} (ID: ${tourDoc.id})`);
            await deleteDoc(doc(db, 'tours', tourDoc.id));
        }

        console.log('Deletion complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error deleting tours:', error);
        process.exit(1);
    }
}

deleteSampleTours();
