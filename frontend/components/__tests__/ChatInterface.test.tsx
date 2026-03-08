<<<<<<< HEAD
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock all external dependencies BEFORE importing the component
vi.mock('wagmi', () => ({
  useAccount: vi.fn(() => ({
=======
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock all external dependencies BEFORE importing the component
jest.mock('wagmi', () => ({
  useAccount: jest.fn(() => ({
>>>>>>> 941ae72
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true,
  })),
}));

<<<<<<< HEAD
vi.mock('@/hooks/useErrorHandler', () => ({
  useErrorHandler: vi.fn(() => ({
    handleError: vi.fn((_err, _type, _options) => 'An error occurred'),
=======
jest.mock('@/hooks/useErrorHandler', () => ({
  useErrorHandler: jest.fn(() => ({
    handleError: jest.fn((err, type, options) => 'An error occurred'),
>>>>>>> 941ae72
  })),
  ErrorType: {
    VOICE_ERROR: 'VOICE_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR',
    WALLET_ERROR: 'WALLET_ERROR',
  },
}));

<<<<<<< HEAD
vi.mock('@/hooks/useAudioRecorder', () => ({
  useAudioRecorder: vi.fn(() => ({
    isRecording: false,
    isSupported: false,
    startRecording: vi.fn(),
    stopRecording: vi.fn(),
=======
jest.mock('@/hooks/useAudioRecorder', () => ({
  useAudioRecorder: jest.fn(() => ({
    isRecording: false,
    isSupported: false,
    startRecording: jest.fn(),
    stopRecording: jest.fn(),
>>>>>>> 941ae72
    error: null,
  })),
}));

<<<<<<< HEAD
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
=======
jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(() => ({
>>>>>>> 941ae72
    user: null,
    isAuthenticated: false,
    isLoading: false,
  })),
}));

<<<<<<< HEAD
vi.mock('../SwapConfirmation', () => ({
  default: function MockSwapConfirmation() {
    return <div data-testid="swap-confirmation">Swap Confirmation</div>;
  }
}));

vi.mock('../TrustIndicators', () => ({
  default: function MockTrustIndicators() {
    return <div data-testid="trust-indicators">Trust Indicators</div>;
  }
}));

vi.mock('../IntentConfirmation', () => ({
  default: function MockIntentConfirmation() {
    return <div data-testid="intent-confirmation">Intent Confirmation</div>;
  }
}));
=======
jest.mock('../SwapConfirmation', () => {
  return function MockSwapConfirmation() {
    return <div data-testid="swap-confirmation">Swap Confirmation</div>;
  };
});

jest.mock('../TrustIndicators', () => {
  return function MockTrustIndicators() {
    return <div data-testid="trust-indicators">Trust Indicators</div>;
  };
});

jest.mock('../IntentConfirmation', () => {
  return function MockIntentConfirmation() {
    return <div data-testid="intent-confirmation">Intent Confirmation</div>;
  };
});
>>>>>>> 941ae72

// NOW import the component after mocking dependencies
import ChatInterface from '../ChatInterface';

describe('ChatInterface Component', () => {
  beforeEach(() => {
<<<<<<< HEAD
    vi.clearAllMocks();
    global.fetch = vi.fn();
=======
    jest.clearAllMocks();
    global.fetch = jest.fn();
>>>>>>> 941ae72
    localStorage.clear();
  });

  afterEach(() => {
<<<<<<< HEAD
    vi.restoreAllMocks();
=======
    jest.restoreAllMocks();
>>>>>>> 941ae72
  });

  test('renders ChatInterface component', () => {
    render(<ChatInterface />);
    expect(screen.getByText(/Hello! I can help you swap assets/i)).toBeInTheDocument();
  });

  test('displays initial greeting message', () => {
    render(<ChatInterface />);
    const greetingText = screen.getByText(/Hello! I can help you swap assets, create payment links, or scout yields/i);
    expect(greetingText).toBeInTheDocument();
  });

  test('renders input field for user messages', () => {
    render(<ChatInterface />);
    const textboxes = screen.getAllByRole('textbox');
    expect(textboxes.length).toBeGreaterThan(0);
  });

  test('allows user to type in the input field', async () => {
<<<<<<< HEAD
    const user = userEvent.setup();
    render(<ChatInterface />);
    const inputElement = screen.getAllByRole('textbox')[0] as HTMLInputElement;
    
    await act(async () => {
      await user.type(inputElement, 'Swap 10 ETH');
    });
=======
    render(<ChatInterface />);
    const inputElement = screen.getAllByRole('textbox')[0] as HTMLInputElement;
    
    await userEvent.type(inputElement, 'Swap 10 ETH');
>>>>>>> 941ae72
    
    expect(inputElement.value).toBe('Swap 10 ETH');
  });

  test('clears input field when typing', async () => {
<<<<<<< HEAD
    const user = userEvent.setup();
    render(<ChatInterface />);
    const inputElement = screen.getAllByRole('textbox')[0] as HTMLInputElement;
    
    await act(async () => {
      await user.type(inputElement, 'Test');
    });
    expect(inputElement.value).toBe('Test');
    
    await act(async () => {
      await user.clear(inputElement);
    });
=======
    render(<ChatInterface />);
    const inputElement = screen.getAllByRole('textbox')[0] as HTMLInputElement;
    
    await userEvent.type(inputElement, 'Test');
    expect(inputElement.value).toBe('Test');
    
    await userEvent.clear(inputElement);
>>>>>>> 941ae72
    expect(inputElement.value).toBe('');
  });

  test('component renders with wallet connected', () => {
    render(<ChatInterface />);
    expect(screen.getByText(/Hello! I can help you swap assets/i)).toBeInTheDocument();
  });

  test('renders with message history on mount', () => {
    render(<ChatInterface />);
    const greeting = screen.getByText(/Hello! I can help you swap assets/i);
    expect(greeting).toBeInTheDocument();
    
<<<<<<< HEAD
    expect(screen.getByText(/Try our Telegram Bot/i)).toBeInTheDocument();
=======
    const tipText = screen.getByText(/Try our Telegram Bot/i);
    expect(tipText).toBeInTheDocument();
>>>>>>> 941ae72
  });

  test('component has proper structure', () => {
    render(<ChatInterface />);
    
    const container = screen.getByText(/Hello! I can help you swap assets/i);
    expect(container).toBeInTheDocument();
  });

  test('accepts input without crashing', async () => {
<<<<<<< HEAD
    const user = userEvent.setup();
    render(<ChatInterface />);
    const inputElement = screen.getAllByRole('textbox')[0];
    
    await act(async () => {
      await user.type(inputElement, 'Test message for input');
    });
=======
    render(<ChatInterface />);
    const inputElement = screen.getAllByRole('textbox')[0];
    
    await userEvent.type(inputElement, 'Test message for input');
>>>>>>> 941ae72
    
    expect(inputElement).toBeInTheDocument();
  });

  test('displays multiple message types', () => {
    render(<ChatInterface />);
    
    expect(screen.getByText(/Hello! I can help you swap assets/i)).toBeInTheDocument();
    expect(screen.getByText(/Tip: Try our Telegram Bot/i)).toBeInTheDocument();
  });
});
