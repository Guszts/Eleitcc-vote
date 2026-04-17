const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');

const map = {
  'bg-blue-50': 'bg-gray-100',
  'bg-blue-100': 'bg-gray-200',
  'bg-blue-200': 'bg-gray-300',
  'bg-blue-300': 'bg-gray-400',
  'bg-blue-400': 'bg-gray-500',
  'bg-blue-500': 'bg-gray-700',
  'bg-blue-600': 'bg-gray-900',
  'bg-blue-700': 'bg-black',
  'bg-blue-800': 'bg-black',
  'bg-blue-900': 'bg-black',
  'text-blue-50': 'text-gray-100',
  'text-blue-100': 'text-gray-200',
  'text-blue-200': 'text-gray-300',
  'text-blue-300': 'text-gray-400',
  'text-blue-400': 'text-gray-500',
  'text-blue-500': 'text-gray-600',
  'text-blue-600': 'text-gray-900',
  'text-blue-700': 'text-black',
  'text-blue-800': 'text-black',
  'text-blue-900': 'text-black',
  'border-blue-50': 'border-gray-100',
  'border-blue-100': 'border-gray-200',
  'border-blue-200': 'border-gray-300',
  'border-blue-300': 'border-gray-400',
  'border-blue-400': 'border-gray-500',
  'border-blue-500': 'border-gray-600',
  'border-blue-600': 'border-gray-900',
  'border-blue-700': 'border-black',
  'border-blue-800': 'border-black',
  'border-blue-900': 'border-black',
  'ring-blue-100': 'ring-gray-200',
  'ring-blue-500': 'ring-gray-900',
  'shadow-blue-900': 'shadow-black',
  'shadow-blue-600': 'shadow-black',
  'from-blue-600': 'from-gray-900',
  'via-blue-700': 'via-black',
  'to-blue-800': 'to-black',
  'to-blue-900': 'to-black',
};

function walkDir(currentPath) {
  const files = fs.readdirSync(currentPath);
  for (const file of files) {
    const fullPath = path.join(currentPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Generic replacement for everything else we missed
      // Actually let's just do a string replace for every key
      for (const [key, value] of Object.entries(map)) {
        // use regex to ensure word boundary
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        content = content.replace(regex, value);
      }
      
      // Also catch any other hover/focus variants automatically if they weren't exactly matched
      content = content.replace(/\bblue-([1-9]00|50)\b/g, (match, strength) => {
        if (strength === '50') return 'gray-100';
        if (strength === '100') return 'gray-200';
        if (strength === '200') return 'gray-300';
        if (strength === '300') return 'gray-400';
        if (strength === '400') return 'gray-500';
        if (strength === '500') return 'gray-600';
        if (strength === '600') return 'gray-900';
        if (strength === '700') return 'black';
        if (strength === '800') return 'black';
        if (strength === '900') return 'black';
        return `gray-${strength}`;
      });

      fs.writeFileSync(fullPath, content);
    }
  }
}

walkDir(dir);
console.log('done');
