import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import { useAuth } from '../../context/AuthContext';
import { useCourseProgress } from '../../context/CourseProgressContext';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Styled Components
const ContentSection = styled.div`
  padding: 20px;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const ExampleBox = styled.div`
  background: #f8fafc;
  border-left: 4px solid #6c63ff;
  padding: 20px;
  margin: 20px 0;
  border-radius: 0 8px 8px 0;
`;

const QuizContainer = styled.div`
  background: #2b3245;
  border-radius: 8px;
  padding: 24px;
  margin: 20px 0;
  color: white;
`;

const QuizTitle = styled.h3`
  color: white;
  margin-bottom: 20px;
`;

const AnswerOption = styled.div<{ $selected?: boolean; $correct?: boolean; $incorrect?: boolean }>`
  background: ${props => 
    props.$correct ? '#059669' :
    props.$incorrect ? '#dc2626' :
    props.$selected ? '#6c63ff' :
    'rgba(255, 255, 255, 0.1)'
  };
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 12px 16px;
  margin: 8px 0;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => 
      props.$correct || props.$incorrect ? 'none' :
      'rgba(255, 255, 255, 0.2)'
    };
  }
`;

const SubmitButton = styled.button`
  background: #00c853;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  margin-top: 16px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #00b848;
  }
`;

const ContentTitle = styled.h1`
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 1rem;
  border-bottom: 3px solid #6c63ff;
  padding-bottom: 0.5rem;
`;

const ContentDescription = styled.p`
  font-size: 1.1rem;
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const TopicTitle = styled.h2`
  font-size: 1.8rem;
  color: #2d3748;
  margin: 2rem 0 1rem;
`;

const SubTopicTitle = styled.h3`
  font-size: 1.4rem;
  color: #4a5568;
  margin: 1.5rem 0 1rem;
`;

const List = styled.ul`
  list-style-type: none;
  padding-left: 0;
  margin: 1rem 0;
  
  li {
    padding: 0.5rem 0;
    color: #4a5568;
    position: relative;
    padding-left: 1.5rem;
    
    &:before {
      content: "•";
      color: #6c63ff;
      font-weight: bold;
      position: absolute;
      left: 0;
    }
  }
`;

const CodeEditorWrapper = styled.div`
  margin: 2rem 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const EditorHeader = styled.div`
  background: #1e1e1e;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EditorTitle = styled.span`
  color: white;
  font-size: 0.9rem;
`;

const RunButton = styled.button`
  background: #6c63ff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: #5a51d6;
  }
`;

const OutputWindow = styled.div`
  background: #1e1e1e;
  color: #fff;
  padding: 1rem;
  border-top: 1px solid #333;
  min-height: 100px;
  max-height: 200px;
  overflow-y: auto;
