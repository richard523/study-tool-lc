import { Problem } from '../types';

export const problems: Problem[] = [
  {
    id: 125,
    title: "Valid Palindrome",
    difficulty: "Easy",
    description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
    examples: [
      {
        input: '"A man, a plan, a canal: Panama"',
        output: 'true',
        explanation: '"amanaplanacanalpanama" is a palindrome.'
      },
      {
        input: '"race a car"',
        output: 'false',
        explanation: '"raceacar" is not a palindrome.'
      },
      {
        input: '" "',
        output: 'true',
        explanation: 's is an empty string "" after removing non-alphanumeric characters. Since an empty string reads the same forward and backward, it is a palindrome.'
      }
    ],
    constraints: [
      "1 <= s.length <= 2 * 10^5",
      "s consists only of printable ASCII characters."
    ],
    component: "PalindromeAnimation",
    code: `function isPalindrome(s) {
    // Convert to lowercase and keep only alphanumeric
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    let left = 0;
    let right = cleaned.length - 1;
    
    while (left < right) {
        if (cleaned[left] !== cleaned[right]) {
            return false;
        }
        left++;
        right--;
    }
    
    return true;
}`
  },
  {
    id: 269,
    title: "Alien Dictionary",
    difficulty: "Hard",
    description: "There is a new alien language that uses the English alphabet. However, the order among the letters is unknown to you. You are given a list of strings words from the alien language's dictionary, where the strings in words are sorted lexicographically by the rules of this alien language. Return a string of the unique letters in the new alien language sorted in lexicographically increasing order by the alien language's rules. If there is no solution, return an empty string. If there are multiple solutions, return any of them.",
    examples: [
      {
        input: 'words = ["wrt","wrf","er","ett","rftt"]',
        output: '"wertf"',
        explanation: 'From "wrt" and "wrf", we can get \'t\' < \'f\'. From "wrt" and "er", we can get \'w\' < \'e\'. From "er" and "ett", we can get \'r\' < \'t\'. From "ett" and "rftt", we can get \'e\' < \'r\'. So the order is "wertf".'
      },
      {
        input: 'words = ["z","x"]',
        output: '"zx"',
        explanation: 'From "z" and "x", we can get \'z\' < \'x\'. So the order is "zx".'
      }
    ],
    constraints: [
      "1 <= words.length <= 100",
      "1 <= words[i].length <= 100",
      "words[i] consists of only lowercase English letters."
    ],
    component: "AlienDictionaryAnimation",
    code: `function alienOrder(words) {
    const graph = {};
    const inDegree = {};
    
    // Initialize graph and in-degree
    for (const word of words) {
        for (const char of word) {
            if (!(char in graph)) {
                graph[char] = [];
                inDegree[char] = 0;
            }
        }
    }
    
    // Build graph by comparing adjacent words
    for (let i = 0; i < words.length - 1; i++) {
        const word1 = words[i];
        const word2 = words[i + 1];
        
        // Check for invalid case
        if (word1.length > word2.length && 
            word1.startsWith(word2)) {
            return "";
        }
        
        // Find first different character
        for (let j = 0; j < Math.min(word1.length, word2.length); j++) {
            if (word1[j] !== word2[j]) {
                if (!graph[word1[j]].includes(word2[j])) {
                    graph[word1[j]].push(word2[j]);
                    inDegree[word2[j]]++;
                }
                break;
            }
        }
    }
    
    // Topological sort using Kahn's algorithm
    const queue = [];
    for (const char in inDegree) {
        if (inDegree[char] === 0) {
            queue.push(char);
        }
    }
    
    const result = [];
    while (queue.length > 0) {
        const char = queue.shift();
        result.push(char);
        
        for (const neighbor of graph[char]) {
            inDegree[neighbor]--;
            if (inDegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        }
    }
    
    return result.length === Object.keys(inDegree).length 
        ? result.join('') : '';
  }`}
];
