'use client';

import { motion } from 'framer-motion';
import Head from 'next/head';
import { useState } from 'react';
import { Button } from '@/components/button/Button';
import { authClient } from '@/lib/auth-client';

export default function HomePage() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleAuthAction = async () => {
    try {
      setIsSubmitting(true);
      setAuthError(null);

      if (session) {
        await authClient.signOut();
        return;
      }

      await authClient.signIn.social({
        provider: 'github',
        callbackURL: window.location.href,
      });
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Auth test failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusy = isSessionPending || isSubmitting;

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grow flex flex-col items-center justify-center text-center px-inset-lg py-16">
        <motion.h1
          className="text-display-lg font-extrabold mb-4 text-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          SBOM<p className="text-primary inline">Vert</p>
        </motion.h1>

        <motion.p
          className="text-body sm:text-heading opacity-80 max-w-2xl mb-10 text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Compare SBOMs and CVEs of the container images you use to bring clarity and eliminate false
          positives.

        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="flex flex-col items-center gap-3"
        >
          <Button onClick={handleAuthAction} disabled={isBusy} withHover>
            {isBusy ? 'Working...' : session ? 'Sign out' : 'Sign in with GitHub'}
          </Button>

          {session?.user?.email ? (
            <p className="text-sm opacity-70 text-foreground">Signed in as {session.user.email}</p>
          ) : null}

          {authError ? <p className="text-sm text-destructive">{authError}</p> : null}
        </motion.div>
      </main>
    </>
  );
}
