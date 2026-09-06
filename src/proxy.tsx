import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { FEATURE_FLAGS } from '@/lib/featureFlags'
import { auth } from './lib/auth';

export async function proxy(request: NextRequest) {
    if (!FEATURE_FLAGS.ENABLE_SCAN_API) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    const apiKeyString = request.headers.get("x-api-key");

    if (!apiKeyString) {
        return NextResponse.json(
            { error: "Unauthorized: missing x-api-key header." }, 
            { status: 401 }
        );
    }

    // 2. Pass the extracted string into the function body layout
    const result = await auth.api.verifyApiKey({
        body: {
            key: apiKeyString, 
        },
    });

    if (!result || !result.valid) {
        return NextResponse.json(
            { error: "Unauthorized: Invalid or expired API key." }, 
            { status: 401 }
        );
    }

    return NextResponse.next()
}
 
export const config = {
    matcher: [
        // Exclude API routes, static files, image optimizations, and .png files
        '/scan',
        '/api/scan/:path*'
    ],
}
