
import React from 'react';
import { Writer, WriterRole } from '../types';
import { PRO_LIST, WRITER_ROLE_OPTIONS } from '../constants';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import { v4 as uuidv4 } from 'uuid';

interface WriterRepeaterProps {
  writers: Writer[];
  setWriters: React.Dispatch<React.SetStateAction<Writer[]>>;
}

const WriterRepeater: React.FC<WriterRepeaterProps> = ({ writers, setWriters }) => {
  const addWriter = () => {
    setWriters([
      ...writers,
      {
        id: uuidv4(),
        name: '',
        ipi_cae: '',
        role: WriterRole.COMPOSER_AUTHOR,
        split_percent: 0,
        pro: PRO_LIST[0],
      },
    ]);
  };

  const removeWriter = (id: string) => {
    setWriters(writers.filter((writer) => writer.id !== id));
  };

  const handleWriterChange = <K extends keyof Writer>(id: string, field: K, value: Writer[K]) => {
    setWriters(
      writers.map((writer) =>
        writer.id === id ? { ...writer, [field]: value } : writer
      )
    );
  };
  
  const totalSplit = writers.reduce((sum, writer) => sum + Number(writer.split_percent || 0), 0);

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-2">Writers & Splits</h3>
      
      <div className="space-y-6">
        {writers.map((writer, index) => (
          <div key={writer.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 relative">
             <button
                type="button"
                onClick={() => removeWriter(writer.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-400 text-2xl font-bold"
                aria-label={`Remove writer ${writer.name}`}
              >
                 &times;
              </button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  label="Writer Name"
                  id={`writer-name-${index}`}
                  value={writer.name}
                  onChange={(e) => handleWriterChange(writer.id, 'name', e.target.value)}
                />
                 <Input
                  label="IPI/CAE #"
                  id={`writer-ipi-${index}`}
                  value={writer.ipi_cae}
                  onChange={(e) => handleWriterChange(writer.id, 'ipi_cae', e.target.value)}
                />
                 <Input
                  label="Split %"
                  id={`writer-split-${index}`}
                  type="number"
                  value={writer.split_percent}
                  onChange={(e) => handleWriterChange(writer.id, 'split_percent', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  step="0.01"
                />
                <Select
                  label="Role"
                  id={`writer-role-${index}`}
                  value={writer.role}
                  onChange={(e) => handleWriterChange(writer.id, 'role', e.target.value as WriterRole)}
                >
                  {Object.entries(WRITER_ROLE_OPTIONS).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </Select>
                <Select
                    label="PRO"
                    id={`writer-pro-${index}`}
                    value={writer.pro}
                    onChange={(e) => handleWriterChange(writer.id, 'pro', e.target.value)}
                >
                    {PRO_LIST.map(pro => <option key={pro} value={pro}>{pro}</option>)}
                </Select>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <Button type="button" onClick={addWriter} variant="secondary">
          Add Writer
        </Button>
        <div className="text-right">
            <p className="text-lg font-semibold">Total Split: 
                <span className={totalSplit === 100 ? 'text-green-400' : 'text-yellow-400'}> {totalSplit.toFixed(2)}%</span>
            </p>
            {totalSplit !== 100 && <p className="text-sm text-gray-400">Total must be exactly 100% to submit.</p>}
        </div>
      </div>
       <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
            <div className={`h-2.5 rounded-full ${totalSplit > 100 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(totalSplit, 100)}%` }}></div>
        </div>
    </div>
  );
};

export default WriterRepeater;
