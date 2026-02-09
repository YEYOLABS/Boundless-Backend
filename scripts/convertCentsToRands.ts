import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../src/config/firebase';

/**
 * Script to convert all float and expense amounts from cents to rands
 * Run this once to migrate existing data
 */

async function convertCentsToRands() {
    console.log('Starting conversion from cents to rands...\n');

    try {
        // Convert Floats
        console.log('Converting floats...');
        const floatsSnapshot = await getDocs(collection(db, 'floats'));
        let floatCount = 0;

        for (const floatDoc of floatsSnapshot.docs) {
            const floatData = floatDoc.data();
            const floatRef = doc(db, 'floats', floatDoc.id);

            const updates: any = {};
            
            if (floatData.originalAmount && floatData.originalAmount > 1000) {
                updates.originalAmount = floatData.originalAmount / 100;
                console.log(`  Float ${floatDoc.id}: originalAmount ${floatData.originalAmount} → ${updates.originalAmount}`);
            }
            
            if (floatData.remainingAmount && floatData.remainingAmount > 1000) {
                updates.remainingAmount = floatData.remainingAmount / 100;
                console.log(`  Float ${floatDoc.id}: remainingAmount ${floatData.remainingAmount} → ${updates.remainingAmount}`);
            }

            if (Object.keys(updates).length > 0) {
                await updateDoc(floatRef, updates);
                floatCount++;
            }
        }

        console.log(`✓ Converted ${floatCount} floats\n`);

        // Convert Expenses
        console.log('Converting expenses...');
        const expensesSnapshot = await getDocs(collection(db, 'expenses'));
        let expenseCount = 0;

        for (const expenseDoc of expensesSnapshot.docs) {
            const expenseData = expenseDoc.data();
            const expenseRef = doc(db, 'expenses', expenseDoc.id);

            if (expenseData.amount && expenseData.amount > 100) {
                const newAmount = expenseData.amount / 100;
                await updateDoc(expenseRef, { amount: newAmount });
                console.log(`  Expense ${expenseDoc.id}: amount ${expenseData.amount} → ${newAmount}`);
                expenseCount++;
            }
        }

        console.log(`✓ Converted ${expenseCount} expenses\n`);

        console.log('✅ Conversion completed successfully!');
        console.log(`Total: ${floatCount} floats + ${expenseCount} expenses converted`);

    } catch (error) {
        console.error('❌ Error during conversion:', error);
        throw error;
    }
}

// Run the script
convertCentsToRands()
    .then(() => {
        console.log('\n✅ Script completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Script failed:', error);
        process.exit(1);
    });
