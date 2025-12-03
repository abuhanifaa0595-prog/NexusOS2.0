import React, { useState, useEffect, useRef } from 'react';
import { WindowProps } from '../../types';

const TerminalApp: React.FC<WindowProps> = () => {
  const [history, setHistory] = useState<string[]>(['Welcome to NexusOS Kernel v1.0.4', 'Type "help" for commands.']);
  const [currentLine, setCurrentLine] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const output = [ `root@nexus:~$ ${cmd}` ];
    
    switch (cmd.toLowerCase().trim()) {
      case 'help':
        output.push('Available commands: help, clear, date, whoami, reboot, ai');
        break;
      case 'date':
        output.push(new Date().toString());
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'whoami':
        output.push('admin');
        break;
      case 'ai':
        output.push('Nexus AI subsystem is active. Access via the Desktop Dock.');
        break;
      case 'reboot':
         output.push('System reboot initiated...');
         // Visual effect only
         setTimeout(() => window.location.reload(), 1000); 
         break;
      case '':
        break;
      default:
        output.push(`Command not found: ${cmd}`);
    }
    setHistory(prev => [...prev, ...output]);
  };

  return (
    <div className="h-full bg-black/80 backdrop-blur-xl text-green-400 p-4 font-mono text-sm overflow-y-auto" onClick={() => document.getElementById('term-input')?.focus()}>
      {history.map((line, i) => (
        <div key={i} className="mb-1">{line}</div>
      ))}
      <div className="flex items-center">
        <span className="mr-2 text-blue-400">root@nexus:~$</span>
        <input
          id="term-input"
          type="text"
          value={currentLine}
          onChange={(e) => setCurrentLine(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCommand(currentLine);
              setCurrentLine('');
            }
          }}
          className="bg-transparent border-none outline-none flex-1 text-green-400 caret-green-400"
          autoFocus
          autoComplete="off"
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default TerminalApp;
