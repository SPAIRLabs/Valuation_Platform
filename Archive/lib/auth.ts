import { auth } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from '@/store/appStore';

export class AuthService {
  static async signIn(email: string, password: string): Promise<User> {
    try {
      // Check if we're in demo mode
      if (email === 'agent@bank.com' && password === 'password123') {
        const demoUser: User = {
          id: 'demo-user-123',
          email: 'agent@bank.com',
          name: 'Demo Agent',
          role: 'field_agent',
          organization: 'Demo Bank',
          createdAt: new Date(),
          lastLogin: new Date(),
        };
        return demoUser;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = await this.getUserProfile(userCredential.user.uid);
      return user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  static async signUp(email: string, password: string, userData: Partial<User>): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user: User = {
        id: userCredential.user.uid,
        email: userCredential.user.email || email,
        name: userData.name || '',
        role: userData.role || 'field_agent',
        organization: userData.organization || '',
        createdAt: new Date(),
        lastLogin: new Date(),
      };
      
      await setDoc(doc(db, 'users', user.id), user);
      return user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  static async getUserProfile(uid: string): Promise<User> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as User;
      } else {
        throw new Error('User profile not found');
      }
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  static onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const user = await this.getUserProfile(firebaseUser.uid);
          callback(user);
        } catch (error) {
          console.error('Auth state change error:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }
}
