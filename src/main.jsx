import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { toast } from 'sonner';
import App from './App';
import './index.css';

// Subscribe to store changes to show toast notifications
store.subscribe(() => {
  const state = store.getState();
  if (state.auth.error) {
    toast.error(state.auth.error);
  }
  if (state.posts.error) {
    toast.error(state.posts.error);
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
