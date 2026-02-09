import {
    collection,
    doc,
    getDocs,
    getDoc,
    query,
    setDoc,
    updateDoc,
    where,
    deleteDoc,
    runTransaction,
    QueryConstraint,
    Transaction,
    WhereFilterOp
} from 'firebase/firestore';
import { db } from '../config/firebase';

interface Data {
    [key: string]: any;
}

export type Filter = { field: string; op: WhereFilterOp; value: any };

export const createData = async (tableName: string, docId: string, data: Data): Promise<boolean> => {
    try {
        await setDoc(doc(db, tableName, docId), data);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};

export const updateData = async (tableName: string, docId: string, obj: Partial<Data>): Promise<boolean> => {
    try {
        const docRef = doc(db, tableName, docId);
        await updateDoc(docRef, obj);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};

export const deleteData = async (tableName: string, docId: string): Promise<boolean> => {
    try {
        await deleteDoc(doc(db, tableName, docId));
        return true;
    } catch (e) {
        return false;
    }
};

export const authenticateUser = async (username: string, pin: string): Promise<any[]> => {
    try {
        const querySnapshot = await getDocs(query(collection(db, 'users'), where('username', '==', username || ''), where('pin', '==', pin || '')));
        const data = querySnapshot.docs.map((doc) => doc.data());
        return data;
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getUserByUsername = async (username: string): Promise<any | null> => {
    try {
        const querySnapshot = await getDocs(query(collection(db, 'users'), where('username', '==', username)));
        if (querySnapshot.empty) return null;
        return querySnapshot.docs[0].data();
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const createUser = async (
    username: string,
    pin: string,
    role?: string,
    organisationId?: string,
    name?: string,
    passportNumber?: string,
    pdpNumber?: string,
    pdpExpiry?: string,
    passportDocumentUrl?: string,
    pdpDocumentUrl?: string,
    email?: string
): Promise<boolean> => {
    try {
        // Check if user already exists
        const existingUsers = await authenticateUser(username, pin);
        if (existingUsers.length > 0) {
            return false; // User already exists
        }
        const userData: any = {
            username,
            pin,
            uid: username,
            role: role || 'owner',
            organisationId: organisationId || 'default',
            name: name || username,
            email: email || null
        };
        if (role === 'driver') {
            userData.passportNumber = passportNumber;
            userData.pdpNumber = pdpNumber;
            userData.pdpExpiry = pdpExpiry;
            userData.passportDocumentUrl = passportDocumentUrl;
            userData.pdpDocumentUrl = pdpDocumentUrl;
        }
        await setDoc(doc(db, 'users', username), userData);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};

export const getSecretKeys = async (): Promise<any[]> => {
    try {
        const querySnapshot = await getDocs(query(collection(db, 'secrets')));
        const data = querySnapshot.docs.map((doc) => doc.data());
        return data;
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getAssignedTask = async (driverId: string): Promise<{ vehicle: any; tour: any; float: any } | null> => {
    try {
        
        const vehicleQuery = await getDocs(query(collection(db, 'vehicles'), where('currentDriverId', '==', driverId || '')));
        const vehicles = vehicleQuery.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log(vehicles)
        if (vehicles.length === 0) return null;

        const vehicle = vehicles[0]; // Assuming one vehicle per driver

        const tourQuery = await getDocs(query(collection(db, 'tours'), where('vehicleId', '==', vehicle.id)));
        const tours = tourQuery.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        if (tours.length === 0) return { vehicle, tour: null, float: null };

        const tour = tours[0]; // Assuming one tour per vehicle

        const floatQuery = await getDocs(query(collection(db, 'floats'), where('tourId', '==', tour.id)));
        const floats = floatQuery.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const float:any = floats.length > 0 ? floats[0] : null; // Assuming one float per tour
        console.log('[getAssignedTask] Returning data:');
        console.log('  - vehicle:', vehicle?.id);
        console.log('  - tour:', tour?.id);
        console.log('  - float:', float?.id);
        console.log('  - float.originalAmount (cents):', float?.originalAmount);
        console.log('  - float.remainingAmount (cents):', float?.remainingAmount);
        
        // Return data as-is from database (in cents)
        return { vehicle, tour, float };
    } catch (e) {
        console.error(e);
        return null;
    }
};
// Helpers for Firestore access used by handlers
export const setDocument = async (tableName: string, docId: string, data: Data): Promise<string> => {
    await setDoc(doc(db, tableName, docId), data);
    return docId;
};

export const createDocument = async (tableName: string, data: Data): Promise<string> => {
    const ref = doc(collection(db, tableName));
    await setDoc(ref, data);
    return ref.id;
};

export const updateDocument = async (tableName: string, docId: string, data: Partial<Data>): Promise<boolean> => {
    await updateDoc(doc(db, tableName, docId), data);
    return true;
};

export const deleteDocument = async (tableName: string, docId: string): Promise<boolean> => {
    await deleteDoc(doc(db, tableName, docId));
    return true;
};

export const getDocument = async (tableName: string, docId: string): Promise<(Data & { id: string }) | null> => {
    const snap = await getDoc(doc(db, tableName, docId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
};

export const queryDocuments = async (tableName: string, constraints: QueryConstraint[] = []): Promise<(Data & { id: string })[]> => {
    const snapshot = await getDocs(query(collection(db, tableName), ...constraints));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const queryDocumentsByFilters = async (tableName: string, filters: Filter[] = []): Promise<(Data & { id: string })[]> => {
    const constraints = filters.map((f) => where(f.field, f.op, f.value));
    return queryDocuments(tableName, constraints);
};

export const getDocRef = (tableName: string, docId: string) => doc(db, tableName, docId);
export const createDocRef = (tableName: string) => doc(collection(db, tableName));
export const getCollectionRef = (tableName: string) => collection(db, tableName);

export const runDbTransaction = async (fn: (transaction: Transaction) => Promise<void>) => runTransaction(db, fn);

export { where };
