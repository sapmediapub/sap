
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRO_LIST } from '../constants';
import { UserRole } from '../types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import UserAgreementModal from '../components/UserAgreementModal';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock registration logic
    alert('Registration submitted! In a real app, a confirmation email would be sent.');
    navigate('/login');
  };

  return (
    <>
      <UserAgreementModal 
        isOpen={isAgreementModalOpen} 
        onClose={() => setIsAgreementModalOpen(false)} 
      />
      <div className="max-w-2xl mx-auto">
        <Card title="Create a New Account">
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" id="name" type="text" required />
              <Input label="Email Address" id="email" type="email" required />
              <Input label="Password" id="password" type="password" required />
              <Input label="Confirm Password" id="confirm-password" type="password" required />
              
              <Select label="Account Type" id="role" defaultValue={UserRole.ARTIST}>
                <option value={UserRole.ARTIST}>Artist</option>
                <option value={UserRole.LABEL}>Label</option>
                <option value={UserRole.WRITER}>Writer</option>
              </Select>

              <Input label="Country" id="country" type="text" required />
              <Input label="IPI/CAE #" id="ipi_cae" type="text" placeholder="(Optional)" />
              
              <Select label="Performing Rights Organization (PRO)" id="pro">
                <option value="">Select your PRO</option>
                {PRO_LIST.map((pro) => (
                  <option key={pro} value={pro}>{pro}</option>
                ))}
              </Select>

              <div>
                <label htmlFor="id_document" className="block text-sm font-medium text-gray-300 mb-1">
                  ID Document (Passport, National ID)
                </label>
                <input 
                  type="file" 
                  id="id_document" 
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-indigo-300 hover:file:bg-gray-600"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
                <div className="flex items-start space-x-3">
                    <input
                        id="agree-to-terms"
                        type="checkbox"
                        className="h-4 w-4 mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 flex-shrink-0"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                    />
                    <div>
                        <label htmlFor="agree-to-terms" className="text-sm font-medium text-white">
                            I have read and agree to the terms of the{' '}
                            <button
                            type="button"
                            className="text-indigo-400 hover:underline focus:outline-none"
                            onClick={() => setIsAgreementModalOpen(true)}
                            >
                            Exclusive Publishing Agreement
                            </button>
                            .
                        </label>
                        <p className="text-xs text-gray-400 mt-1">
                            By creating an account, you agree to an exclusive publishing deal with Sap Media Publishing for all compositions you control during the term.
                        </p>
                    </div>
                </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={!agreeToTerms}>
              Create Account
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
};

export default Register;