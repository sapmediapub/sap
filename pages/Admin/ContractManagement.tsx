
import React, { useState } from 'react';
import { useContractTemplate } from '../../contexts/ContractContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const ContractManagement: React.FC = () => {
  const { contractTemplate, setContractTemplate } = useContractTemplate();
  const [editorState, setEditorState] = useState(contractTemplate);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setContractTemplate(editorState);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };
  
  const placeholders = [
    '[SONG_TITLE]', '[ARTIST_NAMES]', '[WRITER_NAMES]', '[SUBMITTER_NAME]', '[SUBMISSION_DATE]'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white">Manage Publishing Agreement Template</h1>
      <Card title="Contract Editor">
        <div className="space-y-4">
          <div>
            <label htmlFor="contract-template" className="block text-sm font-medium text-gray-300 mb-1">
              Agreement Template
            </label>
            <textarea
              id="contract-template"
              rows={20}
              className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white font-mono text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={editorState}
              onChange={(e) => setEditorState(e.target.value)}
            />
          </div>
           <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
                <h4 className="text-md font-semibold text-white mb-2">Available Placeholders</h4>
                <p className="text-sm text-gray-400 mb-3">These placeholders will be automatically replaced with the song and user details upon generation.</p>
                <div className="flex flex-wrap gap-2">
                    {placeholders.map(p => (
                        <code key={p} className="text-xs bg-gray-700 text-indigo-200 px-2 py-1 rounded-full font-mono">{p}</code>
                    ))}
                </div>
            </div>
          <div className="flex justify-end items-center gap-4">
            {saveSuccess && <p className="text-green-400 text-sm">Template saved successfully!</p>}
            <Button onClick={handleSave}>Save Template</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ContractManagement;