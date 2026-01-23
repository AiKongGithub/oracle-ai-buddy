import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Create hoisted mock function
const mockCreate = vi.hoisted(() => vi.fn());

// Mock the Anthropic SDK before importing route
vi.mock('@anthropic-ai/sdk', () => ({
  default: class MockAnthropic {
    messages = {
      create: mockCreate,
    };
    static APIError = class APIError extends Error {
      status: number;
      constructor(message: string, status = 500) {
        super(message);
        this.status = status;
        this.name = 'APIError';
      }
    };
  },
}));

// Import route after mock is set up
import { POST } from './route';

describe('POST /api/chat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set API key for tests
    process.env.ANTHROPIC_API_KEY = 'test-api-key';
  });

  const createRequest = (body: unknown) => {
    return new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  };

  describe('Validation', () => {
    it('should return 400 when messages is missing', async () => {
      const request = createRequest({});
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Messages array is required');
    });

    it('should return 400 when messages is not an array', async () => {
      const request = createRequest({ messages: 'not-an-array' });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Messages array is required');
    });

    it('should return 400 when messages is null', async () => {
      const request = createRequest({ messages: null });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Messages array is required');
    });
  });

  describe('API Key', () => {
    it('should return 500 when ANTHROPIC_API_KEY is not set', async () => {
      delete process.env.ANTHROPIC_API_KEY;

      const request = createRequest({
        messages: [{ role: 'user', content: 'Hello' }],
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('ANTHROPIC_API_KEY not configured');
    });
  });

  describe('Successful Response', () => {
    it('should return AI message on success', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: 'สวัสดีครับ! 🐉' }],
        usage: { input_tokens: 10, output_tokens: 20 },
      });

      const request = createRequest({
        messages: [{ role: 'user', content: 'สวัสดี' }],
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('สวัสดีครับ! 🐉');
      expect(data.usage).toEqual({ input_tokens: 10, output_tokens: 20 });
    });

    it('should include memory context in system prompt when provided', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: 'สวัสดี สมชาย!' }],
        usage: { input_tokens: 15, output_tokens: 25 },
      });

      const request = createRequest({
        messages: [{ role: 'user', content: 'ฉันชื่ออะไร?' }],
        memoryContext: '## ข้อมูลผู้ใช้\n- ชื่อ: สมชาย',
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('สวัสดี สมชาย!');

      // Verify system prompt includes memory context
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          system: expect.stringContaining('ความทรงจำเกี่ยวกับผู้ใช้'),
        })
      );
    });

    it('should handle response without text content', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'tool_use', id: 'tool_1' }], // No text content
        usage: { input_tokens: 10, output_tokens: 5 },
      });

      const request = createRequest({
        messages: [{ role: 'user', content: 'test' }],
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('ขอโทษครับ ไม่สามารถตอบได้ในขณะนี้');
    });

    it('should call Claude with correct model', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: 'test' }],
        usage: { input_tokens: 10, output_tokens: 10 },
      });

      const request = createRequest({
        messages: [{ role: 'user', content: 'Hello' }],
      });
      await POST(request);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
        })
      );
    });

    it('should map messages correctly', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: 'test' }],
        usage: { input_tokens: 10, output_tokens: 10 },
      });

      const messages = [
        { role: 'user' as const, content: 'Hello' },
        { role: 'assistant' as const, content: 'Hi there!' },
        { role: 'user' as const, content: 'How are you?' },
      ];

      const request = createRequest({ messages });
      await POST(request);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle Anthropic API errors', async () => {
      const Anthropic = (await import('@anthropic-ai/sdk')).default;
      const apiError = new Anthropic.APIError('Rate limit exceeded', 429);

      mockCreate.mockRejectedValue(apiError);

      const request = createRequest({
        messages: [{ role: 'user', content: 'test' }],
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toContain('API Error');
    });

    it('should handle generic errors', async () => {
      mockCreate.mockRejectedValue(new Error('Network error'));

      const request = createRequest({
        messages: [{ role: 'user', content: 'test' }],
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('System Prompt', () => {
    it('should include base system prompt', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: 'test' }],
        usage: { input_tokens: 10, output_tokens: 10 },
      });

      const request = createRequest({
        messages: [{ role: 'user', content: 'test' }],
      });
      await POST(request);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          system: expect.stringContaining('AI Buddy'),
        })
      );
    });

    it('should include Human in the Loop philosophy', async () => {
      mockCreate.mockResolvedValue({
        content: [{ type: 'text', text: 'test' }],
        usage: { input_tokens: 10, output_tokens: 10 },
      });

      const request = createRequest({
        messages: [{ role: 'user', content: 'test' }],
      });
      await POST(request);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          system: expect.stringContaining('Human in the Loop'),
        })
      );
    });
  });
});
