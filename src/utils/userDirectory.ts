import {
  get,
  onValue,
  ref,
  serverTimestamp,
  update,
  type Unsubscribe,
} from 'firebase/database';
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
  const userRef = ref(db, `users/${user.uid}`);
  const existingUser = await get(userRef);

  await update(userRef, {
    ...toDirectoryUser(user),
    updatedAt: serverTimestamp(),
    createdAt: existingUser.exists() ? existingUser.val().createdAt : serverTimestamp(),
  });
};

export const markUserPresence = async (user: User, online: boolean) => {
  if (!user.uid || !user.email) return;

  await update(ref(db, `users/${user.uid}`), {
    ...toDirectoryUser(user),
    online,
    lastSeen: Date.now(),
    updatedAt: serverTimestamp(),
  });
};

export const subscribeDirectoryUsers = (
  fallbackUser: User | null,
  onChange: (users: DirectoryUser[], onlineCount: number, usingRealtimeDatabase: boolean) => void
): Unsubscribe => {
  return onValue(
    ref(db, 'users'),
    (snapshot) => {
      const data = snapshot.val() as Record<string, DirectoryUser> | null;
      const users = Object.entries(data || {}).map(([uid, item]) => {
        const lastSeen = Number(item.lastSeen || 0);
        return {
          ...item,
          uid: item.uid || uid,
          online: Boolean(item.online && lastSeen && Date.now() - lastSeen < ONLINE_WINDOW_MS),
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
