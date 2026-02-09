import { createData } from '../helpers/api';

const addTestUsers = async () => {
    const users = [
        {
            username: 'driver1',
            pin: '1234',
            role: 'driver',
            organisationId: 'org1',
            uid: 'driver1',
            name: 'Test Driver'
        },
        {
            username: 'master1',
            pin: '1234',
            role: 'owner',
            organisationId: 'org1',
            uid: 'master1',
            name: 'Master User'
        }
    ];

    console.log('Adding test users...');
    for (const user of users) {
        const success = await createData('users', user.username, user);
        if (success) {
            console.log(`✅ User ${user.username} added successfully`);
        } else {
            console.log(`❌ Failed to add user ${user.username}`);
        }
    }
    process.exit(0);
};

addTestUsers().catch(err => {
    console.error('Error adding users:', err);
    process.exit(1);
});
