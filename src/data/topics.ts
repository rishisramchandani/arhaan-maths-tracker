import type { Topic, TopicStatus } from './types';
import { getTotalRemainingXP } from './types';

function makeTopic(paper: string, chapter: string, name: string, status: TopicStatus): Topic {
  const id = `${paper.replace(/\s+/g, '_').toLowerCase()}-${chapter.replace(/\s+/g, '_').toLowerCase()}-${name.replace(/[\s/()]+/g, '_').toLowerCase()}`;
  return {
    id,
    paper,
    chapter,
    name,
    originalStatus: status,
    currentStatus: status,
    studyStatus: 'not_started',
    xpValue: getTotalRemainingXP(status),
    xpEarned: 0,
  };
}

export function createAllTopics(): Topic[] {
  const topics: Topic[] = [];

  // ========== PURE 1 ==========
  const p1 = (ch: string, name: string, s: TopicStatus) => makeTopic('Pure 1', ch, name, s);

  // Ch1: Algebraic Expressions
  topics.push(p1('Ch1: Algebraic Expressions', 'Index Laws', 'P'));
  topics.push(p1('Ch1: Algebraic Expressions', 'Expanding Brackets', 'R'));
  topics.push(p1('Ch1: Algebraic Expressions', 'Factorising', 'P'));
  topics.push(p1('Ch1: Algebraic Expressions', 'Negative/Fractional Indices', 'R'));
  topics.push(p1('Ch1: Algebraic Expressions', 'Surds', 'R'));
  topics.push(p1('Ch1: Algebraic Expressions', 'Rationalising Denominators', 'P'));

  // Ch2: Quadratics
  topics.push(p1('Ch2: Quadratics', 'Solving Quadratics', 'P'));
  topics.push(p1('Ch2: Quadratics', 'Completing the Square', 'P'));
  topics.push(p1('Ch2: Quadratics', 'Functions', 'P'));
  topics.push(p1('Ch2: Quadratics', 'Quadratic Graphs', 'P'));
  topics.push(p1('Ch2: Quadratics', 'The Discriminant', 'P'));

  // Ch3: Equations & Inequalities
  topics.push(p1('Ch3: Equations & Inequalities', 'Linear Simultaneous Equations', 'P'));
  topics.push(p1('Ch3: Equations & Inequalities', 'Quadratic Simultaneous Equations', 'P'));
  topics.push(p1('Ch3: Equations & Inequalities', 'Simultaneous on Graphs', 'P'));
  topics.push(p1('Ch3: Equations & Inequalities', 'Linear Inequalities', 'R'));
  topics.push(p1('Ch3: Equations & Inequalities', 'Quadratic Inequalities', 'P'));
  topics.push(p1('Ch3: Equations & Inequalities', 'Inequalities on Graphs', 'R'));
  topics.push(p1('Ch3: Equations & Inequalities', 'Regions', 'R'));

  // Ch4: Graphs
  topics.push(p1('Ch4: Graphs', 'Cubic Graphs', 'P'));
  topics.push(p1('Ch4: Graphs', 'Reciprocal Graphs', 'R'));
  topics.push(p1('Ch4: Graphs', 'Points of Intersection', 'P'));
  topics.push(p1('Ch4: Graphs', 'Translating Graphs', 'R'));
  topics.push(p1('Ch4: Graphs', 'Stretching Graphs', 'R'));
  topics.push(p1('Ch4: Graphs', 'Transforming Functions', 'R'));

  // Ch5: Straight Lines
  topics.push(p1('Ch5: Straight Lines', 'y=mx+c', 'P'));
  topics.push(p1('Ch5: Straight Lines', 'Equations of Straight Lines', 'P'));
  topics.push(p1('Ch5: Straight Lines', 'Parallel/Perpendicular Lines', 'P'));
  topics.push(p1('Ch5: Straight Lines', 'Length and Area', 'P'));

  // Ch6: Trig Ratios
  topics.push(p1('Ch6: Trig Ratios', 'Cosine Rule', 'P'));
  topics.push(p1('Ch6: Trig Ratios', 'Sine Rule', 'P'));
  topics.push(p1('Ch6: Trig Ratios', 'Areas of Triangles', 'P'));
  topics.push(p1('Ch6: Trig Ratios', 'Solving Triangle Problems', 'R'));
  topics.push(p1('Ch6: Trig Ratios', 'Graphs of Sin/Cos/Tan', 'R'));
  topics.push(p1('Ch6: Trig Ratios', 'Transforming Trig Graphs', 'R'));

  // Ch7: Radians
  topics.push(p1('Ch7: Radians', 'Radian Measure', 'R'));
  topics.push(p1('Ch7: Radians', 'Arc Length', 'R'));
  topics.push(p1('Ch7: Radians', 'Areas of Sectors/Segments', 'R'));

  // Ch8: Differentiation
  topics.push(p1('Ch8: Differentiation', 'Gradients of Curves', 'P'));
  topics.push(p1('Ch8: Differentiation', 'Finding the Derivative', 'P'));
  topics.push(p1('Ch8: Differentiation', 'Differentiating x^n', 'P'));
  topics.push(p1('Ch8: Differentiation', 'Differentiating Quadratics', 'P'));
  topics.push(p1('Ch8: Differentiation', 'Differentiating Multi-term', 'P'));
  topics.push(p1('Ch8: Differentiation', 'Gradients/Tangents/Normals', 'P'));
  topics.push(p1('Ch8: Differentiation', 'Second Order Derivatives', 'P'));

  // Ch9: Integration
  topics.push(p1('Ch9: Integration', 'Integrating x^n', 'P'));
  topics.push(p1('Ch9: Integration', 'Indefinite Integrals', 'P'));
  topics.push(p1('Ch9: Integration', 'Finding Functions', 'P'));

  // ========== PURE 2 ==========
  const p2 = (ch: string, name: string, s: TopicStatus) => makeTopic('Pure 2', ch, name, s);

  // Ch1: Algebraic Methods
  topics.push(p2('Ch1: Algebraic Methods', 'Algebraic Fractions', 'R'));
  topics.push(p2('Ch1: Algebraic Methods', 'Dividing Polynomials', 'R'));
  topics.push(p2('Ch1: Algebraic Methods', 'Factor Theorem', 'R'));
  topics.push(p2('Ch1: Algebraic Methods', 'Remainder Theorem', 'R'));
  topics.push(p2('Ch1: Algebraic Methods', 'Mathematical Proof', 'C'));
  topics.push(p2('Ch1: Algebraic Methods', 'Methods of Proof', 'C'));

  // Ch2: Coordinate Geometry
  topics.push(p2('Ch2: Coordinate Geometry', 'Midpoints/Perpendicular Bisectors', 'C'));
  topics.push(p2('Ch2: Coordinate Geometry', 'Equation of a Circle', 'R'));
  topics.push(p2('Ch2: Coordinate Geometry', 'Intersections Lines/Circles', 'R'));
  topics.push(p2('Ch2: Coordinate Geometry', 'Tangent/Chord Properties', 'C'));
  topics.push(p2('Ch2: Coordinate Geometry', 'Circles and Triangles', 'C'));

  // Ch3: Exponentials & Logs
  topics.push(p2('Ch3: Exponentials & Logs', 'Exponential Functions', 'R'));
  topics.push(p2('Ch3: Exponentials & Logs', 'Logarithms', 'R'));
  topics.push(p2('Ch3: Exponentials & Logs', 'Laws of Logarithms', 'R'));
  topics.push(p2('Ch3: Exponentials & Logs', 'Solving with Logarithms', 'R'));
  topics.push(p2('Ch3: Exponentials & Logs', 'Changing Base', 'R'));

  // Ch4: Binomial
  topics.push(p2('Ch4: Binomial', 'Pascals Triangle', 'R'));
  topics.push(p2('Ch4: Binomial', 'Factorial Notation', 'R'));
  topics.push(p2('Ch4: Binomial', 'Binomial Expansion', 'R'));
  topics.push(p2('Ch4: Binomial', 'Solving Binomial Problems', 'R'));
  topics.push(p2('Ch4: Binomial', 'Binomial Estimation', 'R'));

  // Ch5: Sequences & Series
  topics.push(p2('Ch5: Sequences & Series', 'Arithmetic Sequences', 'C'));
  topics.push(p2('Ch5: Sequences & Series', 'Arithmetic Series', 'C'));
  topics.push(p2('Ch5: Sequences & Series', 'Geometric Sequences', 'C'));
  topics.push(p2('Ch5: Sequences & Series', 'Geometric Series', 'C'));
  topics.push(p2('Ch5: Sequences & Series', 'Sum to Infinity', 'C'));
  topics.push(p2('Ch5: Sequences & Series', 'Sigma Notation', 'C'));
  topics.push(p2('Ch5: Sequences & Series', 'Recurrence Relations', 'C'));
  topics.push(p2('Ch5: Sequences & Series', 'Modelling with Series', 'C'));

  // Ch6: Trig Identities
  topics.push(p2('Ch6: Trig Identities', 'Angles in All Four Quadrants', 'C'));
  topics.push(p2('Ch6: Trig Identities', 'Exact Trig Values', 'C'));
  topics.push(p2('Ch6: Trig Identities', 'Trig Identities', 'C'));
  topics.push(p2('Ch6: Trig Identities', 'Simple Trig Equations', 'C'));
  topics.push(p2('Ch6: Trig Identities', 'Harder Trig Equations', 'C'));
  topics.push(p2('Ch6: Trig Identities', 'Equations and Identities', 'C'));

  // Ch7: Differentiation
  topics.push(p2('Ch7: Differentiation', 'Increasing/Decreasing Functions', 'C'));
  topics.push(p2('Ch7: Differentiation', 'Stationary Points', 'C'));
  topics.push(p2('Ch7: Differentiation', 'Sketching Gradient Functions', 'C'));
  topics.push(p2('Ch7: Differentiation', 'Modelling with Differentiation', 'C'));

  // Ch8: Integration
  topics.push(p2('Ch8: Integration', 'Definite Integrals', 'C'));
  topics.push(p2('Ch8: Integration', 'Areas Under Curves', 'C'));
  topics.push(p2('Ch8: Integration', 'Areas Under X-axis', 'C'));
  topics.push(p2('Ch8: Integration', 'Areas Between Curves/Lines', 'C'));
  topics.push(p2('Ch8: Integration', 'Areas Between Two Curves', 'C'));
  topics.push(p2('Ch8: Integration', 'Trapezium Rule', 'C'));

  // ========== STATS 1 ==========
  const s1 = (ch: string, name: string, s: TopicStatus) => makeTopic('Stats 1', ch, name, s);

  // Ch1: Mathematical Modelling
  topics.push(s1('Ch1: Mathematical Modelling', 'Mathematical Models', 'R'));
  topics.push(s1('Ch1: Mathematical Modelling', 'Designing a Model', 'R'));

  // Ch2: Measures of Location
  topics.push(s1('Ch2: Measures of Location', 'Types of Data', 'P'));
  topics.push(s1('Ch2: Measures of Location', 'Central Tendency', 'P'));
  topics.push(s1('Ch2: Measures of Location', 'Other Measures of Location', 'P'));
  topics.push(s1('Ch2: Measures of Location', 'Measures of Spread', 'R'));
  topics.push(s1('Ch2: Measures of Location', 'Variance/Std Dev', 'P'));
  topics.push(s1('Ch2: Measures of Location', 'Coding', 'R'));

  // Ch3: Data Representations
  topics.push(s1('Ch3: Data Representations', 'Histograms', 'P'));
  topics.push(s1('Ch3: Data Representations', 'Outliers', 'P'));
  topics.push(s1('Ch3: Data Representations', 'Box Plots', 'P'));
  topics.push(s1('Ch3: Data Representations', 'Stem and Leaf', 'P'));
  topics.push(s1('Ch3: Data Representations', 'Skewness', 'R'));
  topics.push(s1('Ch3: Data Representations', 'Comparing Data', 'R'));

  // Ch4: Probability
  topics.push(s1('Ch4: Probability', 'Probability Vocabulary', 'P'));
  topics.push(s1('Ch4: Probability', 'Venn Diagrams', 'P'));
  topics.push(s1('Ch4: Probability', 'Mutually Exclusive/Independent', 'R'));
  topics.push(s1('Ch4: Probability', 'Set Notation', 'P'));
  topics.push(s1('Ch4: Probability', 'Conditional Probability', 'P'));
  topics.push(s1('Ch4: Probability', 'Conditional in Venn Diagrams', 'P'));
  topics.push(s1('Ch4: Probability', 'Probability Formulae', 'R'));
  topics.push(s1('Ch4: Probability', 'Tree Diagrams', 'R'));

  // Ch5: Correlation
  topics.push(s1('Ch5: Correlation', 'Scatter Diagrams', 'P'));
  topics.push(s1('Ch5: Correlation', 'Linear Regression', 'P'));
  topics.push(s1('Ch5: Correlation', 'Least Squares', 'R'));
  topics.push(s1('Ch5: Correlation', 'Product Moment Correlation', 'R'));

  // Ch6: Discrete Random Variables
  topics.push(s1('Ch6: Discrete Random Variables', 'Discrete Random Variables', 'P'));
  topics.push(s1('Ch6: Discrete Random Variables', 'CDF for Discrete', 'R'));
  topics.push(s1('Ch6: Discrete Random Variables', 'Expected Value', 'P'));
  topics.push(s1('Ch6: Discrete Random Variables', 'Variance of DRV', 'P'));
  topics.push(s1('Ch6: Discrete Random Variables', 'E(X) and Var of f(X)', 'R'));
  topics.push(s1('Ch6: Discrete Random Variables', 'Solving Problems', 'P'));
  topics.push(s1('Ch6: Discrete Random Variables', 'Discrete Uniform Distribution', 'R'));

  // Ch7: Normal Distribution
  topics.push(s1('Ch7: Normal Distribution', 'Normal Distribution', 'R'));
  topics.push(s1('Ch7: Normal Distribution', 'Using Tables for Z', 'P'));
  topics.push(s1('Ch7: Normal Distribution', 'Finding Z from Probability', 'P'));
  topics.push(s1('Ch7: Normal Distribution', 'Standard Normal', 'R'));
  topics.push(s1('Ch7: Normal Distribution', 'Finding mu and sigma', 'R'));

  // ========== STATS 2 ==========
  const s2 = (ch: string, name: string, s: TopicStatus) => makeTopic('Stats 2', ch, name, s);

  // Ch1: Binomial Distribution
  topics.push(s2('Ch1: Binomial Distribution', 'Binomial Distribution', 'C'));
  topics.push(s2('Ch1: Binomial Distribution', 'Cumulative Probabilities', 'C'));
  topics.push(s2('Ch1: Binomial Distribution', 'Mean/Variance of Binomial', 'C'));

  // Ch2: Poisson Distribution
  topics.push(s2('Ch2: Poisson Distribution', 'Poisson Distribution', 'C'));
  topics.push(s2('Ch2: Poisson Distribution', 'Modelling with Poisson', 'C'));
  topics.push(s2('Ch2: Poisson Distribution', 'Adding Poisson', 'C'));
  topics.push(s2('Ch2: Poisson Distribution', 'Mean/Variance of Poisson', 'C'));

  // Ch3: Approximations
  topics.push(s2('Ch3: Approximations', 'Poisson Approx to Binomial', 'C'));
  topics.push(s2('Ch3: Approximations', 'Approx Binomial', 'C'));
  topics.push(s2('Ch3: Approximations', 'Approx Poisson by Normal', 'C'));
  topics.push(s2('Ch3: Approximations', 'Choosing Approximation', 'C'));

  // Ch4: Continuous Random Variables
  topics.push(s2('Ch4: Continuous Random Variables', 'Continuous Random Variables', 'C'));
  topics.push(s2('Ch4: Continuous Random Variables', 'CDF', 'C'));
  topics.push(s2('Ch4: Continuous Random Variables', 'Mean/Variance of Continuous', 'C'));
  topics.push(s2('Ch4: Continuous Random Variables', 'Mode/Median/Quartiles', 'C'));

  // Ch5: Continuous Uniform
  topics.push(s2('Ch5: Continuous Uniform', 'Continuous Uniform Distribution', 'C'));
  topics.push(s2('Ch5: Continuous Uniform', 'Modelling with Continuous Uniform', 'C'));

  // Ch6: Sampling
  topics.push(s2('Ch6: Sampling', 'Populations and Samples', 'C'));
  topics.push(s2('Ch6: Sampling', 'Concept of a Statistic', 'C'));
  topics.push(s2('Ch6: Sampling', 'Sampling Distribution', 'C'));

  // Ch7: Hypothesis Testing
  topics.push(s2('Ch7: Hypothesis Testing', 'Hypothesis Testing', 'C'));
  topics.push(s2('Ch7: Hypothesis Testing', 'Finding Critical Values', 'C'));
  topics.push(s2('Ch7: Hypothesis Testing', 'One-Tailed Tests', 'C'));
  topics.push(s2('Ch7: Hypothesis Testing', 'Two-Tailed Tests', 'C'));
  topics.push(s2('Ch7: Hypothesis Testing', 'Testing Mean of Poisson', 'C'));
  topics.push(s2('Ch7: Hypothesis Testing', 'Using Approximations', 'C'));

  // ========== DECISION 1 ==========
  const d1 = (ch: string, name: string, s: TopicStatus) => makeTopic('Decision 1', ch, name, s);

  // Ch1: Algorithms
  topics.push(d1('Ch1: Algorithms', 'Using Algorithms', 'P'));
  topics.push(d1('Ch1: Algorithms', 'Flow Charts', 'P'));
  topics.push(d1('Ch1: Algorithms', 'Bubble Sort', 'P'));
  topics.push(d1('Ch1: Algorithms', 'Quick Sort', 'P'));
  topics.push(d1('Ch1: Algorithms', 'Bin-Packing', 'P'));
  topics.push(d1('Ch1: Algorithms', 'Binary Search', 'P'));

  // Ch2: Graphs & Networks
  topics.push(d1('Ch2: Graphs & Networks', 'Modelling with Graphs', 'P'));
  topics.push(d1('Ch2: Graphs & Networks', 'Graph Theory', 'P'));
  topics.push(d1('Ch2: Graphs & Networks', 'Special Graphs', 'P'));
  topics.push(d1('Ch2: Graphs & Networks', 'Graphs as Matrices', 'P'));

  // Ch3: Algorithms on Graphs
  topics.push(d1('Ch3: Algorithms on Graphs', 'Kruskals', 'P'));
  topics.push(d1('Ch3: Algorithms on Graphs', 'Prims', 'P'));
  topics.push(d1('Ch3: Algorithms on Graphs', 'Prims on Distance Matrix', 'R'));
  topics.push(d1('Ch3: Algorithms on Graphs', 'Nearest Neighbour', 'R'));
  topics.push(d1('Ch3: Algorithms on Graphs', 'Dijkstras', 'C'));

  // Ch4: Route Inspection
  topics.push(d1('Ch4: Route Inspection', 'Eulerian Graphs', 'P'));
  topics.push(d1('Ch4: Route Inspection', 'Route Inspection Algorithm', 'P'));

  // Ch5: Travelling Salesman
  topics.push(d1('Ch5: Travelling Salesman', 'Classical/Practical TSP', 'R'));
  topics.push(d1('Ch5: Travelling Salesman', 'Min Spanning Tree Upper Bound', 'R'));
  topics.push(d1('Ch5: Travelling Salesman', 'Min Spanning Tree Lower Bound', 'R'));
  topics.push(d1('Ch5: Travelling Salesman', 'Nearest Neighbour Upper Bound', 'R'));

  // Ch6: Critical Path
  topics.push(d1('Ch6: Critical Path', 'Modelling a Project', 'P'));
  topics.push(d1('Ch6: Critical Path', 'Dummy Activities', 'P'));
  topics.push(d1('Ch6: Critical Path', 'Early/Late Times', 'P'));
  topics.push(d1('Ch6: Critical Path', 'Float', 'P'));
  topics.push(d1('Ch6: Critical Path', 'Critical Activities', 'P'));
  topics.push(d1('Ch6: Critical Path', 'Gantt Charts', 'P'));
  topics.push(d1('Ch6: Critical Path', 'Scheduling Diagrams', 'P'));

  // Ch7: Linear Programming
  topics.push(d1('Ch7: Linear Programming', 'LP Problems', 'R'));
  topics.push(d1('Ch7: Linear Programming', 'Graphical Methods', 'R'));
  topics.push(d1('Ch7: Linear Programming', 'Locating Optimal Point', 'R'));
  topics.push(d1('Ch7: Linear Programming', 'Integer Solutions', 'R'));

  // ========== FURTHER PURE 1 ==========
  const fp1 = (ch: string, name: string, s: TopicStatus) => makeTopic('Further Pure 1', ch, name, s);

  // Ch1: Complex Numbers
  topics.push(fp1('Ch1: Complex Numbers', 'Imaginary/Complex Numbers', 'P'));
  topics.push(fp1('Ch1: Complex Numbers', 'Multiplying Complex', 'P'));
  topics.push(fp1('Ch1: Complex Numbers', 'Complex Conjugation', 'P'));
  topics.push(fp1('Ch1: Complex Numbers', 'Argand Diagrams', 'P'));
  topics.push(fp1('Ch1: Complex Numbers', 'Modulus/Argument', 'R'));
  topics.push(fp1('Ch1: Complex Numbers', 'Modulus-Argument Form', 'R'));
  topics.push(fp1('Ch1: Complex Numbers', 'Roots of Quadratics', 'R'));
  topics.push(fp1('Ch1: Complex Numbers', 'Cubic/Quartic Equations', 'R'));

  // Ch2: Roots of Quadratic
  topics.push(fp1('Ch2: Roots of Quadratic', 'Roots of Quadratic', 'P'));
  topics.push(fp1('Ch2: Roots of Quadratic', 'Forming New Roots', 'P'));

  // Ch3: Numerical Solutions
  topics.push(fp1('Ch3: Numerical Solutions', 'Locating Roots', 'P'));
  topics.push(fp1('Ch3: Numerical Solutions', 'Interval Bisection', 'R'));
  topics.push(fp1('Ch3: Numerical Solutions', 'Linear Interpolation', 'R'));
  topics.push(fp1('Ch3: Numerical Solutions', 'Newton-Raphson', 'P'));

  // Ch4: Coordinate Systems
  topics.push(fp1('Ch4: Coordinate Systems', 'Parametric Equations', 'P'));
  topics.push(fp1('Ch4: Coordinate Systems', 'General Parabola', 'P'));
  topics.push(fp1('Ch4: Coordinate Systems', 'Rectangular Hyperbola', 'R'));

  // Ch5: Matrices
  topics.push(fp1('Ch5: Matrices', 'Intro to Matrices', 'P'));
  topics.push(fp1('Ch5: Matrices', 'Matrix Multiplication', 'P'));
  topics.push(fp1('Ch5: Matrices', 'Determinants', 'R'));
  topics.push(fp1('Ch5: Matrices', 'Inverting 2x2', 'R'));

  // Ch6: Transformations
  topics.push(fp1('Ch6: Transformations', 'Linear Transformations', 'R'));
  topics.push(fp1('Ch6: Transformations', 'Reflections/Rotations', 'P'));
  topics.push(fp1('Ch6: Transformations', 'Enlargements/Stretches', 'P'));
  topics.push(fp1('Ch6: Transformations', 'Successive Transformations', 'P'));
  topics.push(fp1('Ch6: Transformations', 'Inverse of Linear Transformation', 'R'));

  // Ch7: Series
  topics.push(fp1('Ch7: Series', 'Sums of Natural Numbers', 'R'));
  topics.push(fp1('Ch7: Series', 'Sums of Squares/Cubes', 'R'));

  // Ch8: Proof
  topics.push(fp1('Ch8: Proof', 'Proof by Induction', 'P'));
  topics.push(fp1('Ch8: Proof', 'Proving Divisibility', 'R'));
  topics.push(fp1('Ch8: Proof', 'Induction for Recurrence Relations', 'R'));
  topics.push(fp1('Ch8: Proof', 'Proving Statements with Matrices', 'R'));

  return topics;
}
