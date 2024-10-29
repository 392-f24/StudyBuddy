import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';

import App from './App';

describe('launching', () => {
  it('should show the app name', async () => {
    render(<App />);
    await screen.findByText(/StudyBuddy/);
  });
});
