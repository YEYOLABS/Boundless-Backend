import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../src/config/firebase';

/**
 * Script to view all float and expense values from Firebase
 * This helps verify what's actually stored in the database
 */

async function viewDatabaseValues() {
    console.log('='.repeat(80));
    console.log('FIREBASE DATABASE VALUES');
    console.log('='.repeat(80));
    console.log('\n');

    try {
        // Get all floats
        console.log('📊 FLOATS:');
        console.log('-'.repeat(80));
        const floatsSnapshot = await getDocs(collection(db, 'floats'));
        
        if (floatsSnapshot.empty) {
            console.log('  No floats found\n');
        } else {
            floatsSnapshot.forEach((doc) => {
                const data = doc.data();
                console.log(`\n  Float ID: ${doc.id}`);
                console.log(`  ├─ Driver ID: ${data.driverId}`);
                console.log(`  ├─ Tour ID: ${data.tourId}`);
                console.log(`  ├─ Original Amount: ${data.originalAmount} cents (R${(data.originalAmount / 100).toFixed(2)})`);
                console.log(`  ├─ Remaining Amount: ${data.remainingAmount} cents (R${(data.remainingAmount / 100).toFixed(2)})`);
                console.log(`  ├─ Active: ${data.active}`);
                console.log(`  └─ Created: ${data.createdAt}`);
            });
            console.log(`\n  Total: ${floatsSnapshot.size} floats`);
        }

        console.log('\n');
        console.log('='.repeat(80));

        // Get all expenses
        console.log('💰 EXPENSES:');
        console.log('-'.repeat(80));
        const expensesSnapshot = await getDocs(collection(db, 'expenses'));
        
        if (expensesSnapshot.empty) {
            console.log('  No expenses found\n');
        } else {
            expensesSnapshot.forEach((doc) => {
                const data = doc.data();
                console.log(`\n  Expense ID: ${doc.id}`);
                console.log(`  ├─ Float ID: ${data.floatId}`);
                console.log(`  ├─ Driver ID: ${data.driverId}`);
                console.log(`  ├─ Category: ${data.category}`);
                console.log(`  ├─ Amount: ${data.amount} cents (R${(data.amount / 100).toFixed(2)})`);
                console.log(`  ├─ Description: ${data.description}`);
                console.log(`  ├─ Status: ${data.status}`);
                console.log(`  └─ Created: ${data.createdAt}`);
            });
            console.log(`\n  Total: ${expensesSnapshot.size} expenses`);
        }

        console.log('\n');
        console.log('='.repeat(80));

        // Get specific float by ID
        const specificFloatId = 'bbxObZlkavE5MPwtm5t8';
        console.log(`\n🔍 SPECIFIC FLOAT: ${specificFloatId}`);
        console.log('-'.repeat(80));
        
        const specificFloatQuery = query(
            collection(db, 'floats'),
            where('__name__', '==', specificFloatId)
        );
        const specificFloatSnapshot = await getDocs(specificFloatQuery);
        
        if (specificFloatSnapshot.empty) {
            console.log('  Float not found\n');
        } else {
            specificFloatSnapshot.forEach((doc) => {
                const data = doc.data();
                console.log(`\n  Float ID: ${doc.id}`);
                console.log(`  ├─ Original Amount: ${data.originalAmount} cents`);
                console.log(`  ├─ Remaining Amount: ${data.remainingAmount} cents`);
                console.log(`  ├─ Calculated Expenses: ${data.originalAmount - data.remainingAmount} cents`);
                console.log(`  └─ In Rands:`);
                console.log(`      ├─ Original: R${(data.originalAmount / 100).toFixed(2)}`);
                console.log(`      ├─ Remaining: R${(data.remainingAmount / 100).toFixed(2)}`);
                console.log(`      └─ Expenses: R${((data.originalAmount - data.remainingAmount) / 100).toFixed(2)}`);
            });
        }

        // Get expenses for specific float
        console.log(`\n💰 EXPENSES FOR FLOAT: ${specificFloatId}`);
        console.log('-'.repeat(80));
        
        const expensesForFloatQuery = query(
            collection(db, 'expenses'),
            where('floatId', '==', specificFloatId)
        );
        const expensesForFloatSnapshot = await getDocs(expensesForFloatQuery);
        
        if (expensesForFloatSnapshot.empty) {
            console.log('  No expenses found for this float\n');
        } else {
            let totalExpenses = 0;
            expensesForFloatSnapshot.forEach((doc) => {
                const data = doc.data();
                totalExpenses += data.amount;
                console.log(`\n  Expense ID: ${doc.id}`);
                console.log(`  ├─ Category: ${data.category}`);
                console.log(`  ├─ Amount: ${data.amount} cents (R${(data.amount / 100).toFixed(2)})`);
                console.log(`  ├─ Description: ${data.description}`);
                console.log(`  └─ Created: ${data.createdAt}`);
            });
            console.log(`\n  Total Expenses: ${totalExpenses} cents (R${(totalExpenses / 100).toFixed(2)})`);
            console.log(`  Count: ${expensesForFloatSnapshot.size} expenses`);
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
viewDatabaseValues()
    .then(() => {
        console.log('\n✅ Script completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Script failed:', error);
        process.exit(1);
    });
