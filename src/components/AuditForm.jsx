import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';

const toolPlans = {
  'Cursor': ['Hobby', 'Pro', 'Business', 'Enterprise'],
  'GitHub Copilot': ['Individual', 'Business', 'Enterprise'],
  'Claude': ['Free', 'Pro', 'Max', 'Team', 'Enterprise', 'API Direct'],
  'ChatGPT': ['Plus', 'Team', 'Enterprise', 'API Direct'],
  'Anthropic API Direct': ['Pay-as-you-go', 'Enterprise'],
  'OpenAI API Direct': ['Pay-as-you-go', 'Enterprise'],
  'Gemini': ['Pro', 'Ultra', 'API'],
  'Windsurf': ['Free', 'Pro', 'Teams'],
};

const useCases = ['Coding', 'Writing', 'Data Analysis', 'Research', 'Mixed'];

export default function AuditForm({ onBack }) {
  // Load initial state from localStorage or use defaults
  const [teamSize, setTeamSize] = useState(() => {
    const saved = localStorage.getItem('burncheck_team_size');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [useCase, setUseCase] = useState(() => {
    const saved = localStorage.getItem('burncheck_use_case');
    return saved || 'Coding';
  });

  const [tools, setTools] = useState(() => {
    const saved = localStorage.getItem('burncheck_tools');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default if parse fails
      }
    }
    return [{ toolName: 'Cursor', plan: 'Pro', spend: 20, seats: 1 }];
  });

  // Sync state to localStorage on every change
  useEffect(() => {
    localStorage.setItem('burncheck_team_size', teamSize.toString());
  }, [teamSize]);

  useEffect(() => {
    localStorage.setItem('burncheck_use_case', useCase);
  }, [useCase]);

  useEffect(() => {
    localStorage.setItem('burncheck_tools', JSON.stringify(tools));
  }, [tools]);

  const handleToolChange = (index, field, value) => {
    const updated = [...tools];
    updated[index][field] = value;

    // If changing the tool name, auto-update the plan to the first plan in the new tool's list
    if (field === 'toolName') {
      const defaultPlan = toolPlans[value][0];
      updated[index]['plan'] = defaultPlan;
    }
    setTools(updated);
  };

  const handleAddTool = () => {
    setTools([...tools, { toolName: 'Cursor', plan: 'Hobby', spend: 0, seats: 1 }]);
  };

  const handleRemoveTool = (index) => {
    const updated = tools.filter((_, i) => i !== index);
    setTools(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Audit form submitted! This is a mock calculation. We will display your audit results next.');
  };

  return (
    <section className="min-h-screen pt-28 pb-20 px-6 md:px-8 max-w-4xl mx-auto flex flex-col justify-start">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="self-start flex items-center gap-2 text-sm text-secondary hover:text-primary mb-8 transition-colors duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      {/* Header */}
      <div className="mb-10 text-left">
        <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-3">
          Configure Your Stack Audit
        </h2>
        <p className="text-secondary text-sm md:text-base leading-relaxed">
          Provide your team details and select the AI tools currently in use. We will compile a custom spend optimization report.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Team Meta Card */}
        <div className="bg-card border border-border p-6 md:p-8 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="team-size" className="block text-sm font-semibold text-primary mb-2">
              Team Size
            </label>
            <input
              id="team-size"
              type="number"
              min="1"
              value={teamSize}
              onChange={(e) => setTeamSize(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full bg-[#16161a] border border-border rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div>
            <label htmlFor="use-case" className="block text-sm font-semibold text-primary mb-2">
              Primary Use Case
            </label>
            <select
              id="use-case"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className="w-full bg-[#16161a] border border-border rounded-lg px-4 py-3 text-primary focus:outline-none focus:border-accent transition-colors appearance-none"
            >
              {useCases.map((uc) => (
                <option key={uc} value={uc}>
                  {uc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tools Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-primary">AI Tool Allocations</h3>
            <span className="text-xs text-secondary font-mono">{tools.length} active row(s)</span>
          </div>

          <div className="space-y-4">
            {tools.map((item, idx) => (
              <div
                key={idx}
                className="bg-card border border-border p-5 rounded-xl flex flex-col md:flex-row md:items-end gap-4 relative group"
              >
                {/* Tool Selector */}
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-secondary mb-1.5 uppercase tracking-wider">
                    Tool
                  </label>
                  <select
                    value={item.toolName}
                    onChange={(e) => handleToolChange(idx, 'toolName', e.target.value)}
                    className="w-full bg-[#16161a] border border-border rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-accent transition-colors"
                  >
                    {Object.keys(toolPlans).map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Plan Selector */}
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-secondary mb-1.5 uppercase tracking-wider">
                    Plan
                  </label>
                  <select
                    value={item.plan}
                    onChange={(e) => handleToolChange(idx, 'plan', e.target.value)}
                    className="w-full bg-[#16161a] border border-border rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-accent transition-colors"
                  >
                    {toolPlans[item.toolName].map((plan) => (
                      <option key={plan} value={plan}>
                        {plan}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Monthly Spend */}
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-secondary mb-1.5 uppercase tracking-wider">
                    Monthly Spend (USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={item.spend}
                    onChange={(e) => handleToolChange(idx, 'spend', Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-[#16161a] border border-border rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                {/* Seats */}
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-secondary mb-1.5 uppercase tracking-wider">
                    Seats
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.seats}
                    onChange={(e) => handleToolChange(idx, 'seats', Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full bg-[#16161a] border border-border rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                {/* Delete Row Button */}
                <div className="flex justify-end items-center mt-2 md:mt-0">
                  <button
                    type="button"
                    onClick={() => handleRemoveTool(idx)}
                    disabled={tools.length === 1}
                    className="text-secondary hover:text-red-500 disabled:opacity-30 disabled:hover:text-secondary p-2 rounded border border-border hover:border-red-500/20 bg-background transition-colors duration-200"
                    title="Remove Tool"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Another Tool Button */}
          <button
            type="button"
            onClick={handleAddTool}
            className="w-full border border-dashed border-border hover:border-accent/40 bg-card/20 hover:bg-card/40 text-secondary hover:text-primary py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Another Tool
          </button>
        </div>

        {/* Submit Block */}
        <div className="pt-6 border-t border-border flex justify-end">
          <button
            type="submit"
            className="bg-accent hover:bg-accent/90 text-black px-8 py-4 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-accent/10 active:scale-95 cursor-pointer"
          >
            Run My Audit
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </section>
  );
}
