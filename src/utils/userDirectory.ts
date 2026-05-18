import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { User } from '../context/AuthContext';

export interface DirectoryUser {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
  lastSeen?: number;
  online?: boolean;
}

const ONLINE_WINDOW_MS = 2 * 60 * 1000;

export const toDirectoryUser = (user: User): DirectoryUser => ({
  uid: user.uid,
  name: user.displayName || user.email?.split('@')[0] || 'MediQueue User',
  email: user.email || '',
  photoURL: user.photoURL || undefined,
  role: user.role || 'user',
  lastSeen: Date.now(),
  online: true,
});

export const saveDirectoryUser = async (user: User) => {
  if (!user.uid || !user.email) return;

  await setDoc(doc(db, 'users', user.uid), {
    ...toDirectoryUser(user),
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  }, { merge: true });
};

export const markUserPresence = async (user: User, online: boolean) => {
  if (!user.uid || !user.email) return;

  await setDoc(doc(db, 'users', user.uid), {
    ...toDirectoryUser(user),
    online,
    lastSeen: Date.now(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const subscribeDirectoryUsers = (
  fallbackUser: User | null,
  onChange: (users: DirectoryUser[], onlineCount: number, usingFirestore: boolean) => void
): Unsubscribe => {
  return onSnapshot(
    collection(db, 'users'),
    (snapshot) => {
      const users = snapshot.docs.map((item) => {
        const data = item.data() as DirectoryUser;
        const lastSeen = Number(data.lastSeen || 0);
        return {
          ...data,
          uid: data.uid || item.id,
          online: Boolean(data.online && Date.now() - lastSeen < ONLINE_WINDOW_MS),
        };
      });
      const onlineCount = users.filter((item) => item.online).length;
      onChange(users, onlineCount, true);
    },
    () => {
      const localUsers = fallbackUser ? [toDirectoryUser(fallbackUser)] : [];
      onChange(localUsers, localUsers.length, false);
    }
  );
};
