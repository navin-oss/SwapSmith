import { getUserByWalletOrId, users } from './database';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
<<<<<<< HEAD
import logger from './logger';
=======
>>>>>>> 941ae72

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

/**
 * Get or create user in database
 * This ensures a user record exists before we try to save progress
 */
export async function ensureUserExists(firebaseUid: string, walletAddress?: string): Promise<number> {
  if (!db) {
<<<<<<< HEAD
    logger.warn('Database not configured');
=======
    console.warn('Database not configured');
>>>>>>> 941ae72
    throw new Error('Database not configured');
  }

  try {
    // Try to find user by wallet address if provided
    if (walletAddress) {
      const existingUser = await getUserByWalletOrId(walletAddress);
      if (existingUser) {
        return existingUser.id;
      }
    }

    // Check if user exists by Firebase UID
    const { eq } = await import('drizzle-orm');
    
    const existingUsers = await db.select().from(users)
      .where(eq(users.firebaseUid, firebaseUid))
      .limit(1);

    if (existingUsers[0]) {
<<<<<<< HEAD
      logger.info('User found', { userId: existingUsers[0].id });
=======
      console.log('User found with ID:', existingUsers[0].id);
>>>>>>> 941ae72
      return existingUsers[0].id;
    }

    // Create new user
<<<<<<< HEAD
    logger.info('Creating new user', { firebaseUid });
=======
    console.log('Creating new user for Firebase UID:', firebaseUid);
>>>>>>> 941ae72
    const newUser = await db.insert(users)
      .values({
        firebaseUid: firebaseUid,
        walletAddress: walletAddress || null,
        totalPoints: 0,
        totalTokensClaimed: '0',
      })
      .returning();

<<<<<<< HEAD
    logger.info('User created', { userId: newUser[0].id });
    return newUser[0].id;
  } catch (error) {
    logger.error('Error ensuring user exists', { 
      error: error instanceof Error ? error.message : String(error) 
    });
=======
    console.log('User created with ID:', newUser[0].id);
    return newUser[0].id;
  } catch (error) {
    console.error('Error ensuring user exists:', error);
>>>>>>> 941ae72
    throw error;
  }
}

/**
 * Get user database ID from Firebase UID
 */
export async function getUserIdFromFirebaseUid(firebaseUid: string): Promise<number | null> {
  if (!db) {
    return null;
  }

  try {
    const { eq } = await import('drizzle-orm');
    
    const existingUsers = await db.select().from(users)
      .where(eq(users.firebaseUid, firebaseUid))
      .limit(1);

    return existingUsers[0]?.id || null;
  } catch (error) {
<<<<<<< HEAD
    logger.error('Error getting user ID', { 
      error: error instanceof Error ? error.message : String(error) 
    });
=======
    console.error('Error getting user ID:', error);
>>>>>>> 941ae72
    return null;
  }
}
