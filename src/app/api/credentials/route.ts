import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Binary search function to check if username exists
function findUsername(usernames: string[], target: string): boolean {
    let left = 0;
    let right = usernames.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const midUsername = usernames[mid].split(',')[0].toLowerCase();
        const targetUsername = target.toLowerCase();
        
        if (midUsername === targetUsername) {
            return true;
        }
        
        if (midUsername < targetUsername) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return false;
}

export async function POST(request: Request) {
    try {
        // fetch the usernam and password whenever an request is made to this API endpoint
        const { username, password } = await request.json();
        
        // get the path of the file
        const credentialsPath = path.join(process.cwd(), 'credentials.txt');
        
        // Read existing credentials
        let credentials: string[] = [];
        try {
            const fileContent = await fs.readFile(credentialsPath, 'utf-8');
            credentials = fileContent.split('\n').filter(line => line.trim());
        } catch (error) {
            // File doesn't exist yet, start with empty array
        }

        // Check if username already exists
        if (findUsername(credentials, username)) {
            return NextResponse.json(
                { success: false, error: 'Username already exists' },
                { status: 409 }
            );
        }

        // Add new credential
        credentials.push(`${username},${password}`);

        // Sort credentials by username (case-insensitive)
        credentials.sort((a, b) => {
            const usernameA = a.split(',')[0].toLowerCase();
            const usernameB = b.split(',')[0].toLowerCase();
            return usernameA.localeCompare(usernameB);
        });

        // Write back sorted credentials
        await fs.writeFile(credentialsPath, credentials.join('\n') + '\n');
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving credentials:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
} 