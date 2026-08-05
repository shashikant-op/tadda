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
    console.log('Connected to DB for comprehensive seeding...');

    await User.deleteMany({});
    await Branch.deleteMany({});
    await Subject.deleteMany({});
    await Topic.deleteMany({});
    await Tutorial.deleteMany({});
    await Quiz.deleteMany({});

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

    const branchesData = [
      {
        name: 'Computer Science',
        slug: 'computer-science',
        description: 'Core Computer Science and Software Engineering tutorials',
        image: 'https://res.cloudinary.com/dummy/image/upload/v1/cse.png',
        subjects: [
          {
            name: 'Data Structures',
            slug: 'data-structures',
            description: 'Fundamental data structures and algorithms',
            topics: [
              { name: 'Module 1: Arrays & Strings', slug: 'arrays-strings', description: 'Master array manipulation and string algorithms.', tutorialTitle: 'Array Operations & Two Pointers' },
              { name: 'Module 2: Linked Lists', slug: 'linked-lists', description: 'Singly and doubly linked lists implementation.', tutorialTitle: 'Reversing a Linked List' },
              { name: 'Module 3: Stacks & Queues', slug: 'stacks-queues', description: 'LIFO and FIFO data structures.', tutorialTitle: 'Balanced Parentheses using Stack' },
              { name: 'Module 4: Trees & BST', slug: 'trees-bst', description: 'Binary trees, BST, and traversals.', tutorialTitle: 'Binary Tree Level Order Traversal' },
              { name: 'Module 5: Graphs', slug: 'graphs', description: 'Graph representations, BFS, and DFS.', tutorialTitle: 'Breadth-First Search (BFS) in Graphs' }
            ]
          },
          {
            name: 'Algorithms',
            slug: 'algorithms',
            description: 'Advanced algorithm design and complexity analysis',
            topics: [
              { name: 'Module 1: Sorting & Searching', slug: 'sorting-searching', description: 'Merge sort, quick sort, and binary search.', tutorialTitle: 'Merge Sort Algorithm Implementation' },
              { name: 'Module 2: Dynamic Programming', slug: 'dynamic-programming', description: 'Memoization and tabulation techniques.', tutorialTitle: 'Fibonacci & Knapsack DP' },
              { name: 'Module 3: Greedy Algorithms', slug: 'greedy-algorithms', description: 'Activity selection and Huffman coding.', tutorialTitle: 'Interval Scheduling Greedy Approach' },
              { name: 'Module 4: Backtracking', slug: 'backtracking', description: 'N-Queens and Sudoku solver.', tutorialTitle: 'Solving N-Queens with Backtracking' },
              { name: 'Module 5: Graph Algorithms', slug: 'graph-algorithms', description: 'Dijkstra and Kruskal algorithms.', tutorialTitle: 'Dijkstra Shortest Path Algorithm' }
            ]
          },
          {
            name: 'Operating Systems',
            slug: 'operating-systems',
            description: 'Process management, memory management, and file systems',
            topics: [
              { name: 'Module 1: Processes & Threads', slug: 'processes-threads', description: 'Process states, PCB, and multithreading.', tutorialTitle: 'Process Control Block and Context Switching' },
              { name: 'Module 2: CPU Scheduling', slug: 'cpu-scheduling', description: 'FCFS, SJF, Round Robin scheduling.', tutorialTitle: 'Round Robin CPU Scheduling Algorithm' },
              { name: 'Module 3: Synchronization', slug: 'synchronization', description: 'Semaphores, Mutex, and Deadlocks.', tutorialTitle: 'Producer-Consumer Problem with Semaphores' },
              { name: 'Module 4: Memory Management', slug: 'memory-management', description: 'Paging, segmentation, and virtual memory.', tutorialTitle: 'Virtual Memory and Page Replacement' },
              { name: 'Module 5: File Systems', slug: 'file-systems', description: 'File allocation methods and disk scheduling.', tutorialTitle: 'Disk Scheduling Algorithms (SCAN, C-SCAN)' }
            ]
          },
          {
            name: 'Computer Networks',
            slug: 'computer-networks',
            description: 'OSI model, TCP/IP, routing, and network security',
            topics: [
              { name: 'Module 1: Physical & Data Link Layer', slug: 'physical-data-link', description: 'Framing, error control, and MAC protocols.', tutorialTitle: 'Ethernet Framing and CSMA/CD' },
              { name: 'Module 2: Network Layer', slug: 'network-layer', description: 'IP addressing, subnetting, and routing protocols.', tutorialTitle: 'CIDR Subnetting and IP Routing' },
              { name: 'Module 3: Transport Layer', slug: 'transport-layer', description: 'TCP congestion control and UDP reliability.', tutorialTitle: 'TCP 3-Way Handshake and Flow Control' },
              { name: 'Module 4: Application Layer', slug: 'application-layer', description: 'HTTP/HTTPS, DNS, SMTP protocols.', tutorialTitle: 'How DNS Resolution Works' },
              { name: 'Module 5: Network Security', slug: 'network-security', description: 'Firewalls, TLS/SSL, and cryptography.', tutorialTitle: 'TLS Handshake and Certificate Authority' }
            ]
          },
          {
            name: 'Database Management Systems',
            slug: 'database-management-systems',
            description: 'Relational databases, SQL, normalization, and ACID properties',
            topics: [
              { name: 'Module 1: ER Modeling & Relational Algebra', slug: 'er-modeling', description: 'Entities, attributes, and relationships.', tutorialTitle: 'Entity-Relationship Diagram Best Practices' },
              { name: 'Module 2: SQL & Joins', slug: 'sql-joins', description: 'Advanced SQL queries, subqueries, and joins.', tutorialTitle: 'Mastering SQL Inner, Left, and Outer Joins' },
              { name: 'Module 3: Normalization', slug: 'normalization', description: '1NF, 2NF, 3NF, and BCNF.', tutorialTitle: 'Database Normalization up to 3NF' },
              { name: 'Module 4: Transactions & Concurrency', slug: 'transactions-concurrency', description: 'ACID properties and locking protocols.', tutorialTitle: 'ACID Properties and Isolation Levels' },
              { name: 'Module 5: Indexing & Performance', slug: 'indexing-performance', description: 'B-Trees, hash indexes, and query optimization.', tutorialTitle: 'B-Tree Indexing and Query Performance' }
            ]
          }
        ]
      },
      {
        name: 'EEE',
        slug: 'eee',
        description: 'Electrical and Electronics Engineering tutorials',
        image: 'https://res.cloudinary.com/dummy/image/upload/v1/eee.png',
        subjects: [
          {
            name: 'Fiber Optics',
            slug: 'fiber-optics',
            description: 'Principles of optical communication',
            topics: [
              { name: 'Module 1: Optical Waveguides', slug: 'optical-waveguides', description: 'Total internal reflection.', tutorialTitle: 'Introduction to Optical Fibers' },
              { name: 'Module 2: Numerical Aperture', slug: 'numerical-aperture', description: 'Light gathering capability.', tutorialTitle: 'Numerical Aperture Calculation' },
              { name: 'Module 3: Signal Attenuation', slug: 'signal-attenuation', description: 'Absorption and scattering losses.', tutorialTitle: 'Calculating Optical Signal Loss' },
              { name: 'Module 4: Optical Sources', slug: 'optical-sources', description: 'LEDs and Laser diodes.', tutorialTitle: 'Semiconductor Lasers in Fiber Optics' },
              { name: 'Module 5: Photodetectors', slug: 'photodetectors', description: 'PIN and APD photodiodes.', tutorialTitle: 'Working of PIN Photodetectors' }
            ]
          },
          {
            name: 'Power Systems',
            slug: 'power-systems',
            description: 'Generation, transmission, and distribution of electrical power',
            topics: [
              { name: 'Module 1: Generation Systems', slug: 'generation-systems', description: 'Thermal, hydro, and nuclear plants.', tutorialTitle: 'Thermal Power Plant Overview' },
              { name: 'Module 2: Transmission Line Parameters', slug: 'transmission-parameters', description: 'Resistance, inductance, and capacitance.', tutorialTitle: 'Calculations for Overhead Transmission Lines' },
              { name: 'Module 3: Load Flow Analysis', slug: 'load-flow-analysis', description: 'Gauss-Seidel and Newton-Raphson methods.', tutorialTitle: 'Newton-Raphson Power Flow Analysis' },
              { name: 'Module 4: Fault Analysis', slug: 'fault-analysis', description: 'Symmetrical and unsymmetrical faults.', tutorialTitle: 'Symmetrical Three-Phase Fault Analysis' },
              { name: 'Module 5: Power System Protection', slug: 'protection-systems', description: 'Relays, circuit breakers, and stability.', tutorialTitle: 'Overcurrent Protection Relays' }
            ]
          },
          {
            name: 'Control Systems',
            slug: 'control-systems',
            description: 'Feedback control systems and stability analysis',
            topics: [
              { name: 'Module 1: Mathematical Modeling', slug: 'mathematical-modeling', description: 'Transfer functions and block diagrams.', tutorialTitle: 'Block Diagram Reduction Techniques' },
              { name: 'Module 2: Time Response Analysis', slug: 'time-response', description: 'First and second order systems response.', tutorialTitle: 'Second-Order System Step Response' },
              { name: 'Module 3: Stability Analysis', slug: 'stability-analysis', description: 'Routh-Hurwitz criterion.', tutorialTitle: 'Routh-Hurwitz Stability Criterion' },
              { name: 'Module 4: Root Locus Technique', slug: 'root-locus', description: 'Plotting root locus diagrams.', tutorialTitle: 'Root Locus Design Rules' },
              { name: 'Module 5: Frequency Response', slug: 'frequency-response', description: 'Bode plots and Nyquist criteria.', tutorialTitle: 'Bode Plot Magnitude and Phase' }
            ]
          },
          {
            name: 'Digital Signal Processing',
            slug: 'digital-signal-processing',
            description: 'Discrete-time signals, systems, and transforms',
            topics: [
              { name: 'Module 1: Discrete Signals', slug: 'discrete-signals', description: 'Sampling theorem and quantization.', tutorialTitle: 'Nyquist Sampling Theorem' },
              { name: 'Module 2: LTI Systems', slug: 'lti-systems', description: 'Convolution and impulse response.', tutorialTitle: 'Linear Time-Invariant System Convolution' },
              { name: 'Module 3: Z-Transform', slug: 'z-transform', description: 'Properties and inverse Z-transform.', tutorialTitle: 'Region of Convergence in Z-Transform' },
              { name: 'Module 4: Fourier Transform (DFT/FFT)', slug: 'dft-fft', description: 'Fast Fourier Transform algorithms.', tutorialTitle: 'Cooley-Tukey FFT Algorithm' },
              { name: 'Module 5: Digital Filter Design', slug: 'digital-filters', description: 'FIR and IIR filter design.', tutorialTitle: 'Designing FIR Filters using Windowing' }
            ]
          },
          {
            name: 'Electrical Machines',
            slug: 'electrical-machines',
            description: 'Transformers, DC machines, and induction motors',
            topics: [
              { name: 'Module 1: Transformers', slug: 'transformers', description: 'Single-phase and three-phase transformers.', tutorialTitle: 'Transformer Equivalent Circuit and Losses' },
              { name: 'Module 2: DC Generators', slug: 'dc-generators', description: 'Construction and EMF equation.', tutorialTitle: 'DC Generator Characteristics' },
              { name: 'Module 3: DC Motors', slug: 'dc-motors', description: 'Speed control and torque equations.', tutorialTitle: 'DC Motor Speed Control Methods' },
              { name: 'Module 4: Induction Motors', slug: 'induction-motors', description: 'Three-phase induction motor principles.', tutorialTitle: 'Slip-Torque Characteristics of Induction Motors' },
              { name: 'Module 5: Synchronous Machines', slug: 'synchronous-machines', description: 'Alternators and synchronous motors.', tutorialTitle: 'Synchronous Generator Voltage Regulation' }
            ]
          }
        ]
      },
      {
        name: 'Mechanical Engineering',
        slug: 'mechanical',
        description: 'Thermodynamics, fluid mechanics, and machine design',
        image: 'https://res.cloudinary.com/dummy/image/upload/v1/mech.png',
        subjects: [
          {
            name: 'Thermodynamics',
            slug: 'thermodynamics',
            description: 'Laws of thermodynamics and heat engines',
            topics: [
              { name: 'Module 1: Zeroth & First Law', slug: 'first-law', description: 'Energy conservation and closed systems.', tutorialTitle: 'First Law of Thermodynamics for Closed Systems' },
              { name: 'Module 2: Second Law', slug: 'second-law', description: 'Entropy and Carnot cycle.', tutorialTitle: 'Entropy and the Second Law' },
              { name: 'Module 3: Pure Substances', slug: 'pure-substances', description: 'Phase change and steam tables.', tutorialTitle: 'Using Steam Tables for Enthalpy Calculation' },
              { name: 'Module 4: Vapor Power Cycles', slug: 'vapor-power', description: 'Rankine cycle optimization.', tutorialTitle: 'Rankine Power Cycle Efficiency' },
              { name: 'Module 5: Gas Power Cycles', slug: 'gas-power', description: 'Otto, Diesel, and Brayton cycles.', tutorialTitle: 'Otto Cycle Performance Analysis' }
            ]
          },
          {
            name: 'Fluid Mechanics',
            slug: 'fluid-mechanics',
            description: 'Fluid statics, dynamics, and boundary layers',
            topics: [
              { name: 'Module 1: Fluid Statics', slug: 'fluid-statics', description: 'Pressure measurement and buoyancy.', tutorialTitle: 'Hydrostatic Force on Submerged Surfaces' },
              { name: 'Module 2: Fluid Kinematics', slug: 'fluid-kinematics', description: 'Streamlines, vorticity, and continuity.', tutorialTitle: 'Continuity Equation in Fluid Flow' },
              { name: 'Module 3: Fluid Dynamics', slug: 'fluid-dynamics', description: 'Bernoulli\'s equation and Navier-Stokes.', tutorialTitle: 'Applying Bernoulli\'s Equation in Pipe Flow' },
              { name: 'Module 4: Internal Flow', slug: 'internal-flow', description: 'Moody chart and friction factor.', tutorialTitle: 'Darcy-Weisbach Equation for Pipe Friction' },
              { name: 'Module 5: Boundary Layer Theory', slug: 'boundary-layer', description: 'Drag and lift forces.', tutorialTitle: 'Boundary Layer Separation and Drag' }
            ]
          },
          {
            name: 'Machine Design',
            slug: 'machine-design',
            description: 'Design of machine elements and stress analysis',
            topics: [
              { name: 'Module 1: Stress Analysis', slug: 'stress-analysis', description: 'Principal stresses and theories of failure.', tutorialTitle: 'Mohr\'s Circle for Stress Transformation' },
              { name: 'Module 2: Shafts & Keys', slug: 'shafts-keys', description: 'Torsion and bending moments.', tutorialTitle: 'Design of Transmission Shafts' },
              { name: 'Module 3: Fasteners & Welds', slug: 'fasteners-welds', description: 'Bolted and welded joints.', tutorialTitle: 'Analysis of Eccentrically Loaded Welded Joints' },
              { name: 'Module 4: Gears', slug: 'gears', description: 'Spur, helical, and bevel gears.', tutorialTitle: 'Bending Stress Analysis in Spur Gears' },
              { name: 'Module 5: Bearings', slug: 'bearings', description: 'Rolling contact and journal bearings.', tutorialTitle: 'Selection of Ball and Roller Bearings' }
            ]
          },
          {
            name: 'Heat Transfer',
            slug: 'heat-transfer',
            description: 'Conduction, convection, and radiation',
            topics: [
              { name: 'Module 1: Conduction', slug: 'conduction', description: 'Fourier\'s law and fins.', tutorialTitle: '1D Steady-State Heat Conduction' },
              { name: 'Module 2: Transient Conduction', slug: 'transient-conduction', description: 'Lumped capacitance method.', tutorialTitle: 'Lumped System Analysis in Heat Transfer' },
              { name: 'Module 3: Convection', slug: 'convection', description: 'External and internal forced convection.', tutorialTitle: 'Nusselt Number and Forced Convection' },
              { name: 'Module 4: Heat Exchangers', slug: 'heat-exchangers', description: 'LMTD and effectiveness-NTU methods.', tutorialTitle: 'LMTD Method for Heat Exchanger Design' },
              { name: 'Module 5: Radiation', slug: 'radiation', description: 'Blackbody radiation and view factors.', tutorialTitle: 'Radiation Heat Transfer Between Surfaces' }
            ]
          },
          {
            name: 'Manufacturing Processes',
            slug: 'manufacturing-processes',
            description: 'Casting, forming, welding, and machining',
            topics: [
              { name: 'Module 1: Casting', slug: 'casting', description: 'Sand casting and solidification.', tutorialTitle: 'Chvorinov\'s Rule in Sand Casting' },
              { name: 'Module 2: Metal Forming', slug: 'metal-forming', description: 'Rolling, forging, and extrusion.', tutorialTitle: 'Rolling Load and Draft Calculations' },
              { name: 'Module 3: Welding', slug: 'welding', description: 'Arc, TIG, MIG, and resistance welding.', tutorialTitle: 'Heat Input Calculations in Arc Welding' },
              { name: 'Module 4: Machining', slug: 'machining', description: 'Lathe operations and tool life.', tutorialTitle: 'Taylor\'s Tool Life Equation' },
              { name: 'Module 5: CNC Programming', slug: 'cnc-programming', description: 'G-codes and M-codes.', tutorialTitle: 'Introduction to CNC Milling G-Codes' }
            ]
          }
        ]
      },
      {
        name: 'Artificial Intelligence',
        slug: 'ai-ml',
        description: 'Machine Learning, Deep Learning, and AI tutorials',
        image: 'https://res.cloudinary.com/dummy/image/upload/v1/ai.png',
        subjects: [
          {
            name: 'Machine Learning',
            slug: 'machine-learning',
            description: 'Supervised and unsupervised learning algorithms',
            topics: [
              { name: 'Module 1: Linear Regression', slug: 'linear-regression', description: 'Gradient descent and cost function.', tutorialTitle: 'Simple Linear Regression from Scratch' },
              { name: 'Module 2: Logistic Regression', slug: 'logistic-regression', description: 'Classification and sigmoid function.', tutorialTitle: 'Logistic Regression for Binary Classification' },
              { name: 'Module 3: Decision Trees', slug: 'decision-trees', description: 'Entropy, information gain, and random forests.', tutorialTitle: 'Building Decision Trees and Random Forests' },
              { name: 'Module 4: Support Vector Machines', slug: 'svm', description: 'Hyperplanes and kernel trick.', tutorialTitle: 'SVM Classification with Kernel Trick' },
              { name: 'Module 5: Clustering', slug: 'clustering', description: 'K-Means and hierarchical clustering.', tutorialTitle: 'K-Means Clustering Algorithm Explained' }
            ]
          },
          {
            name: 'Deep Learning',
            slug: 'deep-learning',
            description: 'Neural networks, CNNs, and RNNs',
            topics: [
              { name: 'Module 1: Neural Networks', slug: 'neural-networks', description: 'Perceptrons and backpropagation.', tutorialTitle: 'Building a Neural Network from Scratch' },
              { name: 'Module 2: Convolutional Networks', slug: 'cnns', description: 'Image classification and pooling.', tutorialTitle: 'Convolutional Neural Networks (CNN) for Vision' },
              { name: 'Module 3: Recurrent Networks', slug: 'rnns', description: 'LSTMs and sequence modeling.', tutorialTitle: 'LSTMs and Sequence Prediction' },
              { name: 'Module 4: Transformers', slug: 'transformers-dl', description: 'Attention mechanism and BERT/GPT.', tutorialTitle: 'Understanding Attention Mechanism in Transformers' },
              { name: 'Module 5: Generative Models', slug: 'generative-models', description: 'GANs and Diffusion models.', tutorialTitle: 'Introduction to Generative Adversarial Networks' }
            ]
          },
          {
            name: 'Natural Language Processing',
            slug: 'nlp',
            description: 'Text preprocessing, tokenization, and LLMs',
            topics: [
              { name: 'Module 1: Text Preprocessing', slug: 'text-preprocessing', description: 'Tokenization, stemming, and lemmatization.', tutorialTitle: 'Text Tokenization and Stemming in Python' },
              { name: 'Module 2: Word Embeddings', slug: 'word-embeddings', description: 'Word2Vec and GloVe representations.', tutorialTitle: 'Word2Vec Embeddings Explained' },
              { name: 'Module 3: Sequence Tagging', slug: 'sequence-tagging', description: 'POS tagging and Named Entity Recognition.', tutorialTitle: 'Named Entity Recognition with SpaCy' },
              { name: 'Module 4: Sentiment Analysis', slug: 'sentiment-analysis', description: 'Text classification and evaluation.', tutorialTitle: 'Sentiment Analysis using RNNs' },
              { name: 'Module 5: Large Language Models', slug: 'llms', description: 'Prompt engineering and fine-tuning.', tutorialTitle: 'Fine-Tuning LLMs with Hugging Face' }
            ]
          },
          {
            name: 'Computer Vision',
            slug: 'computer-vision',
            description: 'Image processing and object detection',
            topics: [
              { name: 'Module 1: Image Processing Basics', slug: 'image-processing', description: 'Filtering, edge detection, and transformations.', tutorialTitle: 'OpenCV Image Filtering and Edge Detection' },
              { name: 'Module 2: Feature Extraction', slug: 'feature-extraction', description: 'SIFT, HOG, and ORB features.', tutorialTitle: 'Feature Matching with SIFT and ORB' },
              { name: 'Module 3: Object Detection', slug: 'object-detection', description: 'YOLO and R-CNN architectures.', tutorialTitle: 'Object Detection with YOLOv8' },
              { name: 'Module 4: Image Segmentation', slug: 'image-segmentation', description: 'Semantic and instance segmentation.', tutorialTitle: 'U-Net for Medical Image Segmentation' },
              { name: 'Module 5: Video Tracking', slug: 'video-tracking', description: 'Optical flow and object tracking.', tutorialTitle: 'Optical Flow Tracking in Videos' }
            ]
          },
          {
            name: 'Data Engineering',
            slug: 'data-engineering',
            description: 'Pipelines, ETL, and big data processing',
            topics: [
              { name: 'Module 1: ETL Pipelines', slug: 'etl-pipelines', description: 'Extract, transform, load workflows.', tutorialTitle: 'Building an ETL Pipeline in Python' },
              { name: 'Module 2: SQL & NoSQL', slug: 'sql-nosql', description: 'PostgreSQL and MongoDB for data engineering.', tutorialTitle: 'NoSQL Database Modeling with MongoDB' },
              { name: 'Module 3: Apache Spark', slug: 'apache-spark', description: 'Distributed data processing.', tutorialTitle: 'Big Data Processing with PySpark' },
              { name: 'Module 4: Data Warehousing', slug: 'data-warehousing', description: 'Snowflake and BigQuery architecture.', tutorialTitle: 'Star Schema vs Snowflake Schema' },
              { name: 'Module 5: Workflow Orchestration', slug: 'orchestration', description: 'Apache Airflow DAGs.', tutorialTitle: 'Orchestrating Pipelines with Airflow' }
            ]
          }
        ]
      },
      {
        name: 'Civil Engineering',
        slug: 'civil',
        description: 'Structural, geotechnical, and transportation engineering',
        image: 'https://res.cloudinary.com/dummy/image/upload/v1/civil.png',
        subjects: [
          {
            name: 'Structural Analysis',
            slug: 'structural-analysis',
            description: 'Analysis of beams, trusses, and frames',
            topics: [
              { name: 'Module 1: Determinate Structures', slug: 'determinate-structures', description: 'Shear force and bending moment diagrams.', tutorialTitle: 'Drawing BMD and SFD for Beams' },
              { name: 'Module 2: Indeterminate Structures', slug: 'indeterminate-structures', description: 'Slope deflection and moment distribution.', tutorialTitle: 'Moment Distribution Method for Frames' },
              { name: 'Module 3: Truss Analysis', slug: 'truss-analysis', description: 'Method of joints and sections.', tutorialTitle: 'Analyzing Plane Trusses' },
              { name: 'Module 4: Influence Lines', slug: 'influence-lines', description: 'Moving loads on structures.', tutorialTitle: 'Influence Line Diagrams for Bridges' },
              { name: 'Module 5: Matrix Methods', slug: 'matrix-methods', description: 'Stiffness matrix method.', tutorialTitle: 'Direct Stiffness Method in Structural Analysis' }
            ]
          },
          {
            name: 'Geotechnical Engineering',
            slug: 'geotechnical-engineering',
            description: 'Soil mechanics and foundation engineering',
            topics: [
              { name: 'Module 1: Soil Properties', slug: 'soil-properties', description: 'Phase relationships and consistency limits.', tutorialTitle: 'Atterberg Limits and Soil Classification' },
              { name: 'Module 2: Permeability & Seepage', slug: 'permeability-seepage', description: 'Darcy\'s law and flow nets.', tutorialTitle: 'Calculating Seepage through Flow Nets' },
              { name: 'Module 3: Effective Stress', slug: 'effective-stress', description: 'Total and pore water pressure.', tutorialTitle: 'Effective Stress Principle in Soils' },
              { name: 'Module 4: Shear Strength', slug: 'shear-strength', description: 'Mohr-Coulomb failure criterion.', tutorialTitle: 'Direct Shear Test and Mohr-Coulomb' },
              { name: 'Module 5: Foundation Design', slug: 'foundation-design', description: 'Bearing capacity and pile foundations.', tutorialTitle: 'Terzaghi\'s Bearing Capacity Equation' }
            ]
          },
          {
            name: 'Concrete Technology',
            slug: 'concrete-technology',
            description: 'Properties of concrete, mix design, and testing',
            topics: [
              { name: 'Module 1: Cement & Aggregates', slug: 'cement-aggregates', description: 'Types of cement and grading of aggregates.', tutorialTitle: 'Properties of Portland Cement' },
              { name: 'Module 2: Fresh Concrete', slug: 'fresh-concrete', description: 'Workability and slump cone test.', tutorialTitle: 'Slump Test for Concrete Workability' },
              { name: 'Module 3: Hardened Concrete', slug: 'hardened-concrete', description: 'Compressive and tensile strength.', tutorialTitle: 'Compressive Strength Testing of Concrete' },
              { name: 'Module 4: Concrete Mix Design', slug: 'mix-design', description: 'IS/ACI mix design methods.', tutorialTitle: 'IS Code Concrete Mix Design Procedure' },
              { name: 'Module 5: Admixtures & Special Concrete', slug: 'admixtures', description: 'Plasticizers and self-compacting concrete.', tutorialTitle: 'Use of Chemical Admixtures in Concrete' }
            ]
          },
          {
            name: 'Transportation Engineering',
            slug: 'transportation-engineering',
            description: 'Highway alignment, traffic engineering, and pavements',
            topics: [
              { name: 'Module 1: Geometric Design', slug: 'geometric-design', description: 'Sight distance and horizontal/vertical curves.', tutorialTitle: 'Stopping Sight Distance Calculations' },
              { name: 'Module 2: Traffic Engineering', slug: 'traffic-engineering', description: 'Speed, volume, and density studies.', tutorialTitle: 'Traffic Flow Characteristics and Volume Studies' },
              { name: 'Module 3: Pavement Design', slug: 'pavement-design', description: 'Flexible and rigid pavements.', tutorialTitle: 'Flexible Pavement Design using CBR Method' },
              { name: 'Module 4: Railway Engineering', slug: 'railway-engineering', description: 'Track geometry and sleepers.', tutorialTitle: 'Superelevation and Cant Deficiency in Railways' },
              { name: 'Module 5: Airport Engineering', slug: 'airport-engineering', description: 'Runway orientation and wind rose diagrams.', tutorialTitle: 'Wind Rose Diagram Analysis for Runways' }
            ]
          },
          {
            name: 'Environmental Engineering',
            slug: 'environmental-engineering',
            description: 'Water supply, wastewater treatment, and air pollution',
            topics: [
              { name: 'Module 1: Water Demand & Quality', slug: 'water-quality', description: 'Physical, chemical, and biological parameters.', tutorialTitle: 'Drinking Water Quality Standards and Testing' },
              { name: 'Module 2: Water Treatment', slug: 'water-treatment', description: 'Coagulation, filtration, and disinfection.', tutorialTitle: 'Design of Rapid Sand Filters' },
              { name: 'Module 3: Wastewater Engineering', slug: 'wastewater-engineering', description: 'BOD, COD, and sewer design.', tutorialTitle: 'BOD Kinetics and Oxygen Sag Curve' },
              { name: 'Module 4: Biological Treatment', slug: 'biological-treatment', description: 'Activated sludge process and trickling filters.', tutorialTitle: 'Activated Sludge Process Design' },
              { name: 'Module 5: Air & Noise Pollution', slug: 'air-pollution', description: 'Pollutants, control equipment, and noise control.', tutorialTitle: 'Electrostatic Precipitators for Air Pollution Control' }
            ]
          }
        ]
      }
    ];

    for (const bData of branchesData) {
      const branch = await Branch.create({
        name: bData.name,
        slug: bData.slug,
        description: bData.description,
        image: bData.image
      });

      for (const sData of bData.subjects) {
        const subject = await Subject.create({
          name: sData.name,
          slug: sData.slug,
          branch: branch._id,
          description: sData.description
        });

        for (const tData of sData.topics) {
          const topic = await Topic.create({
            name: tData.name,
            slug: tData.slug,
            subject: subject._id,
            description: tData.description
          });

          // Create tutorial for each module
          const tutorial = await Tutorial.create({
            title: tData.tutorialTitle,
            slug: tData.slug + '-tutorial',
            description: tData.description,
            content: `Comprehensive educational guide and professional engineering tutorial for ${tData.tutorialTitle}.\n\n### Overview\nThis module covers key principles, theoretical formulations, and practical applications in ${sData.name}.\n\n### Key Concepts\n- Fundamental theory and derivation\n- Step-by-step problem solving\n- Real-world engineering case studies`,
            branch: branch._id,
            subject: subject._id,
            topic: topic._id,
            author: author._id,
            codeBlocks: [
              {
                language: 'python',
                code: `# Implementation example for ${tData.tutorialTitle}\ndef solve_engineering_problem():\n    print("Running ${tData.tutorialTitle} analysis...")\n    return True`
              }
            ],
            seo: {
              title: `${tData.tutorialTitle} | TutorialsAdda`,
              description: tData.description,
              keywords: [bData.name, sData.name, tData.name]
            },
            status: 'published',
            views: 200
          });

          const quiz = await Quiz.create({
            tutorial: tutorial._id,
            questions: [
              {
                question: `What is the primary objective of ${tData.tutorialTitle}?`,
                options: [
                  'To understand core principles and solve practical problems',
                  'To bypass standard engineering protocols',
                  'To increase system latency',
                  'None of the above'
                ],
                correctAnswer: 'To understand core principles and solve practical problems',
                explanation: `Mastering ${tData.tutorialTitle} is essential for professional engineering practice.`
              }
            ]
          });
          tutorial.quiz = quiz._id;
          await tutorial.save();
        }
      }
    }

    console.log('Successfully seeded 5 branches, 5 courses per branch, and 5 modules per course with real content!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