`;

// Move the CodeEditor component and its interface before courseContent
interface CodeEditorProps {
  initialCode: string;
  title?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode, title = "Python Editor" }) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");

  const handleRunCode = () => {
    // In a real implementation, you would send this to a backend service
    // For now, we'll just show the code as output
    setOutput(`Output:\n${code}`);
  };

  return (
    <CodeEditorWrapper>
      <EditorHeader>
        <EditorTitle>{title}</EditorTitle>
        <RunButton onClick={handleRunCode}>Run ▶</RunButton>
      </EditorHeader>
      <SyntaxHighlighter
        language="python"
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1rem',
          fontSize: '14px',
          backgroundColor: '#1e1e1e',
        }}
      >
        {code}
      </SyntaxHighlighter>
      <OutputWindow>
        {output}
      </OutputWindow>
    </CodeEditorWrapper>
  );
};

// Move this before the courseContent definition
interface QuizProps {
  id: string;
  sectionId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const Quiz: React.FC<QuizProps> = ({
  id,
  sectionId,
  question,
  options,
  correctAnswer,
  explanation,
  difficulty
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | React.ReactNode | null>(null);
  const [showResult, setShowResult] = useState(false);
  const { updateQuizProgress } = useCourseProgress();

  const handleSubmit = () => {
    if (selectedAnswer) {
      const isCorrect = selectedAnswer === correctAnswer;
      updateQuizProgress(sectionId, id, isCorrect);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  return (
    <QuizContainer>
      <QuizTitle>
        {question}
        {difficulty && (
          <span style={{ 
            marginLeft: 'auto', 
            fontSize: '0.8em',
            color: difficulty === 'easy' ? '#00c853' : difficulty === 'medium' ? '#ff9800' : '#f44336'
          }}>
            {difficulty.toUpperCase()}
          </span>
        )}
      </QuizTitle>
      <div>
        {options.map((option, index) => (
          <AnswerOption
            key={index}
            $selected={selectedAnswer === option}
            $correct={showResult && option === correctAnswer}
            $incorrect={showResult && selectedAnswer === option && option !== correctAnswer}
            onClick={() => !showResult && setSelectedAnswer(option)}
          >
            {option}
          </AnswerOption>
        ))}
      </div>
      {!showResult ? (
        <SubmitButton onClick={handleSubmit}>Submit Answer</SubmitButton>
      ) : (
        <>
          <div style={{ margin: '16px 0', color: selectedAnswer === correctAnswer ? '#00c853' : '#f44336' }}>
            {selectedAnswer === correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
          </div>
          <p>{explanation}</p>
          <SubmitButton onClick={handleTryAgain}>Try Again</SubmitButton>
        </>
      )}
    </QuizContainer>
  );
};

// Then define courseContent
const courseContent = {
  title: "Python Programming",
  description: "Master Python programming from basic syntax to advanced concepts",
  modules: [
    {
      id: "introduction",
      title: "Introduction to Python",
      sections: [
        {
          id: "what-is-python",
          title: "What is Python?",
          content: (
            <ContentSection>
              <ContentTitle>Introduction to Python</ContentTitle>
              <ContentDescription>
                Python is a popular, high-level programming language created by Guido van Rossum and released in 1991. It's designed for:
              </ContentDescription>

              <Section>
                <TopicTitle>Main Applications</TopicTitle>
                <List>
                  <li>Web development (server-side)</li>
                  <li>Software Development</li>
                  <li>Mathematics and Complex Calculations</li>
                  <li>System Scripting</li>
                  <li>Data Analysis and Machine Learning</li>
                </List>

                <CodeEditor
                  title="Your First Python Program"
                  initialCode={`# Try running this code!
