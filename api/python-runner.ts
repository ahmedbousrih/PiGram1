import type { VercelRequest, VercelResponse } from '@vercel/node';
import { python } from 'pythonia';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  try {
    // Create a safe execution environment
    const output = await python`
      import sys
      from io import StringIO
      import contextlib

      @contextlib.contextmanager
      def capture_output():
          stdout, stderr = StringIO(), StringIO()
          old_out, old_err = sys.stdout, sys.stderr
          try:
              sys.stdout, sys.stderr = stdout, stderr
              yield stdout, stderr
          finally:
              sys.stdout, sys.stderr = old_out, old_err

      with capture_output() as (out, err):
          try:
              exec(${code})
              output = out.getvalue()
              error = err.getvalue()
          except Exception as e:
              error = str(e)
              output = ""

      result = {"output": output, "error": error}
      print(result)
    `;

    return res.status(200).json(output);
  } catch (error) {
    return res.status(500).json({ error: 'Error executing Python code' });
  }
} 