/**
 * COMPONENT DEMO - Showcases all design system components
 * 
 * Matches Figma design specifications exactly
 */

'use client';

import React, { useState } from 'react';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Checkbox } from '../Checkbox/Checkbox';
import { Alert } from '../Alert/Alert';
import { Loading, InlineLoading, OverlayLoading } from '../Loading/Loading';
import { ChevronRight, Search, Mail, Lock } from 'lucide-react';

export const ComponentDemo: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [errorInput, setErrorInput] = useState('');
  const [successInput, setSuccessInput] = useState('Valid input');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className=" mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Design System Components
          </h1>
          <p className="text-gray-600">
            Components matching Figma design specifications - Now fully integrated!
          </p>
        </div>



        {/* Alerts Section */}
        <section className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Alert Components</h2>
          
          <div className="space-y-4">
            <Alert variant="success" title="Success Alert">
              This is a success message with proper styling and icons.
            </Alert>
            
            {showAlert && (
              <Alert variant="error" title="Error Alert" onClose={() => setShowAlert(false)}>
                This is an error message with a close button.
              </Alert>
            )}
            
            <Alert variant="warning" title="Warning Alert">
              This is a warning message for important information.
            </Alert>
            
            <Alert variant="info">
              This is an info message without a title.
            </Alert>
          </div>
        </section>

        {/* Input Fields Section */}
        <section className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Input Fields</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Default Inputs */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-700">Default States</h3>
              
              <Input
                label="Input name"
                placeholder="Placeholder"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              
              <Input
                label="Input name"
                placeholder="Placeholder"
                value="Placeholder"
                readOnly
              />
              
              <Input
                label="Input name"
                placeholder="Placeholder"
                disabled
              />
            </div>

            {/* Validation States */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-700">Validation States</h3>
              
              <Input
                label="Input name"
                placeholder="Placeholder"
                value={errorInput}
                onChange={(e) => setErrorInput(e.target.value)}
                errorText="Error message"
              />
              
              <Input
                label="Input name"
                placeholder="Placeholder"
                value={successInput}
                onChange={(e) => setSuccessInput(e.target.value)}
                successText="Validation message"
              />
            </div>
          </div>

          {/* Input with Icons */}
          <div className="mt-8 space-y-6">
            <h3 className="text-lg font-medium text-gray-700">With Icons</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                placeholder="Search..."
                leftIcon={<Search className="w-5 h-5" />}
              />
              
              <Input
                placeholder="Email address"
                leftIcon={<Mail className="w-5 h-5" />}
                type="email"
              />
              
              <Input
                placeholder="Password"
                leftIcon={<Lock className="w-5 h-5" />}
                type="password"
              />
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Buttons</h2>
          
          {/* Primary Buttons */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Primary Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="sm">
                  <ChevronRight className="w-4 h-4" />
                  Default
                  <ChevronRight className="w-4 h-4" />
                </Button>
                
                <Button variant="primary" size="md">
                  <ChevronRight className="w-5 h-5" />
                  Active
                  <ChevronRight className="w-5 h-5" />
                </Button>
                
                <Button variant="primary" size="lg">
                  <ChevronRight className="w-6 h-6" />
                  Large
                  <ChevronRight className="w-6 h-6" />
                </Button>
                
                <Button variant="primary" disabled>
                  <ChevronRight className="w-5 h-5" />
                  Disabled
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Outline Buttons */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Outline Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" size="sm">
                  <ChevronRight className="w-4 h-4" />
                  Default
                  <ChevronRight className="w-4 h-4" />
                </Button>
                
                <Button variant="outline" size="md">
                  <ChevronRight className="w-5 h-5" />
                  Active
                  <ChevronRight className="w-5 h-5" />
                </Button>
                
                <Button variant="outline" size="lg">
                  <ChevronRight className="w-6 h-6" />
                  Large
                  <ChevronRight className="w-6 h-6" />
                </Button>
                
                <Button variant="outline" disabled>
                  <ChevronRight className="w-5 h-5" />
                  Disabled
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Icon Buttons */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Icon Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="icon">
                  <ChevronRight className="w-5 h-5" />
                </Button>
                
                <Button variant="primary" size="icon" className="bg-primary-600">
                  <ChevronRight className="w-5 h-5" />
                </Button>
                
                <Button variant="primary" size="icon" className="bg-gray-900">
                  <ChevronRight className="w-5 h-5" />
                </Button>
                
                <Button variant="primary" size="icon" disabled>
                  <ChevronRight className="w-5 h-5" />
                </Button>
                
                <Button variant="outline" size="icon">
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Loading States */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Loading States</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" loading>
                  Loading...
                </Button>
                
                <Button variant="outline" loading>
                  Loading...
                </Button>
                
                <Button variant="primary" size="icon" loading />
              </div>
            </div>

            {/* Full Width */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Full Width</h3>
              <div className="space-y-4">
                <Button variant="primary" fullWidth>
                  Full Width Primary
                </Button>
                
                <Button variant="outline" fullWidth>
                  Full Width Outline
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Checkbox Section */}
        <section className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Checkboxes</h2>
          
          <div className="space-y-4">
            <Checkbox
              label="Default checkbox"
              checked={checkboxValue}
              onChange={(e) => setCheckboxValue(e.target.checked)}
            />
            
            <Checkbox
              label="Checkbox with helper text"
              helperText="This is some helpful information"
              checked={false}
              onChange={() => {}}
            />
            
            <Checkbox
              label="Checkbox with error"
              errorText="This field is required"
              checked={false}
              onChange={() => {}}
            />
            
            <Checkbox
              label="Disabled checkbox"
              disabled
              checked={false}
              onChange={() => {}}
            />
            
            <Checkbox
              label={
                <span>
                  I agree to the{' '}
                  <a href="#" className="text-primary hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </span>
              }
              checked={false}
              onChange={() => {}}
            />
          </div>
        </section>

        {/* Loading Components Section */}
        <section className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Loading Components</h2>
          
          {/* Loading Variants */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Loading Variants</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                <div className="text-center space-y-2">
                  <Loading variant="spinner" size="md" />
                  <p className="text-sm text-gray-600">Spinner</p>
                </div>
                
                <div className="text-center space-y-2">
                  <Loading variant="dots" size="md" />
                  <p className="text-sm text-gray-600">Dots</p>
                </div>
                
                <div className="text-center space-y-2">
                  <Loading variant="pulse" size="md" />
                  <p className="text-sm text-gray-600">Pulse</p>
                </div>
                
                <div className="text-center space-y-2">
                  <Loading variant="bars" size="md" />
                  <p className="text-sm text-gray-600">Bars</p>
                </div>
                
                <div className="text-center space-y-2">
                  <Loading variant="skeleton" />
                  <p className="text-sm text-gray-600">Skeleton</p>
                </div>
              </div>
            </div>

            {/* Loading Sizes */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Loading Sizes</h3>
              <div className="flex items-center gap-8">
                <div className="text-center space-y-2">
                  <Loading variant="spinner" size="sm" />
                  <p className="text-sm text-gray-600">Small</p>
                </div>
                
                <div className="text-center space-y-2">
                  <Loading variant="spinner" size="md" />
                  <p className="text-sm text-gray-600">Medium</p>
                </div>
                
                <div className="text-center space-y-2">
                  <Loading variant="spinner" size="lg" />
                  <p className="text-sm text-gray-600">Large</p>
                </div>
                
                <div className="text-center space-y-2">
                  <Loading variant="spinner" size="xl" />
                  <p className="text-sm text-gray-600">Extra Large</p>
                </div>
              </div>
            </div>

            {/* Inline Loading */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Inline Loading</h3>
              <div className="space-y-4">
                <InlineLoading text="Loading data..." />
                <InlineLoading text="Processing..." variant="dots" />
                <InlineLoading text="Saving changes..." variant="pulse" />
              </div>
            </div>

            {/* Button Loading */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Button Loading States</h3>
              <div className="flex gap-4">
                <Button 
                  variant="primary" 
                  loading={buttonLoading}
                  onClick={() => {
                    setButtonLoading(true);
                    setTimeout(() => setButtonLoading(false), 2000);
                  }}
                >
                  {buttonLoading ? 'Loading...' : 'Click to Load'}
                </Button>
                
                <Button variant="outline" loading>
                  Loading Button
                </Button>
              </div>
            </div>

            {/* Overlay Loading */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Overlay Loading</h3>
              <div className="relative">
                <Button 
                  variant="primary"
                  onClick={() => {
                    setShowOverlay(true);
                    setTimeout(() => setShowOverlay(false), 3000);
                  }}
                >
                  Show Overlay Loading
                </Button>
                
                <OverlayLoading 
                  show={showOverlay}
                  message="Processing your request..."
                />
              </div>
            </div>

            {/* Loading with Messages */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">Loading with Messages</h3>
              <div className="space-y-4">
                <Loading 
                  variant="spinner" 
                  size="md" 
                  message="Loading your dashboard..." 
                />
                
                <Loading 
                  variant="dots" 
                  size="md" 
                  message="Fetching latest predictions..." 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Interactive Demo - Login Form</h2>
          
          <div className="space-y-6 max-w-md">
            <Input
              label="Email"
              placeholder="Enter your email"
              leftIcon={<Mail className="w-5 h-5" />}
              type="email"
            />
            
            <Input
              label="Password"
              placeholder="Enter your password"
              leftIcon={<Lock className="w-5 h-5" />}
              type="password"
            />
            
            <Checkbox
              label="Remember me"
              checked={false}
              onChange={() => {}}
            />
            
            <div className="flex gap-4">
              <Button variant="primary" className="flex-1">
                Sign In
              </Button>
              
              <Button variant="outline" className="flex-1">
                Create Account
              </Button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