print("Hello, World!")
name = input("What's your name? ")
print(f"Nice to meet you, {name}!")`}
                />

                <TopicTitle>Why Choose Python?</TopicTitle>
                <ExampleBox>
                  <SubTopicTitle>Key Advantages</SubTopicTitle>
                  <List>
                    <li>Cross-platform compatibility (Windows, Mac, Linux, Raspberry Pi)</li>
                    <li>Simple, English-like syntax that emphasizes readability</li>
                    <li>Requires fewer lines of code compared to other languages</li>
                    <li>Interactive interpreter for rapid development</li>
                  </List>
                </ExampleBox>

                <Quiz
                  id="intro1"
                  sectionId="what-is-python"
                  question="Which of the following is NOT a common use case for Python?"
                  options={[
                    "Web development",
                    "Mobile app development",
                    "Data analysis",
                    "System scripting"
                  ]}
                  correctAnswer="Mobile app development"
                  explanation="While Python can be used for mobile development, it's not a common choice. Languages like Swift (iOS) and Kotlin/Java (Android) are more typically used for mobile app development."
                  difficulty="easy"
                />
              </Section>

              <Section>
                <h2>Python Versions</h2>
                <p>Python has two major versions:</p>
                <ExampleBox>
                  <h3>Python 3 (Current)</h3>
                  <ul>
                    <li>The current and recommended version</li>
                    <li>Includes the latest features and improvements</li>
                    <li>Better Unicode support</li>
                    <li>More intuitive integer division</li>
                  </ul>

                  <h3>Python 2 (Legacy)</h3>
                  <ul>
                    <li>No longer maintained (since January 2020)</li>
                    <li>Only receives security updates</li>
                    <li>Still used in some legacy systems</li>
                  </ul>
                </ExampleBox>

                <Quiz
                  id="intro2"
                  sectionId="what-is-python"
                  question="What makes Python different from other programming languages?"
                  options={[
                    "It uses curly braces for code blocks",
                    "It requires compilation before running",
                    "It uses indentation to define code blocks",
                    "It requires variable type declaration"
                  ]}
                  correctAnswer="It uses indentation to define code blocks"
                  explanation="Python is unique in using indentation (whitespace) to define code blocks, while most other languages use curly braces or keywords. This enforces clean, readable code."
                  difficulty="easy"
                />
              </Section>
            </ContentSection>
          )
        },
        {
          id: "getting-started",
          title: "Getting Started",
          content: (
            <ContentSection>
              <h1>Getting Started with Python</h1>
              <p>Before you begin coding in Python, it's important to understand the development environment and basic setup.</p>

              <Section>
                <h2>Python Development Environment</h2>
                <ExampleBox>
                  <h3>Ways to Write Python Code</h3>
                  <ul>
                    <li><strong>Text Editors:</strong> Simple tools for writing code (e.g., Notepad++, Sublime Text)</li>
                    <li><strong>IDEs (Integrated Development Environments):</strong>
                      <ul>
                        <li>PyCharm - Full-featured professional IDE</li>
                        <li>Visual Studio Code - Lightweight but powerful editor</li>
                        <li>Thonny - Beginner-friendly Python IDE</li>
                        <li>IDLE - Python's built-in IDE</li>
                      </ul>
                    </li>
                    <li><strong>Online Platforms:</strong> Web-based environments for learning and testing</li>
                  </ul>
                </ExampleBox>

                <h2>Your First Python Program</h2>
                <ExampleBox>
                  <h3>Hello, World!</h3>
                  <pre>{`print("Hello, World!")`}</pre>
                  <p>This simple program demonstrates several key aspects of Python:</p>
                  <ul>
                    <li>The print() function outputs text to the screen</li>
                    <li>Text strings are enclosed in quotes</li>
                    <li>Python executes code line by line</li>
                    <li>No semicolon is needed at the end of statements</li>
                  </ul>
                </ExampleBox>

                <Quiz
                  id="start1"
                  sectionId="getting-started"
                  question="What is the correct way to print 'Hello, World!' in Python?"
                  options={[
                    'System.out.println("Hello, World!");',
                    'console.log("Hello, World!");',
                    'print("Hello, World!")',
                    'echo "Hello, World!";'
                  ]}
                  correctAnswer='print("Hello, World!")'
                  explanation="Python uses the print() function to output text. Unlike other languages, Python doesn't require semicolons at the end of statements and uses simple, straightforward syntax."
                  difficulty="easy"
                />
              </Section>
            </ContentSection>
          )
        }
      ]
    },
    {
      id: "python-basics",
      title: "Python Fundamentals",
      sections: [
        {
          id: "syntax",
          title: "Python Syntax",
          content: (
            <ContentSection>
              <h1>Python Syntax</h1>
              <p>Python syntax can be executed by writing directly in the Command Line or by creating a .py file:</p>

              <Section>
                <h2>Python Indentation</h2>
                <ExampleBox>
                  <p>Indentation refers to the spaces at the beginning of a code line.</p>
                  <pre>{`
if 5 > 2:
    print("Five is greater than two!")  # Correct
if 5 > 2:
print("Five is greater than two!")      # Wrong - no indentation
                  `}</pre>
                  <ul>
                    <li>Python uses indentation to indicate a block of code</li>
                    <li>The number of spaces is up to you, but it must be at least one</li>
                    <li>You must use the same number of spaces in the same block of code</li>
                    <li>Most developers use four spaces</li>
                  </ul>
                </ExampleBox>

                <Quiz
                  id="syntax1"
                  sectionId="syntax"
                  question="How many spaces are commonly used for indentation in Python?"
                  options={["2", "3", "4", "5"]}
                  correctAnswer="4"
                  explanation="While Python allows any number of spaces for indentation, 4 spaces is the most common and PEP 8 (Python style guide) recommended standard."
                  difficulty="easy"
                />
              </Section>

              <Section>
                <h2>Variables in Python</h2>
                <ExampleBox>
                  <pre>{`
