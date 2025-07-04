const terminalOutput = document.getElementById('terminalOutput');
const terminalInput = document.getElementById('terminalInput');
let commandHistory = [];
let historyIndex = -1;
const typingSpeed = 5; // Milliseconds per character for typing effect (sped up!)

// Welcome message displayed on load
const welcomeMessage = `
Welcome to my interactive terminal-style About Me page!
Type 'help' to see available commands.
`;

// Define commands and their outputs
const commands = {
    'help': {
        description: 'Displays a list of available commands.',
        output: `
Available Commands:
  help      - Displays this help message.
  about     - Learn more about me.
  skills    - See my technical skills.
  projects  - Explore some of my projects.
  contact   - Find out how to reach me.
  clear     - Clears the terminal screen.
`
    },
    'about': {
        description: 'Provides information about me.',
        output: `
Hello! I'm [Your Name], a passionate [Your Profession/Role] with a keen interest in [Your Interests/Field].
I enjoy [Hobbies/Activities] and am always looking for new challenges and opportunities to learn.
`
    },
    'skills': {
        description: 'Lists my technical skills and proficiencies.',
        output: `
My Technical Skills:
  Languages: JavaScript, Python, HTML, CSS, [Other Languages]
  Frameworks/Libraries: React, Node.js, Express, Tailwind CSS, [Other Frameworks]
  Tools: Git, Docker, VS Code, [Other Tools]
  Databases: MongoDB, PostgreSQL, [Other Databases]
`
    },
    'projects': {
        description: 'Showcases some of my notable projects.',
        output: `
Here are a few of my projects:
  1. Project Alpha: A web application for [brief description].
     (Link: https://github.com/yourusername/project-alpha)
  2. Project Beta: A [type of project] focused on [brief description].
     (Link: https://github.com/yourusername/project-beta)
  3. Project Gamma: [Another project description].
     (Link: https://github.com/yourusername/project-gamma)

(Replace these with your actual projects and links!)
`
    },
    'contact': {
        description: 'Provides ways to get in touch with me.',
        output: `
You can reach me through:
  Email: your.email@example.com
  LinkedIn: https://linkedin.com/in/yourprofile
  GitHub: https://github.com/yourusername
  Twitter: https://twitter.com/yourhandle (Optional)
`
    },
    'clear': {
        description: 'Clears the terminal screen.',
        output: '' // Handled by function
    }
};

/**
 * Simulates typing text into the terminal output.
 * @param {string} text The text to "type".
 * @returns {Promise<void>} A promise that resolves when typing is complete.
 */
function typeText(text) {
    return new Promise(resolve => {
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                terminalOutput.innerHTML += text.charAt(i);
                terminalOutput.scrollTop = terminalOutput.scrollHeight; // Scroll to bottom
                i++;
            } else {
                clearInterval(typingInterval);
                resolve();
            }
        }, typingSpeed);
    });
}

/**
 * Prints a new line to the terminal output.
 * @param {string} text The text to print.
 * @param {boolean} [addPrompt=false] Whether to add a prompt before the text.
 */
async function printToTerminal(text, addPrompt = false) {
    if (addPrompt) {
        terminalOutput.innerHTML += `<span class="terminal-prompt">user@github-pages:~$</span> `;
    }
    await typeText(text + '\n');
}

/**
 * Handles the command entered by the user.
 * @param {string} command The command string.
 */
async function handleCommand(command) {
    const trimmedCommand = command.trim().toLowerCase();

    // Add command to history if not empty
    if (trimmedCommand !== '') {
        commandHistory.push(command);
        historyIndex = commandHistory.length; // Reset history index
    }

    await printToTerminal(command, true); // Echo the command

    if (commands[trimmedCommand]) {
        if (trimmedCommand === 'clear') {
            terminalOutput.innerHTML = ''; // Clear the screen
        } else {
            await printToTerminal(commands[trimmedCommand].output);
        }
    } else if (trimmedCommand === '') {
        // Do nothing for empty command
    } else {
        await printToTerminal(`Command not found: ${trimmedCommand}. Type 'help' for a list of commands.`);
    }

    terminalInput.value = ''; // Clear the input field
    terminalOutput.scrollTop = terminalOutput.scrollHeight; // Ensure scroll to bottom
}

// Event listener for input field
terminalInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission behavior
        handleCommand(terminalInput.value);
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            terminalInput.value = commandHistory[historyIndex];
        }
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            terminalInput.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            terminalInput.value = ''; // Clear if at end of history
        }
    }
});

// Focus on input when clicking anywhere in the terminal container
terminalOutput.addEventListener('click', () => {
    terminalInput.focus();
});

// Initial welcome message on page load
window.onload = async () => {
    await typeText(welcomeMessage);
    terminalInput.focus(); // Ensure input is focused on load
};
