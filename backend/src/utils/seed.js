require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Branch = require('../models/Branch');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const Tutorial = require('../models/Tutorial');
const Quiz = require('../models/Quiz');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Branch.deleteMany({});
    await Subject.deleteMany({});
    await Topic.deleteMany({});
    await Tutorial.deleteMany({});
    await Quiz.deleteMany({});

    // Create Admin & Author & Student
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@tutorialsadda.com',
      password: hashedPassword,
      role: 'admin'
    });

    const author = await User.create({
      name: 'Author John',
      email: 'author@tutorialsadda.com',
      password: hashedPassword,
      role: 'author'
    });

    const student = await User.create({
      name: 'Student Jane',
      email: 'student@tutorialsadda.com',
      password: hashedPassword,
      role: 'student'
    });

    // Create Branch
    const branch = await Branch.create({
      name: 'Computer Science',
      slug: 'computer-science',
      description: 'Engineering branch tutorials and guides',
      image: 'https://res.cloudinary.com/dummy/image/upload/v1/branch.png'
    });

    // Create Subject
    const subject = await Subject.create({
      name: 'Data Structures',
      slug: 'data-structures',
      branch: branch._id,
      description: 'Learn fundamental data structures'
    });

    // Create Topic
    const topic = await Topic.create({
      name: 'Arrays',
      slug: 'arrays',
      subject: subject._id,
      description: 'Mastering array algorithms and problems'
    });

    // Create Tutorial first
    const tutorial = await Tutorial.create({
      title: 'Two Sum Algorithm',
      slug: 'two-sum-algorithm',
      description: 'Learn how to solve Two Sum problem efficiently in C++ and JavaScript.',
      content: 'Detailed tutorial content explaining the Two Sum algorithm using Hash Map.',
      branch: branch._id,
      subject: subject._id,
      topic: topic._id,
      author: author._id,
      codeBlocks: [
        {
          language: 'cpp',
          code: '#include <vector>\nusing namespace std;\n// Two sum implementation'
        }
      ],
      seo: {
        title: 'Two Sum Algorithm Tutorial | TutorialsAdda',
        description: 'Learn Two Sum algorithm with code examples.',
        keywords: ['two sum', 'algorithms', 'data structures']
      },
      status: 'published',
      views: 120
    });

    // Create Quiz linked to tutorial
    const quiz = await Quiz.create({
      tutorial: tutorial._id,
      questions: [
        {
          question: 'What is the time access complexity of an array by index?',
          options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
          correctAnswer: 'O(1)',
          explanation: 'Arrays allow random access in constant time O(1).'
        }
      ]
    });

    tutorial.quiz = quiz._id;
    await tutorial.save();

    console.log('Dummy data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