x = 5       # x is of type int
y = "John"  # y is of type str
print(x)
print(y)
                  `}</pre>
                  <p>Variables are created when you assign a value to them:</p>
                  <ul>
                    <li>Variables don't need to be declared with any particular type</li>
                    <li>Variables can change type after they have been set</li>
                  </ul>
                </ExampleBox>
              </Section>
            </ContentSection>
          )
        },
        {
          id: "comments",
          title: "Python Comments",
          content: (
            <ContentSection>
              <h1>Python Comments</h1>
              <p>Comments can be used to explain Python code or make the code more readable.</p>

              <Section>
                <h2>Creating Comments</h2>
                <ExampleBox>
                  <h3>Single Line Comments</h3>
                  <pre>{`
# This is a comment
print("Hello, World!")  # This is a comment after code
                  `}</pre>

                  <h3>Multi Line Comments</h3>
                  <pre>{`
"""
This is a comment
written in
more than just one line
"""
                  `}</pre>
                </ExampleBox>

                <Quiz
                  id="comments1"
                  sectionId="comments"
                  question="Which symbol is used for single-line comments in Python?"
                  options={["//", "#", "/*", "--"]}
                  correctAnswer="#"
                  explanation="In Python, the hash symbol (#) is used to start a single-line comment. Everything after # on that line is ignored by the interpreter."
                  difficulty="easy"
                />
              </Section>
            </ContentSection>
          )
        },
        {
          id: "variables",
          title: "Python Variables",
          content: (
            <ContentSection>
              <h1>Python Variables</h1>
              <p>Variables are containers for storing data values.</p>

              <Section>
                <h2>Creating Variables</h2>
                <ExampleBox>
                  <pre>{`
x = 5
y = "Hello"
print(x)
print(y)
                  `}</pre>
                  <h3>Variable Names</h3>
                  <ul>
                    <li>Must start with a letter or underscore</li>
                    <li>Can only contain alpha-numeric characters and underscores (A-z, 0-9, and _)</li>
                    <li>Are case-sensitive (age, Age and AGE are different variables)</li>
                  </ul>
                </ExampleBox>

                <h2>Multiple Values Assignment</h2>
                <ExampleBox>
                  <pre>{`
# Many values to multiple variables
x, y, z = "Orange", "Banana", "Cherry"

# One value to multiple variables
x = y = z = "Orange"
                  `}</pre>
                </ExampleBox>

                <Quiz
                  id="vars1"
                  sectionId="variables"
                  question="Which of these is NOT a valid variable name in Python?"
                  options={[
                    "my_var",
                    "_myvar",
                    "1var",
                    "myVar"
                  ]}
                  correctAnswer="1var"
                  explanation="Variable names cannot start with a number. They must start with a letter or underscore."
                  difficulty="easy"
                />
              </Section>
            </ContentSection>
          )
        },
        {
          id: "data-types",
          title: "Python Data Types",
          content: (
            <ContentSection>
              <h1>Python Data Types</h1>
              <p>In programming, data type is an important concept. Variables can store data of different types.</p>

              <Section>
                <h2>Built-in Data Types</h2>
                <ExampleBox>
                  <pre>{`
# Text Type:      str
x = "Hello World"

# Numeric Types:  int, float, complex
x = 20            # int
y = 20.5          # float
z = 1j            # complex

# Sequence Types: list, tuple, range
x = ["apple", "banana"]    # list
x = ("apple", "banana")    # tuple
x = range(6)              # range

# Mapping Type:   dict
x = {"name" : "John", "age" : 36}

# Set Types:      set, frozenset
x = {"apple", "banana", "cherry"}

# Boolean Type:   bool
x = True

