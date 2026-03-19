import { useMemo, useState, useEffect, useCallback } from 'react';
import ReactWebChat, { createStyleSet } from 'botframework-webchat-component';
import { createStore } from 'botframework-webchat-core';
import { DirectLine } from 'botframework-directlinejs';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** POST endpoint that returns { token, conversationId? } */
const TOKEN_ENDPOINT = '/api/directline/token';

const STYLE_SET = createStyleSet({
  bubbleBackground: 'white',
  backgroundColor: '#E0E0E0',
});

const STYLE_OPTIONS = {
  hideUploadButton: true,
  backgroundColor: '#E3E3E3',
  botAvatarInitials: 'Bot',
  botAvatarBackgroundColor: '#0063B1',
  userAvatarInitials: 'You',
  userAvatarBackgroundColor: '#2D2D2D',
  bubbleTextColor: '#333333',
  bubbleFromUserTextColor: '#333333',
  autoScrollSnapOnPage: true,
};

// ---------------------------------------------------------------------------
// Store middleware
// ---------------------------------------------------------------------------

function createChatStore() {
  return createStore({}, () => (next) => (action) => next(action));
}

// ---------------------------------------------------------------------------
// DirectLine hook
// ---------------------------------------------------------------------------

function useDirectLine() {
  const [directLine, setDirectLine] = useState(null);
  const [status, setStatus] = useState('idle');
  const [refreshKey, setRefreshKey] = useState(0);

  const connect = useCallback(async () => {
    try {
      const res = await fetch(TOKEN_ENDPOINT, { method: 'POST' });
      if (!res.ok) throw new Error(`Token fetch failed: ${res.status}`);
      const { token, conversationId } = await res.json();

      setDirectLine(
        new DirectLine({
          token,
          ...(conversationId ? { conversationId } : {}),
          webSocket: false,
          pollingInterval: 1000,
        }),
      );
      setStatus('success');
    } catch (err) {
      console.error('DirectLine connection error:', err);
      setStatus('error');
    }
  }, []);

  const restart = useCallback(async () => {
    setDirectLine(null);
    await connect();
    setRefreshKey((k) => k + 1);
  }, [connect]);

  useEffect(() => {
    connect();
  }, [connect]);

  return { directLine, status, refreshKey, restart };
}

// ---------------------------------------------------------------------------
// ChatBot component
// ---------------------------------------------------------------------------

function ChatBot() {
  const { directLine, status, refreshKey, restart } = useDirectLine();
  const store = useMemo(() => createChatStore(), [refreshKey]);

  useEffect(() => {
    if (!directLine) return;
    store.dispatch({ type: 'WEB_CHAT/CLEAR_CHAT' });

    const sub = directLine.connectionStatus$.subscribe({
      next(connectionStatus) {
        if (connectionStatus === 2) {
          directLine
            .postActivity({
              name: 'startConversation',
              type: 'event',
              value: {},
            })
            .subscribe();
        }
      },
    });
    return () => sub.unsubscribe();
  }, [directLine, store, refreshKey]);

  if (!directLine) {
    return (
      <div className="chat-status">
        {status === 'error'
          ? 'Failed to connect. Please try again.'
          : 'Connecting...'}
      </div>
    );
  }

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ReactWebChat
        directLine={directLine}
        store={store}
        styleSet={STYLE_SET}
        styleOptions={STYLE_OPTIONS}
        key={refreshKey}
      />
    </div>
  );
}

export { ChatBot, useDirectLine };
export default ChatBot;