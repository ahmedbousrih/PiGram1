export interface Lesson {
  id: string;
  title: string;
  content: string;
  code?: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
}

export const courses: Record<string, Course> = {
  'html': {
    id: 'html',
    title: 'HTML',
    description: 'Learn the fundamentals of web development with HTML5',
    chapters: [
      {
        id: 'html-basics',
        title: 'HTML Basics',
        description: 'Learn the fundamental concepts of HTML',
        lessons: [
          {
            id: 'html-1',
            title: 'Introduction to HTML',
            content: `
              HTML (HyperText Markup Language) is the standard markup language for creating web pages.
              It describes the structure of a web page using various elements and tags.
            `,
            code: `<!DOCTYPE html>
<html>
<head>
  <title>My First HTML Page</title>
</head>
<body>
  <h1>Hello World!</h1>
  <p>This is my first HTML page.</p>
</body>
</html>`
          }
          // Add more lessons...
        ]
      }
      // Add more chapters...
    ]
  },
  // Add other courses (javascript, python, math)...
}; 