# None Type:      NoneType
x = None
                  `}</pre>
                </ExampleBox>

                <Quiz
                  id="types1"
                  sectionId="data-types"
                  question="What is the data type of this value: x = 20.5?"
                  options={[
                    "int",
                    "float",
                    "complex",
                    "str"
                  ]}
                  correctAnswer="float"
                  explanation="Numbers with a decimal point are stored as float data type in Python."
                  difficulty="easy"
                />
              </Section>
            </ContentSection>
          )
        }
      ]
    },
    {
      id: "python-advanced",
      title: "Advanced Python Concepts",
      sections: [
        {
          id: "classes-objects",
          title: "Classes and Objects",
          content: (
            <ContentSection>
              <h1>Object-Oriented Programming in Python</h1>
              <p>Classes provide a means of bundling data and functionality together.</p>

              <Section>
                <h2>Class Definition</h2>
                <ExampleBox>
                  <h3>Basic Class Structure</h3>
                  <pre>{`
class Car:
    def __init__(self, brand, model):
        self.brand = brand
        self.model = model
        
    def display_info(self):
        return f"{self.brand} {self.model}"

# Creating an object
my_car = Car("Toyota", "Camry")
print(my_car.display_info())`}
                  </pre>
                </ExampleBox>

                <Section>
                  <h3>Inheritance</h3>
                  <ExampleBox>
                    <pre>{`
class ElectricCar(Car):
    def __init__(self, brand, model, battery_size):
        super().__init__(brand, model)
        self.battery_size = battery_size
        
    def display_info(self):
        return f"{super().display_info()} - {self.battery_size}kWh"`}
                    </pre>
                  </ExampleBox>
                </Section>

                <Quiz
                  id="class1"
                  sectionId="classes-objects"
                  question="What is the purpose of the __init__ method in a Python class?"
                  options={[
                    "To initialize class attributes",
                    "To create a new instance of the class",
                    "To define class methods",
                    "To delete class instances"
                  ]}
                  correctAnswer="To initialize class attributes"
                  explanation="The __init__ method is a constructor that initializes new object instances with their attributes. It's called automatically when creating a new object."
                  difficulty="medium"
                />
              </Section>
            </ContentSection>
          )
        },
        {
          id: "error-handling",
          title: "Error Handling",
          content: (
            <ContentSection>
              <h1>Exception Handling in Python</h1>
              <p>Exception handling allows you to gracefully handle errors in your code.</p>

              <Section>
                <h2>Try-Except Blocks</h2>
                <ExampleBox>
                  <h3>Basic Exception Handling</h3>
                  <pre>{`
try:
    number = int(input("Enter a number: "))
    result = 10 / number
except ValueError:
    print("Please enter a valid number")
except ZeroDivisionError:
    print("Cannot divide by zero")
else:
    print(f"Result: {result}")
