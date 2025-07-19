const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testAPI() {
  try {
    // Create a comprehensive test file
    const testContent = `John Doe
Senior Full Stack Developer
Location: San Francisco, CA
Email: john.doe@email.com
Phone: (555) 123-4567
LinkedIn: linkedin.com/in/johndoe
GitHub: github.com/johndoe
Website: johndoe.dev

PROFESSIONAL SUMMARY
Experienced full stack software engineer with 8+ years of experience developing scalable web applications.
Passionate about creating efficient, user-friendly solutions using modern technologies.
Proven track record of leading development teams and delivering high-quality software products.

PROFESSIONAL EXPERIENCE

Senior Full Stack Developer
Tech Innovations Inc. | January 2021 - Present
• Led development of microservices architecture serving 1M+ users
• Implemented CI/CD pipelines reducing deployment time by 60%
• Mentored junior developers and conducted code reviews
• Technologies: React, Node.js, AWS, Docker, Kubernetes

Software Engineer
Digital Solutions Corp | June 2018 - December 2020
• Developed responsive web applications using React and TypeScript
• Built RESTful APIs with Node.js and Express
• Optimized database queries improving performance by 40%
• Collaborated with cross-functional teams in Agile environment

Junior Developer
StartupXYZ | August 2016 - May 2018
• Created user interfaces using HTML, CSS, and JavaScript
• Participated in daily standups and sprint planning
• Fixed bugs and implemented new features

EDUCATION

Master of Science in Computer Science
Stanford University | 2014 - 2016
GPA: 3.8/4.0

Bachelor of Science in Computer Science
University of California, Berkeley | 2010 - 2014
GPA: 3.6/4.0

TECHNICAL SKILLS
Programming Languages: JavaScript, TypeScript, Python, Java, C++
Frontend: React, Vue.js, Angular, HTML5, CSS3, Sass, Bootstrap, Tailwind CSS
Backend: Node.js, Express, Django, Flask, Spring Boot
Databases: PostgreSQL, MongoDB, MySQL, Redis
Cloud & DevOps: AWS, Azure, Docker, Kubernetes, Jenkins, Git, GitHub Actions
Tools: VS Code, IntelliJ, Postman, Figma, Jira, Slack

CERTIFICATIONS
AWS Certified Solutions Architect - Associate (2022)
Google Cloud Professional Developer (2021)
Certified Kubernetes Administrator (2020)

LANGUAGES
English (Native)
Spanish (Fluent)
French (Conversational)`;

    // Write test file
    fs.writeFileSync('test-resume.txt', testContent);

    // Create form data
    const formData = new FormData();
    formData.append('resume', fs.createReadStream('test-resume.txt'), {
      filename: 'test-resume.txt',
      contentType: 'text/plain'
    });

    // Make request
    const response = await fetch('http://localhost:3000/api/parse-resume', {
      method: 'POST',
      body: formData
    });

    console.log('Status:', response.status);
    console.log('Headers:', response.headers.raw());

    const text = await response.text();
    console.log('Response:', text);

    // Clean up
    fs.unlinkSync('test-resume.txt');

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAPI();
