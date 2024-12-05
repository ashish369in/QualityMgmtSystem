import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrainingCard } from './TrainingCard';
import { TrainingModal } from './TrainingModal';
import { useAuth } from '../../hooks/useAuth';
import { ChevronDown } from 'lucide-react';

// Training modules data
const trainingModules = [
  {
    id: 'basics',
    title: 'Getting Started',
    description: 'Learn the basics of the QMS system and navigate through key features',
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    steps: [
      {
        title: 'Welcome to QMS',
        content: (
          <div className="space-y-4">
            <p className="text-lg">
              Welcome to the Quality Management System! This training will help you understand how to:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Navigate through the system</li>
              <li>Manage tasks and issues</li>
              <li>Track quality metrics</li>
              <li>Collaborate with team members</li>
            </ul>
          </div>
        )
      },
      {
        title: 'Dashboard Overview',
        content: (
          <div className="space-y-4">
            <p>The dashboard is your central hub for:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Viewing assigned tasks</li>
              <li>Tracking open issues</li>
              <li>Monitoring defects</li>
              <li>Accessing quick actions</li>
            </ul>
          </div>
        )
      }
    ]
  },
  {
    id: 'tasks',
    title: 'Task Management',
    description: 'Master task creation, updates, and status management',
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    steps: [
      {
        title: 'Understanding Tasks',
        content: (
          <div className="space-y-4">
            <p>Tasks are the building blocks of quality management:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Tasks are always linked to an issue</li>
              <li>Each task has an assignee responsible for completion</li>
              <li>Tasks progress through different statuses</li>
              <li>Comments can be added for collaboration</li>
            </ul>
          </div>
        )
      },
      {
        title: 'Task Statuses',
        content: (
          <div className="space-y-4">
            <p>Tasks can have the following statuses:</p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Open: New tasks that need attention</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                <span>In Progress: Tasks currently being worked on</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>Closed: Completed tasks</span>
              </div>
            </div>
          </div>
        )
      }
    ]
  },
  {
    id: 'issues',
    title: 'Issue Management',
    description: 'Learn how to handle quality issues and link them to tasks',
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    steps: [
      {
        title: 'Issue Lifecycle',
        content: (
          <div className="space-y-4">
            <p>Issues follow a defined lifecycle:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Issues are created once the root cause of Defects is identified</li>
              <li>Tasks are created within issues</li>
              <li>When all tasks are closed, issue becomes ready for closure</li>
              <li>Issue Creator reviews and closes issues</li>
            </ul>
          </div>
        )
      },
      {
        title: 'Issue-Task Relationship',
        content: (
          <div className="space-y-4">
            <p>Understanding the connection:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Each issue can have multiple tasks</li>
              <li>Tasks must be completed to resolve the issue</li>
              <li>Issue status updates automatically with task progress</li>
              <li>Related defects can be linked to issues</li>
            </ul>
          </div>
        )
      }
    ]
  }
];

export const TrainingSection: React.FC = () => {
  const { user } = useAuth();
  const [selectedModule, setSelectedModule] = useState<typeof trainingModules[0] | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Load completed modules from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`${user?.id}-completed-modules`);
    if (saved) {
      setCompletedModules(JSON.parse(saved));
    }
  }, [user?.id]);

  const handleModuleClick = (module: typeof trainingModules[0]) => {
    setSelectedModule(module);
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (selectedModule && currentStep < selectedModule.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    if (selectedModule) {
      const newCompleted = [...completedModules, selectedModule.id];
      setCompletedModules(newCompleted);
      localStorage.setItem(`${user?.id}-completed-modules`, JSON.stringify(newCompleted));
      setSelectedModule(null);
    }
  };

  const completedCount = completedModules.length;
  const totalModules = trainingModules.length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col w-full">
        <motion.div
          className="cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Training Modules</h2>
              <p className="text-gray-600">
                {completedCount} of {totalModules} completed
              </p>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-6 h-6 text-gray-500" />
            </motion.div>
          </div>
          {/* Progress bar */}
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalModules) * 100}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          animate={{ height: isExpanded ? "auto" : 0 }}
          initial={false}
          className="overflow-hidden"
          style={{ width: '100%' }}
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-4">
            {trainingModules.map(module => (
              <TrainingCard
                key={module.id}
                title={module.title}
                description={module.description}
                icon={module.icon}
                onClick={() => handleModuleClick(module)}
                isCompleted={completedModules.includes(module.id)}
              />
            ))}
          </div>
        </motion.div>

        {selectedModule && (
          <TrainingModal
            isOpen={!!selectedModule}
            onClose={() => setSelectedModule(null)}
            steps={selectedModule.steps}
            currentStep={currentStep}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onComplete={handleComplete}
          />
        )}
      </div>
    </div>
  );
};