finally:
    print("Execution completed")`}
                  </pre>
                </ExampleBox>

                <Quiz
                  id="error1"
                  sectionId="error-handling"
                  question="Which block is executed regardless of whether an exception occurs?"
                  options={[
                    "try",
                    "except",
                    "else",
                    "finally"
                  ]}
                  correctAnswer="finally"
                  explanation="The finally block is always executed, whether an exception occurred or not. It's commonly used for cleanup operations like closing files or database connections."
                  difficulty="medium"
                />
              </Section>
            </ContentSection>
          )
        }
      ]
    }
  ]
};

const PythonBasics: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const { user, logout } = useAuth();
  const { 
    updateScrollProgress, 
    getCourseProgress, 
    getSectionProgress,
    loading,
    isAuthenticated 
  } = useCourseProgress();
  const contentRef = useRef<HTMLDivElement>(null);
  const courseId = 'python-basics';
  const navigate = useNavigate();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  // Set initial active section
  useEffect(() => {
    if (!activeSection && courseContent.modules.length > 0) {
      const firstModule = courseContent.modules[0];
      if (firstModule.sections.length > 0) {
        setActiveSection(firstModule.sections[0].id);
      }
    }
  }, [activeSection]);

  // Track scroll progress for authenticated users
  useEffect(() => {
    if (!user) return;

    const handleScroll = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        const totalHeight = element.scrollHeight - element.clientHeight;
        const scrollPosition = element.scrollTop;
        const progress = Math.min((scrollPosition / totalHeight) * 100, 100);
        
        updateScrollProgress(courseId, progress);
        if (activeSection) {
          updateScrollProgress(activeSection, progress);
        }
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, [updateScrollProgress, activeSection, courseId, user]);

  // Handle navbar scroll
  useEffect(() => {
    let lastScroll = 0;
    
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setIsScrolled(currentScroll > 0);
      
      if (currentScroll > lastScroll) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const progress = user ? getCourseProgress(courseId) : 0;
  const sectionProgress = user && activeSection ? getSectionProgress(activeSection) : 0;

  return (
    <>
      <Navbar
        isScrolled={isScrolled}
        scrollDirection={scrollDirection}
        isLoggedIn={!!user}
        onLogout={handleLogout}
      />
      <PageLayout>
        <SidebarWrapper>
          <Sidebar>
            <CourseTitle>Python Programming</CourseTitle>
            <NavList>
              {courseContent.modules.map(module => (
                <ModuleWrapper key={module.id}>
                  <ModuleTitle
                    $active={expandedModule === module.id}
                    onClick={() => setExpandedModule(
                      expandedModule === module.id ? null : module.id
                    )}
                  >
                    {module.title}
                  </ModuleTitle>
                  <SectionList $expanded={expandedModule === module.id}>
                    {module.sections.map(section => (
                      <SectionItem
                        key={section.id}
                        $active={activeSection === section.id}
                        onClick={() => {
                          setActiveSection(section.id);
                          setExpandedModule(module.id);
                        }}
                      >
                        {section.title}
                      </SectionItem>
                    ))}
                  </SectionList>
                </ModuleWrapper>
              ))}
            </NavList>
          </Sidebar>
        </SidebarWrapper>
        <MainContent ref={contentRef}>
          {isAuthenticated && (
            <ProgressBar>
              <Progress $progress={sectionProgress} />
            </ProgressBar>
          )}
          {activeSection && courseContent.modules.map(module =>
            module.sections.find(section => section.id === activeSection)?.content
          )}
        </MainContent>
      </PageLayout>
      <Footer />
    </>
  );
};

// Move NavItem declaration before SectionItem
const NavItem = styled.li<{ $active?: boolean }>`
  padding: 12px 20px;
  cursor: pointer;
  color: ${props => props.$active ? '#6c63ff' : '#4b5563'};
  background: ${props => props.$active ? '#f0f4ff' : 'transparent'};
  border-left: 4px solid ${props => props.$active ? '#6c63ff' : 'transparent'};

  &:hover {
    background: #f0f4ff;
    color: #6c63ff;
  }
`;

const SectionItem = styled(NavItem)`
  padding-left: 40px;
  font-size: 15px;
  color: ${props => props.$active ? '#6c63ff' : '#6b7280'};
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const PageLayout = styled.div`
  display: flex;
  min-height: 100vh;
  padding-top: 80px;
`;

const SidebarWrapper = styled.div`
  position: relative;
  width: 300px;
  flex-shrink: 0;
`;

const Sidebar = styled.div`
  width: 300px;
  background: #f8f9fa;
  border-right: 1px solid #e5e7eb;
  padding: 20px 0;
  position: sticky;
  top: 80px;
  height: calc(100vh - 80px);
  overflow-y: auto;
`;

const CourseTitle = styled.h1`
  font-size: 24px;
  color: #1f2937;
  margin-bottom: 30px;
  padding: 0 20px;
`;

const ModuleWrapper = styled.div`
  border-bottom: 1px solid #e5e7eb;
`;

const ModuleTitle = styled.div<{ $active?: boolean }>`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.$active ? '#6c63ff' : '#374151'};
  padding: 15px 20px;
  cursor: pointer;
  background: ${props => props.$active ? '#f0f4ff' : '#f8fafc'};
  transition: all 0.2s ease;
  
  &:hover {
    background: #f0f4ff;
    color: #6c63ff;
  }
`;

const SectionList = styled.div<{ $expanded: boolean }>`
  max-height: ${props => props.$expanded ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 40px;
  background: white;
  min-height: calc(100vh - 80px);
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  margin: 20px 0;
  overflow: hidden;
`;

const Progress = styled.div<{ $progress: number }>`
  width: ${props => props.$progress}%;
  height: 100%;
  background: #6c63ff;
  transition: width 0.3s ease;
`;

export default PythonBasics; 