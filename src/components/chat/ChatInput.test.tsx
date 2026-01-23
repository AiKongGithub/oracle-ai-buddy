import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatInput } from './ChatInput';

describe('ChatInput', () => {
  const mockOnSend = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with default placeholder', () => {
    render(<ChatInput onSend={mockOnSend} />);

    expect(screen.getByPlaceholderText('พิมพ์ข้อความ...')).toBeInTheDocument();
  });

  it('should render with custom placeholder', () => {
    render(<ChatInput onSend={mockOnSend} placeholder="Ask me anything..." />);

    expect(screen.getByPlaceholderText('Ask me anything...')).toBeInTheDocument();
  });

  it('should update input value when typing', () => {
    render(<ChatInput onSend={mockOnSend} />);

    const textarea = screen.getByPlaceholderText('พิมพ์ข้อความ...');
    fireEvent.change(textarea, { target: { value: 'Hello' } });

    expect(textarea).toHaveValue('Hello');
  });

  it('should call onSend when form is submitted with text', () => {
    render(<ChatInput onSend={mockOnSend} />);

    const textarea = screen.getByPlaceholderText('พิมพ์ข้อความ...');
    fireEvent.change(textarea, { target: { value: 'Hello buddy' } });

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnSend).toHaveBeenCalledWith('Hello buddy');
  });

  it('should clear input after sending', () => {
    render(<ChatInput onSend={mockOnSend} />);

    const textarea = screen.getByPlaceholderText('พิมพ์ข้อความ...');
    fireEvent.change(textarea, { target: { value: 'Hello' } });

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(textarea).toHaveValue('');
  });

  it('should not call onSend when input is empty', () => {
    render(<ChatInput onSend={mockOnSend} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it('should not call onSend when input is only whitespace', () => {
    render(<ChatInput onSend={mockOnSend} />);

    const textarea = screen.getByPlaceholderText('พิมพ์ข้อความ...');
    fireEvent.change(textarea, { target: { value: '   ' } });

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it('should disable textarea when disabled prop is true', () => {
    render(<ChatInput onSend={mockOnSend} disabled={true} />);

    const textarea = screen.getByPlaceholderText('พิมพ์ข้อความ...');
    expect(textarea).toBeDisabled();
  });

  it('should disable button when disabled prop is true', () => {
    render(<ChatInput onSend={mockOnSend} disabled={true} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should disable button when input is empty', () => {
    render(<ChatInput onSend={mockOnSend} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should enable button when input has text', () => {
    render(<ChatInput onSend={mockOnSend} />);

    const textarea = screen.getByPlaceholderText('พิมพ์ข้อความ...');
    fireEvent.change(textarea, { target: { value: 'Hello' } });

    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('should submit on Enter key press', () => {
    render(<ChatInput onSend={mockOnSend} />);

    const textarea = screen.getByPlaceholderText('พิมพ์ข้อความ...');
    fireEvent.change(textarea, { target: { value: 'Enter test' } });
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

    expect(mockOnSend).toHaveBeenCalledWith('Enter test');
  });

  it('should not submit on Shift+Enter', () => {
    render(<ChatInput onSend={mockOnSend} />);

    const textarea = screen.getByPlaceholderText('พิมพ์ข้อความ...');
    fireEvent.change(textarea, { target: { value: 'Shift enter test' } });
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });

    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it('should trim whitespace from message before sending', () => {
    render(<ChatInput onSend={mockOnSend} />);

    const textarea = screen.getByPlaceholderText('พิมพ์ข้อความ...');
    fireEvent.change(textarea, { target: { value: '  trimmed message  ' } });

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnSend).toHaveBeenCalledWith('trimmed message');
  });
});
